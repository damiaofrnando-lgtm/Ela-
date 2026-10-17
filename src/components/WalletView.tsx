import React, { useState } from 'react';
import { 
  Wallet, 
  Transaction, 
  User 
} from '../types';
import { 
  formatKz, 
  requestWalletDeposit, 
  requestWithdrawal, 
  getTransactions 
} from '../services/storage';
import { 
  Wallet as WalletIcon, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Clock, 
  Lock, 
  CreditCard, 
  Building2, 
  ShieldCheck, 
  PlusCircle, 
  History, 
  ShoppingBag, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  DollarSign
} from 'lucide-react';

interface WalletViewProps {
  wallet: Wallet;
  currentUser: User;
  onNavigateToMarket: () => void;
}

export const WalletView: React.FC<WalletViewProps> = ({
  wallet,
  currentUser,
  onNavigateToMarket
}) => {
  const [activeModal, setActiveModal] = useState<'deposit' | 'withdraw' | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  // Deposit Form
  const [depositAmount, setDepositAmount] = useState<number>(50000);
  const [depositMethod, setDepositMethod] = useState<'multicaixa_express' | 'referencia'>('multicaixa_express');
  const [mcxPhone, setMcxPhone] = useState<string>(currentUser.phone || '+244 923 000 000');
  const [instantValidation, setInstantValidation] = useState<boolean>(true); // Demo mode helper
  const [depositSuccessMsg, setDepositSuccessMsg] = useState<string | null>(null);
  const [depositError, setDepositError] = useState<string | null>(null);

  // Withdrawal Form
  const [withdrawAmount, setWithdrawAmount] = useState<number>(20000);
  const [withdrawBank, setWithdrawBank] = useState<string>('Banco Angolano de Investimentos (BAI)');
  const [withdrawIban, setWithdrawIban] = useState<string>('AO06.0040.0000.1234.5678.9012.3');
  const [withdrawHolder, setWithdrawHolder] = useState<string>(currentUser.name);
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState<string | null>(null);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);

  const transactions = getTransactions(currentUser.id);

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'all') return true;
    if (filterType === 'carregamento') return t.type === 'carregamento';
    if (filterType === 'compra') return t.type === 'compra_oficial' || t.type === 'compra_revenda';
    if (filterType === 'venda') return t.type === 'venda_recebida';
    if (filterType === 'levantamento') return t.type === 'levantamento';
    return true;
  });

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDepositError(null);
    setDepositSuccessMsg(null);

    if (depositAmount <= 0) {
      setDepositError('O montante deve ser superior a 0 Kz.');
      return;
    }

    try {
      requestWalletDeposit(
        currentUser.id,
        depositAmount,
        depositMethod,
        mcxPhone,
        instantValidation // In demo, immediate validation available for quick testing
      );

      if (instantValidation) {
        setDepositSuccessMsg(`Carregamento de ${formatKz(depositAmount)} validado e creditado com sucesso!`);
      } else {
        setDepositSuccessMsg(`Pedido de carregamento de ${formatKz(depositAmount)} registado! Encontra-se pendente de confirmação bancária/admin.`);
      }

      setTimeout(() => {
        setActiveModal(null);
        setDepositSuccessMsg(null);
      }, 2000);
    } catch (err: any) {
      setDepositError(err.message || 'Erro ao processar carregamento');
    }
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError(null);
    setWithdrawSuccessMsg(null);

    if (withdrawAmount <= 0) {
      setWithdrawError('O montante deve ser superior a 0 Kz.');
      return;
    }

    if (withdrawAmount > wallet.availableBalance) {
      setWithdrawError(`Saldo insuficiente. O teu saldo disponível é de ${formatKz(wallet.availableBalance)}.`);
      return;
    }

    try {
      requestWithdrawal(
        currentUser.id,
        withdrawAmount,
        withdrawBank,
        withdrawIban,
        withdrawHolder
      );

      setWithdrawSuccessMsg(`Pedido de levantamento de ${formatKz(withdrawAmount)} submetido com sucesso! O valor foi reservado até à liquidação.`);
      setTimeout(() => {
        setActiveModal(null);
        setWithdrawSuccessMsg(null);
      }, 2500);
    } catch (err: any) {
      setWithdrawError(err.message || 'Erro ao solicitar levantamento');
    }
  };

  const getTxTypeLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'carregamento': return 'Carregamento Multicaixa';
      case 'compra_oficial': return 'Compra no Mercado Oficial';
      case 'compra_revenda': return 'Compra no Mercado de Revenda';
      case 'venda_recebida': return 'Crédito de Venda Concluída';
      case 'levantamento': return 'Levantamento para IBAN';
      case 'taxa_plataforma': return 'Comissão da Plataforma';
      default: return type;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <WalletIcon className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Minha Carteira Digital</h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Gestão financeira transparente em Kwanzas (Kz) com transações atómicas seguras.
          </p>
        </div>

        {/* Action Buttons Header */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveModal('deposit')}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-amber-400 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Carregar Carteira</span>
          </button>
          <button
            onClick={() => setActiveModal('withdraw')}
            className="px-4 py-2 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Levantar Dinheiro</span>
          </button>
        </div>
      </div>

      {/* Main Balances Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Available Balance - Primary Card */}
        <div className="p-6 rounded-2xl bg-neutral-900 text-white border border-neutral-800 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-400">
                Saldo Disponível
              </span>
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white tabular-nums tracking-tight">
              {formatKz(wallet.availableBalance)}
            </div>
            <p className="text-xs text-neutral-400">
              Pronto a utilizar para compras imediatas na BABA SHOPPING ou levantamentos bancários.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-neutral-800 flex items-center gap-3">
            <button
              onClick={() => setActiveModal('deposit')}
              className="flex-1 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold rounded-lg transition-colors text-center"
            >
              + Carregar
            </button>
            <button
              onClick={onNavigateToMarket}
              className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg transition-colors text-center"
            >
              Comprar Produtos
            </button>
          </div>
        </div>

        {/* In-processing Balance */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-neutral-500">
                Valores em Processamento
              </span>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-neutral-800 tabular-nums">
              {formatKz(wallet.pendingBalance)}
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Pagamentos de vendas ou carregamentos a aguardar confirmação pelo prestador ou entrega.
            </p>
          </div>
          <div className="text-[11px] text-neutral-400 bg-neutral-50 p-2.5 rounded-lg border border-neutral-100">
            Crédito automático após cumprimento das condições de liquidação.
          </div>
        </div>

        {/* Reserved Balance */}
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-neutral-500">
                Valores Reservados
              </span>
              <Lock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-neutral-800 tabular-nums">
              {formatKz(wallet.reservedBalance)}
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Montantes cativos para levantamentos em curso ou propostas de compra aceites.
            </p>
          </div>
          <div className="text-[11px] text-neutral-400 bg-neutral-50 p-2.5 rounded-lg border border-neutral-100">
            Impede o gasto duplicado do mesmo saldo em simultâneo.
          </div>
        </div>
      </div>

      {/* Financial Metrics Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-neutral-200 text-xs">
          <span className="text-neutral-500 block">Total de Carregamentos</span>
          <span className="text-base font-bold text-neutral-900 tabular-nums">
            +{formatKz(wallet.totalDeposited)}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-neutral-200 text-xs">
          <span className="text-neutral-500 block">Total Gasto em Compras</span>
          <span className="text-base font-bold text-neutral-900 tabular-nums">
            -{formatKz(wallet.totalSpent)}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-neutral-200 text-xs">
          <span className="text-neutral-500 block">Total Recebido em Vendas</span>
          <span className="text-base font-bold text-emerald-600 tabular-nums">
            +{formatKz(wallet.totalEarned)}
          </span>
        </div>
        <div className="p-4 rounded-xl bg-white border border-neutral-200 text-xs">
          <span className="text-neutral-500 block">Total de Levantamentos</span>
          <span className="text-base font-bold text-neutral-900 tabular-nums">
            {formatKz(wallet.totalWithdrawn)}
          </span>
        </div>
      </div>

      {/* Transaction Statement History */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-6 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-50/50">
          <div>
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-neutral-700" />
              <h2 className="text-base font-bold text-neutral-900">Extrato Completo de Transações</h2>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Registo financeiro auditável com carimbos de data, referências e idempotência.
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterType === 'all' ? 'bg-neutral-900 text-amber-400' : 'bg-white border border-neutral-200 text-neutral-600'
              }`}
            >
              Todas ({transactions.length})
            </button>
            <button
              onClick={() => setFilterType('carregamento')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterType === 'carregamento' ? 'bg-neutral-900 text-amber-400' : 'bg-white border border-neutral-200 text-neutral-600'
              }`}
            >
              Carregamentos
            </button>
            <button
              onClick={() => setFilterType('compra')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterType === 'compra' ? 'bg-neutral-900 text-amber-400' : 'bg-white border border-neutral-200 text-neutral-600'
              }`}
            >
              Compras
            </button>
            <button
              onClick={() => setFilterType('venda')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterType === 'venda' ? 'bg-neutral-900 text-amber-400' : 'bg-white border border-neutral-200 text-neutral-600'
              }`}
            >
              Vendas
            </button>
            <button
              onClick={() => setFilterType('levantamento')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterType === 'levantamento' ? 'bg-neutral-900 text-amber-400' : 'bg-white border border-neutral-200 text-neutral-600'
              }`}
            >
              Levantamentos
            </button>
          </div>
        </div>

        {/* Transaction Table / List */}
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 space-y-2">
            <FileText className="w-10 h-10 mx-auto text-neutral-300 stroke-1" />
            <p className="text-sm font-semibold text-neutral-600">Nenhuma transação registada neste filtro</p>
            <p className="text-xs text-neutral-400">
              As operações financeiras realizadas nesta conta surgirão aqui com recibo e referência.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 overflow-x-auto">
            {filteredTransactions.map((tx) => {
              const isPositive = tx.type === 'carregamento' || tx.type === 'venda_recebida';
              return (
                <div key={tx.id} className="p-4 sm:px-6 hover:bg-neutral-50/70 transition-colors flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`p-2.5 rounded-xl border mt-0.5 shrink-0 ${
                      isPositive
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                    }`}>
                      {isPositive ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900 text-sm">
                          {getTxTypeLabel(tx.type)}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          Ref: {tx.reference}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 mt-0.5 truncate max-w-md">
                        {tx.description}
                      </p>
                      <span className="text-[11px] text-neutral-400 mt-0.5 block">
                        {new Date(tx.createdAt).toLocaleString('pt-AO')}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className={`text-base font-extrabold tabular-nums ${
                      isPositive ? 'text-emerald-600' : 'text-neutral-900'
                    }`}>
                      {isPositive ? '+' : '-'}{formatKz(tx.amount)}
                    </div>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${
                      tx.status === 'confirmada'
                        ? 'bg-emerald-100 text-emerald-800'
                        : tx.status === 'pendente'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {tx.status === 'confirmada' ? 'Confirmada' : tx.status === 'pendente' ? 'Em Processamento' : 'Rejeitada'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Carregar Carteira */}
      {activeModal === 'deposit' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200">
            <div className="p-4 bg-neutral-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm">Carregamento da Carteira (Kz)</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  Valor a carregar (Kz):
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  step="5000"
                  min="1000"
                  required
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-base font-bold text-neutral-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <div className="flex gap-2 mt-2">
                  {[10000, 25000, 50000, 100000].map(v => (
                    <button
                      type="button"
                      key={v}
                      onClick={() => setDepositAmount(v)}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-800"
                    >
                      +{formatKz(v)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  Método de Pagamento em Angola:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setDepositMethod('multicaixa_express')}
                    className={`p-2.5 rounded-xl border font-bold text-left transition-all ${
                      depositMethod === 'multicaixa_express'
                        ? 'border-amber-500 bg-amber-50/70 text-neutral-900'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-600'
                    }`}
                  >
                    <span>Multicaixa Express</span>
                    <span className="block text-[10px] font-normal text-neutral-400">Via Telemóvel</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepositMethod('referencia')}
                    className={`p-2.5 rounded-xl border font-bold text-left transition-all ${
                      depositMethod === 'referencia'
                        ? 'border-amber-500 bg-amber-50/70 text-neutral-900'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-600'
                    }`}
                  >
                    <span>Pagamento por Ref.</span>
                    <span className="block text-[10px] font-normal text-neutral-400">ATM / Internet Banking</span>
                  </button>
                </div>
              </div>

              {depositMethod === 'multicaixa_express' ? (
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">
                    Número de Telemóvel Multicaixa Express (+244):
                  </label>
                  <input
                    type="text"
                    value={mcxPhone}
                    onChange={(e) => setMcxPhone(e.target.value)}
                    placeholder="+244 9xx xxx xxx"
                    required
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-[10px] text-neutral-400 block mt-1">
                    Receberás a solicitação de autorização no teu aplicativo Multicaixa Express.
                  </span>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Entidade:</span>
                    <strong className="text-neutral-900">00142 (BABA SHOPPING AO)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Referência:</span>
                    <strong className="text-neutral-900 font-mono">992 481 054</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Montante:</span>
                    <strong className="text-neutral-900 tabular-nums">{formatKz(depositAmount)}</strong>
                  </div>
                </div>
              )}

              {/* Instant verification toggle for testing/demo */}
              <div className="p-2.5 rounded-xl bg-neutral-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-neutral-800 block">Validação Imediata</span>
                  <span className="text-[10px] text-neutral-500">Creditar saldo diretamente para teste</span>
                </div>
                <input
                  type="checkbox"
                  checked={instantValidation}
                  onChange={(e) => setInstantValidation(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
                />
              </div>

              {depositError && (
                <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                  {depositError}
                </div>
              )}

              {depositSuccessMsg && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{depositSuccessMsg}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2.5 border border-neutral-300 text-neutral-700 font-semibold text-xs rounded-xl hover:bg-neutral-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-neutral-900 text-amber-400 hover:bg-neutral-800 font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Confirmar Carregamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Levantar Dinheiro */}
      {activeModal === 'withdraw' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-neutral-200">
            <div className="p-4 bg-neutral-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm">Levantamento Bancário (Angola)</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="p-5 space-y-4">
              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Saldo disponível para levantamento:</span>
                  <strong className="text-neutral-900 tabular-nums">{formatKz(wallet.availableBalance)}</strong>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  Montante a levantar (Kz):
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  step="5000"
                  min="1000"
                  max={wallet.availableBalance}
                  required
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-base font-bold text-neutral-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  Banco de Destino em Angola:
                </label>
                <select
                  value={withdrawBank}
                  onChange={(e) => setWithdrawBank(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Banco Angolano de Investimentos (BAI)">Banco Angolano de Investimentos (BAI)</option>
                  <option value="Banco de Fomento Angola (BFA)">Banco de Fomento Angola (BFA)</option>
                  <option value="Banco BIC Angola">Banco BIC Angola</option>
                  <option value="Banco Millennium Atlântico (BMA)">Banco Millennium Atlântico (BMA)</option>
                  <option value="Banco Sol">Banco Sol</option>
                  <option value="Standard Bank Angola">Standard Bank Angola</option>
                  <option value="Banco Caixa Geral Angola (BCGA)">Banco Caixa Geral Angola (BCGA)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  IBAN Angolano (AO06...):
                </label>
                <input
                  type="text"
                  value={withdrawIban}
                  onChange={(e) => setWithdrawIban(e.target.value)}
                  placeholder="AO06.xxxx.xxxx.xxxx.xxxx.xxxx.x"
                  required
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-800 block mb-1">
                  Nome do Titular da Conta:
                </label>
                <input
                  type="text"
                  value={withdrawHolder}
                  onChange={(e) => setWithdrawHolder(e.target.value)}
                  required
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-500 leading-relaxed">
                ℹ️ <strong>Segurança e Idempotência:</strong> O montante solicitado será transferido do teu saldo disponível para o <em>saldo reservado</em> para evitar gastos duplicados enquanto a transferência bancária é processada.
              </div>

              {withdrawError && (
                <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                  {withdrawError}
                </div>
              )}

              {withdrawSuccessMsg && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{withdrawSuccessMsg}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2.5 border border-neutral-300 text-neutral-700 font-semibold text-xs rounded-xl hover:bg-neutral-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-neutral-900 text-amber-400 hover:bg-neutral-800 font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Solicitar Levantamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
