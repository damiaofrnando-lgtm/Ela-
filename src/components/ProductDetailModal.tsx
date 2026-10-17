import React, { useState } from 'react';
import { OfficialProduct } from '../types';
import { formatKz } from '../services/storage';
import { 
  X, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  RotateCcw, 
  Star, 
  Building2, 
  Package, 
  Layers,
  ArrowRight,
  Share2
} from 'lucide-react';

interface ProductDetailModalProps {
  product: OfficialProduct | null;
  onClose: () => void;
  onAddToCart: (product: OfficialProduct) => void;
  onDirectBuy: (product: OfficialProduct) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onDirectBuy
}) => {
  const [selectedQty, setSelectedQty] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!product) return null;

  const suggestedPrice = product.suggestedResalePrice || Math.round(product.officialPrice * 1.4);
  const profitPerUnit = suggestedPrice - product.officialPrice;
  const totalProfit = profitPerUnit * selectedQty;
  const totalPurchase = product.officialPrice * selectedQty;

  const images = product.gallery && product.gallery.length > 0 
    ? [product.imageUrl, ...product.gallery]
    : [product.imageUrl];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-neutral-200 my-auto text-neutral-900 relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-3.5 bg-neutral-900 text-white flex items-center justify-between border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-[#FF6A00] text-white font-black text-[10px] tracking-wider uppercase">
              BABA Trade Assurance
            </span>
            <span className="text-neutral-400 hidden sm:inline">· Fornecedor Verificado Ouro 5 Anos</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors text-xs flex items-center gap-1"
              title="Copiar ligação"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedLink ? 'Copiado!' : 'Partilhar'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left: Product Images Gallery */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-inner group">
                <img
                  src={images[activeImageIndex] || product.imageUrl}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-neutral-950/80 text-white text-[11px] font-bold backdrop-blur-xs flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Foto Original
                </span>
              </div>

              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx ? 'border-[#FF6A00] ring-2 ring-orange-200' : 'border-neutral-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Alibaba Trust Box */}
              <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-200 text-neutral-800 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#FF5000]">
                  <Building2 className="w-4 h-4" />
                  <span>{product.supplierName || 'Hub Oficial BABA Angola (Fornecedor Verificado)'}</span>
                </div>
                <div className="flex items-center gap-3 text-neutral-600 text-[11px]">
                  <span className="flex items-center gap-1 text-amber-600 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {product.supplierRating || '4.9'} / 5.0
                  </span>
                  <span>·</span>
                  <span>Taxa de Resposta: <strong>99.8%</strong></span>
                  <span>·</span>
                  <span>Envio a Tempo: <strong>100%</strong></span>
                </div>
              </div>
            </div>

            {/* Right: Product Details & Purchase Card */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 mb-1">
                  <span>Marca: <strong className="text-neutral-900">{product.brand}</strong></span>
                  <span>·</span>
                  <span>Ref: <code className="text-neutral-700 bg-neutral-100 px-1 py-0.5 rounded">{product.id}</code></span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-neutral-950 leading-snug">
                  {product.name}
                </h1>
              </div>

              {/* Price & Resale Profit Breakdown */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                      Preço de Compra (Atacado BABA)
                    </span>
                    <div className="text-3xl font-black text-[#FF6A00] tabular-nums">
                      {formatKz(product.officialPrice)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-semibold text-neutral-500 block">
                      MOQ (Qtd. Mínima)
                    </span>
                    <span className="text-xs font-bold text-neutral-800 bg-white px-2 py-1 rounded border border-neutral-200 inline-block">
                      {product.moq || '1 unidade'}
                    </span>
                  </div>
                </div>

                {/* Reseller Profit Simulator */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-950 space-y-2">
                  <div className="flex items-center justify-between text-xs font-extrabold text-emerald-800">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      Margem Estimada de Revenda:
                    </span>
                    <span className="text-sm font-black text-emerald-700">
                      +{formatKz(profitPerUnit)} por unidade
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    💡 <strong>Modelo de Revenda BABA:</strong> Podes comprar este produto a <strong>{formatKz(product.officialPrice)}</strong> e revendê-lo no Mercado de Revenda pelo valor sugerido de <strong>{formatKz(suggestedPrice)}</strong> ou pelo preço que definires, obtendo lucro garantido!
                  </p>
                </div>
              </div>

              {/* Custódia & Funcionamento 100% Digital na Plataforma */}
              <div className="space-y-2 text-xs border-y border-neutral-200 py-3 text-neutral-700">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Stock Disponível para Compra:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {product.stock} unidades disponíveis no sistema
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-neutral-500 shrink-0">Transferência de Titularidade:</span>
                  <span className="font-bold text-neutral-900 text-right">
                    Instantânea para "Meus Produtos"
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-orange-50/80 border border-orange-200/80 text-[11px] text-orange-950 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-[#FF6A00]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Ciclo de Compra e Revenda 100% Interno:</span>
                  </div>
                  <p>
                    Todo o processo acontece dentro da plataforma. Ao comprar, o artigo fica sob a sua titularidade e pode colocá-lo à venda por um preço superior para outro utilizador comprar e obter o seu lucro. A plataforma não realiza entregas físicas nem recomenda compras externas.
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-neutral-700">Quantidade:</span>
                <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                    className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-sm transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-sm font-bold text-neutral-900 min-w-[36px] text-center">
                    {selectedQty}
                  </span>
                  <button
                    onClick={() => setSelectedQty(Math.min(product.stock, selectedQty + 1))}
                    className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-sm transition-colors"
                  >
                    +
                  </button>
                </div>
                {selectedQty > 1 && (
                  <span className="text-xs text-neutral-500">
                    Total: <strong className="text-neutral-900">{formatKz(totalPurchase)}</strong> (Lucro potencial: <strong className="text-emerald-700">+{formatKz(totalProfit)}</strong>)
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    for (let i = 0; i < selectedQty; i++) {
                      onAddToCart(product);
                    }
                    onClose();
                  }}
                  disabled={product.stock <= 0}
                  className="flex-1 py-3 px-4 rounded-xl border-2 border-[#FF6A00] text-[#FF6A00] hover:bg-orange-50 text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Adicionar ao Carrinho ({selectedQty})</span>
                </button>

                <button
                  onClick={() => {
                    for (let i = 0; i < selectedQty; i++) {
                      onAddToCart(product);
                    }
                    onDirectBuy(product);
                    onClose();
                  }}
                  disabled={product.stock <= 0}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF5000] hover:from-[#FF5000] hover:to-[#E03A00] text-white text-xs sm:text-sm font-black transition-all shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>Comprar Agora ({formatKz(totalPurchase)})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Product Description */}
              <div className="pt-3 border-t border-neutral-100 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Descrição & Especificações Oficiais
                </h3>
                <p className="text-xs text-neutral-700 leading-relaxed">
                  {product.description}
                </p>
                {product.features && product.features.length > 0 && (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-2">
                    {product.features.map((feat, i) => (
                      <li key={i} className="text-xs text-neutral-600 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
