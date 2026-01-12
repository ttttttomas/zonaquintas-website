"use client";
import Filters from "../components/home/Filters";
import { Separator } from "../components/ui/Separator";
import QuintaSearchCard from "../components/QuintaSearchCard";
import { useEffect } from "react";
import { Quintas } from "@/types";
import { useFilters } from "../context/ContextFilters";
import { useRouter } from "next/navigation";

import { useState } from "react";
import QuintasMap from "@/app/components/quintas/QuintasMap";

export default function QuintasPage() {
  const router = useRouter();
  const { filtersQuintas } = useFilters();
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const [quintas, setQuintas] = useState([]);

  useEffect(() => {
    const fetchQuintas = async () => {
      try {
        const res = await fetch(`${baseURL}/api/getQuintas`);
        const { quintas } = await res.json();
        setQuintas(quintas);
        console.log(quintas);
      } catch (error) {
        console.error("Error al cargar quintas:", error);
      }
    };

    fetchQuintas();
  }, [baseURL]);

  const quintasFiltered = filtersQuintas(quintas);
  const handleMarkerClick = (id: number | string) => {
    // Abrí modal / navegá al detalle / scrollea a la card
    console.log("click marker", id);
    router.push(`/quintas/${id}`);
  };

  return (
    <main className="p-4 md:pt-0 pt-32">
      {/* <Form /> */}
      <Separator color="bg-gray-200" />
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
            {quintas?.map((product: Quintas) => (
              <QuintaSearchCard key={product.id} product={product} />
            ))}
            {!quintasFiltered && (
              <p className="text-center">No hay resultados</p>
            )}
          </ul>
        </div>
        <div className="w-full xl:w-6/10 md:w-4/10 flex-1 text-white text-center">
          <QuintasMap
            listings={quintas}
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
