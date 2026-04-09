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
          <small className="font-semibold">
            ZonaQuintas es una plataforma digital para alquilar casas de fin de
            semana en Argentina. Conectamos propietarios y viajeros de forma
            simple, rápida y segura.
          </small>
          <div className="flex md:flex-col text-sm md:text-md underline items-start justify-between w-full flex-row">
            <Link href="/terms">Términos y condiciones</Link>
            <Link href="/politics">Políticas de privacidad</Link>
          </div>
        </div>
        <div className="flex justify-center gap-10 items-center">
          <ul className="flex flex-col">
            <p className="font-medium underline  text-sm md:text-md">
              Como ser anfitrion
            </p>
            <Link
              className="font-light  text-sm md:text-md text-black/60"
              href="publicar-quinta">
              Publicá tu Quinta
            </Link>
          </ul>
          <ul className="flex flex-col  text-sm md:text-md">
            <Link
              target="_blank"
              className="font-medium flex items-center gap-2"
              href="https://www.instagram.com/zonaquintas/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                preserveAspectRatio="xMidYMid"
                viewBox="0 0 256 256">
                <path
                  fill="#000"
                  d="M128 23.064c34.177 0 38.225.13 51.722.745 12.48.57 19.258 2.655 23.769 4.408 5.974 2.322 10.238 5.096 14.717 9.575 4.48 4.479 7.253 8.743 9.575 14.717 1.753 4.511 3.838 11.289 4.408 23.768.615 13.498.745 17.546.745 51.723 0 34.178-.13 38.226-.745 51.723-.57 12.48-2.655 19.257-4.408 23.768-2.322 5.974-5.096 10.239-9.575 14.718-4.479 4.479-8.743 7.253-14.717 9.574-4.511 1.753-11.289 3.839-23.769 4.408-13.495.616-17.543.746-51.722.746-34.18 0-38.228-.13-51.723-.746-12.48-.57-19.257-2.655-23.768-4.408-5.974-2.321-10.239-5.095-14.718-9.574-4.479-4.48-7.253-8.744-9.574-14.718-1.753-4.51-3.839-11.288-4.408-23.768-.616-13.497-.746-17.545-.746-51.723 0-34.177.13-38.225.746-51.722.57-12.48 2.655-19.258 4.408-23.769 2.321-5.974 5.095-10.238 9.574-14.717 4.48-4.48 8.744-7.253 14.718-9.575 4.51-1.753 11.288-3.838 23.768-4.408 13.497-.615 17.545-.745 51.723-.745M128 0C93.237 0 88.878.147 75.226.77c-13.625.622-22.93 2.786-31.071 5.95-8.418 3.271-15.556 7.648-22.672 14.764C14.367 28.6 9.991 35.738 6.72 44.155 3.555 52.297 1.392 61.602.77 75.226.147 88.878 0 93.237 0 128c0 34.763.147 39.122.77 52.774.622 13.625 2.785 22.93 5.95 31.071 3.27 8.417 7.647 15.556 14.763 22.672 7.116 7.116 14.254 11.492 22.672 14.763 8.142 3.165 17.446 5.328 31.07 5.95 13.653.623 18.012.77 52.775.77s39.122-.147 52.774-.77c13.624-.622 22.929-2.785 31.07-5.95 8.418-3.27 15.556-7.647 22.672-14.763 7.116-7.116 11.493-14.254 14.764-22.672 3.164-8.142 5.328-17.446 5.95-31.07.623-13.653.77-18.012.77-52.775s-.147-39.122-.77-52.774c-.622-13.624-2.786-22.929-5.95-31.07-3.271-8.418-7.648-15.556-14.764-22.672C227.4 14.368 220.262 9.99 211.845 6.72c-8.142-3.164-17.447-5.328-31.071-5.95C167.122.147 162.763 0 128 0Zm0 62.27C91.698 62.27 62.27 91.7 62.27 128c0 36.302 29.428 65.73 65.73 65.73 36.301 0 65.73-29.428 65.73-65.73 0-36.301-29.429-65.73-65.73-65.73Zm0 108.397c-23.564 0-42.667-19.103-42.667-42.667S104.436 85.333 128 85.333s42.667 19.103 42.667 42.667-19.103 42.667-42.667 42.667Zm83.686-110.994c0 8.484-6.876 15.36-15.36 15.36-8.483 0-15.36-6.876-15.36-15.36 0-8.483 6.877-15.36 15.36-15.36 8.484 0 15.36 6.877 15.36 15.36Z"
                />
              </svg>
              <p>Instagram</p>
            </Link>
            <Link
              className="font-light text-black/60  text-sm md:text-md"
              href="/support">
              Preguntas frecuentes
            </Link>
          </ul>
        </div>
        <Link
          href="/support#form"
          className="flex gap-1 md:mb-0 mb-5 items-start pt-5 justify-center">
          <Soporte />
          <p className="mt-1">Soporte</p>
        </Link>
      </section>
      <section className="flex flex-col md:flex-row w-full justify-between items-center font-bold md:px-10 bg-white">
        <p className="text-xs md:text-md">
          ©2025 - Todos los derechos reservados
        </p>
        <div className="flex justify-between md:w-auto w-full md:pl-0 pl-5 items-center gap-5">
          <p className="text-xs md:text-md">Desarrollado por </p>
          <Link target="_blank" href="https://www.iwebtecnology.com/">
            <img src="/iweb.png" alt="logo" className="h-10" />
          </Link>
        </div>
      </section>
    </footer>
  );
}
