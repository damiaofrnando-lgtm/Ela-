import React, { useState, useMemo } from 'react';
import { 
  ResaleListing, 
  User, 
  Wallet, 
  ProductCategory 
} from '../types';
import { CATEGORIES } from '../data/initialData';
import { 
  formatKz, 
  buyResaleProduct, 
  startOrUpdateNegotiation, 
  getNegotiations 
} from '../services/storage';
import { 
  ArrowRightLeft, 
  ShoppingBag, 
  MessageSquare, 
  ShieldCheck, 
  Info, 
  User as UserIcon, 
  CheckCircle2, 
  Percent,
  TrendingUp,
  Tag
} from 'lucide-react';
import { NegotiationModal } from './NegotiationModal';

interface ResaleMarketProps {
  listings: ResaleListing[];
  currentUser: User;
  wallet: Wallet;
  onOpenNegotiation: (negotiationId: string) => void;
  onSuccessOrder: (orderId: string) => void;
  onNavigateToWallet: () => void;
  searchQuery: string;
  initialCategory?: string;
}

export const ResaleMarket: React.FC<ResaleMarketProps> = ({
  listings,
  currentUser,
  wallet,
  onOpenNegotiation,
  onSuccessOrder,
  onNavigateToWallet,
  searchQuery,
  initialCategory
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedListing, setSelectedListing] = useState<ResaleListing | null>(null);
  const [proposalModalListing, setProposalModalListing] = useState<ResaleListing | null>(null);
  const [proposedPrice, setProposedPrice] = useState<number>(0);
  const [proposalMessage, setProposalMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [activeNegotiation, setActiveNegotiation] = useState<any>(null);

  React.useEffect(() => {
    if (initialCategory !== undefined) {
      setSelectedCategory(initialCategory || 'all');
    }
  }, [initialCategory]);

  // Filter listings
  const activeListings = useMemo(() => {
    return listings.filter((l) => {
      if (l.status === 'vendido') return false;
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'roupas_calcados') {
          if (l.category !== 'roupas_calcados' && l.category !== 'roupas_calcados_moda') return false;
        } else if (l.category !== selectedCategory) {
          return false;
        }
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = l.productName.toLowerCase().includes(q);
        const matchesDesc = l.customDescription.toLowerCase().includes(q);
        const matchesSeller = l.sellerName.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesSeller) return false;
      }
      return true;
    });
  }, [listings, selectedCategory, searchQuery]);

  const handleStartProposal = (listing: ResaleListing) => {
    if (listing.sellerId === currentUser.id) {
      setActionError('Não podes fazer propostas no teu próprio produto.');
      return;
    }
    setProposalModalListing(listing);
    setProposedPrice(Math.round(listing.listingPrice * 0.9)); // Default 10% discount proposal
    setProposalMessage('');
    setActionError(null);
  };

  const submitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalModalListing) return;
    if (proposedPrice <= 0) {
      setActionError('O valor proposto deve ser maior que zero.');
      return;
    }

    setIsSubmitting(true);
    setActionError(null);
    try {
      const neg = startOrUpdateNegotiation(
        proposalModalListing.id,
        currentUser.id,
        proposedPrice,
        proposalMessage
      );
      setProposalModalListing(null);
      setActiveNegotiation(neg);
    } catch (err: any) {
      setActionError(err.message || 'Erro ao enviar proposta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectBuyResale = (listing: ResaleListing) => {
    if (listing.sellerId === currentUser.id) {
      alert('Não podes comprar o teu próprio produto.');
      return;
    }
    if (wallet.availableBalance < listing.listingPrice) {
      alert(`Saldo insuficiente. O preço deste artigo é ${formatKz(listing.listingPrice)}, mas tens ${formatKz(wallet.availableBalance)} na carteira. Por favor, carrega a tua carteira.`);
      onNavigateToWallet();
      return;
    }

    if (confirm(`Confirmar a compra de "${listing.productName}" por ${formatKz(listing.listingPrice)}?\n\nO valor será debitado da tua carteira e o artigo transferido para Meus Produtos.`)) {
      try {
        const order = buyResaleProduct(listing.id, currentUser.id, listing.listingPrice);
        onSuccessOrder(order.id);
      } catch (err: any) {
        alert(err.message || 'Falha ao concluir compra');
      }
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Resale Market Header Banner */}
      <div className="rounded-2xl p-6 sm:p-8 bg-neutral-900 text-white border border-neutral-800 relative overflow-hidden shadow-sm">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold tracking-wide uppercase">
            <span>MERCADO DE REVENDA P2P</span>
            <span aria-hidden="true">·</span>
            <span>Artigos Verificados BABA SHOPPING</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Compra de outros utilizadores ou negoceia o melhor preço.
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Aqui encontras artigos colocados à venda pelos próprios clientes da plataforma. Podes comprar imediatamente pelo preço anunciado ou enviar uma proposta direta de negociação.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Propriedade verificada em Angola</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-amber-400" />
              <span>Taxa transparente de intermediação (5%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ArrowRightLeft className="w-4 h-4 text-blue-400" />
              <span>Negociação em tempo real</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            selectedCategory === 'all'
              ? 'bg-neutral-900 text-amber-400 shadow-2xs'
              : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900'
          }`}
        >
          <span>Todos os Anúncios ({listings.filter(l => l.status !== 'vendido').length})</span>
        </button>
        {CATEGORIES.map((cat) => {
          const count = listings.filter(l => l.category === cat.id && l.status !== 'vendido').length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-neutral-900 text-amber-400 shadow-2xs'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span>{cat.label}</span>
              <span className="text-[10px] opacity-75">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Active Category Banner in Resale */}
      {selectedCategory !== 'all' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-neutral-900 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-neutral-500 font-medium">Categoria selecionada:</span>
            <strong className="text-amber-950 font-black text-sm">
              {CATEGORIES.find(c => c.id === selectedCategory)?.label || selectedCategory}
            </strong>
            <span className="text-neutral-600">
              ({activeListings.length} {activeListings.length === 1 ? 'anúncio ativo' : 'anúncios ativos'})
            </span>
          </div>
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-xs font-bold text-amber-900 hover:text-amber-700 bg-white border border-amber-300 px-3 py-1 rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>Mostrar Todos os Anúncios</span>
            <span className="text-[11px] font-black">✕</span>
          </button>
        </div>
      )}

      {/* Error alert */}
      {actionError && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Listings Grid */}
      {activeListings.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-neutral-200 bg-white space-y-3">
          <Tag className="w-12 h-12 mx-auto text-neutral-300 stroke-1" />
          <h3 className="text-base font-bold text-neutral-800">Nenhum artigo disponível para revenda</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Quando os clientes colocam produtos adquiridos à venda, eles surgem aqui no Mercado de Revenda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeListings.map((listing) => {
            const isMyListing = listing.sellerId === currentUser.id;
            const priceDiff = listing.listingPrice - listing.originalPrice;
            const isHigher = priceDiff > 0;

            return (
              <div
                key={listing.id}
                className="bg-white rounded-2xl border border-neutral-200 hover:border-amber-300 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-4/3 w-full bg-neutral-100 overflow-hidden">
                  <img
                    src={listing.imageUrl}
                    alt={listing.productName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {/* Verified Resale badge */}
                  <div className="absolute top-2.5 left-2.5 bg-neutral-900/85 backdrop-blur-xs text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Revenda Verificada</span>
                  </div>

                  {isMyListing && (
                    <div className="absolute top-2.5 right-2.5 bg-amber-400 text-neutral-950 text-[10px] font-black px-2 py-0.5 rounded-md">
                      Teu Anúncio
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    {/* Seller attribution */}
                    <div className="flex items-center justify-between text-[11px] text-neutral-500">
                      <span className="flex items-center gap-1 font-medium text-neutral-700">
                        <UserIcon className="w-3.5 h-3.5 text-neutral-400" />
                        {listing.sellerName}
                      </span>
                      <span>Anunciado em Angola</span>
                    </div>

                    <h3 className="text-sm font-bold text-neutral-900 line-clamp-1">
                      {listing.productName}
                    </h3>

                    <p className="text-xs text-neutral-500 line-clamp-2">
                      {listing.customDescription}
                    </p>

                    {/* Historical Purchase info */}
                    <div className="text-[11px] text-neutral-400 pt-1 flex items-center justify-between">
                      <span>Preço original BABA:</span>
                      <span className="font-medium text-neutral-600 tabular-nums">
                        {formatKz(listing.originalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="pt-3 border-t border-neutral-100 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[10px] text-neutral-400 uppercase font-semibold block leading-none">
                          Preço Anunciado
                        </span>
                        <div className="text-lg font-black text-neutral-900 tabular-nums">
                          {formatKz(listing.listingPrice)}
                        </div>
                      </div>

                      {listing.allowNegotiation && (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          Aceita Negociação
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleStartProposal(listing)}
                        disabled={isMyListing}
                        className="py-2 px-3 rounded-xl border border-neutral-300 hover:border-amber-500 hover:bg-amber-50 text-neutral-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                        <span>Fazer Proposta</span>
                      </button>

                      <button
                        onClick={() => handleDirectBuyResale(listing)}
                        disabled={isMyListing}
                        className="py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-400 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Comprar Já</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Proposal Initial Dialog */}
      {proposalModalListing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200">
            <div className="p-4 bg-neutral-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm">Fazer Proposta de Negociação</h3>
              </div>
              <button
                onClick={() => setProposalModalListing(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitProposal} className="p-5 space-y-4">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                <img
                  src={proposalModalListing.imageUrl}
                  alt={proposalModalListing.productName}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-lg object-cover bg-neutral-100"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-neutral-900 truncate">
                    {proposalModalListing.productName}
                  </h4>
                  <div className="text-[11px] text-neutral-500">
                    Vendedor: <strong>{proposalModalListing.sellerName}</strong>
                  </div>
                  <div className="text-xs font-bold text-neutral-800 tabular-nums">
                    Preço anunciado: {formatKz(proposalModalListing.listingPrice)}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  A tua proposta de preço (em Kwanza - Kz):
                </label>
                <input
                  type="number"
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(Number(e.target.value))}
                  step="500"
                  min="500"
                  required
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-bold text-neutral-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
                <div className="flex justify-between items-center text-[11px] text-neutral-400 mt-1">
                  <span>Preço anunciado: {formatKz(proposalModalListing.listingPrice)}</span>
                  {proposedPrice < proposalModalListing.listingPrice && (
                    <span className="text-emerald-600 font-semibold">
                      Desconto de {Math.round(((proposalModalListing.listingPrice - proposedPrice) / proposalModalListing.listingPrice) * 100)}%
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  Mensagem para o vendedor (opcional):
                </label>
                <textarea
                  value={proposalMessage}
                  onChange={(e) => setProposalMessage(e.target.value)}
                  placeholder="Ex: Olá, tenho interesse no artigo e disponho deste valor para fechar negócio hoje."
                  rows={3}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
                ℹ️ <strong>Como funciona a negociação:</strong> O vendedor receberá uma notificação na sua área <em>Meus Produtos</em> e poderá aceitar, enviar uma contraproposta ou recusar. Nenhum valor é debitado até que ambas as partes concordem e tu confirmes o checkout.
              </div>

              {actionError && (
                <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                  {actionError}
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProposalModalListing(null)}
                  className="flex-1 py-2.5 border border-neutral-300 text-neutral-700 font-semibold text-xs rounded-xl hover:bg-neutral-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-neutral-900 text-amber-400 hover:bg-neutral-800 font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  {isSubmitting ? 'A enviar...' : 'Enviar Proposta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Active Negotiation opened */}
      {activeNegotiation && (
        <NegotiationModal
          isOpen={true}
          onClose={() => setActiveNegotiation(null)}
          negotiation={activeNegotiation}
          currentUser={currentUser}
          wallet={wallet}
          onConfirmPurchase={(neg) => {
            try {
              const order = buyResaleProduct(neg.listingId, currentUser.id, neg.currentProposedPrice);
              setActiveNegotiation(null);
              onSuccessOrder(order.id);
            } catch (err: any) {
              alert(err.message || 'Falha ao concluir compra da proposta.');
            }
          }}
        />
      )}
    </div>
  );
};
