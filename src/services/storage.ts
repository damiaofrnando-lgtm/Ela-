import { 
  User, 
  OfficialProduct, 
  UserProduct, 
  ResaleListing, 
  Negotiation, 
  NegotiationMessage, 
  Transaction, 
  Wallet, 
  Order, 
  DepositRequest, 
  WithdrawalRequest, 
  AppNotification 
} from '../types';

import { 
  INITIAL_USERS, 
  INITIAL_PRODUCTS, 
  INITIAL_USER_PRODUCTS, 
  INITIAL_RESALE_LISTINGS, 
  INITIAL_WALLETS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_NOTIFICATIONS,
  ANGOLA_PROVINCES
} from '../data/initialData';

export { ANGOLA_PROVINCES };

const STORAGE_KEYS = {
  USERS: 'baba_users_v3',
  CURRENT_USER_ID: 'baba_current_user_id_v3',
  PRODUCTS: 'baba_products_v3',
  USER_PRODUCTS: 'baba_user_products_v3',
  RESALE_LISTINGS: 'baba_resale_listings_v3',
  NEGOTIATIONS: 'baba_negotiations_v3',
  WALLETS: 'baba_wallets_v3',
  TRANSACTIONS: 'baba_transactions_v3',
  ORDERS: 'baba_orders_v3',
  DEPOSITS: 'baba_deposits_v3',
  WITHDRAWALS: 'baba_withdrawals_v3',
  NOTIFICATIONS: 'baba_notifications_v3',
};

// Custom event for cross-component reactive sync
export const DB_CHANGE_EVENT = 'baba_db_state_changed';

function emitChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(DB_CHANGE_EVENT));
  }
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error loading ${key}`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    emitChange();
  } catch (err) {
    console.error(`Error saving ${key}`, err);
  }
}

// ---------------- DATABASE INITIALIZATION ----------------
export function initDatabase() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    saveToStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID)) {
    saveToStorage(STORAGE_KEYS.CURRENT_USER_ID, 'usr_maria'); // Default active user for rich experience
  }
  const existingProds = loadFromStorage<OfficialProduct[]>(STORAGE_KEYS.PRODUCTS, []);
  const allRequiredCats = [
    'telemoveis_acessorios',
    'computadores_eletronicos',
    'roupas_calcados',
    'produtos_beleza',
    'casa_decoracao',
    'relogios_acessorios',
    'equipamentos_ferramentas',
    'produtos_automoveis',
    'desporto_lazer',
    'produtos_variados'
  ];
  const hasAllCats = existingProds && allRequiredCats.every(cat => existingProds.some(p => p.category === cat));
  
  if (!existingProds || existingProds.length < INITIAL_PRODUCTS.length || !hasAllCats) {
    saveToStorage(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER_PRODUCTS)) {
    saveToStorage(STORAGE_KEYS.USER_PRODUCTS, INITIAL_USER_PRODUCTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.RESALE_LISTINGS)) {
    saveToStorage(STORAGE_KEYS.RESALE_LISTINGS, INITIAL_RESALE_LISTINGS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.WALLETS)) {
    saveToStorage(STORAGE_KEYS.WALLETS, INITIAL_WALLETS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.NEGOTIATIONS)) {
    saveToStorage(STORAGE_KEYS.NEGOTIATIONS, []);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    saveToStorage(STORAGE_KEYS.ORDERS, []);
  }
  if (!localStorage.getItem(STORAGE_KEYS.DEPOSITS)) {
    saveToStorage(STORAGE_KEYS.DEPOSITS, []);
  }
  if (!localStorage.getItem(STORAGE_KEYS.WITHDRAWALS)) {
    saveToStorage(STORAGE_KEYS.WITHDRAWALS, []);
  }
}

// ---------------- USER & AUTH MANAGEMENT ----------------
export function getUsers(): User[] {
  return loadFromStorage<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
}

export function getCurrentUser(): User {
  const users = getUsers();
  const currentId = loadFromStorage<string>(STORAGE_KEYS.CURRENT_USER_ID, 'usr_maria');
  const user = users.find(u => u.id === currentId);
  return user || users[0];
}

export function switchUser(userId: string): User {
  saveToStorage(STORAGE_KEYS.CURRENT_USER_ID, userId);
  return getCurrentUser();
}

export function registerUser(
  name: string, 
  email: string, 
  phone: string, 
  province: string, 
  city: string,
  idNumber: string,
  birthDate: string,
  idCardFront: string,
  idCardBack: string
): User {
  const users = getUsers();
  const existingEmail = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingEmail) {
    throw new Error('Já existe uma conta associada a este endereço de email.');
  }

  const existingBI = users.find(u => u.idNumber?.toLowerCase() === idNumber.toLowerCase());
  if (existingBI) {
    throw new Error('Este Número de Bilhete de Identidade (BI) já se encontra registado no sistema.');
  }

  const newUser: User = {
    id: `usr_${Date.now()}`,
    name,
    email,
    phone,
    province,
    city,
    role: 'client',
    idNumber,
    birthDate,
    idCardFront,
    idCardBack,
    accountStatus: 'em_processamento', // CONTA ENTRA EM PROCESSAMENTO PARA AVALIAÇÃO DO ADMIN
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveToStorage(STORAGE_KEYS.USERS, users);

  // Initialize wallet for new user
  const wallets = loadFromStorage<Record<string, Wallet>>(STORAGE_KEYS.WALLETS, {});
  wallets[newUser.id] = {
    userId: newUser.id,
    availableBalance: 0,
    pendingBalance: 0,
    reservedBalance: 0,
    totalDeposited: 0,
    totalSpent: 0,
    totalEarned: 0,
    totalWithdrawn: 0
  };
  saveToStorage(STORAGE_KEYS.WALLETS, wallets);

  // Set active user to newly registered user (who will see processing state)
  switchUser(newUser.id);

  addNotification(
    'usr_admin',
    'Novo Bilhete de Identidade para Verificação!',
    `${name} submeteu o BI nº ${idNumber} (${province}) para aprovação de conta.`,
    'sistema'
  );

  return newUser;
}

export function approveUserAccount(userId: string): User {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) throw new Error('Utilizador não encontrado');

  users[idx].accountStatus = 'ativo';
  users[idx].verifiedAt = new Date().toISOString();
  delete users[idx].rejectionReason;
  saveToStorage(STORAGE_KEYS.USERS, users);

  addNotification(
    userId,
    'Conta Aprovada com Sucesso! 🎉',
    'O teu Bilhete de Identidade e registo foram validados pela administração da BABA SHOPPING. Já tens acesso total à plataforma!',
    'sistema'
  );

  return users[idx];
}

export function rejectUserAccount(userId: string, reason: string): User {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) throw new Error('Utilizador não encontrado');

  users[idx].accountStatus = 'rejeitado';
  users[idx].rejectionReason = reason || 'Documento ilegível ou dados divergentes do Bilhete de Identidade.';
  saveToStorage(STORAGE_KEYS.USERS, users);

  addNotification(
    userId,
    'Registo Não Aprovado',
    `A tua submissão de Bilhete de Identidade não pôde ser aprovada: ${users[idx].rejectionReason}. Por favor, corrige os teus dados.`,
    'sistema'
  );

  return users[idx];
}

export function getPendingUsers(): User[] {
  return getUsers().filter(u => u.accountStatus === 'em_processamento');
}

export function resubmitIdDocuments(userId: string, idCardFront: string, idCardBack: string, idNumber?: string): User {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) throw new Error('Utilizador não encontrado');

  users[idx].idCardFront = idCardFront;
  users[idx].idCardBack = idCardBack;
  if (idNumber) users[idx].idNumber = idNumber;
  users[idx].accountStatus = 'em_processamento';
  delete users[idx].rejectionReason;
  saveToStorage(STORAGE_KEYS.USERS, users);

  addNotification(
    'usr_admin',
    'Documentos do BI Reenviados para Verificação',
    `${users[idx].name} reenviou novas fotografias do BI nº ${users[idx].idNumber} para validação.`,
    'sistema'
  );

  return users[idx];
}


// ---------------- OFFICIAL PRODUCTS ----------------
export function getProducts(): OfficialProduct[] {
  return loadFromStorage<OfficialProduct[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
}

export function getProductById(id: string): OfficialProduct | undefined {
  return getProducts().find(p => p.id === id);
}

export function addProduct(product: Omit<OfficialProduct, 'id' | 'createdAt'>): OfficialProduct {
  const products = getProducts();
  const newProduct: OfficialProduct = {
    ...product,
    id: `prod_${Date.now()}`,
    createdAt: new Date().toISOString()
  };
  products.unshift(newProduct);
  saveToStorage(STORAGE_KEYS.PRODUCTS, products);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<OfficialProduct>): OfficialProduct {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === id);
  if (idx === -1) throw new Error('Produto não encontrado');

  products[idx] = { ...products[idx], ...updates };
  saveToStorage(STORAGE_KEYS.PRODUCTS, products);
  return products[idx];
}

// ---------------- USER PRODUCTS ("MEUS PRODUTOS") ----------------
export function getUserProducts(userId?: string): UserProduct[] {
  const all = loadFromStorage<UserProduct[]>(STORAGE_KEYS.USER_PRODUCTS, INITIAL_USER_PRODUCTS);
  if (!userId) return all;
  return all.filter(p => p.currentOwnerId === userId);
}

// ---------------- RESALE LISTINGS ----------------
export function getResaleListings(): ResaleListing[] {
  return loadFromStorage<ResaleListing[]>(STORAGE_KEYS.RESALE_LISTINGS, INITIAL_RESALE_LISTINGS);
}

export function getResaleListingById(id: string): ResaleListing | undefined {
  return getResaleListings().find(l => l.id === id);
}

export function createResaleListing(
  userProductId: string, 
  sellerId: string, 
  listingPrice: number, 
  customDescription: string,
  minAcceptablePrice?: number
): ResaleListing {
  const userProducts = getUserProducts();
  const upIndex = userProducts.findIndex(p => p.id === userProductId && p.currentOwnerId === sellerId);
  if (upIndex === -1) {
    throw new Error('Produto não pertence ao utilizador ou não existe.');
  }

  const uProduct = userProducts[upIndex];
  if (uProduct.status === 'anunciado' || uProduct.status === 'vendido') {
    throw new Error('Este produto já está anunciado ou já foi vendido.');
  }

  const users = getUsers();
  const seller = users.find(u => u.id === sellerId);

  // Mark user product as announced
  uProduct.status = 'anunciado';
  saveToStorage(STORAGE_KEYS.USER_PRODUCTS, userProducts);

  const listings = getResaleListings();
  const newListing: ResaleListing = {
    id: `listing_${Date.now()}`,
    userProductId: uProduct.id,
    sellerId: seller?.id || sellerId,
    sellerName: seller?.name || 'Vendedor BABA',
    productName: uProduct.productName,
    category: uProduct.category,
    imageUrl: uProduct.productImage,
    originalPrice: uProduct.originalPrice,
    listingPrice,
    customDescription: customDescription || 'Produto verificado adquirido na BABA SHOPPING.',
    status: 'ativo',
    allowNegotiation: true,
    minAcceptablePrice: minAcceptablePrice || Math.round(listingPrice * 0.8),
    resaleCycle: uProduct.resaleCycle || 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  listings.unshift(newListing);
  saveToStorage(STORAGE_KEYS.RESALE_LISTINGS, listings);

  addNotification(
    sellerId,
    'Produto colocado à venda',
    `O teu produto "${uProduct.productName}" foi anunciado no Mercado de Revenda por ${listingPrice.toLocaleString('pt-AO')} Kz.`,
    'venda',
    'produto',
    newListing.id
  );

  return newListing;
}

export function cancelResaleListing(listingId: string, sellerId: string): void {
  const listings = getResaleListings();
  const lIdx = listings.findIndex(l => l.id === listingId && l.sellerId === sellerId);
  if (lIdx === -1) throw new Error('Anúncio não encontrado ou sem permissão.');

  const listing = listings[lIdx];
  if (listing.status === 'vendido') {
    throw new Error('Não é possível cancelar um produto já vendido.');
  }

  // Restore user product status to disponivel
  const userProducts = getUserProducts();
  const upIdx = userProducts.findIndex(p => p.id === listing.userProductId);
  if (upIdx !== -1) {
    userProducts[upIdx].status = 'disponivel';
    saveToStorage(STORAGE_KEYS.USER_PRODUCTS, userProducts);
  }

  listings.splice(lIdx, 1);
  saveToStorage(STORAGE_KEYS.RESALE_LISTINGS, listings);

  addNotification(
    sellerId,
    'Anúncio removido',
    `O anúncio de "${listing.productName}" foi retirado do mercado. O produto voltou a estar disponível na tua secção Meus Produtos.`,
    'venda'
  );
}

// ---------------- PRICE NEGOTIATION ----------------
export function getNegotiations(userId?: string): Negotiation[] {
  const all = loadFromStorage<Negotiation[]>(STORAGE_KEYS.NEGOTIATIONS, []);
  if (!userId) return all;
  return all.filter(n => n.buyerId === userId || n.sellerId === userId);
}

export function getNegotiationById(id: string): Negotiation | undefined {
  return loadFromStorage<Negotiation[]>(STORAGE_KEYS.NEGOTIATIONS, []).find(n => n.id === id);
}

export function startOrUpdateNegotiation(
  listingId: string, 
  buyerId: string, 
  proposedPrice: number, 
  initialMessage?: string
): Negotiation {
  const listings = getResaleListings();
  const listing = listings.find(l => l.id === listingId);
  if (!listing) throw new Error('Anúncio não encontrado');
  if (listing.status === 'vendido') throw new Error('Este produto já foi vendido');
  if (listing.sellerId === buyerId) throw new Error('Não podes negociar o teu próprio produto');

  const users = getUsers();
  const buyer = users.find(u => u.id === buyerId);
  const seller = users.find(u => u.id === listing.sellerId);
  if (!buyer || !seller) throw new Error('Utilizador inválido');

  const negotiations = loadFromStorage<Negotiation[]>(STORAGE_KEYS.NEGOTIATIONS, []);
  let negotiation = negotiations.find(n => n.listingId === listingId && n.buyerId === buyerId && n.status !== 'concluida' && n.status !== 'cancelada');

  const now = new Date().toISOString();
  const textMsg = initialMessage || `Olá ${seller.name}, proponho o valor de ${proposedPrice.toLocaleString('pt-AO')} Kz por este artigo. O que acha?`;

  if (negotiation) {
    negotiation.currentProposedPrice = proposedPrice;
    negotiation.lastOfferBy = 'buyer';
    negotiation.status = 'pendente';
    negotiation.updatedAt = now;
    negotiation.messages.push({
      id: `msg_${Date.now()}`,
      negotiationId: negotiation.id,
      senderId: buyer.id,
      senderName: buyer.name,
      text: textMsg,
      timestamp: now
    });
  } else {
    negotiation = {
      id: `neg_${Date.now()}`,
      listingId: listing.id,
      userProductId: listing.userProductId,
      productName: listing.productName,
      productImage: listing.imageUrl,
      sellerId: seller.id,
      sellerName: seller.name,
      buyerId: buyer.id,
      buyerName: buyer.name,
      listedPrice: listing.listingPrice,
      currentProposedPrice: proposedPrice,
      lastOfferBy: 'buyer',
      status: 'pendente',
      statusMessage: `Proposta de ${proposedPrice.toLocaleString('pt-AO')} Kz enviada pelo comprador`,
      createdAt: now,
      updatedAt: now,
      messages: [
        {
          id: `msg_${Date.now()}`,
          negotiationId: `neg_${Date.now()}`,
          senderId: buyer.id,
          senderName: buyer.name,
          text: textMsg,
          timestamp: now
        }
      ]
    };
    negotiations.unshift(negotiation);
  }

  saveToStorage(STORAGE_KEYS.NEGOTIATIONS, negotiations);

  // Notify seller
  addNotification(
    seller.id,
    'Nova proposta recebida!',
    `${buyer.name} ofereceu ${proposedPrice.toLocaleString('pt-AO')} Kz pelo teu artigo "${listing.productName}".`,
    'negociacao',
    'negociacao',
    negotiation.id
  );

  return negotiation;
}

export function sellerRespondNegotiation(
  negotiationId: string, 
  sellerId: string, 
  action: 'aceitar' | 'contraproposta' | 'recusar', 
  counterPrice?: number, 
  note?: string
): Negotiation {
  const negotiations = loadFromStorage<Negotiation[]>(STORAGE_KEYS.NEGOTIATIONS, []);
  const idx = negotiations.findIndex(n => n.id === negotiationId && n.sellerId === sellerId);
  if (idx === -1) throw new Error('Negociação não encontrada ou sem autorização');

  const neg = negotiations[idx];
  const now = new Date().toISOString();

  if (action === 'aceitar') {
    neg.status = 'aceite';
    neg.statusMessage = `Proposta de ${neg.currentProposedPrice.toLocaleString('pt-AO')} Kz ACEITE pelo vendedor. Comprador pode confirmar a compra agora!`;
    neg.updatedAt = now;
    neg.messages.push({
      id: `msg_${Date.now()}`,
      negotiationId: neg.id,
      senderId: sellerId,
      senderName: neg.sellerName,
      text: note || `Aceitei a tua proposta de ${neg.currentProposedPrice.toLocaleString('pt-AO')} Kz! Podes avançar com o pagamento quando desejares.`,
      timestamp: now
    });

    addNotification(
      neg.buyerId,
      'Proposta Aceite! 🎉',
      `${neg.sellerName} aceitou a tua proposta de ${neg.currentProposedPrice.toLocaleString('pt-AO')} Kz para "${neg.productName}". Clica para confirmar a tua compra.`,
      'negociacao',
      'negociacao',
      neg.id
    );
  } else if (action === 'contraproposta') {
    if (!counterPrice || counterPrice <= 0) throw new Error('Preço de contraproposta inválido');
    neg.status = 'contraproposta';
    neg.currentProposedPrice = counterPrice;
    neg.lastOfferBy = 'seller';
    neg.statusMessage = `Contraproposta de ${counterPrice.toLocaleString('pt-AO')} Kz enviada pelo vendedor`;
    neg.updatedAt = now;
    neg.messages.push({
      id: `msg_${Date.now()}`,
      negotiationId: neg.id,
      senderId: sellerId,
      senderName: neg.sellerName,
      text: note || `Não consigo fazer pelo valor anterior, mas proponho ${counterPrice.toLocaleString('pt-AO')} Kz. Que tal?`,
      timestamp: now
    });

    addNotification(
      neg.buyerId,
      'Nova contraproposta recebida',
      `${neg.sellerName} fez uma contraproposta de ${counterPrice.toLocaleString('pt-AO')} Kz para "${neg.productName}".`,
      'negociacao',
      'negociacao',
      neg.id
    );
  } else if (action === 'recusar') {
    neg.status = 'recusada';
    neg.statusMessage = 'Proposta recusada pelo vendedor';
    neg.updatedAt = now;
    neg.messages.push({
      id: `msg_${Date.now()}`,
      negotiationId: neg.id,
      senderId: sellerId,
      senderName: neg.sellerName,
      text: note || 'Agradeço o interesse, mas não posso aceitar esta proposta.',
      timestamp: now
    });

    addNotification(
      neg.buyerId,
      'Proposta não aceite',
      `${neg.sellerName} recusou a proposta para "${neg.productName}".`,
      'negociacao',
      'negociacao',
      neg.id
    );
  }

  saveToStorage(STORAGE_KEYS.NEGOTIATIONS, negotiations);
  return neg;
}

export function buyerRespondCounterOffer(
  negotiationId: string, 
  buyerId: string, 
  action: 'aceitar' | 'contraproposta' | 'recusar', 
  counterPrice?: number, 
  note?: string
): Negotiation {
  const negotiations = loadFromStorage<Negotiation[]>(STORAGE_KEYS.NEGOTIATIONS, []);
  const idx = negotiations.findIndex(n => n.id === negotiationId && n.buyerId === buyerId);
  if (idx === -1) throw new Error('Negociação não encontrada ou sem autorização');

  const neg = negotiations[idx];
  const now = new Date().toISOString();

  if (action === 'aceitar') {
    neg.status = 'aceite';
    neg.statusMessage = `Contraproposta de ${neg.currentProposedPrice.toLocaleString('pt-AO')} Kz ACEITE pelo comprador. Pronto para checkout!`;
    neg.updatedAt = now;
    neg.messages.push({
      id: `msg_${Date.now()}`,
      negotiationId: neg.id,
      senderId: buyerId,
      senderName: neg.buyerName,
      text: note || `Aceito a tua contraproposta de ${neg.currentProposedPrice.toLocaleString('pt-AO')} Kz! Vou concluir a compra.`,
      timestamp: now
    });

    addNotification(
      neg.sellerId,
      'Contraproposta aceite pelo comprador!',
      `${neg.buyerName} aceitou o valor de ${neg.currentProposedPrice.toLocaleString('pt-AO')} Kz por "${neg.productName}". Aguarda a finalização do pagamento.`,
      'negociacao',
      'negociacao',
      neg.id
    );
  } else if (action === 'contraproposta') {
    if (!counterPrice || counterPrice <= 0) throw new Error('Preço de contraproposta inválido');
    neg.status = 'pendente';
    neg.currentProposedPrice = counterPrice;
    neg.lastOfferBy = 'buyer';
    neg.statusMessage = `Nova proposta de ${counterPrice.toLocaleString('pt-AO')} Kz do comprador`;
    neg.updatedAt = now;
    neg.messages.push({
      id: `msg_${Date.now()}`,
      negotiationId: neg.id,
      senderId: buyerId,
      senderName: neg.buyerName,
      text: note || `Ainda é um pouco acima do que pretendia. Posso fechar por ${counterPrice.toLocaleString('pt-AO')} Kz?`,
      timestamp: now
    });

    addNotification(
      neg.sellerId,
      'Nova proposta na negociação',
      `${neg.buyerName} propôs ${counterPrice.toLocaleString('pt-AO')} Kz por "${neg.productName}".`,
      'negociacao',
      'negociacao',
      neg.id
    );
  } else if (action === 'recusar') {
    neg.status = 'recusada';
    neg.statusMessage = 'Negociação encerrada pelo comprador';
    neg.updatedAt = now;
    neg.messages.push({
      id: `msg_${Date.now()}`,
      negotiationId: neg.id,
      senderId: buyerId,
      senderName: neg.buyerName,
      text: note || 'Decidi não avançar neste momento. Obrigado pela atenção.',
      timestamp: now
    });
  }

  saveToStorage(STORAGE_KEYS.NEGOTIATIONS, negotiations);
  return neg;
}

export function sendNegotiationMessage(
  negotiationId: string, 
  senderId: string, 
  senderName: string, 
  text: string
): NegotiationMessage {
  const negotiations = loadFromStorage<Negotiation[]>(STORAGE_KEYS.NEGOTIATIONS, []);
  const neg = negotiations.find(n => n.id === negotiationId);
  if (!neg) throw new Error('Negociação não encontrada');
  if (neg.buyerId !== senderId && neg.sellerId !== senderId) {
    throw new Error('Não tens autorização para enviar mensagens nesta negociação');
  }

  const now = new Date().toISOString();
  const newMsg: NegotiationMessage = {
    id: `msg_${Date.now()}`,
    negotiationId,
    senderId,
    senderName,
    text,
    timestamp: now
  };

  neg.messages.push(newMsg);
  neg.updatedAt = now;
  saveToStorage(STORAGE_KEYS.NEGOTIATIONS, negotiations);

  const recipientId = senderId === neg.buyerId ? neg.sellerId : neg.buyerId;
  addNotification(
    recipientId,
    `Nova mensagem de ${senderName}`,
    `Sobre "${neg.productName}": "${text.length > 50 ? text.substring(0, 50) + '...' : text}"`,
    'negociacao',
    'negociacao',
    neg.id
  );

  return newMsg;
}

// ---------------- WALLET & FINANCIAL ENGINE ----------------
export function getWallets(): Record<string, Wallet> {
  return loadFromStorage<Record<string, Wallet>>(STORAGE_KEYS.WALLETS, INITIAL_WALLETS);
}

export function getUserWallet(userId: string): Wallet {
  const wallets = getWallets();
  if (!wallets[userId]) {
    wallets[userId] = {
      userId,
      availableBalance: 0,
      pendingBalance: 0,
      reservedBalance: 0,
      totalDeposited: 0,
      totalSpent: 0,
      totalEarned: 0,
      totalWithdrawn: 0
    };
    saveToStorage(STORAGE_KEYS.WALLETS, wallets);
  }
  return wallets[userId];
}

export function getTransactions(userId?: string): Transaction[] {
  const all = loadFromStorage<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  if (!userId) return all;
  return all.filter(t => t.userId === userId);
}

// Request deposit (via Multicaixa Express or Reference)
export function requestWalletDeposit(
  userId: string, 
  amount: number, 
  method: 'multicaixa_express' | 'referencia' | 'transferencia_bancaria', 
  phoneOrRef: string,
  autoApproveForDemo: boolean = false
): DepositRequest {
  if (amount <= 0) throw new Error('O valor de carregamento deve ser superior a zero.');
  const user = getUsers().find(u => u.id === userId);
  if (!user) throw new Error('Utilizador não encontrado');

  const deposits = loadFromStorage<DepositRequest[]>(STORAGE_KEYS.DEPOSITS, []);
  const newDeposit: DepositRequest = {
    id: `dep_${Date.now()}`,
    userId,
    userName: user.name,
    amount,
    method,
    phoneOrRef,
    status: autoApproveForDemo ? 'aprovado' : 'pendente',
    createdAt: new Date().toISOString(),
    approvedAt: autoApproveForDemo ? new Date().toISOString() : undefined
  };

  deposits.unshift(newDeposit);
  saveToStorage(STORAGE_KEYS.DEPOSITS, deposits);

  if (autoApproveForDemo) {
    // Credit immediately
    const wallets = getWallets();
    const wallet = getUserWallet(userId);
    wallet.availableBalance += amount;
    wallet.totalDeposited += amount;
    wallets[userId] = wallet;
    saveToStorage(STORAGE_KEYS.WALLETS, wallets);

    // Record transaction
    const transactions = getTransactions();
    transactions.unshift({
      id: `tx_${Date.now()}`,
      userId,
      userName: user.name,
      type: 'carregamento',
      amount,
      status: 'confirmada',
      reference: phoneOrRef || `MCX-${Date.now()}`,
      description: `Carregamento via ${method === 'multicaixa_express' ? 'Multicaixa Express' : 'Referência Bancária'}`,
      paymentMethod: method,
      createdAt: new Date().toISOString()
    });
    saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);

    addNotification(
      userId,
      'Carregamento Concluído!',
      `O teu saldo foi creditado com +${amount.toLocaleString('pt-AO')} Kz. Saldo atual: ${wallet.availableBalance.toLocaleString('pt-AO')} Kz.`,
      'carteira'
    );
  } else {
    addNotification(
      userId,
      'Carregamento Solicitado',
      `O teu pedido de carregamento de ${amount.toLocaleString('pt-AO')} Kz está em validação. Será creditado assim que o pagamento for confirmado.`,
      'carteira'
    );
  }

  return newDeposit;
}

export function approveDeposit(depositId: string): void {
  const deposits = loadFromStorage<DepositRequest[]>(STORAGE_KEYS.DEPOSITS, []);
  const dep = deposits.find(d => d.id === depositId);
  if (!dep) throw new Error('Pedido de carregamento não encontrado');
  if (dep.status === 'aprovado') throw new Error('Este carregamento já foi aprovado');

  dep.status = 'aprovado';
  dep.approvedAt = new Date().toISOString();
  saveToStorage(STORAGE_KEYS.DEPOSITS, deposits);

  const wallets = getWallets();
  const wallet = getUserWallet(dep.userId);
  wallet.availableBalance += dep.amount;
  wallet.totalDeposited += dep.amount;
  wallets[dep.userId] = wallet;
  saveToStorage(STORAGE_KEYS.WALLETS, wallets);

  const transactions = getTransactions();
  transactions.unshift({
    id: `tx_${Date.now()}`,
    userId: dep.userId,
    userName: dep.userName,
    type: 'carregamento',
    amount: dep.amount,
    status: 'confirmada',
    reference: dep.phoneOrRef || `DEP-VAL-${Date.now()}`,
    description: `Carregamento aprovado pela administração (${dep.method})`,
    createdAt: new Date().toISOString()
  });
  saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);

  addNotification(
    dep.userId,
    'Carregamento Aprovado e Creditado',
    `O teu carregamento de ${dep.amount.toLocaleString('pt-AO')} Kz foi aprovado com sucesso e já está disponível na tua carteira.`,
    'carteira'
  );
}

// Request withdrawal (with immediate reservation to prevent double spend)
export function requestWithdrawal(
  userId: string, 
  amount: number, 
  bankName: string, 
  iban: string, 
  accountHolder: string
): WithdrawalRequest {
  if (amount <= 0) throw new Error('O valor de levantamento deve ser maior que zero.');
  const wallet = getUserWallet(userId);
  if (wallet.availableBalance < amount) {
    throw new Error(`Saldo insuficiente. Saldo disponível: ${wallet.availableBalance.toLocaleString('pt-AO')} Kz.`);
  }

  const user = getUsers().find(u => u.id === userId);
  if (!user) throw new Error('Utilizador não encontrado');

  // Atomic reservation
  const wallets = getWallets();
  wallet.availableBalance -= amount;
  wallet.reservedBalance += amount;
  wallets[userId] = wallet;
  saveToStorage(STORAGE_KEYS.WALLETS, wallets);

  const withdrawals = loadFromStorage<WithdrawalRequest[]>(STORAGE_KEYS.WITHDRAWALS, []);
  const newWithdrawal: WithdrawalRequest = {
    id: `wth_${Date.now()}`,
    userId,
    userName: user.name,
    amount,
    bankName,
    iban,
    accountHolder,
    status: 'solicitado',
    createdAt: new Date().toISOString()
  };
  withdrawals.unshift(newWithdrawal);
  saveToStorage(STORAGE_KEYS.WITHDRAWALS, withdrawals);

  const transactions = getTransactions();
  transactions.unshift({
    id: `tx_${Date.now()}`,
    userId,
    userName: user.name,
    type: 'levantamento',
    amount: amount,
    status: 'pendente',
    reference: `LEV-${Date.now()}`,
    description: `Pedido de levantamento para IBAN ${iban} (${bankName})`,
    createdAt: new Date().toISOString()
  });
  saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);

  addNotification(
    userId,
    'Levantamento Solicitado',
    `O pedido de levantamento de ${amount.toLocaleString('pt-AO')} Kz para o IBAN ${iban} foi submetido. O valor fica reservado até à transferência bancária.`,
    'carteira'
  );

  return newWithdrawal;
}

export function processWithdrawal(withdrawalId: string, action: 'aprovar' | 'recusar'): void {
  const withdrawals = loadFromStorage<WithdrawalRequest[]>(STORAGE_KEYS.WITHDRAWALS, []);
  const wth = withdrawals.find(w => w.id === withdrawalId);
  if (!wth) throw new Error('Pedido de levantamento não encontrado');
  if (wth.status === 'pago' || wth.status === 'recusado') {
    throw new Error('Este pedido já foi finalizado');
  }

  const wallets = getWallets();
  const wallet = getUserWallet(wth.userId);

  if (action === 'aprovar') {
    wth.status = 'pago';
    wth.processedAt = new Date().toISOString();
    // Complete deduction
    wallet.reservedBalance -= wth.amount;
    wallet.totalWithdrawn += wth.amount;
    wallets[wth.userId] = wallet;
    saveToStorage(STORAGE_KEYS.WALLETS, wallets);

    addNotification(
      wth.userId,
      'Levantamento Pago!',
      `O valor de ${wth.amount.toLocaleString('pt-AO')} Kz foi transferido com sucesso para a tua conta bancária (${wth.bankName}).`,
      'carteira'
    );
  } else {
    wth.status = 'recusado';
    wth.processedAt = new Date().toISOString();
    // Return reserved balance back to available
    wallet.reservedBalance -= wth.amount;
    wallet.availableBalance += wth.amount;
    wallets[wth.userId] = wallet;
    saveToStorage(STORAGE_KEYS.WALLETS, wallets);

    addNotification(
      wth.userId,
      'Levantamento Não Autorizado',
      `O teu pedido de levantamento de ${wth.amount.toLocaleString('pt-AO')} Kz foi recusado e o saldo foi restaurado para a tua carteira disponível.`,
      'carteira'
    );
  }

  saveToStorage(STORAGE_KEYS.WITHDRAWALS, withdrawals);
}

// ---------------- OFFICIAL PRODUCT PURCHASE ----------------
export function buyOfficialProduct(
  buyerId: string, 
  productId: string, 
  quantity: number = 1,
  deliveryAddress?: {
    province?: string;
    city?: string;
    street?: string;
    recipientName?: string;
    recipientPhone?: string;
  }
): { order: Order; userProducts: UserProduct[] } {
  const products = getProducts();
  const prodIndex = products.findIndex(p => p.id === productId);
  if (prodIndex === -1) throw new Error('Produto oficial não encontrado');
  const product = products[prodIndex];

  if (product.stock < quantity) {
    throw new Error(`Stock insuficiente. Restam apenas ${product.stock} unidades disponíveis.`);
  }

  const totalAmount = product.officialPrice * quantity;
  const buyerWallet = getUserWallet(buyerId);
  const user = getUsers().find(u => u.id === buyerId);
  if (!user) throw new Error('Comprador não encontrado');

  // Verify wallet balance
  if (buyerWallet.availableBalance < totalAmount) {
    throw new Error(`Saldo insuficiente na carteira. Necessário: ${totalAmount.toLocaleString('pt-AO')} Kz. Tens disponível: ${buyerWallet.availableBalance.toLocaleString('pt-AO')} Kz. Carrega a tua carteira para continuar.`);
  }

  // ATOMIC DEDUCTION
  const wallets = getWallets();
  buyerWallet.availableBalance -= totalAmount;
  buyerWallet.totalSpent += totalAmount;
  wallets[buyerId] = buyerWallet;
  saveToStorage(STORAGE_KEYS.WALLETS, wallets);

  // DECREMENT STOCK
  product.stock -= quantity;
  if (product.stock === 0) product.status = 'esgotado';
  products[prodIndex] = product;
  saveToStorage(STORAGE_KEYS.PRODUCTS, products);

  // RECORD TRANSACTION
  const orderId = `ENC-OFIC-${Date.now()}`;
  const transactions = getTransactions();
  transactions.unshift({
    id: `tx_${Date.now()}`,
    userId: buyerId,
    userName: user.name,
    type: 'compra_oficial',
    amount: totalAmount,
    status: 'confirmada',
    reference: orderId,
    description: `Compra oficial de ${quantity}x ${product.name}`,
    createdAt: new Date().toISOString()
  });
  saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);

  // CREATE ORDER
  const orders = loadFromStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
  const newOrder: Order = {
    id: orderId,
    buyerId,
    buyerName: user.name,
    items: [
      {
        id: `item_${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.officialPrice,
        quantity,
        imageUrl: product.imageUrl,
        source: 'oficial'
      }
    ],
    subtotal: totalAmount,
    shippingFee: 0,
    totalAmount,
    deliveryAddress,
    paymentMethod: 'carteira',
    paymentReference: `PAG-BS-${Date.now()}`,
    status: 'pagamento_confirmado',
    source: 'oficial',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  orders.unshift(newOrder);
  saveToStorage(STORAGE_KEYS.ORDERS, orders);

  // AUTOMATICALLY ADD TO "MEUS PRODUTOS"
  const userProducts = getUserProducts();
  const createdInstances: UserProduct[] = [];

  for (let i = 0; i < quantity; i++) {
    const newInstance: UserProduct = {
      id: `uprod_${Date.now()}_${i}`,
      originalProductId: product.id,
      productName: product.name,
      productImage: product.imageUrl,
      category: product.category,
      originalPrice: product.officialPrice,
      purchasePrice: product.officialPrice,
      resaleCycle: 1,
      currentOwnerId: buyerId,
      purchaseDate: new Date().toISOString(),
      status: 'disponivel',
      type: product.type,
      condition: 'novo',
      serialNumber: `BS-${product.brand.substring(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`
    };
    userProducts.unshift(newInstance);
    createdInstances.push(newInstance);
  }
  saveToStorage(STORAGE_KEYS.USER_PRODUCTS, userProducts);

  addNotification(
    buyerId,
    'Compra Concluída com Sucesso! 🛍️',
    `Compraste ${quantity}x "${product.name}" por ${totalAmount.toLocaleString('pt-AO')} Kz. O artigo foi creditado em "Meus Produtos" pronto para ser colocado à venda por um preço superior no Mercado de Revenda para obteres lucro!`,
    'compra',
    'produto'
  );

  return { order: newOrder, userProducts: createdInstances };
}

