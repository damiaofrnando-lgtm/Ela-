import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ShieldCheck, 
  Wallet as WalletIcon, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { User, Wallet } from '../types';
import { formatKz, buyOfficialProduct, buyResaleProduct } from '../services/storage';

export interface CartItem {
  id: string; // product id
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  source: 'oficial' | 'revenda';
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  currentUser: User;
  wallet: Wallet;
  onSuccessOrder: (orderId: string) => void;
  onTopUpWallet: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currentUser,
  wallet,
  onSuccessOrder,
  onTopUpWallet
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalAmount = subtotal; // 100% digital compra na plataforma, sem taxas de envio
  const hasEnoughBalance = wallet.availableBalance >= totalAmount;
  const missingAmount = totalAmount - wallet.availableBalance;

  const handleCheckout = () => {
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage('O teu carrinho está vazio.');
      return;
    }

    if (!hasEnoughBalance) {
      setErrorMessage(
        `Saldo insuficiente na carteira. O total da compra é ${formatKz(totalAmount)}, mas tens disponível apenas ${formatKz(wallet.availableBalance)}. Falta pagar ${formatKz(missingAmount)}.`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      let lastOrderId = '';
      for (const item of items) {
        if (item.source === 'oficial') {
          const res = buyOfficialProduct(currentUser.id, item.id, item.quantity);
          lastOrderId = res.order.id;
        } else if (item.source === 'revenda') {
          const order = buyResaleProduct(item.id, currentUser.id, item.price);
          lastOrderId = order.id;
        }
      }

      onClearCart();
      onClose();
      onSuccessOrder(lastOrderId);
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao processar a compra na plataforma.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF6A00] flex items-center justify-center text-white">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base leading-tight">Carrinho de Compras</h2>
              <span className="text-[11px] text-neutral-400 font-medium">
                {totalQuantity} {totalQuantity === 1 ? 'artigo selecionado' : 'artigos selecionados'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
            title="Fechar carrinho"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-neutral-400">
            <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
              <ShoppingBag className="w-10 h-10 stroke-1 text-neutral-400" />
            </div>
            <p className="text-base font-extrabold text-neutral-800">O teu carrinho está vazio</p>
            <p className="text-xs text-neutral-500 mt-1.5 max-w-xs leading-relaxed">
              Explora o catálogo com mais de 200 produtos oficiais, compra com o saldo da tua carteira e revende com lucro na plataforma.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-5 py-2.5 bg-gradient-to-r from-[#FF6A00] to-[#FF5000] text-white text-xs font-bold rounded-xl shadow-md hover:from-[#FF5000] hover:to-[#E03A00] transition-all cursor-pointer"
            >
              Explorar Catálogo de Produtos
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Resale Platform Clarification Banner */}
            <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-neutral-800 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#FF6A00]">
                <TrendingUp className="w-4 h-4" />
                <span>Compra & Revenda 100% na Plataforma</span>
              </div>
              <p className="text-[11px] text-neutral-700 leading-relaxed">
                Ao confirmares a compra, os artigos são adicionados imediatamente ao teu inventário em <strong>Meus Produtos</strong>, onde poderás clicar no botão <strong>Revender</strong> e definir a tua margem de lucro.
              </p>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              {items.map((item) => {
                const itemSubtotal = item.price * item.quantity;
                return (
                  <div 
                    key={item.id}
                    className="flex gap-3 p-3 rounded-2xl border border-neutral-200 bg-white shadow-2xs hover:border-[#FF6A00]/40 transition-colors"
                  >
                    {/* Fotografia do produto */}
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-18 h-18 rounded-xl object-cover bg-neutral-100 shrink-0 border border-neutral-100"
                    />

                    {/* Detalhes do produto */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        {/* Nome do produto */}
                        <h4 className="text-xs font-bold text-neutral-900 line-clamp-2 leading-snug">
                          {item.name}
                        </h4>
                        {/* Preço unitário */}
                        <p className="text-xs font-black text-[#FF6A00] mt-1 tabular-nums">
                          {formatKz(item.price)}
                          {item.quantity > 1 && (
                            <span className="text-[10px] text-neutral-500 font-normal ml-1">
                              (Subtotal: {formatKz(itemSubtotal)})
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Quantidade e Remover */}
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-100">
                        <div className="flex items-center border border-neutral-200 rounded-lg bg-neutral-50 text-xs overflow-hidden">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="px-2.5 py-1 text-neutral-700 hover:bg-neutral-200 font-bold transition-colors cursor-pointer"
                            title="Diminuir quantidade"
                          >
                            -
                          </button>
                          <span className="px-3 font-extrabold text-neutral-900 tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="px-2.5 py-1 text-neutral-700 hover:bg-neutral-200 font-bold transition-colors cursor-pointer"
                            title="Aumentar quantidade"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-neutral-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title="Remover do carrinho"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Carteira e Verificação de Saldo */}
            <div className="p-3.5 rounded-2xl border border-neutral-200 bg-neutral-50 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-neutral-600 font-bold">
                  <WalletIcon className="w-4 h-4 text-[#FF6A00]" />
                  <span>Saldo Disponível na Carteira</span>
                </span>
                <span className="font-black text-neutral-950 tabular-nums text-sm">
                  {formatKz(wallet.availableBalance)}
                </span>
              </div>

              {/* Se o saldo for insuficiente, mostra o valor que falta pagar */}
              {!hasEnoughBalance && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-900 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-red-700 block">Saldo Insuficiente</span>
                      <span className="text-[11px] text-red-800">
                        Valor que falta pagar: <strong className="text-red-900 font-black tabular-nums">{formatKz(missingAmount)}</strong>
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onTopUpWallet();
                    }}
                    className="w-full py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Carregar Carteira Agora</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 font-medium">
                {errorMessage}
              </div>
            )}
          </div>
        )}

        {/* Footer com Totais e Botão Confirmar Compra */}
        {items.length > 0 && (
          <div className="p-4 border-t border-neutral-200 bg-white space-y-3 shrink-0 shadow-lg">
            {/* Totais do Carrinho */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal ({totalQuantity} itens)</span>
                <span className="font-bold text-neutral-900 tabular-nums">{formatKz(subtotal)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-neutral-950 pt-2 border-t border-neutral-100">
                <span>Total a Pagar</span>
                <span className="text-[#FF6A00] tabular-nums text-lg">{formatKz(totalAmount)}</span>
              </div>
            </div>

            {/* Botão Confirmar Compra */}
            <button
              onClick={handleCheckout}
              disabled={isSubmitting || !hasEnoughBalance}
              className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
                hasEnoughBalance && !isSubmitting
                  ? 'bg-gradient-to-r from-[#FF6A00] to-[#FF5000] hover:from-[#FF5000] hover:to-[#E03A00] text-white cursor-pointer active:scale-98 shadow-orange-600/30'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed border border-neutral-300'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {isSubmitting 
                  ? 'A processar pagamento...' 
                  : hasEnoughBalance 
                  ? 'Confirmar Compra' 
                  : `Saldo Insuficiente (Falta ${formatKz(missingAmount)})`
                }
              </span>
            </button>

            <div className="flex items-center justify-center gap-1 text-[10px] text-neutral-500 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Titularidade transferida imediatamente para "Meus Produtos"</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
