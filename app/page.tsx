import Form from "./components/home/Form";
import Filters from "./components/home/Filters";
import SecondSeparator from "./components/SecondSeparator";
import QuintasFilters from "./components/home/QuintasFilters";
import { Suspense } from "react";
import FormSkeleton from "./components/home/FormSkeleton";
import Arrow from "./components/Arrow";

export default async function Home() {
  return (
    <main className="md:px-10">
      <section
        id="form-home"
        className="flow-root -mt-20 pt-20 bg-cover h-screen md:screen-auto bg-center md:-mt-46 md:pt-62 md:-mx-10"
      >

        <div className="relative isolate flex mt-16 mb-10 px-5 flex-col text-white items-center justify-center text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none md:hidden absolute inset-x-0 -inset-y-4 -z-10"
            style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.76) 0%, rgba(0,0,0,0.52) 50%, rgba(0,0,0,0.12) 82%, transparent 100%)" }}
          />
          <h1 className="font-semibold drop-shadow-[0_2px_3px_rgba(0,0,0,0.95)] md:text-5xl text-lg">
            <span className="block">Encontrá la quinta</span>
            <span className="flex flex-wrap justify-center gap-x-2 md:text-3xl text-lg">
              ideal para tu <span className="text-primary">próxima escapada</span>
            </span>
          </h1>
          <p className="mt-5 drop-shadow-[0_2px_3px_rgba(0,0,0,0.95)] flex gap-1 text-sm md:text-lg">Buscá, compará y reservá quintas en <p className="text-green-500 font-bold">TODO EL PAÍS</p></p>
        </div>
        <Suspense fallback={<FormSkeleton />}>
          <Form />
        </Suspense>
      </section>
      {/* <h2 className="block font-semibold py-1 text-2xl w-fit mx-auto px-10 rounded-xl text-center mt-5">
        Filtros
      </h2>
      <Filters /> */}
      <h2 className="text-2xl font-semibold mt-10 text-center">
        Quintas destacadas
      </h2>
      <QuintasFilters />
    </main>
  );
}
