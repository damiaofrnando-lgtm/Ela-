import React, { useState } from 'react';
import { 
  Order, 
  User 
} from '../types';
import { 
  formatKz, 
  getOrders, 
  formatOrderStatus 
} from '../services/storage';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ChevronRight, 
  ShoppingBag,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface OrdersViewProps {
  currentUser: User;
  onNavigateToMarket: () => void;
  highlightOrderId?: string;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  currentUser,
  onNavigateToMarket,
  highlightOrderId
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const orders = getOrders(currentUser.id);

  // Auto select highlighted order if given
  React.useEffect(() => {
    if (highlightOrderId) {
      const found = orders.find(o => o.id === highlightOrderId);
      if (found) setSelectedOrder(found);
    }
  }, [highlightOrderId, orders]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pagamento_confirmado': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'em_preparacao': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'enviado': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'em_entrega': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'entregue': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'cancelado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  const getStepActiveIndex = (status: Order['status']) => {
    switch (status) {
      case 'aguardando_pagamento': return 0;
      case 'pagamento_confirmado': return 1;
      case 'em_preparacao': return 2;
      case 'enviado': return 3;
      case 'em_entrega': return 4;
      case 'entregue': return 5;
      default: return 1;
    }
  };

  const steps = [
    'Pagamento Confirmado',
    'Em Preparação',
    'Enviado para Distribuição',
    'Em Rota de Entrega',
    'Entregue com Sucesso'
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="border-b border-neutral-200 pb-4">
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6 text-[#FF6A00]" />
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
            Histórico de Compras & Titularidade
          </h1>
        </div>
        <p className="text-xs text-neutral-500 mt-1">
          Registo de todas as compras efetuadas com a carteira digital. Cada produto adquirido fica sob a tua titularidade em "Meus Produtos" pronto para revenda.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-neutral-200 bg-white space-y-3">
          <Package className="w-12 h-12 mx-auto text-neutral-300 stroke-1" />
          <h3 className="text-base font-bold text-neutral-800">Ainda não tens compras registadas</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Quando compras produtos no Mercado Oficial ou no Mercado de Revenda, o registo da transferência de titularidade fica disponível aqui.
          </p>
          <button
            onClick={onNavigateToMarket}
            className="mt-2 px-4 py-2 bg-gradient-to-r from-[#FF6A00] to-[#FF5000] text-white font-bold text-xs rounded-xl shadow-xs hover:from-[#FF5000] hover:to-[#E03A00] transition-colors cursor-pointer"
          >
            Explorar Produtos
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs hover:border-[#FF6A00]/40 transition-all"
              >
                {/* Header */}
                <div className="p-4 sm:px-6 bg-neutral-50 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-neutral-900">{order.id}</span>
                    <span className="text-neutral-400">·</span>
                    <span className="text-neutral-500">
                      {new Date(order.createdAt).toLocaleDateString('pt-AO')}
                    </span>
                    <span className="text-neutral-400">·</span>
                    <span className="text-neutral-600 font-medium">
                      Origem: {order.source === 'oficial' ? 'Mercado Oficial BABA' : `Revenda (Vendedor: ${order.sellerName || 'Parceiro'})`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full border bg-emerald-50 text-emerald-800 border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Titularidade Confirmada</span>
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 space-y-5">
                  {/* Item preview */}
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-lg object-cover bg-neutral-100 shrink-0 border border-neutral-200"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">{item.name}</h4>
                            <span className="text-[11px] text-neutral-500">
                              Qtd: {item.quantity} · Preço un.: {formatKz(item.price)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-neutral-900 tabular-nums">
                            {formatKz(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Resale Ownership Status Box */}
                  <div className="pt-3 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-neutral-50 p-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold text-neutral-800">
                          Disponível em "Meus Produtos"
                        </span>
                        <p className="text-neutral-500 text-[11px]">
                          Podes aceder a Meus Produtos e clicar em <strong>Revender</strong> para definir o teu preço de revenda e lucrar.
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-neutral-500 text-[11px] block">Total Liquidado</span>
                      <span className="text-base font-black text-[#FF6A00] tabular-nums">
                        {formatKz(order.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
