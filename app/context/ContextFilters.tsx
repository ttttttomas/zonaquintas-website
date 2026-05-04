"use client";
import { Quintas } from "@/types";
import { createContext, useContext, useState } from "react";

export const ContextFilters = createContext<any>(null);

interface Filters {
  // Básicos numéricos
  bedrooms: number;
  bathrooms: number;
  amb: number;       // environments
  beds: number;
  currency_price: "TODAS" | "ARS" | "USD";
  dates: string | null;
  guests: number | null;
  place: string | null;
  startDate: string | null;
  endDate: string | null;
  priceRange: [number, number];
  // Booleanos — mismos nombres que el tipo Quintas (null = sin filtrar, true = requerido)
  // Habitaciones
  sabanas: boolean | null;
  mantas: boolean | null;
  almohadas: boolean | null;
  // Artículos de limpieza personal
  toilettes: boolean | null;
  shampoo: boolean | null;
  toallas: boolean | null;
  secador_pelo: boolean | null;
  // Limpieza general
  lavarropas: boolean | null;
  cambio_toallas: boolean | null;
  // Cocina
  utensillos_cocina: boolean | null;
  vajilla: boolean | null;
  freezer: boolean | null;
  // Entretenimiento
  televisor: boolean | null;
  radio: boolean | null;
  tv: boolean | null;
  cable: boolean | null;
  internet: boolean | null;
  jacuzzi: boolean | null;
  playroom: boolean | null;
  sofas: boolean | null;
  // Estacionamiento
  estacionamiento_techado: boolean | null;
  // Otras características
  parrilla: boolean | null;
  estufa_gas: boolean | null;
  hogar: boolean | null;
  hamacas_paraguayas: boolean | null;
  arboleda: boolean | null;
  cancha_futbol: boolean | null;
  piscina: boolean | null;
  cancha_basquet: boolean | null;
  cancha_tenis: boolean | null;
  cancha_padel: boolean | null;
  hamacas: boolean | null;
  parlantes: boolean | null;
}

const defaultFilters: Filters = {
  bedrooms: 0,
  bathrooms: 0,
  amb: 0,
  beds: 0,
  currency_price: "TODAS",
  priceRange: [0, 5000000],
  dates: null,
  guests: null,
  place: null,
  startDate: null,
  endDate: null,
  // booleanos — null = sin filtrar
  sabanas: null,
  mantas: null,
  almohadas: null,
  toilettes: null,
  shampoo: null,
  toallas: null,
  secador_pelo: null,
  lavarropas: null,
  cambio_toallas: null,
  utensillos_cocina: null,
  vajilla: null,
  freezer: null,
  televisor: null,
  radio: null,
  tv: null,
  cable: null,
  internet: null,
  jacuzzi: null,
  playroom: null,
  sofas: null,
  estacionamiento_techado: null,
  parrilla: null,
  estufa_gas: null,
  hogar: null,
  hamacas_paraguayas: null,
  arboleda: null,
  cancha_futbol: null,
  piscina: null,
  cancha_basquet: null,
  cancha_tenis: null,
  cancha_padel: null,
  hamacas: null,
  parlantes: null,
};

/** Solo filtra si el filtro está activo (true). Usa !! para tolerar 0/1 de la API */
const req = (filterVal: boolean | null, quintaVal: any) =>
  filterVal !== true || !!quintaVal;

export const FiltersProvider = ({ children }: any) => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const filtersQuintas = (quintas: Quintas[]) => {
    return quintas.filter((q: Quintas) => {
      const bedrooms   = Number(q.bedrooms)   || 0;
      const bathrooms  = Number(q.bathrooms)  || 0;
      const envs       = Number(q.environments) || 0;
      const beds       = Number(q.beds)       || 0;
      const price      = Number(q.price)      || 0;
      const guests     = Number(q.guests)     || 0;

      return (
        // ── Moneda ────────────────────────────────────────────
        (filters.currency_price === "TODAS" ||
          q.currency_price === filters.currency_price) &&
        // ── Rango de precio ───────────────────────────────────
        filters.priceRange[0] <= price &&
        price <= filters.priceRange[1] &&
        // ── Características básicas numéricas ─────────────────
        (filters.bedrooms  === 0 || filters.bedrooms  <= bedrooms)  &&
        (filters.bathrooms === 0 || filters.bathrooms <= bathrooms) &&
        (filters.amb       === 0 || filters.amb       <= envs)      &&
        (filters.beds      === 0 || filters.beds      <= beds)      &&
        // ── Huéspedes y lugar (Form) ──────────────────────────
        (filters.guests === null || filters.guests <= guests)       &&
        (filters.place  === null || filters.place  === q.city)      &&
        // ── Habitaciones ──────────────────────────────────────
        req(filters.sabanas,  q.sabanas)  &&
        req(filters.mantas,   q.mantas)   &&
        req(filters.almohadas, q.almohadas) &&
        // ── Limpieza personal ─────────────────────────────────
        req(filters.toilettes,   q.toilettes)   &&
        req(filters.shampoo,     q.shampoo)     &&
        req(filters.toallas,     q.toallas)     &&
        req(filters.secador_pelo, q.secador_pelo) &&
        // ── Limpieza general ──────────────────────────────────
        req(filters.lavarropas,   q.lavarropas)   &&
        req(filters.cambio_toallas, q.cambio_toallas) &&
        // ── Cocina ────────────────────────────────────────────
        req(filters.utensillos_cocina, q.utensillos_cocina) &&
        req(filters.vajilla,  q.vajilla)  &&
        req(filters.freezer,  q.freezer)  &&
        // ── Entretenimiento ───────────────────────────────────
        req(filters.televisor, q.televisor) &&
        req(filters.radio,     q.radio)     &&
        req(filters.tv,        q.tv)        &&
        req(filters.cable,     q.cable)     &&
        req(filters.internet,  q.internet)  &&
        req(filters.jacuzzi,   q.jacuzzi)   &&
        req(filters.playroom,  q.playroom)  &&
        req(filters.sofas,     q.sofas)     &&
        // ── Estacionamiento ───────────────────────────────────
        req(filters.estacionamiento_techado, q.estacionamiento_techado) &&
        // ── Otras características ─────────────────────────────
        req(filters.parrilla,          q.parrilla)          &&
        req(filters.estufa_gas,        q.estufa_gas)        &&
        req(filters.hogar,             q.hogar)             &&
        req(filters.hamacas_paraguayas, q.hamacas_paraguayas) &&
        req(filters.arboleda,          q.arboleda)          &&
        req(filters.cancha_futbol,     q.cancha_futbol)     &&
        req(filters.piscina,           q.piscina)           &&
        req(filters.cancha_basquet,    q.cancha_basquet)    &&
        req(filters.cancha_tenis,      q.cancha_tenis)      &&
        req(filters.cancha_padel,      q.cancha_padel)      &&
        req(filters.hamacas,           q.hamacas)           &&
        req(filters.parlantes,         q.parlantes)
      );
    });
  };

  const resetFilters = () => setFilters(defaultFilters);

  return (
    <ContextFilters.Provider
      value={{ filters, setFilters, filtersQuintas, resetFilters }}>
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
