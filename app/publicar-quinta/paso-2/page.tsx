'use client'
import PlacesAutocomplete from "@/app/components/PlacesAutocomplete";
import Link from "next/link";

export default function Paso2Page() {
  return (
    <main className="flex md:flex-row flex-col mb-10 md:mb-0 gap-10 md:gap-0 items-center justify-between mx-10 md:mx-20">
      <section className="flex flex-col items-start justify-center w-full md:w-1/3">
        <h1 className="font-semibold text-xl mb-5">
          Sigamos con los pasos finales
        </h1>
        <form className="w-full flex flex-col gap-5 rounded-xl">
          <input
            placeholder="Agrega un título*"
            className="bg-white p-2 rounded-lg"
            type="text"
          />
          <small className="text-gray-500">
            Agrega mínimo 5 imágenes * (Recomendamos mostrar todas los
            ambientes)
          </small>
          <input
            placeholder="Cantidad de huéspedes*"
            className="bg-white p-2 rounded-lg"
            type="file"
          />
          <div className="flex flex-col gap-1">
              <PlacesAutocomplete
                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!}
                  onLocation={({ address, lat, lng }) => {
                    console.log("Dirección:", address);
                    console.log("Lat:", lat, "Lng:", lng);
                    // acá podés setear en tu state, mover el mapa, etc.
                  }}
              />
          </div>
          <Link
            href={"/publicar-quinta/paso-3"}
            className="bg-primaryDark text-center cursor-pointer text-white py-2 font-bold text-xl rounded-lg">
            Continuar
          </Link>
        </form>
      </section>
      <img className="object-cover" src="/paso2.png" alt="paso 1" />
    </main>
  );
}
