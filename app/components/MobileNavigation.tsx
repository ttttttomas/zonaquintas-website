"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, House, PanelsTopLeft, Plus, UserRound } from "lucide-react";

const items = [
  { href: "/", label: "Inicio", icon: House, matches: (path: string) => path === "/" || path.startsWith("/quintas") || path === "/favorites" },
  { href: "/reservations", label: "Reservas", icon: CalendarDays, matches: (path: string) => path.startsWith("/reservations") || path.startsWith("/estadias") },
  { href: "/publicar-quinta/paso-1", label: "Publicar", icon: Plus, matches: (path: string) => path.startsWith("/publicar-quinta"), primary: true },
  { href: "/publications", label: "Publicaciones", icon: PanelsTopLeft, matches: (path: string) => path.startsWith("/publications") },
  { href: "/my-account", label: "Cuenta", icon: UserRound, matches: (path: string) => ["/my-account", "/wallet", "/dashboard", "/membresia", "/membership"].some((route) => path === route || path.startsWith(`${route}/`)) },
];

export default function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 items-end border-t border-gray-200 bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5 shadow-[0_-4px_16px_rgba(15,23,42,0.08)] backdrop-blur-md md:hidden"
    >
      {items.map(({ href, label, icon: Icon, matches, primary }) => {
        const active = matches(pathname);
        const destination = href === "/reservations" && pathname.startsWith("/estadias") ? "/estadias" : href;
        return (
          <Link
            key={href}
            href={destination}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-12 flex-col items-center justify-end gap-0.5 py-1 text-[10px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primaryDark ${active ? "text-primaryDark" : "text-gray-500 hover:text-gray-900"}`}
          >
            {primary ? (
              <span className={`-mt-5 flex size-11 items-center justify-center rounded-full text-white shadow-md ${active ? "bg-primaryDark" : "bg-green-500"}`}>
                <Icon size={23} strokeWidth={2.5} aria-hidden="true" />
              </span>
            ) : (
              <Icon size={21} strokeWidth={active ? 2.3 : 1.8} aria-hidden="true" />
            )}
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
