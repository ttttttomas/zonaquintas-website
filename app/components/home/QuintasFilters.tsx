"use client";
import { useFilters } from "@/app/context/ContextFilters";
import QuintaCard from "./QuintaCard";
import { useEffect, useState } from "react";
import { ProductsServices } from "@/app/services/ProductsServices";
import { Quintas } from "@/types";

export default function QuintasFilters() {

  const [quintas, setQuintas] = useState<Quintas[]>([]);
  const { filtersQuintas } = useFilters();
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


  return (
    <section className="flex flex-wrap lg:gap-x-16 gap-x-10 justify-center">
      {quintas?.map((product: Quintas) => (
        <QuintaCard key={product.id} product={product} />
      ))}
      {quintas?.map((product: Quintas) => (
        <QuintaCard key={product.id} product={product} />
      ))}
      {quintas?.map((product: Quintas) => (
        <QuintaCard key={product.id} product={product} />
      ))}
      {quintas?.map((product: Quintas) => (
        <QuintaCard key={product.id} product={product} />
      ))}
      {quintas?.map((product: Quintas) => (
        <QuintaCard key={product.id} product={product} />
      ))}
      {!quintas && (
        <p className="text-center m-20">No hay resultados</p>
      )}
    </section>
  );
}
