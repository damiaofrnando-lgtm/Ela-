import React, { useState, useMemo } from 'react';
import { 
  OfficialProduct, 
  ResaleListing, 
  User, 
  Wallet,
  ProductCategory 
} from '../types';
import { CATEGORIES } from '../data/initialData';
import { formatKz } from '../services/storage';
import { 
  ShieldCheck, 
  ArrowRight, 
  ShoppingBag, 
  ArrowRightLeft, 
  Wallet as WalletIcon, 
  Package, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw, 
  TrendingUp, 
  Store,
  ChevronRight,
  Smartphone,
  Laptop,
  Shirt,
  Home,
  Watch,
  Wrench,
  Car,
  Dumbbell,
  Layers,
  Star,
  Truck,
  Eye,
  Check
} from 'lucide-react';
import { BabaLogo } from './BabaLogo';
import { ProductDetailModal } from './ProductDetailModal';

interface HomePageProps {
  products: OfficialProduct[];
  resaleListings: ResaleListing[];
  currentUser: User;
  wallet: Wallet;
  onNavigateTab: (tab: string, param?: string) => void;
  onAddToCart: (p: OfficialProduct) => void;
  onDirectBuy: (p: OfficialProduct) => void;
  initialCategory?: string;
  searchQuery?: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  resaleListings,
  currentUser,
  wallet,
  onNavigateTab,
  onAddToCart,
  onDirectBuy,
  initialCategory,
  searchQuery = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [activeBanner, setActiveBanner] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<OfficialProduct | null>(null);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialCategory !== undefined) {
      setSelectedCategory(initialCategory || 'all');
      if (initialCategory && initialCategory !== 'all') {
        const el = document.getElementById('grelha-produtos-baba');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, [initialCategory]);

  const activeResale = resaleListings.filter(l => l.status !== 'vendido').slice(0, 4);

  // Filter products by category strictly (e.g. phone -> ONLY phones & accessories)
  const filteredOfficialProducts = useMemo(() => {
    let list = products;

    if (selectedCategory !== 'all') {
      list = list.filter((p) => {
        if (selectedCategory === 'roupas_calcados') {
          return p.category === 'roupas_calcados' || p.category === 'roupas_calcados_moda';
        }
        return p.category === selectedCategory;
      });
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => 
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    return list;
  }, [products, selectedCategory, searchQuery]);

  const activeCategoryInfo = useMemo(() => {
    return CATEGORIES.find(c => c.id === selectedCategory);
  }, [selectedCategory]);

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    // Smooth scroll down to the product catalog section
    const el = document.getElementById('grelha-produtos-baba');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAdd = (p: OfficialProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(p);
    setAddedNotice(`"${p.name}" adicionado ao carrinho!`);
    setTimeout(() => setAddedNotice(null), 2500);
  };

  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'telemoveis_acessorios': return <Smartphone className="w-4 h-4 text-[#FF6A00]" />;
      case 'computadores_eletronicos': return <Laptop className="w-4 h-4 text-blue-600" />;
      case 'roupas_calcados':
      case 'roupas_calcados_moda': return <Shirt className="w-4 h-4 text-indigo-600" />;
      case 'produtos_beleza': return <Sparkles className="w-4 h-4 text-pink-600" />;
      case 'casa_decoracao': return <Home className="w-4 h-4 text-emerald-600" />;
      case 'relogios_acessorios': return <Watch className="w-4 h-4 text-amber-600" />;
      case 'equipamentos_ferramentas': return <Wrench className="w-4 h-4 text-orange-700" />;
      case 'produtos_automoveis': return <Car className="w-4 h-4 text-red-600" />;
      case 'desporto_lazer': return <Dumbbell className="w-4 h-4 text-teal-600" />;
      case 'produtos_variados': return <Layers className="w-4 h-4 text-purple-600" />;
      default: return <Layers className="w-4 h-4 text-neutral-600" />;
    }
  };

  const promotionalBanners = [
    {
      tag: 'SUPER ATACADO & REVENDA BABA',
      title: 'Compre a Preço de Fábrica em Kz e Lucre até 60% na Revenda!',
      description: 'Mais de 200 produtos selecionados com preços fixos de atacado. Adquira mercadoria oficial, defina a sua margem de lucro e revenda diretamente no mercado da plataforma.',
      buttonText: 'Ver Produtos de Atacado',
      targetCategory: 'all',
      accentColor: 'from-[#FF6A00] to-[#E03A00]',
      bgImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=80'
    },
    {
      tag: 'TECNOLOGIA & SMARTPHONES 5G',
      title: 'Smartphones, Laptops & Acessórios com Garantia Oficial de 12 Meses',
      description: 'iPhones, Galaxy S24, Redmi Note 13 e fones Bluetooth a partir de 8.000 Kz com titularidade imediata para revenda direta na plataforma.',
      buttonText: 'Explorar Telemóveis',
      targetCategory: 'telemoveis_acessorios',
      accentColor: 'from-blue-600 to-indigo-800',
      bgImage: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1000&auto=format&fit=crop&q=80'
    },
    {
      tag: 'MODA, CALÇADOS & PERFUMES',
      title: 'Marcas Originais Direto dos Melhores Fornecedores Certificados',
      description: 'Nike Air Force 1, sapatilhas Adidas Samba, fatos executivos e perfumes Chanel e Sauvage para o seu negócio de moda render muito mais.',
      buttonText: 'Ver Roupas e Beleza',
      targetCategory: 'roupas_calcados',
      accentColor: 'from-amber-600 to-orange-700',
      bgImage: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1000&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="space-y-10 pb-16">
      {/* Toast Notice */}
      {addedNotice && (
        <div className="fixed bottom-20 right-6 z-50 bg-neutral-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-[#FF6A00] animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#FF6A00]" />
          <span>{addedNotice}</span>
        </div>
      )}

      {/* 1. ALIBABA SIGNATURE 3-COLUMN HERO SECTION */}
      <section className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs p-3 sm:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* Left Column (25% on desktop): Alibaba Interactive Category Sidebar */}
          <div className="lg:col-span-3 bg-neutral-50 rounded-xl p-3 border border-neutral-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-2.5 mb-2 border-b border-neutral-200 text-xs font-black uppercase text-neutral-800 tracking-wider">
                <Layers className="w-4 h-4 text-[#FF6A00]" />
                <span>Menu de Categorias</span>
              </div>
              <nav className="space-y-1">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  const catCount = products.filter(p => {
                    if (cat.id === 'roupas_calcados') {
                      return p.category === 'roupas_calcados' || p.category === 'roupas_calcados_moda';
                    }
                    return p.category === cat.id;
                  }).length;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-[#FF6A00] text-white shadow-xs font-bold' 
                          : 'text-neutral-700 hover:bg-orange-50/80 hover:text-[#FF6A00]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={isSelected ? 'text-white' : ''}>
                          {getCategoryIcon(cat.id)}
                        </span>
                        <span className="truncate">{cat.label}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ml-1.5 ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-600'
                      }`}>
                        {catCount}+
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-3 mt-3 border-t border-neutral-200 text-[11px] text-neutral-500 flex items-center justify-between">
              <span className="text-[#FF6A00] font-bold">10 Categorias Ativas</span>
              <span>210+ Produtos</span>
            </div>
          </div>

          {/* Center Column (50% on desktop): Alibaba Promotional Banner */}
          <div className="lg:col-span-6 relative rounded-xl overflow-hidden bg-neutral-900 text-white min-h-[360px] flex flex-col justify-between p-6 sm:p-8">
            {/* Background Image with Dark Gradient Overlay */}
            <div className="absolute inset-0 z-0">
              <img
                src={promotionalBanners[activeBanner].bgImage}
                alt="Banner BABA"
                className="w-full h-full object-cover opacity-25 scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-900/90 to-transparent" />
            </div>

            {/* Banner Content */}
            <div className="relative z-10 space-y-4 max-w-md">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6A00] text-white text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>{promotionalBanners[activeBanner].tag}</span>
              </div>

              <h2 className="text-xl sm:text-3xl font-black text-white leading-tight">
                {promotionalBanners[activeBanner].title}
              </h2>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {promotionalBanners[activeBanner].description}
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => handleCategorySelect(promotionalBanners[activeBanner].targetCategory)}
                  className="px-5 py-2.5 bg-gradient-to-r from-[#FF6A00] to-[#FF5000] hover:from-[#FF5000] hover:to-[#E03A00] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-orange-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>{promotionalBanners[activeBanner].buttonText}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Banner Dots Switcher */}
            <div className="relative z-10 flex items-center gap-2 pt-4">
              {promotionalBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveBanner(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    activeBanner === idx ? 'w-8 bg-[#FF6A00]' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  title={`Banner ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Column (25% on desktop): Alibaba User & Trade Assurance Card */}
          <div className="lg:col-span-3 bg-neutral-50 rounded-xl p-4 border border-neutral-200/80 flex flex-col justify-between space-y-4">
            {/* User Greeting & Status */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neutral-900 to-neutral-800 text-[#FF6A00] flex items-center justify-center font-black text-base shadow-sm shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <div className="text-[11px] text-neutral-500 font-semibold">Bem-vindo(a),</div>
                  <div className="text-sm font-extrabold text-neutral-900 leading-tight">
                    {currentUser.name}
                  </div>
                </div>
              </div>

              {/* Bilhete de Identidade Verified Badge */}
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-900 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>BI Verificado: {currentUser.idNumber}</span>
              </div>

              {/* Quick Wallet Summary */}
              <div className="p-3 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-1">
                <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>Saldo Disponível Kz</span>
                  <WalletIcon className="w-3.5 h-3.5 text-[#FF6A00]" />
                </div>
                <div className="text-xl font-black text-neutral-950 tabular-nums">
                  {formatKz(wallet.availableBalance)}
                </div>
                <button
                  onClick={() => onNavigateTab('carteira')}
                  className="w-full text-center text-[11px] font-bold text-[#FF6A00] hover:text-orange-700 pt-1 border-t border-neutral-100 block transition-colors cursor-pointer"
                >
                  + Carregar Saldo / Multicaixa
                </button>
              </div>
            </div>

            {/* Quick Action Navigation */}
            <div className="space-y-2">
              <button
                onClick={() => onNavigateTab('meus_produtos')}
                className="w-full py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#FF6A00]" />
                  <span>Meus Produtos (Stock)</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              <button
                onClick={() => onNavigateTab('revenda')}
                className="w-full py-2 px-3 rounded-xl bg-[#FF6A00] hover:bg-[#FF5000] text-white font-extrabold text-xs flex items-center justify-between transition-colors cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>Mercado de Revenda P2P</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Trade Assurance micro text */}
            <div className="pt-2 border-t border-neutral-200 text-[10px] text-neutral-500 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Garantia Trade Assurance em todas as transações</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ALIBABA TRUST PILLARS RIBBON */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-neutral-200 flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FF6A00] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-neutral-900 uppercase">Trade Assurance</h4>
            <p className="text-[11px] text-neutral-500">Proteção total de compra e revenda</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200 flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-neutral-900 uppercase">Sistema de Revenda</h4>
            <p className="text-[11px] text-neutral-500">Compre no atacado e lucre revendendo</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200 flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-neutral-900 uppercase">Titularidade Digital</h4>
            <p className="text-[11px] text-neutral-500">Gestão e revenda direta em Meus Produtos</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200 flex items-center gap-3 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-neutral-900 uppercase">Preços em Kwanzas</h4>
            <p className="text-[11px] text-neutral-500">Sem taxas cambiais nem custos ocultos</p>
          </div>
        </div>
      </section>

      {/* 3. ALIBABA CATEGORY TABS SELECTOR (Clicking updates filter immediately) */}
      <section id="grelha-produtos-baba" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6A00]" />
              <h3 className="text-lg sm:text-2xl font-black text-neutral-950 uppercase tracking-tight">
                Catálogo de Produtos por Atacado
              </h3>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              {selectedCategory === 'all' 
                ? 'A exibir mais de 200 produtos selecionados em todas as categorias' 
                : `A filtrar exclusivamente por "${activeCategoryInfo?.label || selectedCategory}" (${filteredOfficialProducts.length} produtos disponíveis)`
              }
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs font-bold text-neutral-600 hover:text-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-300 hover:border-neutral-400 bg-white transition-colors cursor-pointer"
              >
                Limpar Filtro (Ver Todos)
              </button>
            )}
            <button
              onClick={() => onNavigateTab('oficial', selectedCategory !== 'all' ? selectedCategory : undefined)}
              className="text-xs font-bold text-[#FF6A00] hover:text-orange-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Mercado Oficial Completo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Category Filter Pills (All 10 Categories) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Todos ({products.length})</span>
          </button>

          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = products.filter(p => {
              if (cat.id === 'roupas_calcados') {
                return p.category === 'roupas_calcados' || p.category === 'roupas_calcados_moda';
              }
              return p.category === cat.id;
            }).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#FF6A00] text-white shadow-xs font-extrabold'
                    : 'bg-white text-neutral-700 border border-neutral-200 hover:border-[#FF6A00]/50 hover:text-[#FF6A00]'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-neutral-100 text-neutral-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 4. PRODUCT GRID (Alibaba Wholesale style with clear real photos, prices in Kz, delivery conditions & profit calculation) */}
        {filteredOfficialProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center space-y-3">
            <Package className="w-12 h-12 text-neutral-300 mx-auto" />
            <h4 className="text-base font-bold text-neutral-800">Nenhum produto encontrado nesta categoria</h4>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Experimenta selecionar outra categoria ou clica em "Ver Todos" para explorar todo o catálogo.
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-4 py-2 rounded-xl bg-neutral-900 text-white font-bold text-xs"
            >
              Ver Todas as Categorias
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {filteredOfficialProducts.map((product) => {
              const suggested = product.suggestedResalePrice || Math.round(product.officialPrice * 1.4);
              const profit = suggested - product.officialPrice;

              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-lg hover:border-[#FF6A00]/50 transition-all flex flex-col justify-between group cursor-pointer relative"
                >
                  {/* Image container */}
                  <div className="relative aspect-square bg-neutral-100 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Verified Supplier Tag */}
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-neutral-950/80 text-white text-[9px] font-bold backdrop-blur-xs flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#FF6A00]" />
                      <span>Ouro</span>
                    </div>

                    {/* Quick View Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-white/90 hover:bg-white text-neutral-900 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Ver Detalhes do Produto"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="p-3 flex flex-col justify-between flex-1 space-y-2">
                    <div className="space-y-1">
                      <div className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider truncate">
                        {product.brand}
                      </div>
                      <h4 className="text-xs font-bold text-neutral-900 line-clamp-2 leading-snug group-hover:text-[#FF6A00] transition-colors">
                        {product.name}
                      </h4>
                    </div>

                    {/* Pricing in Kwanzas */}
                    <div className="space-y-1 pt-1 border-t border-neutral-100">
                      <div className="text-sm sm:text-base font-black text-[#FF6A00] tabular-nums leading-none">
                        {formatKz(product.officialPrice)}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-medium">
                        MOQ: <strong>{product.moq || '1 un (Atacado)'}</strong>
                      </div>

                      {/* Resale Profit Highlight */}
                      <div className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200/80 flex items-center justify-between">
                        <span>Lucro Revenda:</span>
                        <span className="font-black text-emerald-700">+{formatKz(profit)}</span>
                      </div>

                      {/* Resale readiness */}
                      <div className="text-[9px] text-neutral-500 font-semibold truncate pt-0.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Titularidade Imediata · Pronto para Revender</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleAdd(product, e)}
                        className="p-2 rounded-xl border border-neutral-200 hover:border-[#FF6A00] hover:text-[#FF6A00] text-neutral-700 transition-colors shrink-0 cursor-pointer"
                        title="Adicionar ao Carrinho"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDirectBuy(product);
                        }}
                        className="flex-1 py-1.5 px-2 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF5000] hover:from-[#FF5000] hover:to-[#E03A00] text-white font-extrabold text-[11px] transition-all text-center cursor-pointer shadow-2xs"
                      >
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. RESALE MARKET P2P HIGHLIGHT (Customer Buy & Resell Model) */}
      <section className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl text-white p-6 sm:p-8 border border-neutral-800 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-[#FF6A00] text-[10px] font-black uppercase tracking-wider border border-orange-500/30">
              <TrendingUp className="w-3 h-3" />
              <span>Oportunidades de Revenda em Angola</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Mercado de Revenda Entre Clientes (P2P)
            </h3>
            <p className="text-xs text-neutral-400 max-w-xl">
              Produtos comprados na plataforma e colocados à venda por outros revendedores. Faça a sua oferta, negocie o preço em tempo real e lucre com as melhores oportunidades de comércio.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('revenda')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF5000] hover:from-[#FF5000] hover:to-[#E03A00] text-white font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer transition-all self-start sm:self-auto shrink-0 shadow-md shadow-orange-500/20"
          >
            <span>Ver Todas as Ofertas de Revenda</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {activeResale.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {activeResale.map((listing) => (
              <div
                key={listing.id}
                onClick={() => onNavigateTab('revenda')}
                className="bg-neutral-800/80 rounded-xl p-3 border border-neutral-700/80 hover:border-[#FF6A00] transition-all cursor-pointer space-y-3 group"
              >
                <div className="aspect-video rounded-lg overflow-hidden bg-neutral-900 relative">
                  <img
                    src={listing.imageUrl}
                    alt={listing.productName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-neutral-900/90 text-amber-400 text-[9px] font-bold">
                    Vendedor: {listing.sellerName.split(' ')[0]}
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-[#FF6A00] transition-colors">
                    {listing.productName}
                  </h4>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Preço de Revenda:</span>
                      <span className="text-sm font-black text-amber-400 tabular-nums">
                        {formatKz(listing.listingPrice)}
                      </span>
                    </div>
                    {listing.allowNegotiation && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                        Negociável
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Individual Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={onAddToCart}
        onDirectBuy={onDirectBuy}
      />
    </div>
  );
};
