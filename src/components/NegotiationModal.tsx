import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  RotateCcw, 
  Ban, 
  MessageSquare, 
  ShoppingBag, 
  AlertCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { Negotiation, ResaleListing, User, Wallet } from '../types';
import { 
  formatKz, 
  sellerRespondNegotiation, 
  buyerRespondCounterOffer, 
  sendNegotiationMessage 
} from '../services/storage';

interface NegotiationModalProps {
  isOpen: boolean;
  onClose: () => void;
  negotiation: Negotiation;
  currentUser: User;
  wallet: Wallet;
  onConfirmPurchase: (negotiation: Negotiation) => void;
}

export const NegotiationModal: React.FC<NegotiationModalProps> = ({
  isOpen,
  onClose,
  negotiation,
  currentUser,
  wallet,
  onConfirmPurchase
}) => {
  const [inputText, setInputText] = useState('');
  const [counterPriceInput, setCounterPriceInput] = useState<number>(negotiation.currentProposedPrice);
  const [showCounterBox, setShowCounterBox] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isSeller = currentUser.id === negotiation.sellerId;
  const isBuyer = currentUser.id === negotiation.buyerId;
  const isAgreementReached = negotiation.status === 'aceite';
  const isFinished = negotiation.status === 'concluida' || negotiation.status === 'cancelada';
  const hasEnoughFunds = wallet.availableBalance >= negotiation.currentProposedPrice;

  // Send a regular chat message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      sendNegotiationMessage(
        negotiation.id,
        currentUser.id,
        currentUser.name,
        inputText.trim()
      );
      setInputText('');
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  // Seller actions
  const handleSellerAction = (action: 'aceitar' | 'contraproposta' | 'recusar') => {
    setActionError(null);
    try {
      if (action === 'contraproposta') {
        if (!counterPriceInput || counterPriceInput <= 0) {
          setActionError('Insere um valor válido para a contraproposta.');
          return;
        }
        sellerRespondNegotiation(negotiation.id, currentUser.id, 'contraproposta', counterPriceInput);
        setShowCounterBox(false);
      } else {
        sellerRespondNegotiation(negotiation.id, currentUser.id, action);
      }
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  // Buyer actions
  const handleBuyerAction = (action: 'aceitar' | 'contraproposta' | 'recusar') => {
    setActionError(null);
    try {
      if (action === 'contraproposta') {
        if (!counterPriceInput || counterPriceInput <= 0) {
          setActionError('Insere um valor válido para a contraproposta.');
          return;
        }
        buyerRespondCounterOffer(negotiation.id, currentUser.id, 'contraproposta', counterPriceInput);
        setShowCounterBox(false);
      } else {
        buyerRespondCounterOffer(negotiation.id, currentUser.id, action);
      }
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-neutral-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={negotiation.productImage}
              alt={negotiation.productName}
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-lg object-cover bg-neutral-800 border border-neutral-700"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  Mesa de Negociação
                </span>
                <span className="text-neutral-500">·</span>
                <span className="text-[11px] text-neutral-300">
                  {isSeller ? `Comprador: ${negotiation.buyerName}` : `Vendedor: ${negotiation.sellerName}`}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white line-clamp-1">{negotiation.productName}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Price status strip */}
        <div className="bg-amber-50/80 border-b border-amber-200/80 p-3 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-neutral-500 block text-[10px] uppercase font-semibold">Preço Anunciado</span>
            <span className="font-bold text-neutral-800 line-through tabular-nums">
              {formatKz(negotiation.listedPrice)}
            </span>
          </div>

          <div className="text-right sm:text-left">
            <span className="text-amber-800 block text-[10px] uppercase font-bold">Proposta Atual em Vigor</span>
            <span className="text-lg font-black text-amber-600 tabular-nums">
              {formatKz(negotiation.currentProposedPrice)}
            </span>
          </div>

          <div className="w-full sm:w-auto">
            <span className="text-[10px] text-neutral-500 block uppercase font-semibold">Estado da Negociação</span>
            <span className={`inline-block font-bold px-2 py-0.5 rounded text-[11px] ${
              negotiation.status === 'aceite'
                ? 'bg-emerald-100 text-emerald-800'
                : negotiation.status === 'contraproposta'
                ? 'bg-amber-100 text-amber-800'
                : negotiation.status === 'recusada'
                ? 'bg-red-100 text-red-800'
                : 'bg-neutral-200 text-neutral-800'
            }`}>
              {negotiation.status === 'aceite' && '✓ Proposta Aceite!'}
              {negotiation.status === 'contraproposta' && 'Contraproposta Ativa'}
              {negotiation.status === 'pendente' && 'Aguardando Resposta'}
              {negotiation.status === 'recusada' && 'Proposta Recusada'}
              {negotiation.status === 'concluida' && 'Venda Concluída'}
              {negotiation.status === 'cancelada' && 'Cancelada'}
            </span>
          </div>
        </div>

        {/* Status banner / Agreement announcement */}
        {isAgreementReached && (
          <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Acordo alcançado por {formatKz(negotiation.currentProposedPrice)}!</strong>
                {isBuyer ? ' Podes agora confirmar o pagamento e concluir a compra.' : ' Aguarda que o comprador finalize o pagamento.'}
              </span>
            </div>
            {isBuyer && (
              <button
                onClick={() => onConfirmPurchase(negotiation)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-xs transition-colors shrink-0"
              >
                Comprar por {formatKz(negotiation.currentProposedPrice)}
              </button>
            )}
          </div>
        )}

        {/* Chat Conversation Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50/50 min-h-[220px]">
          {negotiation.messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 mb-0.5 px-1">
                  <span>{isMe ? 'Tu' : msg.senderName}</span>
                  <span>·</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed ${
                    isMe
                      ? 'bg-neutral-900 text-white rounded-tr-xs'
                      : 'bg-white text-neutral-800 border border-neutral-200 rounded-tl-xs shadow-2xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Counter Offer input box when toggled */}
        {showCounterBox && !isFinished && (
          <div className="p-3 bg-amber-50/70 border-t border-amber-200 flex items-center gap-2">
            <div className="flex-1">
              <label className="text-[10px] font-bold text-neutral-600 block mb-1">
                Indica o teu novo valor de contraproposta (Kz):
              </label>
              <input
                type="number"
                value={counterPriceInput}
                onChange={(e) => setCounterPriceInput(Number(e.target.value))}
                step="500"
                min="1000"
                className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs font-bold text-neutral-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <button
              onClick={() => isSeller ? handleSellerAction('contraproposta') : handleBuyerAction('contraproposta')}
              className="mt-4 px-4 py-2 bg-neutral-900 text-amber-400 hover:bg-neutral-800 text-xs font-bold rounded-lg transition-colors"
            >
              Enviar Valor
            </button>
            <button
              onClick={() => setShowCounterBox(false)}
              className="mt-4 px-2 py-2 text-neutral-500 hover:text-neutral-800 text-xs"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Error message */}
        {actionError && (
          <div className="p-2.5 bg-red-50 text-red-700 text-xs border-t border-red-200">
            {actionError}
          </div>
        )}

        {/* Negotiation Actions for Seller */}
        {isSeller && !isFinished && negotiation.lastOfferBy === 'buyer' && (
          <div className="p-3 bg-white border-t border-neutral-200 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-neutral-700">
              O comprador propôs {formatKz(negotiation.currentProposedPrice)}:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSellerAction('aceitar')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Aceitar Proposta</span>
              </button>
              <button
                onClick={() => setShowCounterBox(true)}
                className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors border border-neutral-300"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Contraproposta</span>
              </button>
              <button
                onClick={() => handleSellerAction('recusar')}
                className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors border border-red-200"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Recusar</span>
              </button>
            </div>
          </div>
        )}

        {/* Negotiation Actions for Buyer (when seller responded with counter-offer) */}
        {isBuyer && !isFinished && negotiation.lastOfferBy === 'seller' && (
          <div className="p-3 bg-white border-t border-neutral-200 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-neutral-700">
              O vendedor propôs {formatKz(negotiation.currentProposedPrice)}:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBuyerAction('aceitar')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Aceitar Valor</span>
              </button>
              <button
                onClick={() => setShowCounterBox(true)}
                className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors border border-neutral-300"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nova Proposta</span>
              </button>
              <button
                onClick={() => handleBuyerAction('recusar')}
                className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors border border-red-200"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Desistir</span>
              </button>
            </div>
          </div>
        )}

        {/* Chat input footer */}
        {!isFinished && (
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escreve uma mensagem para combinar detalhes ou preço..."
              className="flex-1 px-3 py-2 bg-neutral-100 rounded-lg text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 bg-neutral-900 text-amber-400 hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-40"
              title="Enviar Mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
