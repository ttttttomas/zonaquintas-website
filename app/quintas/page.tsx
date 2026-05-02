"use client";
import Filters from "../components/home/Filters";
import Form from "../components/home/Form";
import { Separator } from "../components/ui/Separator";
import QuintaSearchCard from "../components/QuintaSearchCard";
import { useEffect, Suspense } from "react";
import { Quintas } from "@/types";
import { useFilters } from "../context/ContextFilters";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import QuintasMap from "@/app/components/quintas/QuintasMap";
import { ProductsServices } from "../services/ProductsServices";

function QuintasContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filtersQuintas, setFilters } = useFilters();
  const [quintas, setQuintas] = useState<Quintas[]>([]);

  // Leer searchParams y sincronizar con el contexto de filtros
  useEffect(() => {
    const place = searchParams.get("place");
    const guests = searchParams.get("guests");

    setFilters((prev: any) => ({
      ...prev,
      place: place || null,
      guests: guests ? Number(guests) : null,
    }));
  }, [searchParams]);

  useEffect(() => {
    const fetchQuintas = async () => {
      try {
        const res = await ProductsServices.getQuintas();
        setQuintas(res);
      } catch (error) {
        console.error("Error al cargar quintas:", error);
      }
    };

    fetchQuintas();
  }, []);

  // Labels de búsqueda activa para mostrar al usuario
  const placeParam = searchParams.get("place");
  const guestsParam = searchParams.get("guests");
  const hasActiveSearch = placeParam || guestsParam;

  // Siempre aplicar filtersQuintas — los defaults (0/null) no filtran nada
  const quintasFiltered = filtersQuintas(quintas);

  // Mapear al shape que espera QuintasMap: { id, title, price, lat, lng, ... }
  // El tipo Quintas usa `latitude` y `length` (en lugar de lng) — parseamos a número
  const mapListings = quintas
    .map((q: Quintas) => ({
      id: q.id,
      title: q.title,
      price: q.price,
      currency_price: q.currency_price,
      city: q.city,
      guests: q.guests,
      bedrooms: q.bedrooms,
      main_image: q.main_image,
      lat: parseFloat(q.latitude as any),
      lng: parseFloat(q.length as any),
    }))
    .filter((q) => !isNaN(q.lat) && !isNaN(q.lng));

  const handleMarkerClick = (id: number | string) => {
    router.push(`/quintas/${id}`);
  };

  return (
    <main className="p-4 md:pt-0 pt-32">
      <Form />
      <Separator color="bg-gray-200" />

      {/* Banner de búsqueda activa */}
      {hasActiveSearch && (
        <div className="flex items-center gap-3 px-2 py-3 mb-1 text-sm text-gray-600">
          <svg className="w-4 h-4 text-[#28A728] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>
            Mostrando resultados
            {placeParam && <strong> en {placeParam}</strong>}
            {guestsParam && <span> para <strong>{guestsParam} huésped{Number(guestsParam) > 1 ? "es" : ""}</strong></span>}
          </span>
          <button
            onClick={() => {
              setFilters((prev: any) => ({ ...prev, place: null, guests: null }));
              router.push("/quintas");
            }}
            className="ml-auto cursor-pointer text-xs underline text-gray-400 hover:text-gray-700 transition-colors"
          >
            Limpiar búsqueda
          </button>
        </div>
      )}

      <Filters />

      <section className="w-full gap-20 flex md:flex-row flex-col">
        <div className="w-full md:w-4/10">
          <div className="flex justify-end mb-2">
            <h1 className="pr-2">Ordenar por</h1>
            <select className="font-semibold" name="order">
              <option value="relevancia">Relevancia</option>
            </select>
          </div>
          <ul className="flex flex-col gap-5">
            {quintasFiltered?.map((product: Quintas) => (
              <QuintaSearchCard key={product.id} product={product} />
            ))}
            {quintasFiltered?.length === 0 && (
              <p className="text-center py-10 text-gray-400">No hay resultados para tu búsqueda</p>
            )}
          </ul>
        </div>
        <div className="w-full xl:w-6/10 md:w-4/10 flex-1 text-white text-center">
          <QuintasMap
            listings={mapListings}
            onMarkerClick={handleMarkerClick}
            mapHeight="80vh"
            defaultCenter={{ lat: -34.6157, lng: -58.4333 }}
            defaultZoom={10}
          />
        </div>
      </section>
    </main>
  );
}

export default function QuintasPage() {
  return (
    <Suspense fallback={<div className="p-4 pt-32 text-center text-gray-400">Cargando quintas...</div>}>
      <QuintasContent />
    </Suspense>
  );
}
