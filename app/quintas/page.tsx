'use client'
// import { useSearchParams } from "next/navigation";
// import Form from "../components/home/Form";
import Filters from "../components/home/Filters";
import { Separator } from "../components/ui/Separator";
import QuintaSearchCard from "../components/QuintaSearchCard";
import { Suspense } from "react";

export default function QuintasPage() {
  // const searchParams = useSearchParams();

  // const lugar = searchParams.get("place") || "";
  // const ingreso = searchParams.get("startDate") || "";
  // const egreso = searchParams.get("endDate") || "";
  // const personas = searchParams.get("people") || "";

  // console.log({lugar, ingreso, egreso, personas});
  

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <main className="p-4">
      {/* <Form /> */}
      <Separator color="bg-gray-200" />
      <Filters />
      <section className="w-full gap-20 flex">
        <div className="w-4/10">
          <div className="flex justify-end mb-2">
            <h1 className="pr-2">Ordenar por</h1>
            <select className="font-semibold" name="order">
              <option value="relevancia">Relevancia</option>
            </select>
          </div>
          <ul className="flex flex-col gap-5">
            <QuintaSearchCard />
            <QuintaSearchCard />
            <QuintaSearchCard />
            <QuintaSearchCard />
            <QuintaSearchCard />
          </ul>
        </div>
        <div className="w-6/10 flex-1 text-white text-center">
        <img src="map.png" alt="mapa de zona" className="w-full mb-2 mx-auto max-w-7xl mt-5 h-full object-cover rounded-xl" />
        </div>
      </section>
    </main>
    </Suspense>
  );
}
