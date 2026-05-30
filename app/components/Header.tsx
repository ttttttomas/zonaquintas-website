"use client";
import User from "./icons/User";
import Menu from "./icons/Menu";
import Logo from "./icons/Logo";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "../context/UserContext";
import { AuthServices } from "@/app/services/AuthServices";
import toast from "react-hot-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const { user, loading } = useUser();
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState("0px");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const titlesMap: { [key: string]: React.ReactNode } = {
    "/": "Encontrá, reservá y disfrutá.",
    "/favorites": "Mis favoritos",
    "/support": "Soporte",
    "/quintas": "Resultados de busqueda de Quintas",
    "/terms": "Términos y condiciones",
    "/politics": "Políticas de privacidad",
    "/dashboard": "Panel administrador",
    "/my-account": "Mis datos",
    "/reservations": "Mis reservas",
    "/publications": "Mis publicaciones",
    "/wallet": "Wallet",
    "/membresia": "Membresía para Propietarios",
  };

  const title = useMemo(() => titlesMap[path] || null, [path]);

  const closeMenus = () => {
    setIsOpen(false);
    setIsOpen2(false);
  };

  const logout = async () => {
    try {
      const response = await AuthServices.logout();
      closeMenus();
      // Borrar cookie de frontend
      document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure";
      setTimeout(() => {
        window.location.href = "/";
        toast.success(response.data.message);
      }, 1000);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error al cerrar sesión");
    }
  };

  // Centralized Navigation Links
  const navLinks = useMemo(() => {
    const links: any[] = [];
    if (!user) {
      links.push({ label: "Iniciar sesión", href: "/login" });
      links.push({ label: "Registrate", href: "/register" });
    }

    // if (user) {
    //   if (user.membership_status === "active") {
    //     links.push({ label: "Mis Datos", href: "/my-account" });
    //     links.push({ label: "Mi Membresía", href: "/my-membership" });
    //   } else {
    //     links.push({ label: "Mis Datos", href: "/my-account" });
    //     links.push({ label: "Membresía Premium", href: "/membresia" });
    //   }
    // }

    if (user) {
      links.push({ label: "Mis Datos", href: "/my-account" });
      links.push({ type: "separator" });
      links.push({ label: "Cerrar sesión", onClick: logout });
      links.push({ type: "separator" });
      if (user.role === "admin") {
        links.push({ label: "Panel Administrador", href: "/dashboard" });
      }
      links.push({ label: "Mis Reservas", href: "/reservations" });
      links.push({ label: "Mis Publicaciones", href: "/publications" });
      links.push({ label: "Wallet", href: "/wallet" });
    }
    return links;
  }, [user]);

  const UserAvatar = ({ size = "w-8" }: { size?: string }) => {
    if (!user) return <User />;
    const imgSrc = user?.pictures[0]?.url || "/picture_user.jpg";
    return (
      <img
        src={imgSrc}
        alt="user profile"
        className={`${size} aspect-square rounded-full object-cover`}
      />
    );
  };

  const UserSectionSkeleton = () => (
    <div className="flex items-center gap-3 px-3 py-1 rounded-4xl bg-primaryDark/20 animate-pulse min-w-[140px] h-[38px]">
      <div className="w-5 h-1 bg-white/20 rounded-full" />
      <div className="h-4 bg-white/20 rounded w-20" />
      <div className="w-7 h-7 bg-white/20 rounded-full" />
    </div>
  );

  return (
    <header className="flex md:flex-row flex-col md:gap-0 gap-2 z-10 backdrop-blur-sm fixed top-0 w-full justify-between items-center py-2 px-5 md:px-10 mb-5">
      {/* <section className="flex justify-between items-center gap-5 md:w-auto w-full">
        {loading ? (
          <div className="md:hidden">
            <UserSectionSkeleton />
          </div>
        ) : (
          <div className="bg-primaryDark flex md:hidden items-center gap-3 px-3 py-1 rounded-4xl justify-between relative">
            <Menu onClick={handleClick2} />
            <Link className="flex items-center gap-2 text-white justify-center" href="/my-account">
              <UserAvatar size="w-7" />
            </Link>
            <NavMenu isOpenMenu={isOpen2} closeMenu={closeMenus} isMobile={true} />
          </div>
        )}
      </section> */}

      {/* <Menu onClick={handleClick} />
        <NavMenu isOpenMenu={isOpen} closeMenu={closeMenus} isMobile={false} /> */}
      <ul className="flex gap-5 items-center md:my-0 my-2">
        <li className="text-gray-900 cursor-pointer">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger
              disabled={!user && !isMobile}
              className={`outline-none flex items-center gap-1 hover:opacity-80 transition-opacity font-medium text-md ${
                !user && !isMobile
                  ? "text-gray-300 cursor-default"
                  : "text-gray-900 cursor-pointer"
              }`}
            >
              Mi Cuenta <span className="text-[10px] ">▼</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={8}
              className="w-46 bg-white shadow-lg border border-gray-100"
            >
              {navLinks.map((link, index) => {
                if (link.type === "separator") {
                  return <DropdownMenuSeparator key={index} />;
                }
                if (link.onClick) {
                  return (
                    <DropdownMenuItem key={index} onClick={link.onClick} className="cursor-pointer text-red-600 focus:text-red-600">
                      {link.label}
                    </DropdownMenuItem>
                  );
                }
                return (
                  <DropdownMenuItem key={index} asChild>
                    <Link href={link.href} className="w-full cursor-pointer">
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
        <li className="text-gray-900 cursor-pointer hover:opacity-80 transition-opacity font-medium text-md">
          <Link href="/publicar-quinta">Publica tu Quinta</Link>
        </li>
        <li className="text-gray-900 cursor-pointer hover:opacity-80 transition-opacity font-medium text-md">
          <Link href="/support">Soporte</Link>
        </li>
      </ul>
      <Link href="/" className="flex items-center gap-3">
        <Logo className="w-[50px] md:w-[70px]" />
        <div>
          <p className="font-semibold text-sm md:text-lg">ZonaQuintas</p>
          {title}
        </div>
      </Link>

      {loading ? (
        <div className="hidden md:block">
          <UserSectionSkeleton />
        </div>
      ) : (
        <div className="flex items-center gap-3 justify-between relative">
          {user ? (
            <div className="hidden md:flex bg-primaryDark items-center px-3 py-1 rounded-4xl gap-2 text-white justify-center">
              {user && <p className="truncate">Bienvenido/a, {user.name}!</p>}
              <UserAvatar size="w-8" />
            </div>
          ) : (
            <div className="md:flex items-center hidden gap-2 text-black divide-x divide-gray-400 justify-center">
              <Link href="/login">
                <p className="cursor-pointer truncate pr-2 font-medium text-md hover:opacity-80 transition-opacity">Inicia sesión</p>
              </Link>
              <Link href="/register">
                <p className="cursor-pointer truncate pl-2 font-medium text-md hover:opacity-80 transition-opacity">Registrate</p>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
