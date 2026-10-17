import { 
  CategoryInfo, 
  OfficialProduct, 
  User, 
  UserProduct, 
  ResaleListing, 
  Wallet, 
  Transaction, 
  AppNotification,
  Order
} from '../types';
import { MAIN_CATEGORIES, ALL_OFFICIAL_PRODUCTS } from './productsCatalog';

export const CATEGORIES: CategoryInfo[] = MAIN_CATEGORIES;

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin',
    name: 'Administrador BABA SHOPPING',
    email: 'admin@babashopping.ao',
    phone: '+244 923 000 001',
    province: 'Luanda',
    city: 'Luanda (Ingombota)',
    role: 'admin',
    idNumber: '001002003LA001',
    birthDate: '1985-04-12',
    accountStatus: 'ativo',
    idCardFront: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" rx="16" fill="%23fef3c7" stroke="%23f59e0b" stroke-width="2"/><rect x="20" y="20" width="360" height="40" rx="8" fill="%231e293b"/><text x="200" y="38" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23f59e0b" text-anchor="middle">REPÚBLICA DE ANGOLA</text><text x="200" y="52" font-family="sans-serif" font-size="9" fill="%23ffffff" text-anchor="middle">BILHETE DE IDENTIDADE DE CIDADÃO NACIONAL</text><rect x="30" y="80" width="85" height="110" rx="8" fill="%23e2e8f0" stroke="%2394a3b8"/><text x="72" y="140" font-family="sans-serif" font-size="10" fill="%2364748b" text-anchor="middle">FOTO ADMIN</text><text x="135" y="95" font-family="sans-serif" font-size="9" fill="%2364748b">NOME COMPLETO:</text><text x="135" y="112" font-family="sans-serif" font-size="12" font-weight="bold" fill="%230f172a">ADMINISTRADOR BABA SHOPPING</text><text x="135" y="135" font-family="sans-serif" font-size="9" fill="%2364748b">Nº DO BILHETE (BI):</text><text x="135" y="152" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23b45309">001002003LA001</text><text x="135" y="175" font-family="sans-serif" font-size="9" fill="%2364748b">DATA NASC / NATURALIDADE:</text><text x="135" y="190" font-family="sans-serif" font-size="10" font-weight="semibold" fill="%23334155">12/04/1985 · LUANDA</text><rect x="20" y="210" width="360" height="25" rx="4" fill="%23dcfce7"/><text x="200" y="226" font-family="monospace" font-size="10" fill="%23166534" text-anchor="middle">VERIFICADO - ACESSO MASTER KYC</text></svg>',
    idCardBack: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" rx="16" fill="%23fef3c7" stroke="%23f59e0b" stroke-width="2"/><text x="30" y="45" font-family="sans-serif" font-size="10" font-weight="bold" fill="%2392400e">FILIAÇÃO E RESIDÊNCIA (VERSO DO BI):</text><text x="30" y="70" font-family="sans-serif" font-size="9" fill="%2364748b">PAI: MANUEL DA COSTA SHOPPING</text><text x="30" y="90" font-family="sans-serif" font-size="9" fill="%2364748b">MÃE: ANA MARIA SEBASTIÃO</text><text x="30" y="110" font-family="sans-serif" font-size="9" fill="%2364748b">RESIDÊNCIA: INGOMBOТА, LUANDA - ANGOLA</text><text x="30" y="130" font-family="sans-serif" font-size="9" fill="%2364748b">EMISSÃO / VALIDADE: 10/01/2022 A 10/01/2032</text><rect x="30" y="155" width="340" height="65" fill="%231e293b" rx="6"/><text x="200" y="190" font-family="monospace" font-size="11" fill="%23f59e0b" text-anchor="middle">|||||||||||||||||||||||||||||||||||||||||||||||</text><text x="200" y="206" font-family="sans-serif" font-size="8" fill="%2394a3b8" text-anchor="middle">CÓDIGO DE BARRAS DE SEGURANÇA NACIONAL</text></svg>',
    verifiedAt: '2026-01-01T08:00:00Z',
    createdAt: '2026-01-01T08:00:00Z'
  },
  {
    id: 'usr_maria',
    name: 'Maria Vendedora António',
    email: 'maria@revenda.ao',
    phone: '+244 923 111 222',
    province: 'Luanda',
    city: 'Luanda (Talatona)',
    role: 'client',
    idNumber: '007294812LA041',
    birthDate: '1995-07-23',
    accountStatus: 'ativo',
    idCardFront: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" rx="16" fill="%23fef3c7" stroke="%23f59e0b" stroke-width="2"/><rect x="20" y="20" width="360" height="40" rx="8" fill="%231e293b"/><text x="200" y="38" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23f59e0b" text-anchor="middle">REPÚBLICA DE ANGOLA</text><text x="200" y="52" font-family="sans-serif" font-size="9" fill="%23ffffff" text-anchor="middle">BILHETE DE IDENTIDADE DE CIDADÃO NACIONAL</text><rect x="30" y="80" width="85" height="110" rx="8" fill="%23e2e8f0" stroke="%2394a3b8"/><text x="72" y="140" font-family="sans-serif" font-size="10" fill="%2364748b" text-anchor="middle">FOTO TITULAR</text><text x="135" y="95" font-family="sans-serif" font-size="9" fill="%2364748b">NOME COMPLETO:</text><text x="135" y="112" font-family="sans-serif" font-size="12" font-weight="bold" fill="%230f172a">MARIA VENDEDORA ANTÓNIO</text><text x="135" y="135" font-family="sans-serif" font-size="9" fill="%2364748b">Nº DO BILHETE (BI):</text><text x="135" y="152" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23b45309">007294812LA041</text><text x="135" y="175" font-family="sans-serif" font-size="9" fill="%2364748b">DATA NASC / NATURALIDADE:</text><text x="135" y="190" font-family="sans-serif" font-size="10" font-weight="semibold" fill="%23334155">23/07/1995 · LUANDA</text><rect x="20" y="210" width="360" height="25" rx="4" fill="%23dcfce7"/><text x="200" y="226" font-family="monospace" font-size="10" fill="%23166534" text-anchor="middle">DOCUMENTO AUTÊNTICO VERIFICADO PELO ADMIN</text></svg>',
    idCardBack: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" rx="16" fill="%23fef3c7" stroke="%23f59e0b" stroke-width="2"/><text x="30" y="45" font-family="sans-serif" font-size="10" font-weight="bold" fill="%2392400e">FILIAÇÃO E RESIDÊNCIA (VERSO DO BI):</text><text x="30" y="70" font-family="sans-serif" font-size="9" fill="%2364748b">PAI: ANTÓNIO MANUEL AFONSO</text><text x="30" y="90" font-family="sans-serif" font-size="9" fill="%2364748b">MÃE: TERESA KWANZA GOMES</text><text x="30" y="110" font-family="sans-serif" font-size="9" fill="%2364748b">RESIDÊNCIA: TALATONA, LUANDA - ANGOLA</text><text x="30" y="130" font-family="sans-serif" font-size="9" fill="%2364748b">EMISSÃO / VALIDADE: 15/03/2021 A 15/03/2031</text><rect x="30" y="155" width="340" height="65" fill="%231e293b" rx="6"/><text x="200" y="190" font-family="monospace" font-size="11" fill="%23f59e0b" text-anchor="middle">|||||||||||||||||||||||||||||||||||||||||||||||</text><text x="200" y="206" font-family="sans-serif" font-size="8" fill="%2394a3b8" text-anchor="middle">CÓDIGO DE BARRAS DE SEGURANÇA NACIONAL</text></svg>',
    verifiedAt: '2026-01-10T14:30:00Z',
    createdAt: '2026-01-10T12:00:00Z'
  },
  {
    id: 'usr_joao',
    name: 'João Comprador Fernando',
    email: 'joao@cliente.ao',
    phone: '+244 931 444 555',
    province: 'Benguela',
    city: 'Benguela (Praia Morena)',
    role: 'client',
    idNumber: '004189321BE092',
    birthDate: '1991-11-03',
    accountStatus: 'ativo',
    idCardFront: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" rx="16" fill="%23fef3c7" stroke="%23f59e0b" stroke-width="2"/><rect x="20" y="20" width="360" height="40" rx="8" fill="%231e293b"/><text x="200" y="38" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23f59e0b" text-anchor="middle">REPÚBLICA DE ANGOLA</text><text x="200" y="52" font-family="sans-serif" font-size="9" fill="%23ffffff" text-anchor="middle">BILHETE DE IDENTIDADE DE CIDADÃO NACIONAL</text><rect x="30" y="80" width="85" height="110" rx="8" fill="%23e2e8f0" stroke="%2394a3b8"/><text x="72" y="140" font-family="sans-serif" font-size="10" fill="%2364748b" text-anchor="middle">FOTO TITULAR</text><text x="135" y="95" font-family="sans-serif" font-size="9" fill="%2364748b">NOME COMPLETO:</text><text x="135" y="112" font-family="sans-serif" font-size="12" font-weight="bold" fill="%230f172a">JOÃO COMPRADOR FERNANDO</text><text x="135" y="135" font-family="sans-serif" font-size="9" fill="%2364748b">Nº DO BILHETE (BI):</text><text x="135" y="152" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23b45309">004189321BE092</text><text x="135" y="175" font-family="sans-serif" font-size="9" fill="%2364748b">DATA NASC / NATURALIDADE:</text><text x="135" y="190" font-family="sans-serif" font-size="10" font-weight="semibold" fill="%23334155">03/11/1991 · BENGUELA</text><rect x="20" y="210" width="360" height="25" rx="4" fill="%23dcfce7"/><text x="200" y="226" font-family="monospace" font-size="10" fill="%23166534" text-anchor="middle">DOCUMENTO AUTÊNTICO VERIFICADO PELO ADMIN</text></svg>',
    idCardBack: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" rx="16" fill="%23fef3c7" stroke="%23f59e0b" stroke-width="2"/><text x="30" y="45" font-family="sans-serif" font-size="10" font-weight="bold" fill="%2392400e">FILIAÇÃO E RESIDÊNCIA (VERSO DO BI):</text><text x="30" y="70" font-family="sans-serif" font-size="9" fill="%2364748b">PAI: FERNANDO JOÃO DIOGO</text><text x="30" y="90" font-family="sans-serif" font-size="9" fill="%2364748b">MÃE: MADALENA TCHILOMBO</text><text x="30" y="110" font-family="sans-serif" font-size="9" fill="%2364748b">RESIDÊNCIA: PRAIA MORENA, BENGUELA - ANGOLA</text><text x="30" y="130" font-family="sans-serif" font-size="9" fill="%2364748b">EMISSÃO / VALIDADE: 18/09/2020 A 18/09/2030</text><rect x="30" y="155" width="340" height="65" fill="%231e293b" rx="6"/><text x="200" y="190" font-family="monospace" font-size="11" fill="%23f59e0b" text-anchor="middle">|||||||||||||||||||||||||||||||||||||||||||||||</text><text x="200" y="206" font-family="sans-serif" font-size="8" fill="%2394a3b8" text-anchor="middle">CÓDIGO DE BARRAS DE SEGURANÇA NACIONAL</text></svg>',
    verifiedAt: '2026-01-15T09:00:00Z',
    createdAt: '2026-01-15T08:30:00Z'
  },
  {
    id: 'usr_antonio_pending',
    name: 'António Kwanza Sequeira',
    email: 'antonio@email.ao',
    phone: '+244 945 888 999',
    province: 'Huambo',
    city: 'Huambo (Cidade Alta)',
    role: 'client',
    idNumber: '007382914HA088',
    birthDate: '1998-09-14',
    accountStatus: 'em_processamento',
    idCardFront: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" rx="16" fill="%23fef3c7" stroke="%23f59e0b" stroke-width="2"/><rect x="20" y="20" width="360" height="40" rx="8" fill="%231e293b"/><text x="200" y="38" font-family="sans-serif" font-size="11" font-weight="bold" fill="%23f59e0b" text-anchor="middle">REPÚBLICA DE ANGOLA</text><text x="200" y="52" font-family="sans-serif" font-size="9" fill="%23ffffff" text-anchor="middle">BILHETE DE IDENTIDADE DE CIDADÃO NACIONAL</text><rect x="30" y="80" width="85" height="110" rx="8" fill="%23e2e8f0" stroke="%2394a3b8"/><text x="72" y="140" font-family="sans-serif" font-size="10" fill="%2364748b" text-anchor="middle">FOTO RECENTE</text><text x="135" y="95" font-family="sans-serif" font-size="9" fill="%2364748b">NOME COMPLETO:</text><text x="135" y="112" font-family="sans-serif" font-size="12" font-weight="bold" fill="%230f172a">ANTÓNIO KWANZA SEQUEIRA</text><text x="135" y="135" font-family="sans-serif" font-size="9" fill="%2364748b">Nº DO BILHETE (BI):</text><text x="135" y="152" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23b45309">007382914HA088</text><text x="135" y="175" font-family="sans-serif" font-size="9" fill="%2364748b">DATA NASC / NATURALIDADE:</text><text x="135" y="190" font-family="sans-serif" font-size="10" font-weight="semibold" fill="%23334155">14/09/1998 · HUAMBO</text><rect x="20" y="210" width="360" height="25" rx="4" fill="%23fde68a"/><text x="200" y="226" font-family="monospace" font-size="10" fill="%2392400e" text-anchor="middle">SUBMETIDO PARA VALIDAÇÃO KYCBABA</text></svg>',
    idCardBack: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" rx="16" fill="%23fef3c7" stroke="%23f59e0b" stroke-width="2"/><text x="30" y="45" font-family="sans-serif" font-size="10" font-weight="bold" fill="%2392400e">FILIAÇÃO E RESIDÊNCIA (VERSO DO BI):</text><text x="30" y="70" font-family="sans-serif" font-size="9" fill="%2364748b">PAI: SEQUEIRA BAPTISTA</text><text x="30" y="90" font-family="sans-serif" font-size="9" fill="%2364748b">MÃE: ESPERANÇA KWANZA</text><text x="30" y="110" font-family="sans-serif" font-size="9" fill="%2364748b">RESIDÊNCIA: CIDADE ALTA, HUAMBO - ANGOLA</text><text x="30" y="130" font-family="sans-serif" font-size="9" fill="%2364748b">EMISSÃO / VALIDADE: 05/08/2023 A 05/08/2033</text><rect x="30" y="155" width="340" height="65" fill="%23451a03" rx="6"/><text x="200" y="190" font-family="monospace" font-size="11" fill="%23fbbf24" text-anchor="middle">||| | ||||| |||| || |||||| |||||||||| ||||||</text><text x="200" y="206" font-family="sans-serif" font-size="8" fill="%23fef3c7" text-anchor="middle">CÓDIGO DE BARRAS DE SEGURANÇA NACIONAL</text></svg>',
    createdAt: '2026-10-15T08:00:00Z'
  }
];