// ---------------- RESALE PRODUCT PURCHASE (PEER-TO-PEER WITH COMMISSION) ----------------
export function buyResaleProduct(
  listingId: string, 
  buyerId: string, 
  agreedPrice?: number,
  deliveryAddress?: {
    province: string;
    city: string;
    street: string;
    recipientName: string;
    recipientPhone: string;
  }
): Order {
  const listings = getResaleListings();
  const listingIndex = listings.findIndex(l => l.id === listingId);
  if (listingIndex === -1) throw new Error('Anúncio de revenda não encontrado');
  const listing = listings[listingIndex];

  if (listing.status === 'vendido') {
    throw new Error('Este artigo já foi vendido a outro utilizador.');
  }
  if (listing.sellerId === buyerId) {
    throw new Error('Não podes comprar o teu próprio produto.');
  }

  const finalPrice = agreedPrice && agreedPrice > 0 ? agreedPrice : listing.listingPrice;
  const buyerWallet = getUserWallet(buyerId);
  const users = getUsers();
  const buyer = users.find(u => u.id === buyerId);
  const seller = users.find(u => u.id === listing.sellerId);
  if (!buyer || !seller) throw new Error('Utilizadores da transação inválidos');

  // Verify buyer has enough balance
  if (buyerWallet.availableBalance < finalPrice) {
    throw new Error(`Saldo insuficiente na carteira. Valor a pagar: ${finalPrice.toLocaleString('pt-AO')} Kz. Saldo disponível: ${buyerWallet.availableBalance.toLocaleString('pt-AO')} Kz.`);
  }

  // PLATFORM FEE CALCULATION: 5% transparent fee
  const platformFeeRate = 0.05;
  const feeAmount = Math.round(finalPrice * platformFeeRate);
  const netSellerAmount = finalPrice - feeAmount;

  // ATOMIC WALLET MOVEMENTS
  const wallets = getWallets();

  // 1. Debit buyer
  buyerWallet.availableBalance -= finalPrice;
  buyerWallet.totalSpent += finalPrice;
  wallets[buyerId] = buyerWallet;

  // 2. Credit seller (net amount after fee)
  const sellerWallet = getUserWallet(seller.id);
  sellerWallet.availableBalance += netSellerAmount;
  sellerWallet.totalEarned += netSellerAmount;
  wallets[seller.id] = sellerWallet;

  // 3. Platform treasury gets commission
  const adminWallet = getUserWallet('usr_admin');
  adminWallet.availableBalance += feeAmount;
  adminWallet.totalEarned += feeAmount;
  wallets['usr_admin'] = adminWallet;

  saveToStorage(STORAGE_KEYS.WALLETS, wallets);

  // TRANSFER OWNERSHIP OF USER PRODUCT
  const userProducts = getUserProducts();
  const upIndex = userProducts.findIndex(p => p.id === listing.userProductId);
  const nextCycle = (listing.resaleCycle || (upIndex !== -1 ? userProducts[upIndex].resaleCycle : 1) || 1) + 1;

  if (upIndex !== -1) {
    // Seller's copy is marked as vendido
    userProducts[upIndex].status = 'vendido';

    // Create new ownership instance for the buyer
    const buyerItem: UserProduct = {
      id: `uprod_${Date.now()}_transferred`,
      originalProductId: userProducts[upIndex].originalProductId,
      productName: listing.productName,
      productImage: listing.imageUrl,
      category: listing.category,
      originalPrice: userProducts[upIndex].originalPrice, // original baseline
      purchasePrice: finalPrice, // what buyer paid in this cycle
      resaleCycle: nextCycle, // continuous resale cycle!
      previousOwnerName: seller.name,
      currentOwnerId: buyerId,
      purchaseDate: new Date().toISOString(),
      status: 'disponivel', // ready for buyer to resell for higher price!
      type: userProducts[upIndex].type,
      condition: 'bom_estado',
      serialNumber: userProducts[upIndex].serialNumber
    };
    userProducts.unshift(buyerItem);
    saveToStorage(STORAGE_KEYS.USER_PRODUCTS, userProducts);
  }

  // MARK LISTING AS SOLD
  listing.status = 'vendido';
  listing.updatedAt = new Date().toISOString();
  listings[listingIndex] = listing;
  saveToStorage(STORAGE_KEYS.RESALE_LISTINGS, listings);

  // UPDATE ANY ASSOCIATED NEGOTIATIONS TO 'concluida'
  const negotiations = loadFromStorage<Negotiation[]>(STORAGE_KEYS.NEGOTIATIONS, []);
  negotiations.forEach(n => {
    if (n.listingId === listing.id) {
      if (n.buyerId === buyerId) {
        n.status = 'concluida';
        n.statusMessage = 'Venda concluída com sucesso!';
      } else {
        n.status = 'cancelada';
        n.statusMessage = 'Produto vendido a outro comprador.';
      }
    }
  });
  saveToStorage(STORAGE_KEYS.NEGOTIATIONS, negotiations);

  // RECORD TRANSACTIONS
  const orderId = `ENC-REV-${Date.now()}`;
  const transactions = getTransactions();

  // Buyer transaction
  transactions.unshift({
    id: `tx_${Date.now()}_buy`,
    userId: buyerId,
    userName: buyer.name,
    type: 'compra_revenda',
    amount: finalPrice,
    status: 'confirmada',
    reference: orderId,
    description: `Compra no Mercado de Revenda: ${listing.productName} (Vendedor: ${seller.name})`,
    createdAt: new Date().toISOString()
  });

  // Seller transaction
  transactions.unshift({
    id: `tx_${Date.now()}_sell`,
    userId: seller.id,
    userName: seller.name,
    type: 'venda_recebida',
    amount: finalPrice,
    feeAmount: feeAmount,
    netAmount: netSellerAmount,
    status: 'confirmada',
    reference: orderId,
    description: `Venda concluída de ${listing.productName}. Valor bruto: ${finalPrice.toLocaleString('pt-AO')} Kz | Taxa (5%): ${feeAmount.toLocaleString('pt-AO')} Kz | Líquido creditado: ${netSellerAmount.toLocaleString('pt-AO')} Kz`,
    createdAt: new Date().toISOString()
  });

  // Platform commission audit log
  transactions.unshift({
    id: `tx_${Date.now()}_fee`,
    userId: 'usr_admin',
    userName: 'BABA SHOPPING Plataforma',
    type: 'taxa_plataforma',
    amount: feeAmount,
    status: 'confirmada',
    reference: orderId,
    description: `Comissão de intermediação (5%) sobre a venda ${orderId}`,
    createdAt: new Date().toISOString()
  });

  saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);

  // CREATE ORDER
  const orders = loadFromStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
  const newOrder: Order = {
    id: orderId,
    buyerId,
    buyerName: buyer.name,
    sellerId: seller.id,
    sellerName: seller.name,
    items: [
      {
        id: `item_${Date.now()}`,
        productId: listing.id,
        name: listing.productName,
        price: finalPrice,
        quantity: 1,
        imageUrl: listing.imageUrl,
        source: 'revenda',
        userProductId: listing.userProductId,
        sellerId: seller.id
      }
    ],
    subtotal: finalPrice,
    shippingFee: 0,
    totalAmount: finalPrice,
    deliveryAddress: deliveryAddress || {
      province: buyer.province || 'Luanda',
      city: buyer.city || 'Luanda Centro',
      street: 'Inventário Digital da Plataforma',
      recipientName: buyer.name,
      recipientPhone: buyer.phone
    },
    paymentMethod: 'carteira',
    paymentReference: `REV-PAY-${Date.now()}`,
    status: 'pagamento_confirmado',
    source: 'revenda',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  orders.unshift(newOrder);
  saveToStorage(STORAGE_KEYS.ORDERS, orders);

  // NOTIFY BOTH USERS
  addNotification(
    buyerId,
    'Compra de Revenda Concluída! 🚀',
    `Compraste com sucesso "${listing.productName}" por ${finalPrice.toLocaleString('pt-AO')} Kz (Ciclo ${nextCycle}). O produto agora é teu em "Meus Produtos" pronto para ser colocado à venda novamente por um preço superior para obteres lucro!`,
    'compra',
    'produto'
  );

  addNotification(
    seller.id,
    'Artigo Vendido! Dinheiro Creditado 💰',
    `Parabéns! O teu produto "${listing.productName}" foi vendido a ${buyer.name} por ${finalPrice.toLocaleString('pt-AO')} Kz. Recebeste ${netSellerAmount.toLocaleString('pt-AO')} Kz líquidos diretamente na tua carteira digital!`,
    'venda',
    'carteira'
  );

  return newOrder;
}

