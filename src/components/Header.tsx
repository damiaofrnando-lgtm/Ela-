import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Bell, 
  Wallet as WalletIcon, 
  Search, 
  ShieldCheck, 
  User as UserIcon, 
  ArrowRightLeft,
  ChevronDown,
  Package,
  Layers,
  Sparkles,
  Smartphone,
  Laptop,
  Shirt,
  Home,
  Watch,
  Wrench,
  Car,
  Dumbbell
} from 'lucide-react';
import { User, Wallet, ProductCategory } from '../types';
import { formatKz, getPendingUsers } from '../services/storage';
import { BabaLogo } from './BabaLogo';

interface HeaderProps {
  currentUser: User;
  wallet: Wallet;
  unreadCount: number;
  cartCount: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNotifications: () => void;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelectCategory?: (category: string) => void;
  activeCategory?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  wallet,
  unreadCount,
  cartCount,
  activeTab,
  setActiveTab,
  onOpenNotifications,
  onOpenCart,
  onOpenAuth,
  searchQuery,
  setSearchQuery,
  onSelectCategory,
  activeCategory = 'all'
}) => {
  const [selectedSearchCategory, setSelectedSearchCategory] = useState<string>(activeCategory || 'all');
  const [showCatMenuMobile, setShowCatMenuMobile] = useState<boolean>(false);

  React.useEffect(() => {
    setSelectedSearchCategory(activeCategory || 'all');
  }, [activeCategory]);

  const pendingCount = getPendingUsers().length;

  const handleCategoryClick = (catId: string) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    } else {
      setActiveTab('oficial');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 transition-all shadow-xs">
      {/* 1. Alibaba-style Top Utility Bar */}
      <div className="bg-neutral-900 text-neutral-300 text-[11px] py-1 px-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-[#FF6A00] flex items-center gap-1">
              <span>🇦🇴 BABA.AO</span>
            </span>
            <span className="text-neutral-600">|</span>
            <span className="hidden sm:inline">Comércio Oficial por Atacado & Revenda em Angola</span>
            <span className="text-neutral-600 hidden sm:inline">|</span>
            <span className="text-amber-300 font-semibold hidden md:inline">Garantia BABA Trade Assurance 🛡️</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-neutral-400">Moeda: <strong className="text-white">Kwanza (Kz)</strong></span>
            <span className="text-neutral-600">|</span>
            <button 
              onClick={onOpenAuth}
              className="text-[#FF6A00] hover:text-orange-400 font-bold transition-colors cursor-pointer"
            >
              {currentUser ? `Olá, ${currentUser.name.split(' ')[0]}` : 'Entrar / Criar Conta com BI'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Alibaba Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 md:gap-6">
        {/* Brand Logo */}
        <div className="shrink-0">
          <button 
            onClick={() => {
              setActiveTab('inicio');
              if (onSelectCategory) onSelectCategory('all');
            }}
            className="flex items-center text-left focus:outline-none cursor-pointer"
          >
            <BabaLogo size="md" theme="light" />
          </button>
        </div>

        {/* Center: Alibaba Signature Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl relative">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (selectedSearchCategory !== 'all' && onSelectCategory) {
                onSelectCategory(selectedSearchCategory);
              }
            }}
            className="w-full flex items-center rounded-xl border-2 border-[#FF6A00] bg-white overflow-hidden shadow-xs hover:border-[#FF5000] focus-within:border-[#FF5000] transition-colors"
          >
            {/* Category Dropdown */}
            <div className="relative border-r border-neutral-200 bg-neutral-50 shrink-0">
              <select
                value={selectedSearchCategory}
                onChange={(e) => {
                  setSelectedSearchCategory(e.target.value);
                  if (onSelectCategory) onSelectCategory(e.target.value);
                }}
                className="text-xs font-semibold text-neutral-700 bg-transparent py-2.5 pl-3 pr-7 focus:outline-none cursor-pointer appearance-none"
              >
                <option value="all">Todas as Categorias</option>
                <option value="telemoveis_acessorios">Telemóveis e Acessórios</option>
                <option value="computadores_eletronicos">Computadores e Eletrónicos</option>
                <option value="roupas_calcados">Roupas e Calçados</option>
                <option value="produtos_beleza">Produtos de Beleza</option>
                <option value="casa_decoracao">Casa e Decoração</option>
                <option value="relogios_acessorios">Relógios e Acessórios</option>
                <option value="equipamentos_ferramentas">Equipamentos e Ferramentas</option>
                <option value="produtos_automoveis">Produtos Automóveis</option>
                <option value="desporto_lazer">Desporto e Lazer</option>
                <option value="produtos_variados">Produtos Variados</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-3.5 pointer-events-none" />
            </div>

            {/* Input field */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="O que estás à procura para comprar ou revender hoje? (ex: iPhone, fato, perfume, Makita...)"
              className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none"
            />

            {/* Search Button */}
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-[#FF6A00] to-[#FF5000] hover:from-[#FF5000] hover:to-[#E03A00] text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Pesquisar</span>
            </button>
          </form>
        </div>

        {/* Right Actions: Account, Orders, Resale, Wallet, Cart */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Resale Market Quick Link */}
          <button
            onClick={() => setActiveTab('revenda')}
            className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'revenda' 
                ? 'bg-orange-100 text-[#FF5000] border border-orange-200' 
                : 'text-neutral-700 hover:text-[#FF6A00] hover:bg-neutral-100'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4 text-[#FF6A00]" />
            <span>Mercado de Revenda</span>
          </button>

          {/* Orders */}
          <button
            onClick={() => setActiveTab('encomendas')}
            className={`hidden lg:flex flex-col items-center justify-center p-1.5 rounded-lg text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition-colors cursor-pointer ${
              activeTab === 'encomendas' ? 'text-[#FF6A00] font-bold' : ''
            }`}
            title="Meus Pedidos"
          >
            <Package className="w-5 h-5 text-neutral-600" />
            <span className="text-[10px] mt-0.5">Pedidos</span>
          </button>

          {/* Wallet Balance */}
          <button
            onClick={() => setActiveTab('carteira')}
            title="Minha Carteira Digital"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50/70 hover:bg-orange-100 border border-orange-200 text-neutral-900 transition-all text-left cursor-pointer"
          >
            <WalletIcon className="w-4 h-4 text-[#FF6A00]" />
            <div className="hidden sm:block">
              <div className="text-[9px] text-neutral-500 font-bold uppercase leading-none">Saldo Kz</div>
              <div className="text-xs font-black text-[#FF6A00] tabular-nums">
                {formatKz(wallet.availableBalance)}
              </div>
            </div>
          </button>

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            title="Notificações & Negociações"
            className="relative p-2 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#FF5000] text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={onOpenCart}
            title="Carrinho de Compras"
            className="relative p-2 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-neutral-950 text-amber-400 text-[10px] font-black rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin Badge */}
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-neutral-100 text-neutral-700 border-neutral-300 hover:bg-neutral-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span className="hidden md:inline">Admin</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-black animate-pulse">
                  {pendingCount}
                </span>
              )}
            </button>
          )}

          {/* User Account / Profile */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl border border-neutral-200 hover:border-neutral-300 bg-white text-neutral-800 text-xs font-bold transition-all cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-neutral-900 to-neutral-800 text-amber-400 flex items-center justify-center text-xs font-black">
              {currentUser.name.charAt(0)}
            </div>
            <span className="hidden xl:inline max-w-[90px] truncate">{currentUser.name.split(' ')[0]}</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-2.5">
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar telemóveis, roupas, sapatilhas, perfumes..."
            className="w-full pl-9 pr-4 py-2 bg-neutral-100 text-xs text-neutral-900 placeholder-neutral-400 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* 3. Alibaba Categories Navigation Bar (with 10 distinct categories) */}
      <div className="bg-neutral-900 text-neutral-200 text-xs border-t border-neutral-800 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0 font-semibold">
            {/* All Categories Button */}
            <button
              onClick={() => handleCategoryClick('all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                !activeCategory || activeCategory === 'all'
                  ? 'bg-[#FF6A00] text-white shadow-xs'
                  : 'bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Todas as Categorias</span>
            </button>

            {/* 1. Telemóveis e Acessórios */}
            <button
              onClick={() => handleCategoryClick('telemoveis_acessorios')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                activeCategory === 'telemoveis_acessorios'
                  ? 'bg-[#FF6A00] text-white shadow-xs'
                  : 'text-neutral-200 hover:bg-neutral-800 hover:text-[#FF6A00]'
              }`}
            >
              <span>📱 Telemóveis</span>
            </button>

            {/* 2. Computadores e Eletrónicos */}
            <button
              onClick={() => handleCategoryClick('computadores_eletronicos')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                activeCategory === 'computadores_eletronicos'
                  ? 'bg-[#FF6A00] text-white shadow-xs'
                  : 'text-neutral-200 hover:bg-neutral-800 hover:text-[#FF6A00]'
              }`}
            >
              <span>💻 Computadores</span>
            </button>

            {/* 3. Roupas e Calçados */}
            <button
              onClick={() => handleCategoryClick('roupas_calcados')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                activeCategory === 'roupas_calcados' || activeCategory === 'roupas_calcados_moda'
                  ? 'bg-[#FF6A00] text-white shadow-xs'
                  : 'text-neutral-200 hover:bg-neutral-800 hover:text-[#FF6A00]'
              }`}
            >
              <span>👕 Roupas & Calçados</span>
            </button>

            {/* 4. Produtos de Beleza */}
            <button
              onClick={() => handleCategoryClick('produtos_beleza')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                activeCategory === 'produtos_beleza'
                  ? 'bg-[#FF6A00] text-white shadow-xs'
                  : 'text-neutral-200 hover:bg-neutral-800 hover:text-[#FF6A00]'
              }`}
            >
              <span>✨ Beleza & Perfumes</span>
            </button>

            {/* 5. Casa e Decoração */}
            <button
              onClick={() => handleCategoryClick('casa_decoracao')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                activeCategory === 'casa_decoracao'
                  ? 'bg-[#FF6A00] text-white shadow-xs'
                  : 'text-neutral-200 hover:bg-neutral-800 hover:text-[#FF6A00]'
              }`}
            >
              <span>🏠 Casa & Decoração</span>
            </button>

            {/* 6. Relógios e Acessórios */}
            <button
              onClick={() => handleCategoryClick('relogios_acessorios')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                activeCategory === 'relogios_acessorios'
                  ? 'bg-[#FF6A00] text-white shadow-xs'
                  : 'text-neutral-200 hover:bg-neutral-800 hover:text-[#FF6A00]'
              }`}
            >
              <span>⌚ Relógios</span>
            </button>

            {/* 7. Equipamentos e Ferramentas */}
            <button
              onClick={() => handleCategoryClick('equipamentos_ferramentas')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                activeCategory === 'equipamentos_ferramentas'
                  ? 'bg-[#FF6A00] text-white shadow-xs'
                  : 'text-neutral-200 hover:bg-neutral-800 hover:text-[#FF6A00]'
              }`}
            >
              <span>🔧 Ferramentas</span>
            </button>

            {/* 8. Produtos Automóveis */}
            <button
              onClick={() => handleCategoryClick('produtos_automoveis')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                activeCategory === 'produtos_automoveis'
                  ? 'bg-[#FF6A00] text-white shadow-xs'
                  : 'text-neutral-200 hover:bg-neutral-800 hover:text-[#FF6A00]'
              }`}
            >
              <span>🚗 Automóveis</span>
            </button>

            {/* 9. Desporto e Lazer */}
            <button
              onClick={() => handleCategoryClick('desporto_lazer')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                activeCategory === 'desporto_lazer'
                  ? 'bg-[#FF6A00] text-white shadow-xs'
                  : 'text-neutral-200 hover:bg-neutral-800 hover:text-[#FF6A00]'
              }`}
            >
              <span>⚽ Desporto & Lazer</span>
            </button>

            {/* 10. Produtos Variados */}
            <button
              onClick={() => handleCategoryClick('produtos_variados')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                activeCategory === 'produtos_variados'
                  ? 'bg-[#FF6A00] text-white shadow-xs'
                  : 'text-neutral-200 hover:bg-neutral-800 hover:text-[#FF6A00]'
              }`}
            >
              <span>📦 Variados</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-[11px] text-neutral-400 shrink-0">
            <button
              onClick={() => setActiveTab('meus_produtos')}
              className="text-amber-400 hover:text-amber-300 font-bold transition-colors"
            >
              🚀 Revender Meus Produtos
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
