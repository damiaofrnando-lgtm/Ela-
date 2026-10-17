import React from 'react';
import { Home, Store, Package, Wallet, User as UserIcon, ShieldAlert } from 'lucide-react';
import { UserRole } from '../types';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  unreadCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  unreadCount = 0
}) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-2 py-1.5 shadow-lg safe-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* INÍCIO */}
        <button
          onClick={() => setActiveTab('inicio')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${
            activeTab === 'inicio' ? 'text-amber-600 font-semibold' : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Início</span>
        </button>

        {/* MERCADO */}
        <button
          onClick={() => setActiveTab('oficial')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${
            activeTab === 'oficial' || activeTab === 'revenda'
              ? 'text-amber-600 font-semibold'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Store className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Mercado</span>
        </button>

        {/* MEUS PRODUTOS */}
        <button
          onClick={() => setActiveTab('meus_produtos')}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${
            activeTab === 'meus_produtos' ? 'text-amber-600 font-semibold' : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Package className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Meus Produtos</span>
          {unreadCount > 0 && (
            <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          )}
        </button>

        {/* CARTEIRA */}
        <button
          onClick={() => setActiveTab('carteira')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${
            activeTab === 'carteira' ? 'text-amber-600 font-semibold' : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Wallet className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Carteira</span>
        </button>

        {/* PERFIL / ADMIN */}
        <button
          onClick={() => setActiveTab(userRole === 'admin' ? 'admin' : 'perfil')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${
            activeTab === 'perfil' || activeTab === 'admin'
              ? 'text-amber-600 font-semibold'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          {userRole === 'admin' ? (
            <ShieldAlert className="w-5 h-5 mb-0.5 text-amber-600" />
          ) : (
            <UserIcon className="w-5 h-5 mb-0.5" />
          )}
          <span className="text-[10px] tracking-tight">
            {userRole === 'admin' ? 'Admin' : 'Perfil'}
          </span>
        </button>
      </div>
    </nav>
  );
};