// ---------------- ORDERS & DELIVERIES ----------------
export function getOrders(userId?: string): Order[] {
  const all = loadFromStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
  if (!userId) return all;
  return all.filter(o => o.buyerId === userId || o.sellerId === userId);
}

export function updateOrderStatus(orderId: string, newStatus: Order['status']): Order {
  const orders = loadFromStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx === -1) throw new Error('Encomenda não encontrada');

  orders[idx].status = newStatus;
  orders[idx].updatedAt = new Date().toISOString();
  saveToStorage(STORAGE_KEYS.ORDERS, orders);

  addNotification(
    orders[idx].buyerId,
    `Atualização da Encomenda #${orderId}`,
    `O estado da tua encomenda passou para: ${formatOrderStatus(newStatus)}.`,
    'encomenda',
    'encomenda',
    orderId
  );

  return orders[idx];
}

export function formatOrderStatus(status: Order['status']): string {
  switch (status) {
    case 'aguardando_pagamento': return 'Aguardando Pagamento';
    case 'pagamento_confirmado': return 'Pagamento Confirmado';
    case 'em_preparacao': return 'Em Preparação';
    case 'enviado': return 'Enviado';
    case 'em_entrega': return 'Em Rota de Entrega';
    case 'entregue': return 'Entregue com Sucesso';
    case 'cancelado': return 'Cancelado';
    default: return status;
  }
}

