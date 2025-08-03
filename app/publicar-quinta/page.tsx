import Link from "next/link";
import SecondSeparator from "../components/SecondSeparator";

export default function PublicarQuintaPage() {
  return (
    <main className="flex flex-col relative items-center justify-center">
      <div className="absolute publicar h-full z-0 w-full"></div>
      <h1 className="text-center text-primaryDark font-extrabold text-2xl">Bienvenido/a a la sección propietarios</h1>
      <h2 className="text-center text-primaryDark font-semibold text-xl mb-10">Los pasos para el alquiler de tu Quinta</h2>
      <SecondSeparator />
      <section className="flex flex-col my-5 items-center justify-center">
        <h3 className="font-bold text-lg">Brinda información sobre la propiedad</h3>
        <ul className="flex flex-col justify-center items-center my-5 text-center gap-2">
            <li>Cantidad de ambientes</li>
            <li>Características principales</li>
            <li>Cantidad de m2</li>
            <li>Comodidades adicionales</li>
            <li>Cantidad de huéspedes permitidos</li>
        </ul>
        <SecondSeparator />
      </section>
      <section className="flex flex-col items-center justify-center">
        <h3 className="font-bold text-lg text-center">Visualiza tu Quinta</h3>
        <ul className="flex flex-col justify-center items-center my-5 gap-2">
            <li>Creá un título llamativo</li>
            <li>Agregá imagenes</li>
            <li>Ubicá la quinta en el mapa</li>
        </ul>
        <SecondSeparator />
      </section>
      <section className="">
        <h3 className="font-bold my-5 text-center text-lg">Finaliza el proceso</h3>
        <ul className="flex flex-col justify-center items-center mt-5 gap-2">
            <li>Indicá la disponibilidad del alojamiento</li>
            <li>Brindá un precio a la estadía</li>
            <li>Fijá el precio según el tiempo de Alojamiento (Recomendado)</li>
        </ul>
      </section>
      <Link href="/publicar-quinta/paso-1" className="bg-primaryDark z-20 w-1/2 text-center mx-auto text-white py-2 rounded-xl text-xl font-bold my-5">Comenzar</Link>
    </main>
  );
}
