"use client";

import { useSearchParams } from "next/navigation";
import Form from "../components/home/Form";
import Filters from "../components/home/Filters";
import { Separator } from "../components/ui/Separator";
import QuintaSearchCard from "../components/QuintaSearchCard";

export default function QuintasPage() {
  const searchParams = useSearchParams();

  const lugar = searchParams.get("place") || "";
  const ingreso = searchParams.get("startDate") || "";
  const egreso = searchParams.get("endDate") || "";
  const personas = searchParams.get("people") || "";

  console.log({lugar, ingreso, egreso, personas});
  

  return (
    <div className="p-4">
      <Form />
      <Separator color="bg-gray-200" />
      <Filters />
      <section className="w-full gap-20 flex">
        <div className="w-4/10">
          <div className="flex justify-end">
            <h1 className="font-semibold">Ordenar por:</h1>
            <select name="" id="">
              <option value="">Elegi una opción</option>
              <option value="">Huéspued</option>
              <option value="">Propietario</option>
              <option value="">Precio</option>
            </select>
          </div>
          <ul className="flex flex-col mt-10 gap-5">
            <QuintaSearchCard />
            <QuintaSearchCard />
            <QuintaSearchCard />
            <QuintaSearchCard />
            <QuintaSearchCard />
          </ul>
        </div>
        <div className="w-6/10 flex-1 bg-black text-white text-center">Mapa</div>
      </section>
    </div>
  );
}
