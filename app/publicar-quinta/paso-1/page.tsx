import AddCharacteristics from "../../components/AddCharacteristics";
import Link from "next/link";

export default function Paso1Page() {
  return (
    <main className="flex items-center justify-between mx-20">
      <section className="flex flex-col items-start justify-center w-1/3">
        <h1 className="font-semibold text-xl mb-5">Empecemos con tu publicación</h1>
        <form className="w-full flex flex-col gap-5 rounded-xl">
          <input placeholder="Cantidad de ambientes*" className="bg-white p-2 rounded-lg" type="number" />
          <input placeholder="Cantidad de huéspedes*" className="bg-white p-2 rounded-lg" type="number" />
          <input placeholder="Cantidad de m2" className="bg-white p-2 rounded-lg" type="number" />
          <AddCharacteristics />
          <Link href={'/publicar-quinta/paso-2'} className="bg-primaryDark text-center cursor-pointer text-white py-2 font-bold text-xl rounded-lg">Continuar</Link>
        </form>
      </section>
      <img src="/paso1.png" alt="paso 1" />
    </main>
  );
}
