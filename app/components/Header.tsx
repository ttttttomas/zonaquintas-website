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
  const { user, loading } = useUser();
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

  const closeMenus = () => {
    setIsOpen(false);
    setIsOpen2(false);
  };

  const logout = async () => {
    try {
      const response = await AuthServices.logout();
      closeMenus();
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
    links.push({ label: "Publicá tu quinta", href: "/publicar-quinta" });

    if (user) {
      if (user.membership_status === "active") {
        links.push({ label: "Mi membresía", href: "/my-membership" });
      } else {
        links.push({ label: "Membresía premium", href: "/membresia" });
      }
    }
    links.push({ label: "Soporte", href: "/support" });

    if (user) {
      links.push({ type: "separator" });
      links.push({ label: "Cerrar sesión", onClick: logout });
      links.push({ type: "separator" });
      if (user.role === "admin") {
        links.push({ label: "Panel administrador", href: "/dashboard" });
      }
      links.push({ label: "Mis reservas", href: "/reservations" });
      links.push({ label: "Mis publicaciones", href: "/publications" });
      links.push({ label: "Wallet", href: "/wallet" });
    }
    return links;
  }, [user]);

  const UserAvatar = ({ size = "w-8" }: { size?: string }) => {
    if (!user) return <User />;
    const imgSrc = user.picture?.[0] || "/picture_user.jpg";
    return (
      <img
        src={imgSrc}
        alt="user profile"
        className={`${size} aspect-square rounded-full object-cover`}
      />
    );
  };

  const NavMenu = ({ isOpenMenu, closeMenu, isMobile }: { isOpenMenu: boolean, closeMenu: () => void, isMobile: boolean }) => (
    <ul
      ref={contentRef as any}
      style={{
        maxHeight: maxHeight,
        overflow: "hidden",
        transition: "max-height 0.6s ease, opacity 0.6s ease, transform 0.6s ease",
        opacity: isOpenMenu ? 1 : 0,
        transform: isOpenMenu ? "translateY(0)" : "translateY(-20px)",
        backgroundColor: "#2DB40A",
        padding: isOpenMenu ? "1rem" : "0",
        borderRadius: "0 0 10px 10px",
        color: "white",
        pointerEvents: isOpenMenu ? "auto" : "none",
      }}
      className={`text-white menu-container font-medium flex flex-col gap-2 absolute bg-primaryDark rounded-b-xl px-6 py-3 min-w-[200px] z-50 
        ${isMobile ? "right-0 top-11" : "top-15 right-14"}`}
    >
      {navLinks.map((link, index) => {
        if (link.type === "separator") {
          return <Separator key={`sep-${index}`} color="bg-gray-200/30" />;
        }
        if (link.onClick) {
          return (
            <button key={index} className="cursor-pointer text-start w-full hover:opacity-80 transition-opacity" onClick={link.onClick}>
              {link.label}
            </button>
          );
        }
        return (
          <Link key={index} onClick={closeMenu} href={link.href} className="hover:opacity-80 transition-opacity">
            {link.label}
          </Link>
        );
      })}
    </ul>
  );

  const UserSectionSkeleton = () => (
    <div className="flex items-center gap-3 px-3 py-1 rounded-4xl bg-primaryDark/20 animate-pulse min-w-[140px] h-[38px]">
      <div className="w-5 h-1 bg-white/20 rounded-full" />
      <div className="h-4 bg-white/20 rounded w-20" />
      <div className="w-7 h-7 bg-white/20 rounded-full" />
    </div>
  );

  return (
    <header className="flex md:flex-row flex-col md:gap-0 gap-2 z-10 backdrop-blur-sm fixed top-0 w-full justify-between items-center py-2 px-5 md:px-10 mb-5">
      <section className="flex justify-between items-center gap-5 md:w-auto w-full">
        <Link href="/" className="flex items-center gap-3">
          <Logo className="w-[50px] md:w-[70px]" />
          <p className="font-semibold text-sm md:text-lg">ZonaQuintas</p>
        </Link>

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
      </section>

      <div className="font-semibold md:pr-26 text-wrap text-sm md:text-lg">
        {title}
      </div>

      {loading ? (
        <div className="hidden md:block">
          <UserSectionSkeleton />
        </div>
      ) : (
        <div className="bg-primaryDark md:flex hidden items-center gap-3 px-3 py-1 rounded-4xl justify-between relative">
          <Menu onClick={handleClick} />
          <Link
            className="flex items-center gap-2 text-white justify-center"
            href={user ? "/my-account" : "/login"}
          >
            {user && <button className="max-w-[120px] cursor-pointer truncate">{user.name}</button>}
            <UserAvatar size="w-8" />
          </Link>
          <NavMenu isOpenMenu={isOpen} closeMenu={closeMenus} isMobile={false} />
        </div>
      )}
    </header>
  );
}
