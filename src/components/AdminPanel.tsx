import React, { useState } from 'react';
import { 
  OfficialProduct, 
  ResaleListing, 
  Order, 
  Transaction, 
  User, 
  ProductCategory,
  DepositRequest,
  WithdrawalRequest
} from '../types';
import { CATEGORIES } from '../data/initialData';
import { 
  formatKz, 
  addProduct, 
  updateProduct, 
  getProducts, 
  getResaleListings, 
  getOrders, 
  getUsers, 
  getTransactions, 
  getPendingDeposits, 
  getPendingWithdrawals, 
  approveDeposit, 
  processWithdrawal, 
  updateOrderStatus,
  getWallets,
  approveUserAccount,
  rejectUserAccount,
  getPendingUsers
} from '../services/storage';
import { 
  ShieldCheck, 
  Package, 
  DollarSign, 
  Truck, 
  Users, 
  BarChart3, 
  Plus, 
  Edit3, 
  Check, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Percent,
  Layers,
  ShoppingBag,
  FileText,
  Eye,
  UserCheck
} from 'lucide-react';

interface AdminPanelProps {
  currentUser: User;
  onNavigateToMarket: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  onNavigateToMarket
}) => {
  const [activeSection, setActiveSection] = useState<'stats' | 'produtos' | 'financeiro' | 'encomendas' | 'utilizadores' | 'verificacao_bi'>('verificacao_bi');
  const [inspectModalImage, setInspectModalImage] = useState<{ title: string; src: string } | null>(null);
  const [rejectModalUser, setRejectModalUser] = useState<User | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('Fotografia do Bilhete de Identidade ilegível. Por favor, tira nova fotografia nítida.');

  // Product Add / Edit Form State
  const [editingProduct, setEditingProduct] = useState<OfficialProduct | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('telemoveis_acessorios');
  const [formBrand, setFormBrand] = useState('');
  const [formPrice, setFormPrice] = useState<number>(8000);
  const [formStock, setFormStock] = useState<number>(50);
  const [formImageUrl, setFormImageUrl] = useState('/src/assets/images/product_smartphone_pro_1792077571413.jpg');
  const [formDescription, setFormDescription] = useState('');
  const [formType, setFormType] = useState<'fisico' | 'digital'>('fisico');
  const [formMessage, setFormMessage] = useState<string | null>(null);

  // Data Queries
  const products = getProducts();
  const resaleListings = getResaleListings();
  const orders = getOrders();
  const users = getUsers();
  const transactions = getTransactions();
  const pendingDeposits = getPendingDeposits();
  const pendingWithdrawals = getPendingWithdrawals();
  const wallets = getWallets();

  // Financial calculations
  const platformTreasury = wallets['usr_admin']?.availableBalance || 0;
  const platformCommissionsEarned = wallets['usr_admin']?.totalEarned || 0;
  const totalUserBalancesInCirculation = Object.entries(wallets)
    .filter(([id]) => id !== 'usr_admin')
    .reduce((sum, [, w]) => sum + w.availableBalance + w.reservedBalance, 0);

  const totalSalesVolume = orders
    .filter(o => o.status !== 'cancelado')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('telemoveis_acessorios');
    setFormBrand('BABA Official');
    setFormPrice(15000);
    setFormStock(50);
    setFormImageUrl('/src/assets/images/product_headphones_gold_1792077588306.jpg');
    setFormDescription('Artigo oficial de alta qualidade com garantia de procedência BABA SHOPPING.');
    setFormType('fisico');
    setShowProductForm(true);
    setFormMessage(null);
  };

  const handleOpenEditProduct = (p: OfficialProduct) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormBrand(p.brand);
    setFormPrice(p.officialPrice);
    setFormStock(p.stock);
    setFormImageUrl(p.imageUrl);
    setFormDescription(p.description);
    setFormType(p.type);
    setShowProductForm(true);
    setFormMessage(null);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (formPrice <= 0 || formStock < 0) {
      setFormMessage('Preço ou stock inválidos.');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formName,
        category: formCategory,
        brand: formBrand,
        officialPrice: formPrice,
        stock: formStock,
        imageUrl: formImageUrl,
        description: formDescription,
        type: formType,
        status: formStock > 0 ? 'disponivel' : 'esgotado'
      });
      setFormMessage('Produto oficial atualizado com sucesso!');
    } else {
      addProduct({
        name: formName,
        category: formCategory,
        brand: formBrand,
        officialPrice: formPrice,
        stock: formStock,
        imageUrl: formImageUrl,
        description: formDescription,
        type: formType,
        status: formStock > 0 ? 'disponivel' : 'esgotado',
        resaleEligible: true
      });
      setFormMessage('Novo produto adicionado ao catálogo oficial!');
    }

    setTimeout(() => {
      setShowProductForm(false);
      setFormMessage(null);
    }, 1500);
  };

  const handleApproveDeposit = (depositId: string) => {
    try {
      approveDeposit(depositId);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleProcessWithdrawal = (withdrawalId: string, action: 'aprovar' | 'recusar') => {
    try {
      processWithdrawal(withdrawalId, action);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    try {
      updateOrderStatus(orderId, status);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Admin Header */}
      <div className="p-6 rounded-2xl bg-neutral-900 text-white border border-neutral-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Área Administrativa Autorizada</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Painel de Gestão BABA SHOPPING
          </h1>
          <p className="text-xs text-neutral-400">
            Controlo de preços oficiais, stock, liquidações em Kz, moderação e entregas em Angola.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-400">Sessão:</span>
          <span className="font-bold text-amber-400 bg-neutral-800 px-3 py-1 rounded-lg border border-neutral-700">
            {currentUser.name} (Super Admin)
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-neutral-200">
        <button
          onClick={() => setActiveSection('verificacao_bi')}
          className={`py-2 px-3.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap relative ${
            activeSection === 'verificacao_bi'
              ? 'bg-amber-400 text-neutral-950 shadow-xs font-black'
              : 'text-neutral-700 bg-amber-50/80 border border-amber-200 hover:bg-amber-100'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-700" />
          <span>Aprovação de Contas & BI</span>
          {users.filter(u => u.accountStatus === 'em_processamento').length > 0 && (
            <span className="w-5 h-5 rounded-full bg-neutral-900 text-amber-400 text-[10px] font-black flex items-center justify-center">
              {users.filter(u => u.accountStatus === 'em_processamento').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSection('stats')}
          className={`py-2 px-3.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeSection === 'stats'
              ? 'bg-neutral-900 text-amber-400 shadow-2xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Estatísticas & Receitas</span>
        </button>

        <button
          onClick={() => setActiveSection('produtos')}
          className={`py-2 px-3.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeSection === 'produtos'
              ? 'bg-neutral-900 text-amber-400 shadow-2xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Gestão de Produtos ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('financeiro')}
          className={`py-2 px-3.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap relative ${
            activeSection === 'financeiro'
              ? 'bg-neutral-900 text-amber-400 shadow-2xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Gestão Financeira</span>
          {(pendingDeposits.filter(d => d.status === 'pendente').length > 0 || pendingWithdrawals.filter(w => w.status === 'solicitado').length > 0) && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveSection('encomendas')}
          className={`py-2 px-3.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeSection === 'encomendas'
              ? 'bg-neutral-900 text-amber-400 shadow-2xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Encomendas & Entregas ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('utilizadores')}
          className={`py-2 px-3.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            activeSection === 'utilizadores'
              ? 'bg-neutral-900 text-amber-400 shadow-2xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Utilizadores ({users.length})</span>
        </button>
      </div>

      {/* SECTION 0: VERIFICAÇÃO DE CONTAS & BILHETES DE IDENTIDADE (KYC) */}
      {activeSection === 'verificacao_bi' && (
        <div className="space-y-6">
          {/* Header Summary */}
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
                <h2 className="text-base font-extrabold text-amber-950">
                  Validação Documental de Bilhetes de Identidade (BI)
                </h2>
              </div>
              <p className="text-xs text-amber-900/80 leading-relaxed max-w-2xl">
                Nenhum utilizador pode comprar, anunciar produtos ou movimentar fundos na BABA SHOPPING sem que o seu Bilhete de Identidade (Frente e Verso) seja formalmente aprovado nesta área.
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-amber-800 block">Em Processamento</span>
              <span className="text-2xl font-black text-amber-700 tabular-nums">
                {users.filter(u => u.accountStatus === 'em_processamento').length} conta{users.filter(u => u.accountStatus === 'em_processamento').length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Pending Applications List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Contas a Aguardar Análise do Administrador ({users.filter(u => u.accountStatus === 'em_processamento').length})</span>
            </h3>

            {users.filter(u => u.accountStatus === 'em_processamento').length === 0 ? (
              <div className="p-10 rounded-2xl bg-white border border-neutral-200 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-sm text-neutral-800">Todas as contas estão em dia!</h4>
                <p className="text-xs text-neutral-400">
                  Não existem novos Bilhetes de Identidade pendentes de validação no momento.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {users.filter(u => u.accountStatus === 'em_processamento').map(pendingUser => (
                  <div
                    key={pendingUser.id}
                    className="p-5 sm:p-6 bg-white rounded-3xl border border-amber-300 shadow-md space-y-5 transition-all"
                  >
                    {/* User summary row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-amber-400 font-black text-lg flex items-center justify-center shrink-0">
                          {pendingUser.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-extrabold text-neutral-900">{pendingUser.name}</h4>
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200">
                              Aguardando Decisão
                            </span>
                          </div>
                          <div className="text-xs text-neutral-500 flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                            <span>Email: <strong className="text-neutral-700">{pendingUser.email}</strong></span>
                            <span>·</span>
                            <span>Telemóvel: <strong className="text-neutral-700">{pendingUser.phone}</strong></span>
                            <span>·</span>
                            <span>Localidade: <strong className="text-neutral-700">{pendingUser.city}, {pendingUser.province}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-[10px] uppercase font-bold text-neutral-400 block">Nº de Bilhete Submetido</span>
                        <span className="text-base font-black text-amber-600 font-mono tracking-wider">
                          {pendingUser.idNumber}
                        </span>
                      </div>
                    </div>

                    {/* BI Photos & Inspection Grid */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-neutral-800 block">
                        Fotografias do Documento para Análise Pericial:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Front of BI */}
                        <div className="rounded-2xl border border-neutral-200 p-3 bg-neutral-50 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-neutral-700">1. Frente do BI (Foto e Dados Pessoais)</span>
                            <button
                              type="button"
                              onClick={() => pendingUser.idCardFront && setInspectModalImage({ title: `Frente do BI — ${pendingUser.name}`, src: pendingUser.idCardFront })}
                              className="text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 text-[11px]"
                            >
                              <Eye className="w-3.5 h-3.5" /> Ampliar Imagem
                            </button>
                          </div>
                          <div 
                            onClick={() => pendingUser.idCardFront && setInspectModalImage({ title: `Frente do BI — ${pendingUser.name}`, src: pendingUser.idCardFront })}
                            className="aspect-16/10 rounded-xl bg-white border border-neutral-200 overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                          >
                            {pendingUser.idCardFront ? (
                              <img src={pendingUser.idCardFront} alt="Frente do BI" className="w-full h-full object-contain p-1" />
                            ) : (
                              <span className="text-neutral-400 text-xs">Sem foto</span>
                            )}
                          </div>
                        </div>

                        {/* Back of BI */}
                        <div className="rounded-2xl border border-neutral-200 p-3 bg-neutral-50 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-neutral-700">2. Verso do BI (Filiação, Residência e Código)</span>
                            <button
                              type="button"
                              onClick={() => pendingUser.idCardBack && setInspectModalImage({ title: `Verso do BI — ${pendingUser.name}`, src: pendingUser.idCardBack })}
                              className="text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 text-[11px]"
                            >
                              <Eye className="w-3.5 h-3.5" /> Ampliar Imagem
                            </button>
                          </div>
                          <div 
                            onClick={() => pendingUser.idCardBack && setInspectModalImage({ title: `Verso do BI — ${pendingUser.name}`, src: pendingUser.idCardBack })}
                            className="aspect-16/10 rounded-xl bg-white border border-neutral-200 overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                          >
                            {pendingUser.idCardBack ? (
                              <img src={pendingUser.idCardBack} alt="Verso do BI" className="w-full h-full object-contain p-1" />
                            ) : (
                              <span className="text-neutral-400 text-xs">Sem foto</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Decision Buttons */}
                    <div className="pt-3 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <span className="text-[11px] text-neutral-400">
                        Submetido em: {new Date(pendingUser.createdAt).toLocaleString('pt-AO')}
                      </span>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setRejectModalUser(pendingUser);
                            setRejectReason('Fotografia do Bilhete de Identidade ilegível ou cortada. Por favor, tira nova fotografia com boa iluminação.');
                          }}
                          className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                        >
                          <X className="w-4 h-4" />
                          <span>Rejeitar Documento</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            try {
                              approveUserAccount(pendingUser.id);
                            } catch (err: any) {
                              alert(err.message);
                            }
                          }}
                          className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-sm transition-colors flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          <span>Aprovar Conta & Validar BI</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Verified Users Audit Table */}
          <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-2xs">
            <div className="p-4 sm:p-5 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-800">
                  Contas com Bilhete de Identidade Verificado
                </h4>
                <p className="text-[11px] text-neutral-500">Membros autorizados para compras e revenda em Angola</p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                {users.filter(u => u.accountStatus === 'ativo').length} verificados
              </span>
            </div>

            <div className="divide-y divide-neutral-100 overflow-x-auto text-xs">
              {users.filter(u => u.accountStatus === 'ativo').map(u => (
                <div key={u.id} className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-neutral-900 text-amber-400 font-bold flex items-center justify-center text-xs">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-neutral-900">{u.name}</strong>
                        {u.role === 'admin' ? (
                          <span className="text-[9px] bg-amber-400 text-neutral-950 font-black px-1.5 py-0.5 rounded">
                            ADMIN
                          </span>
                        ) : (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" /> BI VÁLIDO
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5 font-mono">
                        BI: {u.idNumber} · {u.province} ({u.city})
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 block">Contacto</span>
                    <span className="text-neutral-700 font-medium">{u.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: ESTATÍSTICAS & RECONCILIAÇÃO */}
      {activeSection === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
              <span className="text-xs text-neutral-500 block font-medium">Volume Total de Vendas</span>
              <div className="text-2xl font-black text-neutral-900 mt-1 tabular-nums">
                {formatKz(totalSalesVolume)}
              </div>
              <span className="text-[11px] text-neutral-400 block mt-1">Transações comerciais oficiais e revenda</span>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 shadow-2xs">
              <span className="text-xs text-amber-800 block font-bold">Comissões da Plataforma (5%)</span>
              <div className="text-2xl font-black text-amber-700 mt-1 tabular-nums">
                {formatKz(platformCommissionsEarned)}
              </div>
              <span className="text-[11px] text-amber-800/80 block mt-1">Receita efetiva retida pela BABA SHOPPING</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
              <span className="text-xs text-neutral-500 block font-medium">Saldo de Utilizadores em Circulação</span>
              <div className="text-2xl font-black text-neutral-900 mt-1 tabular-nums">
                {formatKz(totalUserBalancesInCirculation)}
              </div>
              <span className="text-[11px] text-neutral-400 block mt-1">Fundos dos clientes mantidos em custódia</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
              <span className="text-xs text-neutral-500 block font-medium">Total de Encomendas</span>
              <div className="text-2xl font-black text-neutral-900 mt-1 tabular-nums">
                {orders.length}
              </div>
              <span className="text-[11px] text-neutral-400 block mt-1">Em processamento ou entregues</span>
            </div>
          </div>

          {/* Business separation notice required by prompt section 18 */}
          <div className="p-4 rounded-xl bg-neutral-900 text-neutral-200 text-xs border border-neutral-800 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-white text-sm">
                Princípio de Transparência e Segregação Contabilística:
              </span>
              <p className="text-neutral-300 leading-relaxed">
                A BABA SHOPPING distingue categoricamente o <strong>volume bruto transacionado</strong> e o <strong>saldo pertencente aos utilizadores</strong> da <strong>receita efetiva da empresa</strong> (comissões de 5% sobre revendas e margens de artigos oficiais). O dinheiro dos clientes permanece segregado e auditável a qualquer momento.
              </p>
            </div>
          </div>

          {/* Quick Resale Listings Moderation Table */}
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
            <div className="p-4 sm:p-5 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <h3 className="font-bold text-sm text-neutral-900">Anúncios no Mercado de Revenda para Moderação</h3>
              <span className="text-xs text-neutral-500">{resaleListings.length} anúncios registados</span>
            </div>
            <div className="divide-y divide-neutral-100 overflow-x-auto text-xs">
              {resaleListings.map(listing => (
                <div key={listing.id} className="p-3 sm:px-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={listing.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover bg-neutral-100 shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-neutral-900 truncate">{listing.productName}</h4>
                      <span className="text-[11px] text-neutral-500">
                        Vendedor: {listing.sellerName} · Preço: {formatKz(listing.listingPrice)} (Original: {formatKz(listing.originalPrice)})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      listing.status === 'ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-800'
                    }`}>
                      {listing.status === 'ativo' ? 'Ativo' : listing.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: GESTÃO DE PRODUTOS OFICIAIS */}
      {activeSection === 'produtos' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Catálogo do Mercado Oficial</h2>
              <p className="text-xs text-neutral-500">
                O administrador define os preços oficiais fixos e o stock disponível para venda inicial.
              </p>
            </div>
            <button
              onClick={handleOpenAddProduct}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-amber-400 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Novo Produto</span>
            </button>
          </div>

          {/* Form Modal */}
          {showProductForm && (
            <div className="p-6 bg-white rounded-2xl border border-amber-300 shadow-md space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="font-bold text-base text-neutral-900">
                  {editingProduct ? 'Editar Produto Oficial' : 'Novo Produto Oficial'}
                </h3>
                <button
                  onClick={() => setShowProductForm(false)}
                  className="text-neutral-400 hover:text-neutral-700 font-bold text-xs"
                >
                  Fechar ✕
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Nome do Produto:</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    required
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-medium"
                    placeholder="Ex: Auscultadores Bluetooth Aurora"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Marca:</label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    required
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900"
                    placeholder="Ex: Aurora Audio"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Categoria:</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ProductCategory)}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Tipo de Artigo:</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900"
                  >
                    <option value="fisico">Físico (Entrega ao domicílio em Angola)</option>
                    <option value="digital">Digital (Download / Licença imediata)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Preço Oficial de Venda (Kz):</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    step="500"
                    min="500"
                    required
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-bold tabular-nums"
                  />
                  <span className="text-[10px] text-neutral-400 mt-0.5 block">
                    Todos os clientes pagarão exatamente este valor no Mercado Oficial.
                  </span>
                </div>

                <div>
                  <label className="font-bold text-neutral-700 block mb-1">Stock Disponível:</label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    min="0"
                    required
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-bold tabular-nums"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-bold text-neutral-700 block mb-1">URL da Imagem do Produto:</label>
                  <input
                    type="text"
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    required
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-bold text-neutral-700 block mb-1">Descrição Comercial:</label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={3}
                    required
                    className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900"
                    placeholder="Especificações, detalhes técnicos e garantia..."
                  />
                </div>

                {formMessage && (
                  <div className="md:col-span-2 p-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200">
                    {formMessage}
                  </div>
                )}

                <div className="md:col-span-2 flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowProductForm(false)}
                    className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-neutral-900 text-amber-400 hover:bg-neutral-800 rounded-lg font-bold shadow-xs transition-colors"
                  >
                    {editingProduct ? 'Guardar Alterações' : 'Adicionar ao Catálogo'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Product Listing Table */}
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
            <div className="divide-y divide-neutral-100 overflow-x-auto text-xs">
              {products.map(p => (
                <div key={p.id} className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={p.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover bg-neutral-100 shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-neutral-900 text-sm truncate">{p.name}</h4>
                        <span className="text-[10px] text-neutral-400">· {p.brand}</span>
                      </div>
                      <div className="flex items-center gap-3 text-neutral-500 mt-1">
                        <span>Stock: <strong className="text-neutral-800">{p.stock} un.</strong></span>
                        <span>·</span>
                        <span>Tipo: <strong className="text-neutral-800">{p.type}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-neutral-400 block uppercase font-semibold">Preço Oficial</span>
                      <span className="text-base font-extrabold text-neutral-900 tabular-nums">
                        {formatKz(p.officialPrice)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenEditProduct(p)}
                      className="p-2 border border-neutral-300 rounded-lg hover:border-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors"
                      title="Editar preço e stock"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: GESTÃO FINANCEIRA (CARREGAMENTOS & LEVANTAMENTOS) */}
      {activeSection === 'financeiro' && (
        <div className="space-y-6">
          {/* Pending deposits table */}
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
            <div className="p-4 sm:p-5 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-neutral-900">Pedidos de Carregamento de Carteira</h3>
                <p className="text-xs text-neutral-500">Validação e crédito de fundos dos utilizadores</p>
              </div>
              <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full">
                {pendingDeposits.filter(d => d.status === 'pendente').length} pendente{pendingDeposits.filter(d => d.status === 'pendente').length !== 1 ? 's' : ''}
              </span>
            </div>

            {pendingDeposits.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-400">
                Nenhum carregamento solicitado recentemente.
              </div>
            ) : (
              <div className="divide-y divide-neutral-100 overflow-x-auto text-xs">
                {pendingDeposits.map(dep => (
                  <div key={dep.id} className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900">{dep.userName}</span>
                        <span className="text-neutral-400">·</span>
                        <span className="text-neutral-500">{dep.method === 'multicaixa_express' ? 'Multicaixa Express' : 'Referência Bancária'}</span>
                      </div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">
                        Contacto/Ref: {dep.phoneOrRef} · Solicitado em: {new Date(dep.createdAt).toLocaleString('pt-AO')}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-neutral-900 tabular-nums">
                        {formatKz(dep.amount)}
                      </span>
                      {dep.status === 'pendente' ? (
                        <button
                          onClick={() => handleApproveDeposit(dep.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Aprovar & Creditar</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          ✓ Aprovado
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending withdrawals table */}
          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
            <div className="p-4 sm:p-5 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-neutral-900">Pedidos de Levantamento para IBAN</h3>
                <p className="text-xs text-neutral-500">Transferências bancárias e liquidação de saldo</p>
              </div>
              <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full">
                {pendingWithdrawals.filter(w => w.status === 'solicitado').length} a aguardar
              </span>
            </div>

            {pendingWithdrawals.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-400">
                Nenhum pedido de levantamento pendente.
              </div>
            ) : (
              <div className="divide-y divide-neutral-100 overflow-x-auto text-xs">
                {pendingWithdrawals.map(wth => (
                  <div key={wth.id} className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900">{wth.userName}</span>
                        <span className="text-neutral-400">·</span>
                        <span className="text-neutral-600">{wth.bankName}</span>
                      </div>
                      <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                        IBAN: {wth.iban} (Titular: {wth.accountHolder})
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-neutral-900 tabular-nums">
                        {formatKz(wth.amount)}
                      </span>
                      {wth.status === 'solicitado' ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleProcessWithdrawal(wth.id, 'aprovar')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors"
                          >
                            Confirmar Pagamento
                          </button>
                          <button
                            onClick={() => handleProcessWithdrawal(wth.id, 'recusar')}
                            className="px-2.5 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 font-bold text-xs rounded-lg transition-colors border border-red-200"
                          >
                            Recusar
                          </button>
                        </div>
                      ) : (
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md ${
                          wth.status === 'pago' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                        }`}>
                          {wth.status === 'pago' ? '✓ Pago' : 'Recusado'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 4: GESTÃO DE ENCOMENDAS */}
      {activeSection === 'encomendas' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
          <div className="p-4 sm:p-5 border-b border-neutral-200 bg-neutral-50">
            <h3 className="font-bold text-sm text-neutral-900">Gestão e Atualização de Encomendas</h3>
            <p className="text-xs text-neutral-500">Muda os estados de preparação, envio e entrega aos clientes</p>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-400">
              Nenhuma encomenda registada na plataforma.
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 overflow-x-auto text-xs">
              {orders.map(o => (
                <div key={o.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-neutral-900">{o.id}</span>
                      <span className="text-neutral-400">·</span>
                      <span className="text-neutral-700 font-semibold">Comprador: {o.buyerName}</span>
                    </div>
                    <p className="text-neutral-500 text-[11px]">
                      {o.items.map(i => `${i.quantity}x ${i.name}`).join(', ')} · Total: {formatKz(o.totalAmount)}
                    </p>
                    <p className="text-neutral-400 text-[10px]">
                      {o.deliveryAddress?.street 
                        ? `Destino: ${o.deliveryAddress.street}, ${o.deliveryAddress.province} (${o.deliveryAddress.recipientPhone})`
                        : 'Transferência Digital: Titularidade creditada em Meus Produtos'
                      }
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={o.status}
                      onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value as any)}
                      className="p-1.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-900 focus:outline-none"
                    >
                      <option value="pagamento_confirmado">Pagamento Confirmado</option>
                      <option value="em_preparacao">Em Preparação</option>
                      <option value="enviado">Enviado</option>
                      <option value="em_entrega">Em Entrega</option>
                      <option value="entregue">Entregue</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SECTION 5: UTILIZADORES */}
      {activeSection === 'utilizadores' && (
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
          <div className="p-4 sm:p-5 border-b border-neutral-200 bg-neutral-50">
            <h3 className="font-bold text-sm text-neutral-900">Utilizadores Registados na BABA SHOPPING</h3>
            <p className="text-xs text-neutral-500">Contas de clientes e administradores em Angola</p>
          </div>
          <div className="divide-y divide-neutral-100 overflow-x-auto text-xs">
            {users.map(u => {
              const uWallet = wallets[u.id];
              return (
                <div key={u.id} className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900 text-sm">{u.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        u.role === 'admin' ? 'bg-amber-100 text-amber-900' : 'bg-neutral-100 text-neutral-700'
                      }`}>
                        {u.role === 'admin' ? 'Administrador' : 'Cliente'}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      {u.email} · {u.phone} · {u.city}, {u.province}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 block uppercase font-semibold">Saldo Atual</span>
                    <span className="font-extrabold text-neutral-900 tabular-nums">
                      {formatKz(uWallet?.availableBalance || 0)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* BI Image Inspection Modal */}
      {inspectModalImage && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-3xl w-full p-5 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>{inspectModalImage.title}</span>
              </h4>
              <button
                onClick={() => setInspectModalImage(null)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg bg-neutral-800 hover:bg-neutral-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[75vh] flex items-center justify-center bg-black/60 rounded-2xl p-4 overflow-auto border border-neutral-800">
              <img src={inspectModalImage.src} alt="" className="max-w-full max-h-[70vh] object-contain rounded-xl" />
            </div>
            <div className="pt-3 flex justify-end">
              <button
                onClick={() => setInspectModalImage(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs rounded-xl"
              >
                Concluir Inspeção
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal with custom reason */}
      {rejectModalUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>Rejeitar Bilhete de Identidade</span>
              </h4>
              <button
                onClick={() => setRejectModalUser(null)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-neutral-600">
              Indica o motivo pelo qual o documento de <strong>{rejectModalUser.name}</strong> (BI: {rejectModalUser.idNumber}) foi recusado:
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              required
              className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              placeholder="Ex: Fotografia do verso ilegível, nome no formulário divergente do bilhete..."
            />

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalUser(null)}
                className="flex-1 py-2.5 border border-neutral-300 text-neutral-700 font-semibold text-xs rounded-xl hover:bg-neutral-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  try {
                    rejectUserAccount(rejectModalUser.id, rejectReason);
                    setRejectModalUser(null);
                  } catch (err: any) {
                    alert(err.message);
                  }
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Confirmar Rejeição
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
