"use client";
import User from "./icons/User";
import Menu from "./icons/Menu";
import Logo from "./icons/Logo";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Separator } from "./ui/Separator";
import { usePathname } from "next/navigation";
import { useUser } from "../context/UserContext";
import { AuthServices } from "@/app/services/AuthServices";
import toast from "react-hot-toast";

export default function Header() {
  const { user } = useUser();
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  useEffect(() => {
    if (isOpen || (isOpen2 && contentRef.current)) {
      setMaxHeight(`${contentRef?.current?.scrollHeight}px`);
    } else {
      setMaxHeight("0px");
    }
  }, [isOpen, isOpen2]);
  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  const handleClick2 = () => {
    setIsOpen2(!isOpen2);
  };

  const logout = async () => {
    try {
      const response = await AuthServices.logout();
      console.log(response);
      setTimeout(() => {
        window.location.href = "/";
        toast.success(response.data.message);
      }, 1000);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Error al iniciar sesión. Revise su conexión y/o credenciales.";
      toast.error(message);
    }
  };

  const titlesMap: { [key: string]: React.ReactNode } = {
    "/": "Encontrá, reservá y disfrutá.",
    "/favorites": "Mis favoritos",
    "/support": "Soporte",
    "/quintas": "Resultados de busqueda de Quintas",
    "/terms": "Términos y condiciones",
    "/politics": "Políticas de privacidad",
    "/dashboard": "Panel administrador",
    "/reservations": "Mis reservas",
    "/publications": "Mis publicaciones",
    "/wallet": "Wallet",
    "/membresia": "Membresía para Propietarios",
  };

  const title = useMemo(() => titlesMap[path] || null, [path]);
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
            <ul
              ref={contentRef as any}
              style={{
                maxHeight: maxHeight,
                overflow: "hidden",
                transition:
                  "max-height 0.6s ease, opacity 0.6s ease, transform 0.6s ease",
                opacity: isOpen2 ? 1 : 0,
                transform: isOpen2 ? "translateY(0)" : "translateY(-20px)",
                backgroundColor: "#2DB40A",
                padding: "1rem",
                borderRadius: "0 0 10px 10px",
                color: "white",
              }}
              className={`text-white menu-container ${isOpen2 ? "open" : "closed"} font-medium flex flex-col gap-2 right-0 top-16 md:right-4 text-md absolute bg-primaryDark rounded-b-xl px-6 py-3`}
            >
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
        {title}
      </div>
      <div className="bg-primaryDark md:flex hidden items-center gap-3 px-3 py-1 rounded-4xl justify-between">
        <Menu onClick={handleClick} />
        <button>
          <Link
            className="flex items-center gap-2 text-white justify-center"
            href="/my-account"
          >
            {/* SI HAY USUARIO, ACA VA EL NOMBRE ACTIVO  */}
            {user && user.name}
            {user ? (
              user.picture ? (
                <img
                  src={user.picture[0]}
                  alt="user profile"
                  className="w-8 rounded-full"
                />
              ) : (
                <img
                  src={"/picture_user.jpg"}
                  alt="user profile"
                  className="w-8 rounded-full"
                />
              )
            ) : (
              <User />
            )}
          </Link>
        </button>
        {isOpen && (
          <ul
            ref={contentRef as any}
            style={{
              maxHeight: maxHeight,
              overflow: "hidden",
              transition:
                "max-height 0.1s ease, opacity 0.1s ease, transform 0.1s ease",
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? "translateY(0)" : "translateY(-20px)",
              backgroundColor: "#2DB40A",
              padding: "1rem",
              borderRadius: "0 0 10px 10px",
              color: "white",
            }}
            className={`text-white menu-container ${isOpen ? "open" : "closed"} font-medium flex flex-col gap-2 top-36 right-32 md:top-15 md:right-14 text-md absolute bg-primaryDark rounded-b-xl px-6 py-3`}
          >
            {!user && (
              <Link onClick={() => setIsOpen(false)} href="/login">
                Iniciar sesión
              </Link>
            )}
            {!user && (
              <Link onClick={() => setIsOpen(false)} href="/register">
                Registrate
              </Link>
            )}
            <Link onClick={() => setIsOpen(false)} href="/publicar-quinta">
              Publicá tu quinta
            </Link>
            <Link onClick={() => setIsOpen(false)} href="/membresia">
              Membresia premium
            </Link>
            <Link onClick={() => setIsOpen(false)} href="/support">
              Soporte
            </Link>

            {user && <Separator color="bg-gray-200" />}
            {user && (
              <button className="cursor-pointer" onClick={logout}>
                Cerrar sesión
              </button>
            )}
            <Separator color="bg-gray-200" />
            {user?.role === "admin" && (
              <Link onClick={() => setIsOpen(false)} href="/dashboard">
                Panel administador
              </Link>
            )}
            {user && (
              <>
                <Link onClick={() => setIsOpen(false)} href="/reservations">
                  Mis reservas
                </Link>
                <Link onClick={() => setIsOpen(false)} href="/publications">
                  Mis publicaciones
                </Link>
                <Link onClick={() => setIsOpen(false)} href="/wallet">
                  Wallet
                </Link>
              </>
            )}
          </ul>
        )}
      </div>
    </header>
  );
}
