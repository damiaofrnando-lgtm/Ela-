import React, { useState } from 'react';
import { User, Wallet, UserProduct, Order } from '../types';
import { formatKz } from '../services/storage';
import { 
  User as UserIcon, 
  ShieldCheck, 
  Wallet as WalletIcon, 
  Package, 
  FileText, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  TrendingUp, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Building2, 
  ArrowRightLeft, 
  ExternalLink,
  Eye,
  LogOut,
  ChevronRight
} from 'lucide-react';

interface CustomerAreaProps {
  currentUser: User;
  wallet: Wallet;
  userProducts: UserProduct[];
  orders: Order[];
  onNavigateTab: (tab: string, param?: string) => void;
  onOpenAuth: () => void;
}

export const CustomerArea: React.FC<CustomerAreaProps> = ({
  currentUser,
  wallet,
  userProducts,
  orders,
  onNavigateTab,
  onOpenAuth
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'geral' | 'bi_dossier' | 'resumo_revenda'>('geral');
  const [showBiModal, setShowBiModal] = useState<'frente' | 'verso' | null>(null);

  const activeResaleCount = userProducts.filter(p => p.status === 'anunciado' || p.status === 'reservado').length;
  const availableStockCount = userProducts.filter(p => p.status === 'disponivel').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. Profile Header Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 text-[#FF6A00] flex items-center justify-center font-black text-2xl sm:text-3xl shadow-sm shrink-0 border-2 border-orange-200">
              {currentUser.name.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-neutral-950">
                  {currentUser.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>BI Verificado</span>
                </span>
                {currentUser.role === 'admin' && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-400 text-neutral-950 text-[10px] font-black uppercase">
                    Administrador
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-neutral-500">
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-neutral-400" />
                  Nº BI: <strong className="text-neutral-800 font-mono">{currentUser.idNumber}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  {currentUser.city}, {currentUser.province}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  {currentUser.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onOpenAuth}
              className="flex-1 sm:flex-none px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Trocar de Conta</span>
            </button>
            <button
              onClick={() => onNavigateTab('carteira')}
              className="flex-1 sm:flex-none px-4 py-2 bg-[#FF6A00] hover:bg-[#FF5000] text-white text-xs font-black rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
            >
              <WalletIcon className="w-3.5 h-3.5" />
              <span>Carregar Saldo</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Reseller Business KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-neutral-400 flex items-center justify-between">
            <span>Saldo da Carteira</span>
            <WalletIcon className="w-4 h-4 text-[#FF6A00]" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-neutral-950 tabular-nums">
            {formatKz(wallet.availableBalance)}
          </div>
          <p className="text-[10px] text-neutral-500">Pronto para novas compras de atacado</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-neutral-400 flex items-center justify-between">
            <span>Em Stock (Revenda)</span>
            <Package className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 tabular-nums">
            {availableStockCount} unidades
          </div>
          <p className="text-[10px] text-neutral-500">Prontos para anunciar no mercado</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-neutral-400 flex items-center justify-between">
            <span>Anúncios Ativos</span>
            <ArrowRightLeft className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-blue-700 tabular-nums">
            {activeResaleCount} artigos
          </div>
          <p className="text-[10px] text-neutral-500">A receber propostas de compradores</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-2xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-neutral-400 flex items-center justify-between">
            <span>Total Encomendas</span>
            <CheckCircle2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-700 tabular-nums">
            {orders.length} pedidos
          </div>
          <p className="text-[10px] text-neutral-500">Entregues com garantia BABA</p>
        </div>
      </div>

      {/* 3. Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
        <button
          onClick={() => setActiveSubTab('geral')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'geral'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          Visão Geral & Acessos Rápidos
        </button>
        <button
          onClick={() => setActiveSubTab('bi_dossier')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'bi_dossier'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Dossiê do Bilhete de Identidade</span>
        </button>
      </div>

      {/* 4. Tab Content: General Overview */}
      {activeSubTab === 'geral' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4 shadow-2xs">
            <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-tight flex items-center gap-2">
              <Package className="w-4 h-4 text-[#FF6A00]" />
              <span>Gestão do Teu Negócio de Revenda</span>
            </h3>

            <div className="space-y-2.5">
              <button
                onClick={() => onNavigateTab('meus_produtos')}
                className="w-full p-3 rounded-xl border border-neutral-200 hover:border-[#FF6A00] bg-neutral-50/70 hover:bg-orange-50/50 flex items-center justify-between transition-all cursor-pointer text-left"
              >
                <div>
                  <div className="text-xs font-bold text-neutral-900">Ver Meu Inventário para Revenda</div>
                  <div className="text-[11px] text-neutral-500">Artigos comprados que podes anunciar com o teu próprio preço</div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>

              <button
                onClick={() => onNavigateTab('revenda')}
                className="w-full p-3 rounded-xl border border-neutral-200 hover:border-[#FF6A00] bg-neutral-50/70 hover:bg-orange-50/50 flex items-center justify-between transition-all cursor-pointer text-left"
              >
                <div>
                  <div className="text-xs font-bold text-neutral-900">Mercado de Revenda P2P</div>
                  <div className="text-[11px] text-neutral-500">Explorar anúncios e negociar preços com outros comerciantes</div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>

              <button
                onClick={() => onNavigateTab('encomendas')}
                className="w-full p-3 rounded-xl border border-neutral-200 hover:border-[#FF6A00] bg-neutral-50/70 hover:bg-orange-50/50 flex items-center justify-between transition-all cursor-pointer text-left"
              >
                <div>
                  <div className="text-xs font-bold text-neutral-900">Histórico de Encomendas</div>
                  <div className="text-[11px] text-neutral-500">Rastreio de entregas e recibos oficiais de compra</div>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </button>
            </div>
          </div>

          {/* Business Model Guide */}
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 text-white rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-[#FF6A00] uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>Como Funciona a Compra & Revenda</span>
            </div>
            <h3 className="text-base font-extrabold text-white">
              Ganha dinheiro comprando por atacado e revendendo na BABA SHOPPING
            </h3>
            <ol className="space-y-3 text-xs text-neutral-300">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#FF6A00] text-white flex items-center justify-center text-[10px] font-black shrink-0">1</span>
                <span><strong>Compra ao Preço de Fábrica:</strong> Escolhe produtos no catálogo oficial por atacado a preços fixos em Kwanza.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#FF6A00] text-white flex items-center justify-center text-[10px] font-black shrink-0">2</span>
                <span><strong>Fica no Teu Stock:</strong> O artigo entra instantaneamente em <em>Meus Produtos</em> como teu património verificado.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-[#FF6A00] text-white flex items-center justify-center text-[10px] font-black shrink-0">3</span>
                <span><strong>Revende com Lucro:</strong> Define o teu preço de venda e aceita ou contrapropõe ofertas no Mercado de Revenda.</span>
              </li>
            </ol>
            <div className="pt-2">
              <button
                onClick={() => onNavigateTab('oficial')}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-[#FF6A00] to-[#FF5000] hover:from-[#FF5000] hover:to-[#E03A00] text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer text-center"
              >
                Comprar Produtos para Revender Agora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Tab Content: Bilhete de Identidade (BI) Official Dossier */}
      {activeSubTab === 'bi_dossier' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <h3 className="text-base font-black text-neutral-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Bilhete de Identidade Nacional (Angola)</span>
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Dados cadastrais autênticos verificados e validados pelo Administrador do BABA SHOPPING.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-300">
              STATUS: ATIVO & REGULARIZADO
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <span className="text-[10px] font-bold uppercase text-neutral-400 block">Nome no BI</span>
              <span className="text-xs font-bold text-neutral-900 block mt-0.5">{currentUser.name}</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <span className="text-[10px] font-bold uppercase text-neutral-400 block">Número do BI</span>
              <span className="text-xs font-mono font-bold text-[#FF6A00] block mt-0.5">{currentUser.idNumber}</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <span className="text-[10px] font-bold uppercase text-neutral-400 block">Data de Nascimento</span>
              <span className="text-xs font-bold text-neutral-900 block mt-0.5">{currentUser.birthDate || '14/09/1995'}</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
              <span className="text-[10px] font-bold uppercase text-neutral-400 block">Província / Município</span>
              <span className="text-xs font-bold text-neutral-900 block mt-0.5">{currentUser.city}, {currentUser.province}</span>
            </div>
          </div>

          {/* Front and Back BI Images Gallery */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black uppercase text-neutral-700 tracking-wider">
              Fotografias Originais do Documento (Frente e Verso)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Front Photo */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-neutral-600 flex items-center justify-between">
                  <span>Foto Frente do BI:</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">Validado</span>
                </div>
                <div className="rounded-xl border-2 border-neutral-200 overflow-hidden bg-neutral-100 aspect-[16/10] relative group">
                  {currentUser.idCardFront ? (
                    <img
                      src={currentUser.idCardFront}
                      alt="Frente do BI"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                      Imagem não disponível
                    </div>
                  )}
                  <button
                    onClick={() => setShowBiModal('frente')}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Ampliar Imagem</span>
                  </button>
                </div>
              </div>

              {/* Back Photo */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-neutral-600 flex items-center justify-between">
                  <span>Foto Verso do BI:</span>
                  <span className="text-[10px] text-emerald-700 font-semibold">Validado</span>
                </div>
                <div className="rounded-xl border-2 border-neutral-200 overflow-hidden bg-neutral-100 aspect-[16/10] relative group">
                  {currentUser.idCardBack ? (
                    <img
                      src={currentUser.idCardBack}
                      alt="Verso do BI"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                      Imagem não disponível
                    </div>
                  )}
                  <button
                    onClick={() => setShowBiModal('verso')}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Ampliar Imagem</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zoom Modal for BI Photo */}
      {showBiModal && (
        <div 
          onClick={() => setShowBiModal(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-pointer animate-fadeIn"
        >
          <div className="max-w-2xl w-full bg-white rounded-2xl overflow-hidden p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-900 uppercase">
                Visualização do Bilhete de Identidade ({showBiModal === 'frente' ? 'Frente' : 'Verso'})
              </span>
              <button 
                onClick={() => setShowBiModal(null)}
                className="text-neutral-500 hover:text-neutral-900 text-xs font-bold p-1 cursor-pointer"
              >
                ✕ Fechar
              </button>
            </div>
            <div className="rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200">
              <img
                src={showBiModal === 'frente' ? currentUser.idCardFront : currentUser.idCardBack}
                alt="Documento ampliado"
                className="w-full h-auto object-contain max-h-[70vh]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
