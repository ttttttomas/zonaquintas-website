'use client';
import { useRouter } from "next/navigation";
import Lupa from "../icons/Lupa";
import { Suspense, useState } from "react";

export default function Form() {
  const [viewInput1, setViewInput1] = useState(false);
  const [viewInput2, setViewInput2] = useState(false);
  const [viewInput3, setViewInput3] = useState(false);
  const [viewInput4, setViewInput4] = useState(false);
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
          {viewInput1 ? (
            <div className={`hover:bg-black/10 w-[260px] rounded-4xl flex flex-col focus:bg-black ${viewInput1 && 'md:pl-10'} py-5 items-center transition-all animate-out md:items-start`}>
            <p className={viewInput1 ? "font-medium" : "font-medium text-xl my-auto mx-auto"}>Lugar</p>
            {viewInput1 &&
                        <input
                        type="text"
                        // defaultValue={searchParams.get("query") || ""}
                        name="place"
                        className="text-black/40 transition-all md:text-start text-center focus:outline-0"
                        placeholder="Elegi aca tu destino"
                      />}
          </div>
          ) : (<div onClick={() => setViewInput1(!viewInput1)} className={`hover:bg-black/10 w-[260px] rounded-4xl flex flex-col focus:bg-black ${viewInput1 && 'md:pl-10'} py-5 items-center text-gray-300 hover:text-black transition-all md:items-start`}>
          <p className="font-medium text-xl my-auto mx-auto">Lugar</p>

        </div>)}

          {viewInput2 ? (
            <div className={`hover:bg-black/10 w-[260px] rounded-4xl flex flex-col focus:bg-black ${viewInput2 && 'md:pl-10'} py-5 items-center transition-all animate-out md:items-start`}>
            <p className={viewInput2 ? "font-medium" : "font-medium text-xl my-auto mx-auto"}>Fecha de ingreso</p>
            {viewInput2 &&
                        <input
                        type="text"
                        // defaultValue={searchParams.get("query") || ""}
                        name="startDate"
                        className="text-black/40 transition-all md:text-start text-center focus:outline-0"
                        placeholder="Elegi aca tu destino"
                      />}
          </div>
          ) : (<div onClick={() => setViewInput2(!viewInput2)} className={`hover:bg-black/10 w-[260px] rounded-4xl flex flex-col focus:bg-black ${viewInput2 && 'md:pl-10'} py-5 items-center text-gray-300 hover:text-black transition-all md:items-start`}>
          <p className="font-medium text-xl my-auto mx-auto">Fecha de ingreso</p>

        </div>)}

          {viewInput3 ? (
            <div className={`hover:bg-black/10 w-[260px] rounded-4xl flex flex-col focus:bg-black ${viewInput3 && 'md:pl-10'} py-5 items-center transition-all animate-out md:items-start`}>
            <p className={viewInput3 ? "font-medium" : "font-medium text-xl my-auto mx-auto"}>Fecha de egreso</p>
            {viewInput3 &&
                        <input
                        type="text"
                        // defaultValue={searchParams.get("query") || ""}
                        name="endDate"
                        className="text-black/40 transition-all md:text-start text-center focus:outline-0"
                        placeholder="Elegi aca tu destino"
                      />}
          </div>
          ) : (<div onClick={() => setViewInput3(!viewInput3)} className={`hover:bg-black/10 w-[260px] rounded-4xl flex flex-col focus:bg-black ${viewInput3 && 'md:pl-10'} py-5 items-center text-gray-300 hover:text-black transition-all md:items-start`}>
          <p className="font-medium text-xl my-auto mx-auto">Fecha de egreso</p>

        </div>)}

          {viewInput4 ? (
            <div className={`hover:bg-black/10 w-[260px] rounded-4xl flex flex-col focus:bg-black ${viewInput4 && 'md:pl-10'} py-5 items-center transition-all animate-out md:items-start`}>
            <p className={viewInput4 ? "font-medium" : "font-medium text-xl my-auto mx-auto"}>Huespedes</p>
            {viewInput4 &&
                        <input
                        type="text"
                        // defaultValue={searchParams.get("query") || ""}
                        name="people"
                        className="text-black/40 transition-all md:text-start text-center focus:outline-0"
                        placeholder="Elegi aca tu destino"
                      />}
          </div>
          ) : (<div onClick={() => setViewInput4(!viewInput4)} className={`hover:bg-black/10 w-[260px] rounded-4xl flex flex-col focus:bg-black ${viewInput4 && 'md:pl-10'} text-gray-300 hover:text-black py-5 items-center transition-all md:items-start`}>
          <p className="font-medium text-xl my-auto mx-auto">Huespedes</p>

        </div>)}
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
