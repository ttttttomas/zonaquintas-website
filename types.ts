export type Quintas = {
  id: string;
  title: string;
  address: string;
  latitude: number; // FLOAT
  length: number; // FLOAT
  city: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  environments: number;
  status: 'active' | 'pending' | 'rejected' | 'cancelled';
  beds: number;
  price: number;
  images: string[]; // TABLA INTERMEDIA
  main_image: string;
  description: string;
  owner_id: string; // DEBERIA SER EL ID DEL USUARIO QUE CREO LA QUINTA
  currency_price: "ARS" | "USD"; // STRING
  created_at: string;
  // ── Características básicas ──
  // Habitaciones
  sabanas: boolean;
  mantas: boolean;
  almohadas: boolean;
  // Artículos de limpieza personal
  toilettes: boolean;
  shampoo: boolean;
  toallas: boolean;
  secador_pelo: boolean; // Secador de pelo
  // Artículos de limpieza general
  lavarropas: boolean;
  cambio_toallas: boolean;

  // ── Características adicionales ──
  // Cocina
  utensillos_cocina: boolean;
  vajilla: boolean;
  freezer: boolean;
  // Entretenimiento
  televisor: boolean;
  radio: boolean;
  tv: boolean;
  cable: boolean;
  internet: boolean; // Internet
  jacuzzi: boolean;
  playroom: boolean;
  sofas: boolean;
  // Estacionamiento
  estacionamiento_techado: boolean;

  // ── Otras características ──
  parrilla: boolean;
  estufa_gas: boolean;
  hogar: boolean;
  hamacas_paraguayas: boolean;
  arboleda: boolean; // Arboleda con buena sombra
  cancha_futbol: boolean;
  piscina: boolean;
  cancha_basquet: boolean;
  cancha_tenis: boolean;
  cancha_padel: boolean;
  hamacas: boolean;
  parlantes: boolean;


};

export type Users = {
  id: string;
  name: string;
  phone: string;
  date_of_birth: Date;
  address: string;
  description: string;
  owner_time: string;
  owner_location: string;
  created_at: string;
  average_opinions: number; // PROMEDIO DE OPINION; FLOAT
  role: "admin" | "user";
  email: string;
  password: string;
  languages: string[]; // TABLA INTERMEDIA
  opinions: string[]; // TABLA INTERMEDIA
  picture: string[]; // FOTO DE PERFIL DEL WACHO
};

export type Search = {
  place: string | null;
  dates: Date[];
  guests: number | null;
};

export type Booking = {
  id?: string;
  payment_id?: string;
  quinta_id: string;
  guest_id: string;
  owner_id: string;
  check_in: string;
  check_out: string;
  guest_count: number;
  message: string;
  currency_price: "ARS" | "USD";
  amount: number;
  payment_type: "deposit" | "balance";
  status: "pending" | "finished" | "rejected" | "cancelled" | "accepted" | "paid";
  payment_expire?: string;
  created_at?: string;
  updated_at?: string | null;
  quinta_title?: string;
  quinta_main_image?: string;
  quinta_address?: string;
  guest_email?: string;
  guest_phone?: string;
  guest_name?: string;
}

export type BookingPayments = {
  payment_id?: string;
  booking_id: string;
  payment_type: "deposit" | "balance";
  amount: number;
  currency: "ARS" | "USD";
  status: "pending" | "finished" | "rejected" | "cancelled" | "accepted" | "paid";
  rebill_payment_link_id: string;
  rebill_payment_link_url: string;
  rebill_transaction_id: string;
  payment_expire?: string;
  created_at?: string;
  updated_at?: string;
  paid_at?: string;
}

export type Favorite = {
  favorite_id?: string;
  user_id: string;
  quinta_id: string;
  created_at?: string;
}

export type Review = {
  review_id?: string;
  booking_id: string;
  stars: number;
  review_text: string;
  created_at?: string;
}

export interface PaymentLink {
  id: string;
  organizationId: string;
  url: string;
  status: "active" | "inactive" | "expired";
  description: string | null;
  metadata: Record<string, unknown> | null;
  expirationDate: string | null; // ISO date
  redirectUrls: RedirectUrls;
  prefilledFields: Record<string, unknown> | null;
  showCoupon: boolean;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  isSingleUse: boolean;

  paymentMethods: PaymentMethod[];
  installmentsSettings: InstallmentsSettings[];
  prices: Price[];

  type: "instant" | "subscription";
}

export interface CreatePaymentLinkRequest {
  title: Title[];

  paymentMethods: PaymentMethod[];

  prices?: PriceInput[]; // 👈 opcional porque en suscripciones no se usa
  plans?: string[]; // 👈 para suscripciones

  installmentsSettings?: InstallmentsSettings[];

  isSingleUse?: boolean;

  redirectUrls?: RedirectUrls;

  description?: string;
  metadata?: Record<string, unknown>;
  expirationDate?: string; // ISO date
  prefilledFields?: Record<string, unknown>;
  showCoupon?: boolean;
}

export interface PaymentMethod {
  methods: ("card" | "bank_transfer" | string)[];
  currency: string;
}

export interface PriceInput {
  amount: number;
  currency: string;
  isDefault?: boolean;
}

export interface InstallmentsSettings {
  currency: string;
  enabledInstallments: number[];
}

export interface RedirectUrls {
  approved: string;
  rejected?: string;
  pending?: string;
}

export interface Title {
  text: string;
  language: string;
}

export interface Price {
  id: string;
  amount: number;
  currency: string;
  isPriceFixed: boolean | null;
  isDefault: boolean;
}

export interface Balance {
  ARS: number;
  USD: number;
}

export interface Balances {
  retenido: Balance;
  disponible: Balance;
  entregado: Balance;
}

export type Currency = "ARS" | "USD";

export type Status = "RETENIDO" | 'ENTREGADO' | 'DISPONIBLE';

export interface Transaction {
  id: string;
  date: string;       // Podrías usar Date si parseas la fecha
  quinta_name: string;
  amount: number;
  currency: Currency;
  status: Status;
  description: string;
}

export interface Wallet {
  balances: Balances;
  next_transfer: null | string;  // Si puede ser fecha o undefined, adaptar
  recent_transactions: Transaction[];
}