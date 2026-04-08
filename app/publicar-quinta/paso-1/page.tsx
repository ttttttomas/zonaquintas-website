"use client";
import AddCharacteristics from "../../components/AddCharacteristics";
import Link from "next/link";
import { useQuintaForm } from "@/app/context/QuintaFormContext";

export default function Paso1Page() {
  const { form, updateForm } = useQuintaForm();

  return (
    <main className="flex md:flex-row flex-col mb-10 md:mb-0 gap-10 md:gap-0 md:h-[50vh] items-center justify-between mx-10 md:mx-20">
      <section className="flex flex-col items-start justify-center w-full md:w-1/3">
        <h1 className="font-semibold text-xl mb-5">
          Empecemos con tu publicación
        </h1>
        <form className="w-full flex flex-col gap-5 rounded-xl">
          <input
            placeholder="Cantidad de ambientes*"
            className="bg-white p-2 rounded-lg"
            type="number"
            value={form.ambients || ""}
            onChange={(e) =>
              updateForm({ ambients: Number(e.target.value) })
            }
          />
          <input
            placeholder="Cantidad de habitaciones*"
            className="bg-white p-2 rounded-lg"
            type="number"
            value={form.bedrooms || ""}
            onChange={(e) =>
              updateForm({ bedrooms: Number(e.target.value) })
            }
          />
          <input
            placeholder="Cantidad de camas*"
            className="bg-white p-2 rounded-lg"
            type="number"
            value={form.beds || ""}
            onChange={(e) => updateForm({ beds: Number(e.target.value) })}
          />
          <input
            placeholder="Cantidad de baños*"
            className="bg-white p-2 rounded-lg"
            type="number"
            value={form.bathrooms || ""}
            onChange={(e) =>
              updateForm({ bathrooms: Number(e.target.value) })
            }
          />
          <input
            placeholder="Cantidad de huéspedes*"
            className="bg-white p-2 rounded-lg"
            type="number"
            value={form.guests || ""}
            onChange={(e) =>
              updateForm({ guests: Number(e.target.value) })
            }
          />
          <input
            placeholder="Cantidad de m2"
            className="bg-white p-2 rounded-lg"
            type="number"
            value={form.m2 || ""}
            onChange={(e) => updateForm({ m2: Number(e.target.value) })}
          />
          {(AddCharacteristics as any)({
            selected: form.characteristics,
            onChangeSelected: (chars: string[]) =>
              updateForm({ characteristics: chars }),
          })}
          <Link
            href={"/publicar-quinta/paso-2"}
            className="bg-primaryDark text-center cursor-pointer text-white py-2 font-bold text-xl rounded-lg">
            Continuar
          </Link>
        </form>
      </section>
      <img className="object-cover" src="/paso1.png" alt="paso 1" />
    </main>
  );
}
