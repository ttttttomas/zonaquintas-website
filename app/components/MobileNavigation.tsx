"use client";

import { useUser } from "@/app/context/UserContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarDays, ChevronUp, House, PanelsTopLeft, Plus, UserRound, Wallet, Heart } from "lucide-react";

const isHomeActive = (path: string) => path === "/" || path.startsWith("/quintas");
const isManagementActive = (path: string) => path.startsWith("/reservations") || path.startsWith("/estadias") || path.startsWith("/publications");
const isAccountActive = (path: string) => ["/my-account", "/dashboard", "/membresia", "/membership"].some((route) => path === route || path.startsWith(`${route}/`));

export default function MobileNavigation() {
  const pathname = usePathname();
  const { user, viewMode } = useUser();
  const ownerMode = !!user && viewMode === "owner";
  const [managementOpen, setIsManagementOpen] = useState(false);
  const isManagementOpen = ownerMode && managementOpen;

  useEffect(() => {
    if (!isManagementOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsManagementOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isManagementOpen]);

  const closeMenu = () => setIsManagementOpen(false);

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar menú de gestión"
        tabIndex={isManagementOpen ? 0 : -1}
        onClick={closeMenu}
        className={`fixed inset-0 z-30 bg-black/20 transition-opacity duration-200 md:hidden ${isManagementOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <div
        id="mobile-management-menu"
        role="group"
        aria-label="Opciones de gestión"
        aria-hidden={!isManagementOpen}
        className={`fixed left-10 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-40 rounded-2xl border border-gray-200 bg-white p-2 shadow-[0_8px_30px_rgba(15,23,42,0.18)] transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none md:hidden ${isManagementOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
      >
        <Link
          href="/reservations"
          aria-current={pathname.startsWith("/reservations") || pathname.startsWith("/estadias") ? "page" : undefined}
          tabIndex={isManagementOpen ? 0 : -1}
          onClick={closeMenu}
          className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-primaryDark"
        >
          <CalendarDays size={20} aria-hidden="true" />
          <span>Reservas</span>
        </Link>
        <Link
          href="/publications"
          aria-current={pathname.startsWith("/publications") ? "page" : undefined}
          tabIndex={isManagementOpen ? 0 : -1}
          onClick={closeMenu}
          className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-primaryDark"
        >
          <PanelsTopLeft size={20} aria-hidden="true" />
          <span>Publicaciones</span>
        </Link>
      </div>
      <nav
        aria-label="Navegación principal"
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 items-end border-t border-gray-200 bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5 shadow-[0_-4px_16px_rgba(15,23,42,0.08)] backdrop-blur-md md:hidden"
      >
        <Link
          href={ownerMode ? "/propietario" : "/"}
          aria-current={(ownerMode ? pathname === "/propietario" : isHomeActive(pathname)) ? "page" : undefined}
          className={`flex min-h-12 flex-col items-center justify-end gap-0.5 py-1 text-[10px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primaryDark ${(ownerMode ? pathname === "/propietario" : isHomeActive(pathname)) ? "text-primaryDark" : "text-gray-500 hover:text-gray-900"}`}
        >
          <House size={21} strokeWidth={(ownerMode ? pathname === "/propietario" : isHomeActive(pathname)) ? 2.3 : 1.8} aria-hidden="true" />
          <span>Inicio</span>
        </Link>
        {ownerMode ? (
        <button
          type="button"
          aria-expanded={isManagementOpen}
          aria-controls="mobile-management-menu"
          onClick={() => setIsManagementOpen((open) => !open)}
          className={`flex min-h-12 flex-col items-center justify-end gap-0.5 py-1 text-[10px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primaryDark ${isManagementActive(pathname) || isManagementOpen ? "text-primaryDark" : "text-gray-500 hover:text-gray-900"}`}
        >
          {isManagementOpen ? <ChevronUp size={21} aria-hidden="true" /> : <CalendarDays size={21} aria-hidden="true" />}
          <span>Gestión</span>
        </button>
) : <Link href="/estadias" aria-current={pathname.startsWith("/estadias") ? "page" : undefined} className={`flex min-h-12 flex-col items-center justify-end gap-0.5 py-1 text-[10px] font-medium focus-visible:outline-2 focus-visible:outline-primaryDark ${pathname.startsWith("/estadias") ? "text-primaryDark" : "text-gray-500"}`}><CalendarDays size={21} aria-hidden="true" /><span>Estadías</span></Link>}
        <Link
          href="/publicar-quinta/paso-1"
          aria-current={pathname.startsWith("/publicar-quinta") ? "page" : undefined}
          className={`flex min-h-12 flex-col items-center justify-end gap-0.5 py-1 text-[10px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primaryDark ${pathname.startsWith("/publicar-quinta") ? "text-primaryDark" : "text-gray-500 hover:text-gray-900"}`}
        >
          <span className={`-mt-5 flex size-11 items-center justify-center rounded-full text-white shadow-md ${pathname.startsWith("/publicar-quinta") ? "bg-primaryDark" : "bg-green-500"}`}>
            <Plus size={23} strokeWidth={2.5} aria-hidden="true" />
          </span>
          <span>Publicar</span>
        </Link>
        <Link
          href={ownerMode ? "/wallet" : "/favorites"}
          aria-current={(ownerMode ? pathname.startsWith("/wallet") : pathname.startsWith("/favorites")) ? "page" : undefined}
          className={`flex min-h-12 flex-col items-center justify-end gap-0.5 py-1 text-[10px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primaryDark ${(ownerMode ? pathname.startsWith("/wallet") : pathname.startsWith("/favorites")) ? "text-primaryDark" : "text-gray-500 hover:text-gray-900"}`}
        >
          {ownerMode ? <Wallet size={21} strokeWidth={(ownerMode ? pathname.startsWith("/wallet") : pathname.startsWith("/favorites")) ? 2.3 : 1.8} aria-hidden="true" />
          : <Heart size={21} aria-hidden="true" />}
          <span>{ownerMode ? "Wallet" : "Favoritos"}</span>
        </Link>
        <Link
          href="/my-account"
          aria-current={isAccountActive(pathname) ? "page" : undefined}
          className={`flex min-h-12 flex-col items-center justify-end gap-0.5 py-1 text-[10px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primaryDark ${isAccountActive(pathname) ? "text-primaryDark" : "text-gray-500 hover:text-gray-900"}`}
        >
          <UserRound size={21} strokeWidth={isAccountActive(pathname) ? 2.3 : 1.8} aria-hidden="true" />
          <span>Cuenta</span>
        </Link>
      </nav>
    </>
  );
}
