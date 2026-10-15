export type ViewMode = "guest" | "owner";

export function routeViewMode(path: string): ViewMode | null {
  const matches = (route: string) => path === route || path.startsWith(`${route}/`);
  if (["/propietario", "/reservations", "/publications", "/wallet", "/publicar-quinta"].some(matches)) return "owner";
  if (path === "/" || ["/estadias", "/favorites", "/quintas"].some(matches)) return "guest";
  return null;
}

export const ownerNavigation = [
  { href: "/reservations", label: "Reservas" },
  { href: "/publications", label: "Publicaciones" },
  { href: "/wallet", label: "Wallet" },
];

export const guestNavigation = [
  { href: "/estadias", label: "Mis estadías" },
  { href: "/favorites", label: "Favoritos" },
];
