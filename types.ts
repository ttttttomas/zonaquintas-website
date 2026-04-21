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
