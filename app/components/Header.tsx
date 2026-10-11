"use client";
import User from "./icons/User";
import Logo from "./icons/Logo";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "../context/UserContext";
import { AuthServices } from "@/app/services/AuthServices";
import toast from "react-hot-toast";
import { Menu as MenuIcon, X, Wallet, LogOut, HelpCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { user, loading } = useUser();
  const path = usePathname();
  const showAccountNavigation = ![
    "/my-account",
    "/reservations",
    "/publications",
    "/wallet",
  ].includes(path);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => setIsMobileMenuOpen(false), [path]);

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
    setIsMobileMenuOpen(false);
  };

  const logout = async () => {
    try {
      const response = await AuthServices.logout();
      closeMenus();
      // Borrar cookie de frontend
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax; Secure";
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
      links.push({ label: "Cerrar sesión", onClick: logout });
      if (user.role === "admin") {
        links.push({ label: "Panel Administrador", href: "/dashboard" });
      }
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
    <header className="fixed inset-x-0 top-0 z-50 flex h-16 flex-row items-center justify-between bg-white/95 px-4 shadow-sm backdrop-blur-sm md:h-auto md:bg-transparent md:px-10 md:py-2 md:shadow-none">
      <ul className="hidden gap-5 items-center md:flex">
        {showAccountNavigation && (
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
                      <DropdownMenuItem
                        key={index}
                        onClick={link.onClick}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                      >
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
        )}
        <li className="text-gray-900 cursor-pointer hover:opacity-80 transition-opacity font-medium text-md">
          <Link href="/publicar-quinta">Publica tu Quinta</Link>
        </li>
        <li className="text-gray-900 cursor-pointer hover:opacity-80 transition-opacity font-medium text-md">
          <Link href="/support">Soporte</Link>
        </li>
      </ul>
      <Link href="/" className="flex items-center gap-3">
        <Logo className="w-10 md:w-[70px]" />
        <div className="leading-tight">
          <p className="font-semibold text-sm md:text-lg">ZonaQuintas</p>
          <span className="hidden md:block">{title}</span>
        </div>
      </Link>

      {loading ? (
        <div className="hidden md:block">
          <UserSectionSkeleton />
        </div>
      ) : (
        <div className="hidden items-center gap-3 justify-between relative md:flex">
          {user ? (
            <div className="hidden md:flex bg-primaryDark items-center px-3 py-1 rounded-4xl gap-2 text-white justify-center">
              {user && <p className="truncate">Bienvenido/a, {user.name}!</p>}
              <UserAvatar size="w-8" />
            </div>
          ) : (
            <div className="md:flex items-center hidden gap-2 text-black divide-x divide-gray-400 justify-center">
              <Link href="/login">
                <p className="cursor-pointer truncate pr-2 font-medium text-md hover:opacity-80 transition-opacity">
                  Inicia sesión
                </p>
              </Link>
              <Link href="/register">
                <p className="cursor-pointer truncate pl-2 font-medium text-md hover:opacity-80 transition-opacity">
                  Registrate
                </p>
              </Link>
            </div>
          )}
        </div>
      )}
      <div className="flex items-center gap-5 md:hidden">
        <Link href="/support">
          <HelpCircle size={23} aria-hidden="true" />
        </Link>
        {user && (
          <Link href="/wallet">
            <Wallet size={23} aria-hidden="true" />
          </Link>
        )}
        {user && (
          <Link href="/login" onClick={logout}>
            <LogOut size={23} aria-hidden="true" />
          </Link>
        )}
        {!user && (
          <Link className="flex items-center text-md text-white bg-primaryDark rounded-full px-4 py-2 shadow-md" href="/login">
            Iniciar sesion
          </Link>
        )}
      </div>
      {isMobileMenuOpen && (
        <nav
          id="mobile-header-menu"
          aria-label="Menú principal"
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-gray-100 bg-white px-4 py-3 shadow-lg md:hidden"
        >
          <div className="flex flex-col">
            {navLinks.map((link, index) => {
              if (link.type === "separator") {
                return (
                  <hr
                    key={`separator-${index}`}
                    className="my-2 border-gray-100"
                  />
                );
              }
              if (link.onClick) {
                return (
                  <button
                    key={link.label}
                    type="button"
                    onClick={link.onClick}
                    className="min-h-11 text-left text-sm font-medium text-red-600"
                  >
                    {link.label}
                  </button>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenus}
                  className="flex min-h-11 items-center text-sm font-medium text-gray-800"
                >
                  {link.label}
                </Link>
              );
            })}
            {user && (
              <Link
                href="/estadias"
                onClick={closeMenus}
                className="flex min-h-11 items-center text-sm font-medium text-gray-800"
              >
                Mis estadías
              </Link>
            )}
            <hr className="my-2 border-gray-100" />
            <Link
              href="/support"
              onClick={closeMenus}
              className="flex min-h-11 items-center text-sm font-medium text-gray-800"
            >
              Soporte
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
