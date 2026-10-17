import React from 'react';
import { X, CheckCheck, Bell, MessageSquare, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { AppNotification } from '../types';
import { markNotificationAsRead, markAllNotificationsAsRead } from '../services/storage';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  userId: string;
  onNavigate: (type: string, id?: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  userId,
  onNavigate
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleItemClick = (n: AppNotification) => {
    markNotificationAsRead(n.id);
    if (n.linkType === 'negociacao') {
      onNavigate('meus_produtos', n.linkId);
    } else if (n.linkType === 'produto') {
      onNavigate('revenda', n.linkId);
    } else if (n.linkType === 'carteira') {
      onNavigate('carteira');
    } else if (n.linkType === 'encomenda') {
      onNavigate('encomendas', n.linkId);
    }
    onClose();
  };

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'negociacao':
        return <MessageSquare className="w-4 h-4 text-amber-500" />;
      case 'venda':
        return <Tag className="w-4 h-4 text-emerald-600" />;
      case 'compra':
        return <ShoppingBag className="w-4 h-4 text-blue-500" />;
      case 'carteira':
        return <CheckCheck className="w-4 h-4 text-emerald-500" />;
      default:
        return <Bell className="w-4 h-4 text-neutral-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-neutral-200">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-neutral-900 text-base">Notificações</h2>
            {unreadCount > 0 && (
              <span className="text-xs bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full">
                {unreadCount} nova{unreadCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={() => markAllNotificationsAsRead(userId)}
                className="text-xs text-amber-600 hover:text-amber-700 font-semibold"
              >
                Marcar lidas
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-neutral-100">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
              <Bell className="w-12 h-12 stroke-1 text-neutral-300 mb-2" />
              <p className="text-sm font-medium text-neutral-600">Sem notificações no momento</p>
              <p className="text-xs text-neutral-400 mt-1">
                Todas as atualizações de negociações, vendas e carteira aparecerão aqui.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleItemClick(n)}
                className={`pt-2.5 pb-2 px-3 rounded-lg cursor-pointer transition-colors ${
                  !n.read ? 'bg-amber-50/60 hover:bg-amber-50' : 'hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white border border-neutral-200 shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-xs ${!n.read ? 'font-bold text-neutral-900' : 'font-medium text-neutral-700'}`}>
                        {n.title}
                      </h4>
                      <span className="text-[10px] text-neutral-400 whitespace-nowrap">
                        {new Date(n.createdAt).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-0.5 line-clamp-2">
                      {n.message}
                    </p>
                    {n.linkType && (
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 mt-1.5">
                        <span>Ver detalhes</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