// ---------------- NOTIFICATIONS ----------------
export function getNotifications(userId: string): AppNotification[] {
  const all = loadFromStorage<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  return all.filter(n => n.recipientId === userId);
}

export function addNotification(
  recipientId: string, 
  title: string, 
  message: string, 
  type: AppNotification['type'],
  linkType?: AppNotification['linkType'],
  linkId?: string
): AppNotification {
  const all = loadFromStorage<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  const newNotif: AppNotification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    recipientId,
    title,
    message,
    type,
    read: false,
    linkType,
    linkId,
    createdAt: new Date().toISOString()
  };
  all.unshift(newNotif);
  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, all);
  return newNotif;
}

export function markNotificationAsRead(notificationId: string): void {
  const all = loadFromStorage<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  const n = all.find(item => item.id === notificationId);
  if (n) {
    n.read = true;
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, all);
  }
}

export function markAllNotificationsAsRead(userId: string): void {
  const all = loadFromStorage<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  all.forEach(n => {
    if (n.recipientId === userId) n.read = true;
  });
  saveToStorage(STORAGE_KEYS.NOTIFICATIONS, all);
}

// ---------------- ADMIN DEPOSIT & WITHDRAWAL QUERIES ----------------
export function getPendingDeposits(): DepositRequest[] {
  return loadFromStorage<DepositRequest[]>(STORAGE_KEYS.DEPOSITS, []);
}

export function getPendingWithdrawals(): WithdrawalRequest[] {
  return loadFromStorage<WithdrawalRequest[]>(STORAGE_KEYS.WITHDRAWALS, []);
}

// Format currency in Angolan Kwanza
export function formatKz(amount: number): string {
  return `${amount.toLocaleString('pt-AO')} Kz`;
}
