export type UserRole = 'client' | 'admin';
export type AccountStatus = 'ativo' | 'em_processamento' | 'rejeitado';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  province: string;
  city: string;
  role: UserRole;
  avatar?: string;
  idNumber: string; // Bilhete de Identidade (BI Angolano)
  birthDate?: string;
  idCardFront?: string; // Foto frente do BI
  idCardBack?: string;  // Foto verso do BI
  accountStatus: AccountStatus; // 'ativo' | 'em_processamento' | 'rejeitado'
  rejectionReason?: string;
  verifiedAt?: string;
  createdAt: string;
}

export type ProductCategory = 
  | 'telemoveis_acessorios'
  | 'computadores_eletronicos'
  | 'roupas_calcados'
  | 'roupas_calcados_moda'
  | 'produtos_beleza'
  | 'casa_decoracao'
  | 'relogios_acessorios'
  | 'equipamentos_ferramentas'
  | 'produtos_automoveis'
  | 'desporto_lazer'
  | 'produtos_variados'
  | 'produtos_digitais'
  | 'outros_produtos';

export interface CategoryInfo {
  id: ProductCategory;
  label: string;
  iconName: string;
  description: string;
}

export interface OfficialProduct {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  brand: string;
  officialPrice: number; // in Kz (Preço de compra / atacado)
  suggestedResalePrice?: number; // Preço sugerido de revenda (Kz)
  stock: number;
  imageUrl: string;
  gallery?: string[];
  status: 'disponivel' | 'esgotado';
  type: 'fisico' | 'digital';
  createdAt: string;
  resaleEligible: boolean;
  deliveryTime?: string; // e.g. "24h - 48h Luanda | 3-5 dias Províncias"
  deliveryConditions?: string; // Condições de entrega e garantia
  moq?: string; // Quantidade mínima, ex: "1 un (Atacado)"
  supplierName?: string;
  supplierRating?: number;
  features?: string[];
}

export type ProductOwnershipStatus = 
  | 'disponivel'
  | 'anunciado'
  | 'reservado'
  | 'vendido'
  | 'entregue'
  | 'devolvido';

export interface UserProduct {
  id: string; // unique item instance
  originalProductId: string;
  productName: string;
  productImage: string;
  category: ProductCategory;
  originalPrice: number; // in Kz (preço original inicial de fábrica)
  purchasePrice?: number; // quanto este proprietário pagou na última compra
  resaleCycle?: number; // ciclo de revenda atual (ex: 1, 2, 3...)
  previousOwnerName?: string;
  currentOwnerId: string;
  purchaseDate: string;
  status: ProductOwnershipStatus;
  type: 'fisico' | 'digital';
  condition: 'novo' | 'como_novo' | 'bom_estado';
  serialNumber?: string;
}

export interface ResaleListing {
  id: string;
  userProductId: string;
  sellerId: string;
  sellerName: string;
  productName: string;
  category: ProductCategory;
  imageUrl: string;
  originalPrice: number;
  listingPrice: number; // seller defined price
  customDescription: string;
  status: 'ativo' | 'em_negociacao' | 'reservado' | 'vendido' | 'pausado';
  allowNegotiation: boolean;
  minAcceptablePrice?: number;
  resaleCycle?: number;
  createdAt: string;
  updatedAt: string;
}

export type NegotiationStatus = 
  | 'pendente'
  | 'contraproposta'
  | 'aceite'
  | 'recusada'
  | 'expirada'
  | 'em_processamento'
  | 'concluida'
  | 'cancelada';

export interface NegotiationMessage {
  id: string;
  negotiationId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface Negotiation {
  id: string;
  listingId: string;
  userProductId: string;
  productName: string;
  productImage: string;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  listedPrice: number;
  currentProposedPrice: number;
  lastOfferBy: 'buyer' | 'seller';
  status: NegotiationStatus;
  statusMessage?: string;
  createdAt: string;
  updatedAt: string;
  messages: NegotiationMessage[];
}

export type TransactionType = 
  | 'carregamento'
  | 'compra_oficial'
  | 'compra_revenda'
  | 'venda_recebida'
  | 'levantamento'
  | 'taxa_plataforma'
  | 'reembolso';

export type TransactionStatus = 'pendente' | 'confirmada' | 'rejeitada' | 'cancelada';

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: TransactionType;
  amount: number; // in Kz
  feeAmount?: number;
  netAmount?: number;
  status: TransactionStatus;
  reference: string;
  description: string;
  createdAt: string;
  paymentMethod?: string;
}

export interface Wallet {
  userId: string;
  availableBalance: number; // Saldo disponível em Kz
  pendingBalance: number;   // Valores em processamento em Kz
  reservedBalance: number;  // Valores reservados para compras ou levantamentos
  totalDeposited: number;
  totalSpent: number;
  totalEarned: number;
  totalWithdrawn: number;
}

export type OrderStatus = 
  | 'aguardando_pagamento'
  | 'pagamento_confirmado'
  | 'em_preparacao'
  | 'enviado'
  | 'em_entrega'
  | 'entregue'
  | 'cancelado';

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  source: 'oficial' | 'revenda';
  userProductId?: string;
  sellerId?: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId?: string;
  sellerName?: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee?: number;
  totalAmount: number;
  deliveryAddress?: {
    province?: string;
    city?: string;
    street?: string;
    recipientName?: string;
    recipientPhone?: string;
  };
  paymentMethod: 'carteira' | 'multicaixa_express' | 'referencia';
  paymentReference: string;
  status: OrderStatus;
  source: 'oficial' | 'revenda';
  createdAt: string;
  updatedAt: string;
}

export interface DepositRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  method: 'multicaixa_express' | 'referencia' | 'transferencia_bancaria';
  phoneOrRef: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  proofUrl?: string;
  createdAt: string;
  approvedAt?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  bankName: string;
  iban: string;
  accountHolder: string;
  status: 'solicitado' | 'em_analise' | 'aprovado' | 'em_processamento' | 'pago' | 'recusado';
  createdAt: string;
  processedAt?: string;
}

export interface AppNotification {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  type: 'negociacao' | 'venda' | 'compra' | 'carteira' | 'encomenda' | 'sistema';
  read: boolean;
  linkType?: 'produto' | 'negociacao' | 'carteira' | 'encomenda';
  linkId?: string;
  createdAt: string;
}
