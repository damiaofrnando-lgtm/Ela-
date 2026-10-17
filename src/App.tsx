import React, { useState, useEffect, useCallback } from 'react';
import { 
  User, 
  Wallet, 
  OfficialProduct, 
  ResaleListing, 
  UserProduct, 
  AppNotification, 
  Order 
} from './types';
import { 
  initDatabase, 
  getCurrentUser, 
  getUserWallet, 
  getProducts, 
  getResaleListings, 
  getUserProducts, 
  getNotifications, 
  getOrders, 
  DB_CHANGE_EVENT,
  formatKz,
  switchUser
} from './services/storage';

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './components/HomePage';
import { OfficialMarket } from './components/OfficialMarket';
import { ResaleMarket } from './components/ResaleMarket';
import { MyProducts } from './components/MyProducts';
import { WalletView } from './components/WalletView';
import { OrdersView } from './components/OrdersView';
import { AdminPanel } from './components/AdminPanel';
import { NotificationCenter } from './components/NotificationCenter';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { AccountPendingProcessing } from './components/AccountPendingProcessing';
import { CustomerArea } from './components/CustomerArea';

import { 
  CheckCircle2, 
  Package, 
  User as UserIcon, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  LogOut, 
  ArrowRight,
  ShoppingBag
} from 'lucide-react';

