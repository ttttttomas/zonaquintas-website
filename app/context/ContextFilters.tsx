"use client";
import { Quintas } from "@/types";
import { createContext, useContext, useState } from "react";

export const ContextFilters = createContext<any>(null);

interface Filters {
  bedrooms: number;
  bathrooms: number;
  amb: number;
  beds: number;
  currency_price: "TODAS" | "ARS" | "USD";
  dates: string | null;
  guests: number | null;
  place: string | null;
  priceRange: [number, number];
  // Filtros booleanos
  a_a: boolean | null;
  botiquin: boolean | null;
  cable: boolean | null;
  cocina: boolean | null;
  cubiertos: boolean | null;
  estacionamiento: boolean | null;
  estufa_hogar: boolean | null;
  heladera: boolean | null;
  jacuzzi: boolean | null;
  juegos_infantiles: boolean | null;
  lavarropas: boolean | null;
  mantas: boolean | null;
  parrilla: boolean | null;
  piscina: boolean | null;
  playroom: boolean | null;
  ropa_de_camara: boolean | null;
  sabanas: boolean | null;
  secador: boolean | null;
  toallas: boolean | null;
  tv: boolean | null;
  wifi: boolean | null;
  vajilla: boolean | null;
}

export const FiltersProvider = ({ children }: any) => {
  const [filters, setFilters] = useState<Filters>({
    bedrooms: 2,
    bathrooms: 1,
    amb: 1,
    beds: 1,
    currency_price: "TODAS",
    priceRange: [50000, 5000000],
    dates: null,
    guests: null,
    place: null,
    // Filtros booleanos inicializados en null (sin filtrar)
    a_a: null,
    botiquin: null,
    cable: null,
    cocina: null,
    cubiertos: null,
    estacionamiento: null,
    estufa_hogar: null,
    heladera: null,
    jacuzzi: null,
    juegos_infantiles: null,
    lavarropas: null,
    mantas: null,
    parrilla: null,
    piscina: null,
    playroom: null,
    ropa_de_camara: null,
    sabanas: null,
    secador: null,
    toallas: null,
    tv: null,
    wifi: null,
    vajilla: null,
  });

  const filtersQuintas = (quintas: Quintas[]) => {
    return quintas.filter((quinta: Quintas) => {
      return (
        // Filtros básicos
        (filters.currency_price === "TODAS" || quinta.currency_price === filters.currency_price) &&
        (filters.priceRange[0] <= quinta.price && quinta.price <= filters.priceRange[1]) &&
        (filters.bedrooms <= quinta.bedrooms) &&
        (filters.bathrooms <= quinta.bathrooms) &&
        (filters.amb <= quinta.ambients) &&
        (filters.beds <= quinta.beds) &&
        (filters.guests === null || filters.guests <= quinta.guests) &&
        (filters.place === null || filters.place === quinta.city) &&
        // Filtros booleanos - solo filtrar si están activos (true)
        (filters.a_a === null || filters.a_a === false || quinta.a_a === true) &&
        (filters.botiquin === null || filters.botiquin === false || quinta.botiquin === true) &&
        (filters.cable === null || filters.cable === false || quinta.cable === true) &&
        (filters.cocina === null || filters.cocina === false || quinta.cocina === true) &&
        (filters.cubiertos === null || filters.cubiertos === false || quinta.cubiertos === true) &&
        (filters.estacionamiento === null || filters.estacionamiento === false || quinta.estacionamiento === true) &&
        (filters.estufa_hogar === null || filters.estufa_hogar === false || quinta.estufa_hogar === true) &&
        (filters.heladera === null || filters.heladera === false || quinta.heladera === true) &&
        (filters.jacuzzi === null || filters.jacuzzi === false || quinta.jacuzzi === true) &&
        (filters.juegos_infantiles === null || filters.juegos_infantiles === false || quinta.juegos_infantiles === true) &&
        (filters.lavarropas === null || filters.lavarropas === false || quinta.lavarropas === true) &&
        (filters.mantas === null || filters.mantas === false || quinta.mantas === true) &&
        (filters.parrilla === null || filters.parrilla === false || quinta.parrilla === true) &&
        (filters.piscina === null || filters.piscina === false || quinta.piscina === true) &&
        (filters.playroom === null || filters.playroom === false || quinta.playroom === true) &&
        (filters.ropa_de_camara === null || filters.ropa_de_camara === false || quinta.ropa_de_camara === true) &&
        (filters.sabanas === null || filters.sabanas === false || quinta.sabanas === true) &&
        (filters.secador === null || filters.secador === false || quinta.secador === true) &&
        (filters.toallas === null || filters.toallas === false || quinta.toallas === true) &&
        (filters.tv === null || filters.tv === false || quinta.tv === true) &&
        (filters.wifi === null || filters.wifi === false || quinta.wifi === true) &&
        (filters.vajilla === null || filters.vajilla === false || quinta.vajilla === true)
      );
    });
  };

  return (
    <ContextFilters.Provider value={
        {
          filters,
          setFilters,
          filtersQuintas,
        }
    }>
      {children}
    </ContextFilters.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(ContextFilters);
  if (context === undefined) {
    throw new Error("useFilters must be used within a FiltersProvider");
  }
  return context;
};