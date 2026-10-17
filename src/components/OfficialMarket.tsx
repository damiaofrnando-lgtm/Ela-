import React, { useState, useMemo } from 'react';
import { 
  OfficialProduct, 
  ProductCategory, 
  User, 
  Wallet 
} from '../types';
import { CATEGORIES } from '../data/initialData';
import { formatKz } from '../services/storage';
import { 
  Filter, 
  Check, 
  ShoppingBag, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  ArrowUpDown,
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
  Eye,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';
import { ProductDetailModal } from './ProductDetailModal';

interface OfficialMarketProps {
  products: OfficialProduct[];
  currentUser: User;
  wallet: Wallet;
  onAddToCart: (product: OfficialProduct) => void;
  onDirectBuy: (product: OfficialProduct) => void;
  searchQuery: string;
  initialCategory?: string;
}

export const OfficialMarket: React.FC<OfficialMarketProps> = ({
  products,
  currentUser,
  wallet,
  onAddToCart,
  onDirectBuy,
  searchQuery,
  initialCategory
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'stock'>('featured');
  const [selectedProduct, setSelectedProduct] = useState<OfficialProduct | null>(null);
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialCategory !== undefined) {
      setSelectedCategory(initialCategory || 'all');
      if (initialCategory && initialCategory !== 'all') {
        const el = document.getElementById('catalogo-oficial');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, [initialCategory]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'roupas_calcados') {
          if (p.category !== 'roupas_calcados' && p.category !== 'roupas_calcados_moda') return false;
        } else if (p.category !== selectedCategory) {
          return false;
        }
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesDesc) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.officialPrice - b.officialPrice;
      if (sortBy === 'price_desc') return b.officialPrice - a.officialPrice;
      if (sortBy === 'stock') return b.stock - a.stock;
      return 0;
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

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

  const activeCategory = CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      {addedNotice && (
        <div className="fixed bottom-20 right-6 z-50 bg-neutral-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-[#FF6A00] animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#FF6A00]" />
          <span>{addedNotice}</span>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-neutral-950 text-white border border-neutral-800 shadow-md p-6 sm:p-10">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6A00]/20 text-[#FF6A00] text-[11px] font-black uppercase tracking-wider border border-[#FF6A00]/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Mercado Oficial de Atacado BABA Trade Assurance</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Compre produtos pelo preço oficial e revenda na plataforma com lucro.
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Mais de 200 produtos selecionados a preço oficial de atacado em Kwanzas. Compre com o saldo da sua carteira e o artigo fica imediatamente sob a sua titularidade em <strong>Meus Produtos</strong>, pronto para ser revendido na plataforma com a sua margem de lucro.
          </p>
        </div>
      </div>

      {/* Categories Bar & Filters */}
      <div id="catalogo-oficial" className="space-y-4">
        {/* Horizontal Category Selector */}
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
            <span>Todos os Artigos ({products.length})</span>
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

        {/* Filter and Sorting Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-neutral-200">
          <div className="text-xs text-neutral-600 font-medium">
            A mostrar <strong className="text-neutral-900">{filteredProducts.length} produtos</strong>
            {selectedCategory !== 'all' && (
              <span> em <strong className="text-[#FF6A00]">{activeCategory?.label}</strong></span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 font-semibold flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Ordenar por:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-bold text-neutral-800 bg-neutral-100 border border-neutral-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#FF6A00] cursor-pointer"
            >
              <option value="featured">Destaques</option>
              <option value="price_asc">Menor Preço Kz</option>
              <option value="price_desc">Maior Preço Kz</option>
              <option value="stock">Maior Stock Disponível</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center space-y-3">
            <Layers className="w-12 h-12 text-neutral-300 mx-auto" />
            <h3 className="text-base font-bold text-neutral-800">Nenhum produto encontrado</h3>
            <p className="text-xs text-neutral-500">
              Não foram encontrados produtos para a pesquisa ou categoria selecionada.
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-4 py-2 bg-neutral-900 text-white font-bold text-xs rounded-xl"
            >
              Ver Todas as Categorias
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {filteredProducts.map((product) => {
              const suggested = product.suggestedResalePrice || Math.round(product.officialPrice * 1.4);
              const profit = suggested - product.officialPrice;

              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-lg hover:border-[#FF6A00]/50 transition-all flex flex-col justify-between group cursor-pointer relative"
                >
                  <div className="relative aspect-square bg-neutral-100 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-neutral-950/80 text-white text-[9px] font-bold backdrop-blur-xs flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#FF6A00]" />
                      <span>Verificado</span>
                    </div>

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

                  <div className="p-3 flex flex-col justify-between flex-1 space-y-2">
                    <div className="space-y-1">
                      <div className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider truncate">
                        {product.brand}
                      </div>
                      <h4 className="text-xs font-bold text-neutral-900 line-clamp-2 leading-snug group-hover:text-[#FF6A00] transition-colors">
                        {product.name}
                      </h4>
                    </div>

                    <div className="space-y-1 pt-1 border-t border-neutral-100">
                      <div className="text-sm sm:text-base font-black text-[#FF6A00] tabular-nums leading-none">
                        {formatKz(product.officialPrice)}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-medium">
                        MOQ: <strong>{product.moq || '1 un (Atacado)'}</strong>
                      </div>

                      <div className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200/80 flex items-center justify-between">
                        <span>Lucro Revenda:</span>
                        <span className="font-black text-emerald-700">+{formatKz(profit)}</span>
                      </div>

                      <div className="text-[9px] text-neutral-500 font-semibold truncate pt-0.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Titularidade Imediata · Pronto para Revender</span>
                      </div>
                    </div>

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
      </div>

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
