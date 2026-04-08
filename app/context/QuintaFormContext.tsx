"use client";
import { createContext, useContext, useState, ReactNode } from "react";

/** Datos del formulario de publicación (lo que se recolecta en pasos 1-3) */
export type QuintaFormData = {
  // ── Paso 1 ──
  ambients: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  guests: number;
  m2: number;
  // Características (booleans)
  characteristics: string[]; // nombres legibles seleccionados

  // ── Paso 2 ──
  title: string;
  description: string;
  images: File[];
  address: string;
  latitude: number;
  longitude: number;
  city: string; // barrio / neighborhood

  // ── Paso 3 ──
  price: number;
  currency_price: "ARS" | "USD";
  price_quincena: number;
  currency_quincena: "ARS" | "USD";
  price_mes: number;
  currency_mes: "ARS" | "USD";
};

const DEFAULT_FORM: QuintaFormData = {
  ambients: 0,
  bedrooms: 0,
  beds: 0,
  bathrooms: 0,
  guests: 0,
  m2: 0,
  characteristics: [],

  title: "",
  description: "",
  images: [],
  address: "",
  latitude: 0,
  longitude: 0,
  city: "",

  price: 0,
  currency_price: "USD",
  price_quincena: 0,
  currency_quincena: "USD",
  price_mes: 0,
  currency_mes: "USD",
};

interface QuintaFormContextType {
  form: QuintaFormData;
  updateForm: (partial: Partial<QuintaFormData>) => void;
  resetForm: () => void;
}

const QuintaFormContext = createContext<QuintaFormContextType | null>(null);

export const QuintaFormProvider = ({ children }: { children: ReactNode }) => {
  const [form, setForm] = useState<QuintaFormData>(DEFAULT_FORM);

  const updateForm = (partial: Partial<QuintaFormData>) => {
    setForm((prev) => ({ ...prev, ...partial }));
  };

  const resetForm = () => setForm(DEFAULT_FORM);

  return (
    <QuintaFormContext.Provider value={{ form, updateForm, resetForm }}>
      {children}
    </QuintaFormContext.Provider>
  );
};

export const useQuintaForm = () => {
  const ctx = useContext(QuintaFormContext);
  if (!ctx) {
    throw new Error(
      "useQuintaForm debe ser usado dentro de un QuintaFormProvider",
    );
  }
  return ctx;
};
