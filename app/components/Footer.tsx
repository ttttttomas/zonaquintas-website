import Link from "next/link";
import Logo from "./icons/Logo";
import Soporte from "./icons/Soporte";
import SecondSeparator from "./SecondSeparator";

export default function Footer() {
  return (
    <footer className="flex flex-col">
      <SecondSeparator />
      <section className="flex flex-col px-5 md:px-10 md:flex-row gap-5 justify-between mt-8 pt-5 border-gray-300 md:mb-20">
        <div className="flex flex-col w-full md:w-96 gap-5">
          <div className="mx-auto md:mx-0">
            <Logo className="w-[120px]" />
          </div>
          <small>
            ZonaQuintas es una plataforma digital para alquilar casas de fin de
            semana en Argentina. Conectamos propietarios y viajeros de forma
            simple, rápida y segura.
          </small>
          <div className="flex md:flex-col underline items-start justify-between w-full flex-row">
            <Link href="/terms">Términos y condiciones</Link>
            <Link href="/politics">Políticas de privacidad</Link>
          </div>
        </div>
        <div className="flex justify-center gap-10 items-center">
          <ul className="flex flex-col">
            <Link className="font-medium" href="">
              Como ser anfitrion
            </Link>
            <Link className="font-light text-black/60" href="">
              Publicá tu Quinta
            </Link>
            {/* <Link className="font-light text-black/60" href="">
              Foro de la comunidad
            </Link> */}
          </ul>
          <ul className="flex flex-col">
            <Link className="font-medium" href="">
              ZonaQuintas
            </Link>
            <Link className="font-light text-black/60" href="">
              Manejo de la web
            </Link>
            <Link className="font-light text-black/60" href="/favorites">
              Favoritos
            </Link>
          </ul>
        </div>
        <Link href="/support" className="flex gap-1 md:mb-0 mb-5 items-start pt-5 justify-center">
          <Soporte />
          <p className="mt-1">Soporte</p>
        </Link>
      </section>
      <section className="flex w-full justify-between items-center font-bold px-5 md:px-10 bg-white">
        <p>©2025 - Todos los derechos reservados</p>
        <div className="flex justify-between items-center gap-5">
          <p>Desarrollado por </p>
          <Logo className="w-[50px]" />
        </div>
      </section>
    </footer>
  );
}
