export type Quintas ={
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
    currency_price: 'ARS' | 'USD'; // STRING
    created_at: string;
    a_a: boolean;
    botiquin: boolean;
    cable: boolean;
    cocina: boolean;
    cubiertos: boolean;
    estacionamiento: boolean;
    estufa_hogar: boolean;
    heladera: boolean;
    jacuzzi: boolean;
    juegos_infantiles: boolean;
    lavarropas: boolean;
    mantas: boolean;
    parrilla: boolean;
    piscina: boolean;
    playroom: boolean;
    ropa_de_camara: boolean;
    sabanas: boolean;
    secador: boolean;
    toallas: boolean;
    tv: boolean;
    wifi: boolean;
    visits: boolean;
    vajilla: boolean;
}

export type Users ={
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
    role: 'ADMIN' | 'USER'; // STRING
    email: string;
}

export type Search ={
    place: string | null;
    dates: Date[];
    guests: number | null;
}