import React, { useState } from 'react';
import { 
  UserProduct, 
  ResaleListing, 
  Negotiation, 
  User, 
  Wallet 
} from '../types';
import { 
  formatKz, 
  createResaleListing, 
  cancelResaleListing, 
  getResaleListings, 
  getNegotiations,
  buyResaleProduct
} from '../services/storage';
import { 
  Package, 
  Tag, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Clock, 
  DollarSign, 
  ArrowRight, 
  ShieldCheck, 
  PlusCircle,
  Eye,
  Trash2
} from 'lucide-react';
import { NegotiationModal } from './NegotiationModal';

interface MyProductsProps {
  userProducts: UserProduct[];
  currentUser: User;
  wallet: Wallet;
  onNavigateToOfficial: () => void;
  onSuccessOrder: (orderId: string) => void;
  initialNegotiationId?: string;
}

export const MyProducts: React.FC<MyProductsProps> = ({
  userProducts,
  currentUser,
  wallet,
  onNavigateToOfficial,
  onSuccessOrder,
  initialNegotiationId
}) => {
  const [activeTab, setActiveTab] = useState<'todos' | 'venda' | 'negociacoes'>(
    initialNegotiationId ? 'negociacoes' : 'todos'
  );
  
  // Listing modal state
  const [productToList, setProductToList] = useState<UserProduct | null>(null);
  const [listingPrice, setListingPrice] = useState<number>(0);
  const [listingDesc, setListingDesc] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [listingError, setListingError] = useState<string | null>(null);

  // Active negotiation drawer
  const [selectedNegotiation, setSelectedNegotiation] = useState<Negotiation | null>(null);

  // Queries
  const allResaleListings = getResaleListings();
  const myResaleListings = allResaleListings.filter(l => l.sellerId === currentUser.id && l.status !== 'vendido');
  const allNegotiations = getNegotiations(currentUser.id);

  // Open negotiation if passed by prop
  React.useEffect(() => {
    if (initialNegotiationId) {
      const found = allNegotiations.find(n => n.id === initialNegotiationId);
      if (found) {
        setSelectedNegotiation(found);
        setActiveTab('negociacoes');
      }
    }
  }, [initialNegotiationId]);

  const handleOpenListModal = (p: UserProduct) => {
    setProductToList(p);
    // Suggest 15-20% margin above original purchase
    const suggested = Math.round(p.originalPrice * 1.2);
    setListingPrice(suggested);
    setMinPrice(p.originalPrice);
    setListingDesc(`Artigo original adquirido na BABA SHOPPING em ${new Date(p.purchaseDate).toLocaleDateString('pt-AO')}. Estado verificado e funcional.`);
    setListingError(null);
  };

  const handleConfirmListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productToList) return;

    if (listingPrice <= 0) {
      setListingError('O preço deve ser superior a zero.');
      return;
    }

    try {
      createResaleListing(
        productToList.id,
        currentUser.id,
        listingPrice,
        listingDesc,
        minPrice
      );
      setProductToList(null);
    } catch (err: any) {
      setListingError(err.message || 'Falha ao colocar produto à venda.');
    }
  };

  const handleCancelListing = (listingId: string) => {
    if (confirm('Tens a certeza que desejas retirar este anúncio do Mercado de Revenda? O produto voltará a estar disponível para ti.')) {
      try {
        cancelResaleListing(listingId, currentUser.id);
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  const getStatusBadge = (status: UserProduct['status']) => {
    switch (status) {
      case 'disponivel':
        return <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">Disponível no Inventário</span>;
      case 'anunciado':
        return <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">À Venda no Mercado</span>;
      case 'reservado':
        return <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">Reservado</span>;
      case 'vendido':
        return <span className="text-[11px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-300">Vendido com Sucesso</span>;
      case 'entregue':
        return <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">Entregue</span>;
      default:
        return <span className="text-[11px] font-medium text-neutral-600">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Meus Produtos</h1>
            <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
              {userProducts.length} artigo{userProducts.length !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Gere os produtos que compraste no Mercado Oficial, coloca-os à venda e acompanha as propostas de negociação.
          </p>
        </div>

        <button
          onClick={onNavigateToOfficial}
          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-amber-400 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Comprar Mais Artigos Oficiais</span>
        </button>
      </div>

      {/* 3 Mandatory Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-1">
        <button
          onClick={() => setActiveTab('todos')}
          className={`py-2 px-4 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'todos'
              ? 'bg-neutral-900 text-amber-400 shadow-2xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>1. Todos os Meus Produtos ({userProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('venda')}
          className={`py-2 px-4 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'venda'
              ? 'bg-neutral-900 text-amber-400 shadow-2xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>2. Produtos à Venda ({myResaleListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('negociacoes')}
          className={`py-2 px-4 rounded-lg text-xs font-bold transition-colors flex items-center gap-2 relative ${
            activeTab === 'negociacoes'
              ? 'bg-neutral-900 text-amber-400 shadow-2xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>3. Negociações e Notificações ({allNegotiations.length})</span>
          {allNegotiations.some(n => n.status === 'pendente' && n.lastOfferBy !== (currentUser.id === n.sellerId ? 'seller' : 'buyer')) && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          )}
        </button>
      </div>

      {/* TAB 1: TODOS OS MEUS PRODUTOS */}
      {activeTab === 'todos' && (
        <div className="space-y-4">
          {userProducts.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-neutral-200 bg-white space-y-3">
              <Package className="w-12 h-12 mx-auto text-neutral-300 stroke-1" />
              <h3 className="text-base font-bold text-neutral-800">Ainda não possuis produtos</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Quando compras produtos no Mercado Oficial com o teu saldo, eles aparecem automaticamente aqui e ficam elegíveis para revenda.
              </p>
              <button
                onClick={onNavigateToOfficial}
                className="mt-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold rounded-xl shadow-2xs transition-colors"
              >
                Ir para o Mercado Oficial
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {userProducts.map((item) => {
                const isAnnounced = item.status === 'anunciado';
                const isSold = item.status === 'vendido';
                const relatedListing = allResaleListings.find(l => l.userProductId === item.id && l.status !== 'vendido');
                const relatedNegotiations = allNegotiations.filter(n => n.userProductId === item.id);

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl border p-4 flex flex-col justify-between space-y-4 transition-all shadow-xs ${
                      isSold ? 'border-neutral-200 opacity-75 bg-neutral-50/50' : 'border-neutral-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <img
                          src={item.productImage}
                          alt={item.productName}
                          referrerPolicy="no-referrer"
                          className="w-18 h-18 rounded-xl object-cover bg-neutral-100 shrink-0 border border-neutral-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="mb-1">{getStatusBadge(item.status)}</div>
                          <h3 className="text-sm font-bold text-neutral-900 line-clamp-2">
                            {item.productName}
                          </h3>
                          <span className="text-[10px] text-neutral-400 block mt-0.5">
                            ID: {item.serialNumber || item.id}
                          </span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs space-y-1">
                        <div className="flex justify-between text-neutral-500">
                          <span>Preço Oficial de Compra:</span>
                          <span className="font-bold text-neutral-800 tabular-nums">{formatKz(item.originalPrice)}</span>
                        </div>
                        <div className="flex justify-between text-neutral-400 text-[11px]">
                          <span>Data de Compra:</span>
                          <span>{new Date(item.purchaseDate).toLocaleDateString('pt-AO')}</span>
                        </div>
                        {relatedListing && (
                          <div className="flex justify-between text-amber-700 font-semibold pt-1 border-t border-neutral-200 text-xs">
                            <span>Preço Anunciado:</span>
                            <span className="font-bold tabular-nums">{formatKz(relatedListing.listingPrice)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                      {item.status === 'disponivel' && (
                        <button
                          onClick={() => handleOpenListModal(item)}
                          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF5000] hover:from-[#FF5000] hover:to-[#E03A00] text-white text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-98"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                          <span>Revender</span>
                        </button>
                      )}

                      {isAnnounced && relatedListing && (
                        <div className="w-full flex items-center gap-2">
                          <button
                            onClick={() => handleCancelListing(relatedListing.id)}
                            className="flex-1 py-2 px-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Retirar Anúncio</span>
                          </button>
                          {relatedNegotiations.length > 0 && (
                            <button
                              onClick={() => {
                                setSelectedNegotiation(relatedNegotiations[0]);
                                setActiveTab('negociacoes');
                              }}
                              className="flex-1 py-2 px-2.5 rounded-xl bg-neutral-900 text-amber-400 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Propostas ({relatedNegotiations.length})</span>
                            </button>
                          )}
                        </div>
                      )}

                      {isSold && (
                        <div className="text-xs text-neutral-500 font-medium italic text-center w-full py-1">
                          ✓ Vendido e valor creditado na carteira
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUTOS À VENDA */}
      {activeTab === 'venda' && (
        <div className="space-y-4">
          {myResaleListings.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-neutral-200 bg-white space-y-3">
              <Tag className="w-12 h-12 mx-auto text-neutral-300 stroke-1" />
              <h3 className="text-base font-bold text-neutral-800">Não tens produtos anunciados no momento</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Para começar a revender, vai ao separador <em>Todos os Meus Produtos</em> e clica em <strong>Colocar à Venda</strong>.
              </p>
              <button
                onClick={() => setActiveTab('todos')}
                className="mt-2 text-xs font-bold text-amber-600 hover:underline"
              >
                Ver os meus produtos disponíveis
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {myResaleListings.map((listing) => {
                const relatedNegotiations = allNegotiations.filter(n => n.listingId === listing.id);

                return (
                  <div
                    key={listing.id}
                    className="bg-white rounded-2xl border border-amber-300/80 p-4 flex flex-col justify-between space-y-3 shadow-xs"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <img
                          src={listing.imageUrl}
                          alt={listing.productName}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-xl object-cover bg-neutral-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                            Ativo no Mercado de Revenda
                          </span>
                          <h3 className="text-sm font-bold text-neutral-900 mt-1 line-clamp-1">
                            {listing.productName}
                          </h3>
                          <div className="text-base font-black text-neutral-900 mt-0.5 tabular-nums">
                            {formatKz(listing.listingPrice)}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-600 line-clamp-2 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
                        "{listing.customDescription}"
                      </p>

                      <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
                        <span>Preço de compra original:</span>
                        <span className="tabular-nums font-semibold">{formatKz(listing.originalPrice)}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleCancelListing(listing.id)}
                        className="py-1.5 px-3 rounded-lg border border-neutral-200 hover:border-red-300 hover:bg-red-50 text-red-600 text-xs font-semibold transition-colors"
                      >
                        Retirar Anúncio
                      </button>

                      {relatedNegotiations.length > 0 ? (
                        <button
                          onClick={() => {
                            setSelectedNegotiation(relatedNegotiations[0]);
                            setActiveTab('negociacoes');
                          }}
                          className="py-1.5 px-3 rounded-lg bg-neutral-900 text-amber-400 text-xs font-bold transition-colors flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Ver Propostas ({relatedNegotiations.length})</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-neutral-400 italic">
                          Aguardando propostas
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: NEGOCIAÇÕES E NOTIFICAÇÕES */}
      {activeTab === 'negociacoes' && (
        <div className="space-y-4">
          {allNegotiations.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-neutral-200 bg-white space-y-3">
              <MessageSquare className="w-12 h-12 mx-auto text-neutral-300 stroke-1" />
              <h3 className="text-base font-bold text-neutral-800">Nenhuma negociação em curso</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Quando enviares ou receberes propostas de preço no Mercado de Revenda, a mesa de negociação e o histórico de mensagens aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {allNegotiations.map((neg) => {
                const isSeller = neg.sellerId === currentUser.id;
                const otherParty = isSeller ? neg.buyerName : neg.sellerName;
                const isWaitingMe = (isSeller && neg.lastOfferBy === 'buyer') || (!isSeller && neg.lastOfferBy === 'seller');

                return (
                  <div
                    key={neg.id}
                    onClick={() => setSelectedNegotiation(neg)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isWaitingMe && neg.status !== 'concluida'
                        ? 'bg-amber-50/50 border-amber-300 hover:bg-amber-50'
                        : 'bg-white border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={neg.productImage}
                        alt={neg.productName}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-xl object-cover bg-neutral-100 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-neutral-900">
                            {neg.productName}
                          </span>
                          <span className="text-[10px] text-neutral-400">·</span>
                          <span className="text-xs text-neutral-500">
                            {isSeller ? `Comprador: ${otherParty}` : `Vendedor: ${otherParty}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-neutral-400 line-through tabular-nums">
                            {formatKz(neg.listedPrice)}
                          </span>
                          <span className="text-sm font-black text-amber-600 tabular-nums">
                            {formatKz(neg.currentProposedPrice)}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            neg.status === 'aceite'
                              ? 'bg-emerald-100 text-emerald-800'
                              : neg.status === 'contraproposta'
                              ? 'bg-amber-100 text-amber-800'
                              : neg.status === 'concluida'
                              ? 'bg-neutral-200 text-neutral-700'
                              : 'bg-neutral-100 text-neutral-700'
                          }`}>
                            {neg.status === 'aceite' && 'Acordo Aceite!'}
                            {neg.status === 'contraproposta' && 'Contraproposta'}
                            {neg.status === 'pendente' && 'Pendente'}
                            {neg.status === 'recusada' && 'Recusada'}
                            {neg.status === 'concluida' && 'Concluída'}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-0.5 line-clamp-1">
                          Última mensagem: {neg.messages[neg.messages.length - 1]?.text}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      {isWaitingMe && (
                        <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-lg">
                          Tua vez de responder
                        </span>
                      )}
                      <button
                        className="px-3 py-1.5 rounded-xl bg-neutral-900 text-amber-400 text-xs font-bold hover:bg-neutral-800 transition-colors flex items-center gap-1"
                      >
                        <span>Abrir Negociação</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal: Colocar Produto à Venda */}
      {productToList && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200">
            <div className="p-4 bg-neutral-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#FF6A00]" />
                <h3 className="font-extrabold text-sm">Revender Produto no Mercado</h3>
              </div>
              <button
                onClick={() => setProductToList(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmListing} className="p-5 space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <img
                  src={productToList.productImage}
                  alt={productToList.productName}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-lg object-cover bg-neutral-100"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-neutral-900 truncate">
                    {productToList.productName}
                  </h4>
                  <div className="text-[11px] text-neutral-500 mt-0.5">
                    Preço original BABA: <strong className="tabular-nums">{formatKz(productToList.originalPrice)}</strong>
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Comprado em: {new Date(productToList.purchaseDate).toLocaleDateString('pt-AO')}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  Preço pretendido de revenda (Kz):
                </label>
                <input
                  type="number"
                  value={listingPrice}
                  onChange={(e) => setListingPrice(Number(e.target.value))}
                  step="500"
                  min="500"
                  required
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-bold text-neutral-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
                <div className="flex justify-between items-center text-[11px] text-neutral-500 mt-1">
                  <span>Preço original de compra: {formatKz(productToList.originalPrice)}</span>
                  {listingPrice > productToList.originalPrice ? (
                    <span className="text-emerald-600 font-semibold">
                      +{formatKz(listingPrice - productToList.originalPrice)} de margem bruta
                    </span>
                  ) : (
                    <span className="text-amber-600 font-semibold">
                      Desconto de {formatKz(productToList.originalPrice - listingPrice)}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  Descrição complementar para os compradores:
                </label>
                <textarea
                  value={listingDesc}
                  onChange={(e) => setListingDesc(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  placeholder="Descreve o estado do artigo, acessórios incluídos e disponibilidade em Angola..."
                />
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-600 space-y-1">
                <div className="flex justify-between">
                  <span>Preço anunciado:</span>
                  <span className="font-bold text-neutral-900 tabular-nums">{formatKz(listingPrice)}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Comissão da BABA SHOPPING (5%):</span>
                  <span className="tabular-nums">-{formatKz(Math.round(listingPrice * 0.05))}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-700 pt-1 border-t border-neutral-200">
                  <span>Valor líquido a receber na venda:</span>
                  <span className="tabular-nums">{formatKz(listingPrice - Math.round(listingPrice * 0.05))}</span>
                </div>
              </div>

              {listingError && (
                <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                  {listingError}
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProductToList(null)}
                  className="flex-1 py-2.5 border border-neutral-300 text-neutral-700 font-semibold text-xs rounded-xl hover:bg-neutral-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-neutral-900 text-amber-400 hover:bg-neutral-800 font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Confirmar Anúncio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Negotiation Modal if opened */}
      {selectedNegotiation && (
        <NegotiationModal
          isOpen={true}
          onClose={() => setSelectedNegotiation(null)}
          negotiation={selectedNegotiation}
          currentUser={currentUser}
          wallet={wallet}
          onConfirmPurchase={(neg) => {
            try {
              const order = buyResaleProduct(neg.listingId, currentUser.id, neg.currentProposedPrice);
              setSelectedNegotiation(null);
              onSuccessOrder(order.id);
            } catch (err: any) {
              alert(err.message || 'Falha ao confirmar compra');
            }
          }}
        />
      )}
    </div>
  );
};
