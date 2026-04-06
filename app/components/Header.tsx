"use client";
import User from "./icons/User";
import Menu from "./icons/Menu";
import Logo from "./icons/Logo";
import Link from "next/link";
import { useState } from "react";
import { Separator } from "./ui/Separator";
import { usePathname } from "next/navigation";
import FormQuintas from "./FormQuintas";

export default function Header() {
  const [user] = useState(false);
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  const handleClick2 = () => {
    setIsOpen2(!isOpen2);
  };
  return (
    <header className="flex md:flex-row flex-col md:gap-0 gap-2 z-10 backdrop-blur-sm fixed top-0 w-full justify-between items-center py-2 px-5 md:px-10 mb-5">
      <section className="flex justify-between items-center gap-5 md:w-auto w-full">
        <Link href="/" className="flex items-center gap-3">
          <Logo className="w-[50px] md:w-[70px]" />
          <p className="font-semibold text-sm md:text-lg">ZonaQuintas</p>
        </Link>
        <div className="bg-primaryDark flex md:hidden items-center gap-5 px-3 py-1 rounded-4xl justify-between">
          <Menu onClick={handleClick2} />
          <User />
          {isOpen2 && (
            <ul className="text-white font-medium flex flex-col gap-2 right-0 top-16 md:right-4 text-md absolute bg-primaryDark rounded-xl px-6 py-3">
              <Link onClick={() => setIsOpen2(false)} href="/login">
                Iniciar sesión
              </Link>

              <Link onClick={() => setIsOpen2(false)} href="/register">
                Registrate
              </Link>

              <Separator color="bg-gray-200" />
              <Link onClick={() => setIsOpen2(false)} href="/">
                Publicá tu quinta
              </Link>
              <Link onClick={() => setIsOpen2(false)} href="/support">
                Soporte
              </Link>
            </ul>
          )}
        </div>
      </section>
      <div className="font-semibold md:pr-26 text-wrap text-sm md:text-lg">
        {path === "/" && "Encontrá, reservá y disfrutá."}
        {path === "/favorites" && "Mis favoritos"}
        {path === "/support" && "Soporte"}
        {path === "/quintas" && <FormQuintas />}
        {path === "/terms" && "Términos y condiciones"}
        {path === "/politics" && "Políticas de privacidad"}
        {path === "/dashboard" && "Panel administador"}
      </div>
      <div className="bg-primaryDark md:flex hidden items-center gap-3 px-3 py-1 rounded-4xl justify-between">
        <Menu onClick={handleClick} />
        <Link className="flex items-center justify-center" href="/my-account">
          {/* SI HAY USUARIO, ACA VA EL NOMBRE ACTIVO  */}
        </Link>
        <User />
        {isOpen && (
          <ul className="text-white font-medium flex flex-col gap-2 top-36 right-32 md:top-16 md:right-4 text-md absolute bg-primaryDark rounded-xl px-6 py-3">
            {!user && (
              <Link onClick={() => setIsOpen(false)} href="/login">
                Iniciar sesión
              </Link>
            )}
            {user && (
              <Link onClick={() => setIsOpen(false)} href="/my-account">
                Mis datos
              </Link>
            )}
            {!user && (
              <Link onClick={() => setIsOpen(false)} href="/register">
                Registrate
              </Link>
            )}
            <Separator color="bg-gray-200" />
            <Link onClick={() => setIsOpen(false)} href="/publicar-quinta">
              Publicá tu quinta
            </Link>
            <Link onClick={() => setIsOpen(false)} href="/membresia">
              Membresia premium
            </Link>
            <Link onClick={() => setIsOpen(false)} href="/support">
              Soporte
            </Link>
          </ul>
        )}
      </div>
    </header>
  );
}
