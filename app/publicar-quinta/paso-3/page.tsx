"use client";
import Link from "next/link";
import { useQuintaForm } from "@/app/context/QuintaFormContext";
import "react-datepicker/dist/react-datepicker.css";

export default function Paso3Page() {
  const { form, updateForm } = useQuintaForm();
  console.log(form)

  return (
    <main className="flex md:flex-row flex-col mb-10 md:mb-0 gap-10 md:gap-0 md:h-[50vh] items-center justify-between mx-10 md:mx-20">
      <section className="flex flex-col items-start justify-center w-full md:w-1/3">
        <h1 className="font-semibold text-xl mb-5">
          Brindanos la ultima información para tu publicación
        </h1>
        <form className="w-full flex flex-col gap-5 rounded-xl">
          <div className="w-full flex bg-white rounded-lg">
            <input
              placeholder="Ponele precio a tu quinta (Precio por dia)*"
              className="p-2 flex-1"
              type="number"
              value={form.price || ""}
              onChange={(e) => updateForm({ price: Number(e.target.value) })}
            />
            <select
              value={form.currency_price}
              onChange={(e) =>
                updateForm({
                  currency_price: e.target.value as "ARS" | "USD",
                })
              }>
              <option value="ARS">ARS</option>
            </select>
          </div>
          <Link
            href={"/publicar-quinta/paso-4"}
            className="bg-primaryDark text-center cursor-pointer text-white py-2 font-bold text-xl rounded-lg">
            Continuar
          </Link>
        </form>
      </section>
      <img src="/paso3.png" className="h-90 object-cover" alt="paso 3" />
    </main>
  );
}
