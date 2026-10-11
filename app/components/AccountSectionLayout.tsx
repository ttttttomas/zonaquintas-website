"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, CircleHelp, House, Wallet, UserRound, Plus } from "lucide-react";
import type { ReactNode } from "react";

const sections = [
  { href: "/my-account", label: "Mi perfil", icon: UserRound },
  { href: "/wallet", label: "Mi Wallet", icon: Wallet },
  { href: "/reservations", label: "Mis reservas", icon: CalendarDays },
  { href: "/publications", label: "Mis publicaciones", icon: House },
];

export default function AccountSectionLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return <div className="mx-0 min-h-[70vh] w-full max-w-none px-4 pb-28 pt-7 md:px-8 lg:px-10 lg:pb-12">
    <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-8">
      <aside aria-label="Navegación de mi cuenta" className="hidden border-r border-gray-200 pr-5 lg:block">
        <nav className="sticky top-36 space-y-1">
          {sections.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${active ? "bg-green-50 text-primaryDark" : "text-gray-700 hover:bg-gray-50"}`}><Icon size={19} aria-hidden="true" />{label}</Link>;
          })}
        </nav>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
    <nav aria-label="Navegación móvil" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-gray-200 bg-white/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[0_-4px_16px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
      {[
        { href: "/quintas", label: "Inicio", icon: House },
        { href: "/reservations", label: "Reservas", icon: CalendarDays },
        { href: "/publicar-quinta/paso-1", label: "Publicar", icon: Plus },
        { href: "/publications", label: "Quintas", icon: House },
        { href: "/my-account", label: "Cuenta", icon: UserRound },
      ].map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={`flex flex-col items-center gap-1 py-1 text-[10px] font-medium ${pathname === href ? "text-primaryDark" : "text-gray-500"}`}><Icon size={20} aria-hidden="true" />{label}</Link>)}
    </nav>
  </div>;
}
