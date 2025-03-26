import Link from "next/link";
import Logo from "./icons/Logo";
import Soporte from "./icons/Soporte"

export default function Footer() {
  return (
    <footer className="flex flex-col px-10 pt-8">
        <section className="flex justify-between mb-20">
            <div className="flex flex-col w-96 gap-5">
                <Logo width={100} height="auto"/>
                <small>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum, qui facere minus numquam voluptas dicta eum perferendis fuga id eligendi illo, voluptates eos, nisi suscipit facilis iure alias nulla deserunt!
                </small>
                <div className="flex flex-col underline">
                <Link href="/">Términos y condiciones</Link>
                <Link href="/">Privacidad</Link>
                </div>
            </div>
            <div className="flex justify-center gap-10 items-center">
                <ul className="flex flex-col">
                    <Link className="font-medium" href="">Como ser anfitrion</Link>
                    <Link className="font-extralight" href="">Publicá tu Quinta</Link>
                    <Link className="font-extralight" href="">Recursos para anfitriones</Link>
                    <Link className="font-extralight" href="">Foro de la comunidad</Link>
                </ul>
                <ul className="flex flex-col">
                    <Link className="font-medium" href="">ZonaQuintas</Link>
                    <Link className="font-extralight" href="">Noticias</Link>
                    <Link className="font-extralight" href="">Manejo de la web</Link>
                    <Link className="font-extralight" href="">Empleo</Link>
                </ul>
            </div>
            <Link href="/" className="flex gap-1 items-start justify-center">
                <Soporte />
                <p className="mt-1">Soporte</p>
            </Link>
        </section>
        <section className="flex justify-between items-center font-bold bg-white">
            <p>©2025 - Todos los derechos reservados</p>
            <div className="flex justify-between items-center gap-5">
                <p>Desarrollado por </p>
                <Logo width="50" height={"auto"}/>
            </div>
        </section>
    </footer>
  )
}
