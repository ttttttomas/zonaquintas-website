"use client";
import { useFilters } from "@/app/context/ContextFilters";
import QuintaCard from "./QuintaCard";
import { useEffect, useMemo, useState } from "react";
import { ProductsServices } from "@/app/services/ProductsServices";
import { Quintas } from "@/types";

export default function QuintasFilters() {
  const [quintas, setQuintas] = useState<Quintas[]>([]);
  const [loading, setLoading] = useState(true);
  const { filtersQuintas } = useFilters();

  useEffect(() => {
    const fetchQuintas = async () => {
      try {
        const res = await ProductsServices.getQuintas();
        setQuintas(res);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar quintas:", error);
      }
    };

    fetchQuintas();
  }, []);

  const dataFiltered = useMemo(() => filtersQuintas(quintas), [quintas, filtersQuintas]);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full border-4 border-primaryDark border-t-transparent">
          <img src="logo.png" width={80} height={80} alt="" />
        </div>
      </main>
    );
  }

  return (
    <section className="flex flex-wrap lg:gap-x-16 gap-x-10 justify-center">
      {dataFiltered?.map((product: Quintas) => (
        <QuintaCard key={product.id} product={product} />
      ))}
      {dataFiltered?.length === 0 && (
        <p className="text-gray-400 py-10">No hay quintas que coincidan con los filtros</p>
      )}
    </section>
  );
}
