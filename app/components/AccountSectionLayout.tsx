"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, House, Wallet, UserRound } from "lucide-react";
import type { ReactNode } from "react";

const sections = [
  { href: "/my-account", label: "Mi perfil", icon: UserRound },
  { href: "/wallet", label: "Mi Wallet", icon: Wallet },
  { href: "/reservations", label: "Mis reservas", icon: CalendarDays },
  { href: "/publications", label: "Mis publicaciones", icon: House },
];

export default function AccountSectionLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return <div className="mx-0 min-h-[70vh] w-full max-w-none px-4 pb-7 pt-7 md:px-8 lg:px-10 lg:pb-12">
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
  </div>;
}
