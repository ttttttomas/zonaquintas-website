import Logo from "@/app/components/icons/Logo";
import Link from "next/link";

export default function MyAccountPage() {
  return (
    <main className="flex flex-col md:flex-row w-full md:px-20 justify-between gap-10 md:gap-20 items-center md:items-start">
      <Logo width={150} height={"auto"} />
      <form className="flex flex-col bg-white w-full max-w-5xl px-5 md:px-20 gap-2 shadow-lg py-10 shadow-black/20 flex-1 text-black" action="">
        <h1 className="text-center font-semibold text-xl">Mis datos</h1>
        <input placeholder="Nombre completo" className="border-gray-200 px-2 border-2 md:w-2/3 mx-auto py-1 rounded-lg w-full" type="text" />
        <input placeholder="Telefono" className="border-gray-200 px-2 border-2 md:w-2/3 mx-auto py-1 rounded-lg w-full" type="text" />
        <input placeholder="Fecha de nacimiento" className="border-gray-200 px-2 border-2 md:w-2/3 mx-auto py-1 rounded-lg w-full" type="text" />
        <input placeholder="Mail" className="border-gray-200 px-2 border-2 md:w-2/3 mx-auto py-1 rounded-lg w-full" type="text" />
        <input placeholder="Dirección" className="border-gray-200 px-2 border-2 md:w-2/3 mx-auto py-1 rounded-lg w-full" type="text" />
        <input placeholder="Idiomas" className="border-gray-200 px-2 border-2 md:w-2/3 mx-auto py-1 rounded-lg w-full" type="text" />
        <input placeholder="Descripcion" className="border-gray-200 px-2 border-2 md:w-2/3 mx-auto py-1 rounded-lg w-full" type="text" />
        <button className="bg-green-600 xl:mx-52 mt-5 py-2 text-white md:w-auto w-full font-semibold rounded-md cursor-pointer" type="submit">Modificar datos</button>
      </form>
      <Link href="/" className="bg-green-600 text-white rounded-full cursor-pointer size-42 text-center pt-16 font-bold text-2xl">Mis reservas</Link>
    </main>
  );
}
