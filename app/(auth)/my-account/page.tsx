'use client'
import Logo from "@/app/components/icons/Logo";
import AddLanguage from "@/app/components/AddLanguage";
import Link from "next/link";

export default function MyAccountPage() {
  
  return (
    <main className="flex flex-col md:flex-row w-full md:px-20 justify-between gap-10 md:gap-20 items-center md:items-start">
      <img src="picture_user.jpg" alt="User profile" className="w-32 md:w-[150px] rounded-xl" />
    {/* <Logo className="w-[150px]" /> */}
      <form
        className="flex flex-col md:mx-0 mx-10 bg-white w-full max-w-5xl px-5 xl:px-20 gap-2 shadow-lg py-10 shadow-black/20 flex-1 text-black">
        <h1 className="text-center font-semibold text-xl">Mis datos</h1>
        <input
          placeholder="Nombre completo"
          className="border-gray-200 px-2 border-2 xl:w-full mx-auto py-1 rounded-md w-full"
          type="text"
        />
        <input
          placeholder="Telefono"
          className="border-gray-200 px-2 border-2 xl:w-full mx-auto py-1 rounded-md w-full"
          type="text"
        />
        <input
          placeholder="Fecha de nacimiento"
          className="border-gray-200 px-2 border-2 xl:w-full mx-auto py-1 rounded-md w-full"
          type="text"
        />
        <input
          placeholder="Mail"
          className="border-gray-200 px-2 border-2 xl:w-full mx-auto py-1 rounded-md w-full"
          type="text"
        />
        <input
          placeholder="Dirección"
          className="border-gray-200 px-2 border-2 xl:w-full mx-auto py-1 rounded-md w-full"
          type="text"
        />
        <AddLanguage />
        <input
          placeholder="Descripcion"
          className="border-gray-200 px-2 border-2 xl:w-full mx-auto py-1 rounded-md w-full"
          type="text"
        />
        <button
          className="bg-primaryDark xl:mx-52 mt-5 py-2 text-white md:w-auto w-full font-semibold rounded-md cursor-pointer"
          type="submit">
          Modificar datos
        </button>
      </form>
      <div className="flex flex-col items-center justify-between gap-60">
        <Link
          href="/reservations"
          className="bg-primaryDark text-white rounded-full cursor-pointer size-42 text-center pt-16 font-bold text-2xl">
          Mis reservas
        </Link>
        <Link
          href="/publications"
          className="bg-primaryDark text-white rounded-2xl py-5 px-10 cursor-pointer text-nowrap text-center font-bold text-2xl">
          Mis publicaciones
        </Link>
      </div>
    </main>
  );
}
