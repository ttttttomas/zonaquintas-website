'use client';
import { useRouter } from "next/navigation";
import Lupa from "../icons/Lupa";
import { Suspense, useState } from "react";

export default function Form() {
  const [viewInput, setViewInput] = useState(false);
  const router = useRouter();
  // const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const form = e.currentTarget;

    // const place = form.place.value;
    // const startDate = form.startDate.value;
    // const endDate = form.endDate.value;
    // const people = form.people.value;

    // const query = new URLSearchParams({
    //   place,
    //   startDate,
    //   endDate,
    //   people,
    // }).toString();

    router.push(`/quintas?query=test`);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <form
        onSubmit={handleSubmit}
        className="flex md:flex-row flex-col justify-center items-center gap-5 md:gap-8 mb-5 md:mb-10">
        <section className="flex md:flex-row flex-col border-black/30 border cursor-pointer w-max bg-white rounded-4xl">
          {viewInput ? (
            <div className={`hover:bg-black/10 w-[260px] rounded-4xl flex flex-col focus:bg-black ${viewInput && 'md:pl-10'} py-5 items-center transition-all animate-out md:items-start`}>
            <p className={viewInput ? "font-medium" : "font-medium text-xl my-auto mx-auto"}>Lugar</p>
            {viewInput &&
                        <input
                        type="text"
                        // defaultValue={searchParams.get("query") || ""}
                        name="place"
                        className="text-black/40 transition-all md:text-start text-center focus:outline-0"
                        placeholder="Elegi aca tu destino"
                      />}
          </div>
          ) : (<div onClick={() => setViewInput(!viewInput)} className={`hover:bg-black/10 w-[260px] rounded-4xl flex flex-col focus:bg-black ${viewInput && 'md:pl-10'} py-5 items-center transition-all md:items-start`}>
          <p className="font-medium text-xl my-auto mx-auto">Lugar</p>

        </div>)}

          <div className="flex flex-col py-5 md:pl-2 hover:bg-black/10 rounded-4xl items-center md:items-start">
            <p className="font-medium">Fecha de ingreso</p>
            <input
              name="startDate"
              type="text"
              className="text-black/40 md:text-start text-center focus:outline-0"
              placeholder="¿Desde cuando?"
            />
          </div>

          <div className="flex flex-col py-5 md:pl-2 hover:bg-black/10 rounded-4xl items-center md:items-start">
            <p className="font-medium">Fecha de egreso</p>
            <input
              name="endDate"
              type="text"
              className="text-black/40 md:text-start text-center focus:outline-0"
              placeholder="¿Hasta cuando?"
            />
          </div>

          <div className="flex flex-col py-5 md:pl-2 hover:bg-black/10 rounded-4xl pr-5 items-center md:items-start">
            <p className="font-medium">Huespedes</p>
            <input
              name="people"
              type="text"
              className="text-black/40 md:text-start text-center focus:outline-0"
              placeholder="Cantidad de personas"
            />
          </div>
        </section>
        <button
          className="border-black/30 bg-white border p-2 rounded-4xl cursor-pointer"
          type="submit">
          <Lupa />
        </button>
      </form>
    </Suspense>
  );
}
