import React, { useState } from 'react';
import { 
  User 
} from '../types';
import { 
  getUsers, 
  switchUser, 
  registerUser, 
  ANGOLA_PROVINCES,
  formatKz,
  getUserWallet
} from '../services/storage';
import { 
  X, 
  UserCheck, 
  UserPlus, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  Sparkles,
  Upload,
  FileText,
  Clock,
  AlertCircle,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { BabaLogo } from './BabaLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUserChanged: (newUser: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChanged
}) => {
  const [mode, setMode] = useState<'switch' | 'register'>('switch');

  // Registration Form with Bilhete de Identidade (BI)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+244 9');
  const [province, setProvince] = useState('Luanda');
  const [city, setCity] = useState('Luanda (Talatona)');
  const [idNumber, setIdNumber] = useState('');
  const [birthDate, setBirthDate] = useState('1998-05-15');
  const [idCardFront, setIdCardFront] = useState<string>('');
  const [idCardBack, setIdCardBack] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  if (!isOpen) return null;

  const users = getUsers();

  const handleSwitch = (userId: string) => {
    const user = switchUser(userId);
    onUserChanged(user);
    onClose();
  };

  // File upload handler converting image to data URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          if (side === 'front') setIdCardFront(reader.result);
          else setIdCardBack(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Helper to load sample Angolan BI mock images for quick demo testing
  const handleLoadSampleDocuments = () => {
    const sampleFront = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" rx="16" fill="%23f7f9fa" stroke="%23cbd5e1" stroke-width="2"/><rect x="20" y="20" width="360" height="40" rx="8" fill="%231e293b"/><text x="200" y="38" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23f59e0b" text-anchor="middle">REPÚBLICA DE ANGOLA</text><text x="200" y="52" font-family="sans-serif" font-size="9" fill="%23ffffff" text-anchor="middle">BILHETE DE IDENTIDADE DE CIDADÃO NACIONAL</text><rect x="30" y="80" width="85" height="110" rx="8" fill="%23e2e8f0" stroke="%2394a3b8"/><text x="72" y="140" font-family="sans-serif" font-size="10" fill="%2364748b" text-anchor="middle">FOTO TITULAR</text><text x="135" y="95" font-family="sans-serif" font-size="9" fill="%2364748b">NOME COMPLETO:</text><text x="135" y="112" font-family="sans-serif" font-size="12" font-weight="bold" fill="%230f172a">${name.toUpperCase() || 'CIDADÃO ANGOLANO'}</text><text x="135" y="135" font-family="sans-serif" font-size="9" fill="%2364748b">Nº DO BILHETE (BI):</text><text x="135" y="152" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23b45309">${idNumber || '008912341LA099'}</text><text x="135" y="175" font-family="sans-serif" font-size="9" fill="%2364748b">DATA NASC / NATURALIDADE:</text><text x="135" y="190" font-family="sans-serif" font-size="10" font-weight="semibold" fill="%23334155">${birthDate} · ${province.toUpperCase()}</text><rect x="20" y="210" width="360" height="25" rx="4" fill="%23e2e8f0"/><text x="200" y="226" font-family="monospace" font-size="10" fill="%23475569" text-anchor="middle">IDAGO${idNumber || '008912341LA099'}&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</text></svg>`;

    const sampleBack = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" rx="16" fill="%23f1f5f9" stroke="%23cbd5e1" stroke-width="2"/><text x="30" y="45" font-family="sans-serif" font-size="10" font-weight="bold" fill="%23475569">FILIAÇÃO E RESIDÊNCIA (VERSO DO BI):</text><text x="30" y="70" font-family="sans-serif" font-size="9" fill="%2364748b">PAI: MANUEL ANTÓNIO</text><text x="30" y="90" font-family="sans-serif" font-size="9" fill="%2364748b">MÃE: MARIA SEBASTIÃO</text><text x="30" y="110" font-family="sans-serif" font-size="9" fill="%2364748b">RESIDÊNCIA: ${city.toUpperCase()}, ${province.toUpperCase()}</text><text x="30" y="130" font-family="sans-serif" font-size="9" fill="%2364748b">EMISSÃO / VALIDADE: 2024 A 2034</text><rect x="30" y="155" width="340" height="65" fill="%23334155" rx="6"/><text x="200" y="190" font-family="monospace" font-size="11" fill="%2338bdf8" text-anchor="middle">||| | ||||| |||| || |||||| |||||||||| ||||||</text><text x="200" y="206" font-family="sans-serif" font-size="8" fill="%2394a3b8" text-anchor="middle">CÓDIGO DE BARRAS DE SEGURANÇA NACIONAL</text></svg>`;

    setIdCardFront(sampleFront);
    setIdCardBack(sampleBack);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!name.trim() || !email.trim() || !phone.trim() || !idNumber.trim()) {
      setRegError('Preenche todos os campos obrigatórios, incluindo o Nº do Bilhete de Identidade.');
      return;
    }

    if (!idCardFront || !idCardBack) {
      setRegError('Deves anexar a fotografia da FRENTE e do VERSO do Bilhete de Identidade.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newUser = registerUser(
        name.trim(),
        email.trim(),
        phone.trim(),
        province,
        city.trim(),
        idNumber.trim().toUpperCase(),
        birthDate,
        idCardFront,
        idCardBack
      );

      onUserChanged(newUser);
      onClose();
    } catch (err: any) {
      setRegError(err.message || 'Erro ao criar conta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-neutral-200 my-6">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-neutral-900 text-white flex items-center justify-between">
          <BabaLogo size="sm" theme="dark" />
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 text-xs font-bold">
          <button
            onClick={() => setMode('switch')}
            className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-1.5 ${
              mode === 'switch' ? 'bg-white text-neutral-900 border-b-2 border-amber-500' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <UserCheck className="w-4 h-4 text-amber-500" />
            <span>Contas / Iniciar Sessão</span>
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-3 text-center transition-colors flex items-center justify-center gap-1.5 ${
              mode === 'register' ? 'bg-white text-neutral-900 border-b-2 border-amber-500' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <UserPlus className="w-4 h-4 text-amber-500" />
            <span>Criar Conta com BI</span>
          </button>
        </div>

        {/* MODE: SWITCH ACCOUNT */}
        {mode === 'switch' && (
          <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-neutral-900">Seleciona a Conta para Aceder</h4>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Alterna entre o Administrador (para validar bilhetes e stock) e clientes para comprar e revender.
              </p>
            </div>

            <div className="space-y-2.5">
              {users.map((u) => {
                const isSelected = u.id === currentUser.id;
                const wallet = getUserWallet(u.id);
                const isPending = u.accountStatus === 'em_processamento';

                return (
                  <button
                    key={u.id}
                    onClick={() => handleSwitch(u.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
                        : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-neutral-900 text-amber-400 font-bold flex items-center justify-center shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-neutral-900 truncate">{u.name}</h4>
                          {u.role === 'admin' ? (
                            <span className="text-[9px] bg-amber-400 text-neutral-950 font-black px-1.5 py-0.5 rounded">
                              ADMIN
                            </span>
                          ) : isPending ? (
                            <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                              <Clock className="w-2.5 h-2.5" /> EM PROCESSAMENTO
                            </span>
                          ) : (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                              BI VERIFICADO
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-500 truncate mt-0.5">
                          BI: <strong className="text-neutral-700 font-mono">{u.idNumber}</strong> · {u.city}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-neutral-400 block uppercase font-semibold">Saldo</span>
                      <span className="text-xs font-black text-neutral-900 tabular-nums">
                        {formatKz(wallet.availableBalance)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-600 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-neutral-800">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Fluxo de Conformidade do Bilhete de Identidade:</span>
              </div>
              <p className="text-[11px] leading-relaxed text-neutral-500">
                Para testar a validação do BI: cria uma nova conta na aba ao lado (que ficará em processamento) ou clica no utilizador <strong>António Kwanza</strong>. Depois troca para a conta do <strong>Administrador</strong> para rever o documento frente/verso e aprovar a ativação!
              </p>
            </div>
          </div>
        )}

        {/* MODE: REGISTER WITH BILHETE DE IDENTIDADE (BI) */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="p-5 sm:p-6 space-y-4 text-xs max-h-[78vh] overflow-y-auto">
            {/* Notice */}
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold block">Verificação Obrigatória de Identidade (Angola)</span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Insere os dados reais conforme o teu Bilhete de Identidade de Cidadão Nacional. A tua conta entrará em processamento e será validada pela administração da BABA SHOPPING antes da ativação.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-neutral-800 block mb-1">
                  Nome Completo (conforme o BI): *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ex: Domingos Manuel da Silva"
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-800 block mb-1">
                    Nº do Bilhete de Identidade (BI): *
                  </label>
                  <input
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value.toUpperCase())}
                    required
                    placeholder="Ex: 007294812LA041"
                    maxLength={14}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-800 block mb-1">
                    Data de Nascimento: *
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-800 block mb-1">
                    Província de Residência: *
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {ANGOLA_PROVINCES.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-neutral-800 block mb-1">
                    Município / Bairro: *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    placeholder="Ex: Talatona, Bairro Benfica"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-neutral-800 block mb-1">
                    Telemóvel (+244): *
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="+244 9xx xxx xxx"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-neutral-800 block mb-1">
                    Endereço de Email: *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="nome@exemplo.ao"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* DOCUMENT UPLOAD SECTION: FRONT & BACK OF BI */}
              <div className="pt-2 border-t border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-neutral-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-500" />
                    <span>Fotografias do Bilhete de Identidade (Frente e Verso): *</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleLoadSampleDocuments}
                    className="text-[11px] font-bold text-amber-600 hover:text-amber-700 underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Preencher BI de Exemplo</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Front Upload */}
                  <div className="border border-neutral-300 rounded-2xl p-3 bg-neutral-50 text-center space-y-2">
                    <span className="font-bold text-neutral-700 block text-[11px]">
                      1. Foto da FRENTE do BI
                    </span>
                    {idCardFront ? (
                      <div className="relative rounded-xl overflow-hidden aspect-16/10 bg-white border border-neutral-200">
                        <img src={idCardFront} alt="Frente BI" className="w-full h-full object-contain" />
                        <button
                          type="button"
                          onClick={() => setIdCardFront('')}
                          className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-md text-[10px]"
                        >
                          Trocar
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer border-2 border-dashed border-neutral-300 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-neutral-100 transition-colors">
                        <Upload className="w-6 h-6 text-neutral-400 mb-1" />
                        <span className="text-[11px] font-semibold text-neutral-700">Carregar Frente</span>
                        <span className="text-[9px] text-neutral-400 mt-0.5">PNG, JPG ou câmara</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'front')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {/* Back Upload */}
                  <div className="border border-neutral-300 rounded-2xl p-3 bg-neutral-50 text-center space-y-2">
                    <span className="font-bold text-neutral-700 block text-[11px]">
                      2. Foto do VERSO do BI
                    </span>
                    {idCardBack ? (
                      <div className="relative rounded-xl overflow-hidden aspect-16/10 bg-white border border-neutral-200">
                        <img src={idCardBack} alt="Verso BI" className="w-full h-full object-contain" />
                        <button
                          type="button"
                          onClick={() => setIdCardBack('')}
                          className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-md text-[10px]"
                        >
                          Trocar
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer border-2 border-dashed border-neutral-300 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-neutral-100 transition-colors">
                        <Upload className="w-6 h-6 text-neutral-400 mb-1" />
                        <span className="text-[11px] font-semibold text-neutral-700">Carregar Verso</span>
                        <span className="text-[9px] text-neutral-400 mt-0.5">PNG, JPG ou câmara</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'back')}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {regError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-neutral-900 text-amber-400 hover:bg-neutral-800 font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{isSubmitting ? 'A submeter dados...' : 'Submeter Criação de Conta para Análise'}</span>
              </button>
              <p className="text-[10px] text-center text-neutral-400 mt-2">
                A tua conta será aberta em modo de processamento até aprovação pelo administrador.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