export default function App() {
  // Initialize storage on first load
  useEffect(() => {
    initDatabase();
  }, []);

  // State
  const [currentUser, setCurrentUser] = useState<User>(() => getCurrentUser());
  const [wallet, setWallet] = useState<Wallet>(() => getUserWallet(currentUser.id));
  const [products, setProducts] = useState<OfficialProduct[]>(() => getProducts());
  const [resaleListings, setResaleListings] = useState<ResaleListing[]>(() => getResaleListings());
  const [userProducts, setUserProducts] = useState<UserProduct[]>(() => getUserProducts(currentUser.id));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => getNotifications(currentUser.id));
  const [orders, setOrders] = useState<Order[]>(() => getOrders(currentUser.id));

  // Navigation
  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [navigationParam, setNavigationParam] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Drawers & Modals
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);

  // Sync state handler
  const refreshData = useCallback(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setWallet(getUserWallet(user.id));
    setProducts(getProducts());
    setResaleListings(getResaleListings());
    setUserProducts(getUserProducts(user.id));
    setNotifications(getNotifications(user.id));
    setOrders(getOrders(user.id));
  }, []);

  // Listen to DB changes across application
  useEffect(() => {
    const handleDbChange = () => {
      refreshData();
    };

    window.addEventListener(DB_CHANGE_EVENT, handleDbChange);
    return () => {
      window.removeEventListener(DB_CHANGE_EVENT, handleDbChange);
    };
  }, [refreshData]);

  // If user account is in processing or rejected, show the dedicated processing/validation screen!
  if (currentUser.accountStatus === 'em_processamento' || currentUser.accountStatus === 'rejeitado') {
    return (
      <>
        <AccountPendingProcessing
          user={currentUser}
          onSwitchUser={() => setIsAuthOpen(true)}
          onAdminDirectLogin={() => {
            const admin = switchUser('usr_admin');
            setCurrentUser(admin);
            setActiveTab('admin');
            refreshData();
          }}
          onRefreshStatus={refreshData}
        />
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          currentUser={currentUser}
          onUserChanged={(newUser) => {
            setCurrentUser(newUser);
            refreshData();
          }}
        />
      </>
    );
  }

  // Cart operations
  const handleAddToCart = (product: OfficialProduct) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.officialPrice,
        quantity: 1,
        imageUrl: product.imageUrl,
        source: 'oficial'
      }];
    });
  };

  const handleDirectBuy = (product: OfficialProduct) => {
    handleAddToCart(product);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOrderSuccess = (orderId: string) => {
    setOrderSuccessId(orderId);
    refreshData();
  };

  const handleNotificationNavigate = (targetTab: string, id?: string) => {
    setNavigationParam(id);
    setActiveTab(targetTab);
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const totalCartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAFAFB] text-neutral-900 flex flex-col font-sans">
      {/* Primary Header */}
      <Header
        currentUser={currentUser}
        wallet={wallet}
        unreadCount={unreadCount}
        cartCount={totalCartCount}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setNavigationParam(undefined);
        }}
        onSelectCategory={(cat) => {
          const target = cat === 'all' ? undefined : cat;
          setNavigationParam(target);
          if (activeTab !== 'inicio' && activeTab !== 'oficial' && activeTab !== 'revenda') {
            setActiveTab('inicio');
          }
        }}
        activeCategory={navigationParam || 'all'}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 lg:pb-12">
        {activeTab === 'inicio' && (
          <HomePage
            products={products}
            resaleListings={resaleListings}
            currentUser={currentUser}
            wallet={wallet}
            onNavigateTab={(tab, param) => {
              setActiveTab(tab);
              setNavigationParam(param);
            }}
            onAddToCart={handleAddToCart}
            onDirectBuy={handleDirectBuy}
            initialCategory={navigationParam}
            searchQuery={searchQuery}
          />
        )}

        {activeTab === 'oficial' && (
          <OfficialMarket
            products={products}
            currentUser={currentUser}
            wallet={wallet}
            onAddToCart={handleAddToCart}
            onDirectBuy={handleDirectBuy}
            searchQuery={searchQuery}
            initialCategory={navigationParam}
          />
        )}

        {activeTab === 'revenda' && (
          <ResaleMarket
            listings={resaleListings}
            currentUser={currentUser}
            wallet={wallet}
            onOpenNegotiation={(negId) => {
              setNavigationParam(negId);
              setActiveTab('meus_produtos');
            }}
            onSuccessOrder={handleOrderSuccess}
            onNavigateToWallet={() => setActiveTab('carteira')}
            searchQuery={searchQuery}
            initialCategory={navigationParam}
          />
        )}

        {activeTab === 'meus_produtos' && (
          <MyProducts
            userProducts={userProducts}
            currentUser={currentUser}
            wallet={wallet}
            onNavigateToOfficial={() => setActiveTab('oficial')}
            onSuccessOrder={handleOrderSuccess}
            initialNegotiationId={navigationParam}
          />
        )}

        {activeTab === 'carteira' && (
          <WalletView
            wallet={wallet}
            currentUser={currentUser}
            onNavigateToMarket={() => setActiveTab('oficial')}
          />
        )}

        {activeTab === 'encomendas' && (
          <OrdersView
            currentUser={currentUser}
            onNavigateToMarket={() => setActiveTab('oficial')}
            highlightOrderId={navigationParam}
          />
        )}

        {activeTab === 'admin' && currentUser.role === 'admin' && (
          <AdminPanel
            currentUser={currentUser}
            onNavigateToMarket={() => setActiveTab('oficial')}
          />
        )}

        {activeTab === 'perfil' && (
          <CustomerArea
            currentUser={currentUser}
            wallet={wallet}
            userProducts={userProducts}
            orders={orders}
            onNavigateTab={(tab, param) => {
              setActiveTab(tab);
              setNavigationParam(param);
            }}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setNavigationParam(undefined);
        }}
        userRole={currentUser.role}
        unreadCount={unreadCount}
      />

      {/* Notifications Drawer */}
      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        userId={currentUser.id}
        onNavigate={handleNotificationNavigate}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        currentUser={currentUser}
        wallet={wallet}
        onSuccessOrder={handleOrderSuccess}
        onTopUpWallet={() => {
          setIsCartOpen(false);
          setActiveTab('carteira');
        }}
      />

      {/* Auth / Account Switcher Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onUserChanged={(newUser) => {
          setCurrentUser(newUser);
          refreshData();
        }}
      />

      {/* Order Success Modal */}
      {orderSuccessId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-neutral-900">
                Compra Concluída com Sucesso!
              </h3>
              <p className="text-xs text-neutral-500">
                A tua encomenda <strong>{orderSuccessId}</strong> foi registada e o valor liquidado na carteira.
              </p>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-700 space-y-1 text-left">
              <div className="flex items-center gap-1.5 font-bold text-amber-700">
                <Package className="w-4 h-4" />
                <span>O teu produto já está em "Meus Produtos"!</span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Podes agora aceder à tua área pessoal para utilizar o produto ou anunciá-lo de imediato no Mercado de Revenda com o preço que definires.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setOrderSuccessId(null);
                  setActiveTab('meus_produtos');
                }}
                className="flex-1 py-2.5 bg-neutral-900 text-amber-400 hover:bg-neutral-800 text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                Ver em Meus Produtos
              </button>
              <button
                onClick={() => {
                  setOrderSuccessId(null);
                  setNavigationParam(orderSuccessId);
                  setActiveTab('encomendas');
                }}
                className="flex-1 py-2.5 border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-xs font-semibold rounded-xl transition-colors"
              >
                Acompanhar Entrega
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