export const INITIAL_PRODUCTS: OfficialProduct[] = ALL_OFFICIAL_PRODUCTS;

// Initial user products owned by Maria
export const INITIAL_USER_PRODUCTS: UserProduct[] = [
  {
    id: 'uprod_maria_001',
    originalProductId: 'tel_04',
    productName: 'Auscultadores Bluetooth Over-Ear ANC com Cancelamento de Ruído',
    productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    category: 'telemoveis_acessorios',
    originalPrice: 8000,
    currentOwnerId: 'usr_maria',
    purchaseDate: '2026-02-12T14:20:00Z',
    status: 'anunciado',
    type: 'fisico',
    condition: 'como_novo',
    serialNumber: 'BS-ANC-88001'
  },
  {
    id: 'uprod_maria_002',
    originalProductId: 'bel_02',
    productName: 'Perfume Masculino Dior Sauvage Eau de Parfum 100ml Original',
    productImage: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&auto=format&fit=crop&q=80',
    category: 'produtos_beleza',
    originalPrice: 98000,
    currentOwnerId: 'usr_maria',
    purchaseDate: '2026-02-14T09:15:00Z',
    status: 'disponivel',
    type: 'fisico',
    condition: 'novo',
    serialNumber: 'BS-PF-11843'
  }
];

