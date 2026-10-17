import React, { useState } from 'react';
import { User } from '../types';
import { 
  Clock, 
  ShieldCheck, 
  FileText, 
  AlertCircle, 
  UserCheck, 
  LogOut, 
  CheckCircle2, 
  Eye,
  X,
  Upload,
  ArrowRight,
  Sparkles,
  KeyRound,
  RefreshCw
} from 'lucide-react';
import { BabaLogo } from './BabaLogo';
import { resubmitIdDocuments } from '../services/storage';

interface AccountPendingProcessingProps {
  user: User;
  onSwitchUser: () => void;
  onAdminDirectLogin?: () => void;
  onRefreshStatus: () => void;
}

export const AccountPendingProcessing: React.FC<AccountPendingProcessingProps> = ({
  user,
  onSwitchUser,
  onAdminDirectLogin,
  onRefreshStatus
}) => {
  const [inspectImage, setInspectImage] = useState<{ title: string; src: string } | null>(null);
  const [isResubmitting, setIsResubmitting] = useState(false);
  const [resubmitFront, setResubmitFront] = useState(user.idCardFront || '');
  const [resubmitBack, setResubmitBack] = useState(user.idCardBack || '');
  const [resubmitIdNumber, setResubmitIdNumber] = useState(user.idNumber || '');
  const [resubmitMsg, setResubmitMsg] = useState<string | null>(null);

  const isRejected = user.accountStatus === 'rejeitado';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          if (side === 'front') setResubmitFront(reader.result);
          else setResubmitBack(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoadSample = () => {
    const sampleFront = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" rx="16" fill="%23f7f9fa" stroke="%23cbd5e1" stroke-width="2"/><rect x="20" y="20" width="360" height="40" rx="8" fill="%231e293b"/><text x="200" y="38" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23f59e0b" text-anchor="middle">REPÚBLICA DE ANGOLA</text><text x="200" y="52" font-family="sans-serif" font-size="9" fill="%23ffffff" text-anchor="middle">BILHETE DE IDENTIDADE DE CIDADÃO NACIONAL</text><rect x="30" y="80" width="85" height="110" rx="8" fill="%23e2e8f0" stroke="%2394a3b8"/><text x="72" y="140" font-family="sans-serif" font-size="10" fill="%2364748b" text-anchor="middle">FOTO TITULAR</text><text x="135" y="95" font-family="sans-serif" font-size="9" fill="%2364748b">NOME COMPLETO:</text><text x="135" y="112" font-family="sans-serif" font-size="12" font-weight="bold" fill="%230f172a">${user.name.toUpperCase()}</text><text x="135" y="135" font-family="sans-serif" font-size="9" fill="%2364748b">Nº DO BILHETE (BI):</text><text x="135" y="152" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23b45309">${resubmitIdNumber || user.idNumber}</text><text x="135" y="175" font-family="sans-serif" font-size="9" fill="%2364748b">DATA NASC / NATURALIDADE:</text><text x="135" y="190" font-family="sans-serif" font-size="10" font-weight="semibold" fill="%23334155">${user.birthDate || '1998-05-15'} · ${user.province.toUpperCase()}</text><rect x="20" y="210" width="360" height="25" rx="4" fill="%23e2e8f0"/><text x="200" y="226" font-family="monospace" font-size="10" fill="%23475569" text-anchor="middle">IDAGO${resubmitIdNumber || user.idNumber}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</text></svg>`;

    const sampleBack = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" rx="16" fill="%23f1f5f9" stroke="%23cbd5e1" stroke-width="2"/><text x="30" y="45" font-family="sans-serif" font-size="10" font-weight="bold" fill="%23475569">FILIAÇÃO E RESIDÊNCIA (VERSO DO BI):</text><text x="30" y="70" font-family="sans-serif" font-size="9" fill="%2364748b">PAI: MANUEL ANTÓNIO</text><text x="30" y="90" font-family="sans-serif" font-size="9" fill="%2364748b">MÃE: MARIA SEBASTIÃO</text><text x="30" y="110" font-family="sans-serif" font-size="9" fill="%2364748b">RESIDÊNCIA: ${user.city.toUpperCase()}, ${user.province.toUpperCase()}</text><text x="30" y="130" font-family="sans-serif" font-size="9" fill="%2364748b">EMISSÃO / VALIDADE: 2024 A 2034</text><rect x="30" y="155" width="340" height="65" fill="%23334155" rx="6"/><text x="200" y="190" font-family="monospace" font-size="11" fill="%2338bdf8" text-anchor="middle">||| | ||||| |||| || |||||| |||||||||| ||||||</text><text x="200" y="206" font-family="sans-serif" font-size="8" fill="%2394a3b8" text-anchor="middle">CÓDIGO DE BARRAS DE SEGURANÇA NACIONAL</text></svg>`;

    setResubmitFront(sampleFront);
    setResubmitBack(sampleBack);
  };

  const handleSaveResubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resubmitFront || !resubmitBack) {
      setResubmitMsg('Carrega ambas as fotografias (frente e verso) do Bilhete de Identidade.');
      return;
    }
    try {
      resubmitIdDocuments(user.id, resubmitFront, resubmitBack, resubmitIdNumber);
      setIsResubmitting(false);
      setResubmitMsg(null);
      onRefreshStatus();
    } catch (err: any) {
      setResubmitMsg(err.message || 'Erro ao reenviar documentos.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0D12] text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-neutral-800">
        <BabaLogo size="md" />
        <div className="flex items-center gap-2">
          {onAdminDirectLogin && (
            <button
              onClick={onAdminDirectLogin}
              className="text-xs font-black text-neutral-950 bg-amber-400 hover:bg-amber-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Aceder como Administrador</span>
            </button>
          )}
          <button
            onClick={onSwitchUser}
            className="text-xs font-bold text-neutral-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Alternar Conta</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto w-full my-8 bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 backdrop-blur-md">
        {/* Status Header */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-inner">
            {isRejected ? (
              <AlertCircle className="w-10 h-10 text-red-400" />
            ) : (
              <Clock className="w-10 h-10 animate-pulse text-amber-400" />
            )}
          </div>

          <div className="space-y-1">
            <span className={`text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block ${
              isRejected ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-400/20 text-amber-400 border border-amber-400/30'
            }`}>
              {isRejected ? 'Registo Não Aprovado' : 'Criação de Conta em Processamento'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
              {isRejected ? 'Validação de Documento Recusada' : 'Aguardando Verificação do Bilhete de Identidade'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto leading-relaxed">
              {isRejected
                ? user.rejectionReason || 'Os dados ou fotos do Bilhete de Identidade apresentados não puderam ser validados pelo Administrador. Podes reenviar novas fotografias abaixo.'
                : 'A tua conta não abre imediatamente. Conforme as regras da BABA SHOPPING em Angola, todos os dados e as fotos do Bilhete de Identidade (Frente e Verso) são enviados para o painel do Administrador para conferência antes da ativação definitiva.'}
            </p>
          </div>
        </div>

        {/* Verification Stepper */}
        {!isRejected && (
          <div className="bg-neutral-950/70 p-4 rounded-2xl border border-neutral-800 space-y-3">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
              Fluxo Obrigatório de Validação de Identidade (Angola)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">1. Registo & Upload do BI</span>
                  <span className="text-[10px] text-neutral-400">Dados e fotos submetidos</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-spin" />
                <div>
                  <span className="font-bold text-amber-300 block">2. Em Análise no Painel Adm</span>
                  <span className="text-[10px] text-amber-300/80">Conferência frente & verso</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 opacity-60">
                <ShieldCheck className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-300 block">3. Ativação da Conta</span>
                  <span className="text-[10px] text-neutral-500">Carteira & Revenda ativadas</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submitted User Dossier */}
        <div className="bg-neutral-950/80 rounded-2xl border border-neutral-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Dossier de Identificação Submetido</span>
            </h3>
            <span className="text-[11px] text-neutral-500 font-mono">
              Registo #{user.id.replace('usr_', '')}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-neutral-500 text-[11px] block">Nome Completo:</span>
              <strong className="text-white text-sm">{user.name}</strong>
            </div>

            <div>
              <span className="text-neutral-500 text-[11px] block">Nº do Bilhete de Identidade (BI):</span>
              <strong className="text-amber-400 text-sm font-mono tracking-wide">{user.idNumber}</strong>
            </div>

            <div>
              <span className="text-neutral-500 text-[11px] block">Contacto & Email:</span>
              <span className="text-neutral-300">{user.phone} · {user.email}</span>
            </div>

            <div>
              <span className="text-neutral-500 text-[11px] block">Residência em Angola:</span>
              <span className="text-neutral-300">{user.city}, {user.province}</span>
            </div>
          </div>

          {/* Attached Document Photos */}
          <div className="pt-3 border-t border-neutral-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-neutral-400">
                Fotografias do Bilhete de Identidade Submetidas:
              </span>
              {isRejected && !isResubmitting && (
                <button
                  type="button"
                  onClick={() => setIsResubmitting(true)}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reenviar Novas Fotos
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Front */}
              <div 
                onClick={() => user.idCardFront && setInspectImage({ title: 'Frente do Bilhete de Identidade (BI)', src: user.idCardFront })}
                className="group relative rounded-xl overflow-hidden border border-neutral-700 bg-neutral-900 p-2 cursor-pointer hover:border-amber-400 transition-colors"
              >
                <div className="text-[10px] text-neutral-400 mb-1 flex items-center justify-between">
                  <span>1. Frente do BI (Foto Titular)</span>
                  <span className="text-amber-400 flex items-center gap-1 group-hover:underline">
                    <Eye className="w-3 h-3" /> Ampliar
                  </span>
                </div>
                <div className="aspect-16/10 rounded-lg overflow-hidden bg-neutral-950 flex items-center justify-center">
                  {user.idCardFront ? (
                    <img src={user.idCardFront} alt="Frente do BI" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-neutral-600 text-xs">Sem fotografia</span>
                  )}
                </div>
              </div>

              {/* Back */}
              <div 
                onClick={() => user.idCardBack && setInspectImage({ title: 'Verso do Bilhete de Identidade (BI)', src: user.idCardBack })}
                className="group relative rounded-xl overflow-hidden border border-neutral-700 bg-neutral-900 p-2 cursor-pointer hover:border-amber-400 transition-colors"
              >
                <div className="text-[10px] text-neutral-400 mb-1 flex items-center justify-between">
                  <span>2. Verso do BI (Código de Barras / Filiação)</span>
                  <span className="text-amber-400 flex items-center gap-1 group-hover:underline">
                    <Eye className="w-3 h-3" /> Ampliar
                  </span>
                </div>
                <div className="aspect-16/10 rounded-lg overflow-hidden bg-neutral-950 flex items-center justify-center">
                  {user.idCardBack ? (
                    <img src={user.idCardBack} alt="Verso do BI" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-neutral-600 text-xs">Sem fotografia</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resubmission Section if Rejected or Updating */}
        {isResubmitting && (
          <form onSubmit={handleSaveResubmission} className="bg-neutral-950 p-5 rounded-2xl border border-amber-400/40 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h4 className="font-bold text-sm text-amber-400 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                <span>Reenviar Fotografias do Bilhete de Identidade</span>
              </h4>
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-xs text-amber-300 underline font-semibold flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" /> Exemplo Válido
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">Nº do Bilhete de Identidade:</label>
                <input
                  type="text"
                  value={resubmitIdNumber}
                  onChange={(e) => setResubmitIdNumber(e.target.value.toUpperCase())}
                  className="w-full p-2.5 bg-neutral-900 border border-neutral-700 rounded-xl font-mono text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Front Upload */}
              <div className="border border-neutral-700 rounded-xl p-3 bg-neutral-900 text-center space-y-2">
                <span className="font-bold text-neutral-300 block text-[11px]">Nova Foto da Frente:</span>
                {resubmitFront ? (
                  <div className="aspect-16/10 rounded-lg overflow-hidden bg-neutral-950 border border-neutral-800 relative">
                    <img src={resubmitFront} alt="Nova Frente" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => setResubmitFront('')}
                      className="absolute top-1 right-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer border-2 border-dashed border-neutral-700 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-neutral-800">
                    <Upload className="w-5 h-5 text-neutral-400 mb-1" />
                    <span className="text-[11px] text-neutral-300">Carregar Frente</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'front')} className="hidden" />
                  </label>
                )}
              </div>

              {/* Back Upload */}
              <div className="border border-neutral-700 rounded-xl p-3 bg-neutral-900 text-center space-y-2">
                <span className="font-bold text-neutral-300 block text-[11px]">Nova Foto do Verso:</span>
                {resubmitBack ? (
                  <div className="aspect-16/10 rounded-lg overflow-hidden bg-neutral-950 border border-neutral-800 relative">
                    <img src={resubmitBack} alt="Novo Verso" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={() => setResubmitBack('')}
                      className="absolute top-1 right-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded"
                    >
                      Remover
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer border-2 border-dashed border-neutral-700 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-neutral-800">
                    <Upload className="w-5 h-5 text-neutral-400 mb-1" />
                    <span className="text-[11px] text-neutral-300">Carregar Verso</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'back')} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {resubmitMsg && (
              <p className="text-xs text-red-400 font-semibold">{resubmitMsg}</p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsResubmitting(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-black rounded-xl shadow-md"
              >
                Submeter para Nova Análise
              </button>
            </div>
          </form>
        )}

        {/* Action Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <button
            onClick={onRefreshStatus}
            className="w-full sm:w-auto px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl border border-neutral-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Verificar se Já Foi Aprovado</span>
          </button>

          {onAdminDirectLogin ? (
            <button
              onClick={onAdminDirectLogin}
              className="w-full sm:w-auto px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-neutral-950" />
              <span>Aceder ao Painel Admin para Validar Este BI</span>
            </button>
          ) : (
            <button
              onClick={onSwitchUser}
              className="w-full sm:w-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black rounded-xl shadow-md transition-colors"
            >
              Aceder como Administrador para Validar
            </button>
          )}
        </div>
      </main>

      {/* Image Inspection Modal */}
      {inspectImage && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full p-4 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3">
              <h4 className="font-bold text-sm text-white">{inspectImage.title}</h4>
              <button
                onClick={() => setInspectImage(null)}
                className="p-1 text-neutral-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[75vh] flex items-center justify-center bg-black/40 rounded-xl p-2 overflow-auto">
              <img src={inspectImage.src} alt="" className="max-w-full max-h-[70vh] object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center text-xs text-neutral-600 pt-6 border-t border-neutral-900">
        BABA SHOPPING Angola · Compra. Revende. Ganha. · Proteção de Identidade e Conformidade Legal
      </footer>
    </div>
  );
};
