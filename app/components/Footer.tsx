import Link from "next/link";
import Logo from "./icons/Logo";
import Soporte from "./icons/Soporte";

export default function Footer() {
  return (
    <footer className="flex flex-col pt-8">
      <section className="flex flex-col px-5 md:px-10 md:flex-row gap-5 justify-between border-t pt-5 border-gray-300 md:mb-20">
        <div className="flex flex-col justify-center items-center w-full md:w-96 gap-5">
          <Logo width={100} height="auto" />
          <small>
            ZonaQuintas es una plataforma digital para alquilar casas de fin de
            semana en Argentina. Conectamos propietarios y viajeros de forma
            simple, rápida y segura.
          </small>
          <div className="flex md:flex-col underline justify-between w-full flex-row">
            <Link href="/">Términos y condiciones</Link>
            <Link href="/">Privacidad</Link>
          </div>
        </div>
        <div className="flex justify-center gap-10 items-center">
          <ul className="flex flex-col">
            <Link className="font-medium" href="">
              Como ser anfitrion
            </Link>
            <Link className="font-extralight" href="">
              Publicá tu Quinta
            </Link>
            <Link className="font-extralight" href="">
              Foro de la comunidad
            </Link>
          </ul>
          <ul className="flex flex-col">
            <Link className="font-medium" href="">
              ZonaQuintas
            </Link>
            <Link className="font-extralight" href="">
              Manejo de la web
            </Link>
            <Link className="font-extralight" href="">
              Empleo
            </Link>
          </ul>
        </div>
        <Link href="/" className="flex gap-1 md:mb-0 mb-5 items-start justify-center">
          <Soporte />
          <p className="mt-1">Soporte</p>
        </Link>
      </section>
      <section className="flex w-full justify-between items-center font-bold px-5 md:px-10 bg-white">
        <p>©2025 - Todos los derechos reservados</p>
        <div className="flex justify-between items-center gap-5">
          <p>Desarrollado por </p>
          <Logo width="50" height={"auto"} />
        </div>
      </section>
    </footer>
  );
}