// Resale listing already listed by Maria
export const INITIAL_RESALE_LISTINGS: ResaleListing[] = [
  {
    id: 'listing_001',
    userProductId: 'uprod_maria_001',
    sellerId: 'usr_maria',
    sellerName: 'Maria Vendedora António',
    productName: 'Auscultadores Bluetooth Over-Ear ANC (Revenda Verificada)',
    category: 'telemoveis_acessorios',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    originalPrice: 8000,
    listingPrice: 14000, // Maria wants 14.000 Kz (bought for 8.000 Kz => 6.000 Kz profit!)
    customDescription: 'Comprado oficialmente na BABA SHOPPING por preço de fábrica. Lacrado na caixa original, testado e com garantia. Lucro de revenda garantido!',
    status: 'ativo',
    allowNegotiation: true,
    minAcceptablePrice: 12000,
    createdAt: '2026-02-14T11:00:00Z',
    updatedAt: '2026-02-14T11:00:00Z'
  }
];

export const INITIAL_WALLETS: Record<string, Wallet> = {
  usr_admin: {
    userId: 'usr_admin',
    availableBalance: 2450000,
    pendingBalance: 0,
    reservedBalance: 0,
    totalDeposited: 3000000,
    totalSpent: 0,
    totalEarned: 125000,
    totalWithdrawn: 0
  },
  usr_maria: {
    userId: 'usr_maria',
    availableBalance: 85000,
    pendingBalance: 0,
    reservedBalance: 0,
    totalDeposited: 120000,
    totalSpent: 35000,
    totalEarned: 0,
    totalWithdrawn: 0
  },
  usr_joao: {
    userId: 'usr_joao',
    availableBalance: 150000,
    pendingBalance: 0,
    reservedBalance: 0,
    totalDeposited: 150000,
    totalSpent: 0,
    totalEarned: 0,
    totalWithdrawn: 0
  }
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_init_001',
    userId: 'usr_maria',
    userName: 'Maria Vendedora António',
    type: 'carregamento',
    amount: 120000,
    status: 'confirmada',
    reference: 'MCX-2026-99120',
    description: 'Carregamento via Multicaixa Express',
    paymentMethod: 'Multicaixa Express',
    createdAt: '2026-02-10T11:00:00Z'
  },
  {
    id: 'tx_init_002',
    userId: 'usr_maria',
    userName: 'Maria Vendedora António',
    type: 'compra_oficial',
    amount: 33000,
    status: 'confirmada',
    reference: 'ENC-OFIC-001',
    description: 'Compra oficial para revenda de Auscultadores ANC e Perfume Dior Sauvage',
    createdAt: '2026-02-12T14:20:00Z'
  },
  {
    id: 'tx_init_003',
    userId: 'usr_joao',
    userName: 'João Comprador Fernando',
    type: 'carregamento',
    amount: 150000,
    status: 'confirmada',
    reference: 'MCX-2026-88412',
    description: 'Carregamento de saldo via Multicaixa Express',
    paymentMethod: 'Multicaixa Express',
    createdAt: '2026-02-15T15:00:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_init_001',
    recipientId: 'usr_maria',
    title: 'Anúncio publicado com sucesso',
    message: 'O teu produto Auscultadores Bluetooth ANC está ativo no Mercado de Revenda por 14.000 Kz.',
    type: 'venda',
    read: false,
    linkType: 'produto',
    linkId: 'listing_001',
    createdAt: '2026-02-14T11:00:00Z'
  },
  {
    id: 'notif_init_002',
    recipientId: 'usr_joao',
    title: 'Bem-vindo à BABA SHOPPING!',
    message: 'A tua carteira digital foi criada com sucesso. Explora o mercado oficial e as ofertas de revenda.',
    type: 'sistema',
    read: true,
    linkType: 'carteira',
    createdAt: '2026-02-15T14:30:00Z'
  }
];

export const ANGOLA_PROVINCES = [
  'Bengo',
  'Benguela',
  'Bié',
  'Cabinda',
  'Cuando Cubango',
  'Cuanza Norte',
  'Cuanza Sul',
  'Cunene',
  'Huambo',
  'Huíla',
  'Luanda',
  'Lunda Norte',
  'Lunda Sul',
  'Malanje',
  'Moxico',
  'Namibe',
  'Uíge',
  'Zaire'
];
