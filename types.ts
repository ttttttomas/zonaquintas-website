export type Quintas = {
  id: string;
  title: string;
  address: string;
  latitude: number; // FLOAT
  longitude: number; // FLOAT
  city: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  ambients: number;
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
  secador: boolean; // Secador de pelo
  // Artículos de limpieza general
  lavarropas: boolean;
  cambio_de_toallas: boolean;

  // ── Características adicionales ──
  // Cocina
  utensilios_cocina: boolean;
  vajilla: boolean;
  freezer: boolean;
  // Entretenimiento
  televisor: boolean;
  radio: boolean;
  tv: boolean;
  cable: boolean;
  wifi: boolean; // Internet
  jacuzzi: boolean;
  playroom: boolean;
  sofas: boolean;
  // Estacionamiento
  estacionamiento: boolean;
  estacionamiento_techado: boolean;

  // ── Otras características ──
  parrilla: boolean;
  estufa_a_gas: boolean;
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

  // ── Otros ──
  a_a: boolean; // Aire acondicionado
  botiquin: boolean;
  cocina: boolean;
  cubiertos: boolean;
  heladera: boolean;
  juegos_infantiles: boolean;
  ropa_de_camara: boolean;
  visits: boolean;
};

export type Users = {
  id: string;
  name: string;
  phone: string;
  date_of_birth: Date;
  address: string;
  description: string;
  languages: string[]; // TABLA INTERMEDIA
  owner_time: string;
  owner_location: string;
  opinions: string[]; // TABLA INTERMEDIA
  average_opinions: number; // PROMEDIO DE OPINION; FLOAT
  picture: string; // FOTO DE PERFIL DEL WACHO
  created_at: string;
  role: "ADMIN" | "USER"; // STRING
  email: string;
};

export type Search = {
  place: string | null;
  dates: Date[];
  guests: number | null;
};
