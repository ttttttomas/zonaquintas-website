"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import EstadiaCard, { bookingStatus } from "@/app/components/EstadiaCard";
import BookingReviews from "@/app/components/BookingReviews";
import { GuestServices, type GuestOverview } from "@/app/services/GuestServices";
import { argentinaToday } from "@/app/lib/availability";

const button = "rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm disabled:opacity-50";
function Skeleton() { return <main aria-busy="true" aria-label="Cargando tus estadías" className="mx-auto max-w-7xl space-y-6 px-4 py-10"><div className="h-12 w-60 animate-pulse rounded-xl bg-gray-200" /><div className="grid gap-5 md:grid-cols-3">{[0,1,2].map(n => <div key={n} className="h-32 animate-pulse rounded-xl bg-gray-200" />)}</div><div className="h-80 animate-pulse rounded-xl bg-gray-200" /></main>; }
export default function EstadiasPage() {
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [data, setData] = useState<GuestOverview | null>(null);
  const [loadedUser, setLoadedUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const [section, setSection] = useState("bookings");
  const [status, setStatus] = useState("all");
  const [period, setPeriod] = useState("all");
  const [query, setQuery] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  useEffect(() => {
    if (authLoading) return;
    if (!user?.id) { router.replace("/login"); return; }
    const controller = new AbortController(); setLoading(true); setError("");
    GuestServices.overview(controller.signal).then(result => { if (!controller.signal.aborted) { setData(result); setLoadedUser(user.id); } }).catch(() => { if (!controller.signal.aborted) setError("No pudimos cargar tus estadías. Intentá nuevamente."); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [authLoading,user?.id,router,revision]);
  if (authLoading || !user || loading) return <Skeleton />;
  if (error || !data || loadedUser !== user.id) return <main className="mx-auto max-w-7xl p-10"><p role="alert">{error || "No hay información disponible."}</p><button className={button + " mt-4"} onClick={() => setRevision(v => v+1)}>Reintentar</button></main>;
  const today = argentinaToday();
  const confirmed = data.bookings.filter(b => ["paid","finished"].includes(b.status.toLowerCase()));
  const upcoming = confirmed.filter(b => b.check_in.slice(0,10) > today).sort((a,b) => a.check_in.localeCompare(b.check_in));
  const current = confirmed.filter(b => b.check_in.slice(0,10) <= today && b.check_out.slice(0,10) >= today);
  const pendingReviews = data.bookings.filter(b => b.can_review).length;
  const bookings = data.bookings.filter(b => (status === "all" || b.status.toLowerCase() === status) && `${b.quinta_title || ""} ${b.id}`.toLocaleLowerCase().includes(query.toLocaleLowerCase().trim()) && (period === "all" || (period === "upcoming" ? b.check_in.slice(0,10) > today : period === "current" ? b.check_in.slice(0,10) <= today && b.check_out.slice(0,10) >= today : period === "review" ? b.can_review : b.check_out.slice(0,10) < today)));
  return <main className="mx-auto max-w-7xl px-4 py-8 text-gray-900 md:px-10">
    <header className="mb-8 flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-3xl font-semibold">Tus estadías</h1><p className="mt-2 text-gray-500">Tus escapadas, lugares guardados y experiencias.</p></div><button className={button} onClick={() => setRevision(v => v+1)}>Actualizar</button></header>
    <section aria-label="Resumen de tus viajes" className="mb-8 grid gap-4 md:grid-cols-3">{[["Próximas estadías",upcoming.length],["Estadías en curso",current.length],["Por calificar",pendingReviews]].map(([label,value]) => <article key={label} className="rounded-2xl border border-gray-200 bg-white p-6"><h2 className="text-sm text-gray-500">{label}</h2><p className="mt-3 text-3xl font-semibold">{value}</p></article>)}</section>
    {upcoming[0] && <p className="mb-8 rounded-xl bg-green-50 p-5 text-sm text-green-900">Tu próxima escapada: <strong>{upcoming[0].quinta_title}</strong> · {upcoming[0].check_in.slice(0,10)}</p>}
    <nav aria-label="Tu actividad" className="mb-6 flex gap-6 overflow-x-auto border-b border-gray-200">{[["bookings","Reservas",data.bookings.length],["favorites","Favoritos",data.favorites.length],["reviews","Mis reseñas",data.reviews.length]].map(([key,label,count]) => <button key={key} aria-pressed={section === key} onClick={() => setSection(String(key))} className={`shrink-0 border-b-2 pb-4 text-sm font-semibold ${section === key ? "border-primaryDark text-primaryDark" : "border-transparent text-gray-500"}`}>{label} ({count})</button>)}</nav>
    {section === "bookings" && <section aria-label="Tus reservas"><div className="mb-5 flex flex-wrap gap-2">{["all",...new Set([...Object.keys(bookingStatus),...data.bookings.map(b => b.status.toLowerCase())])].map(key => <button key={key} aria-pressed={status === key} className={button + (status === key ? " border-primaryDark text-primaryDark" : "")} onClick={() => setStatus(key)}>{key === "all" ? "Todas" : bookingStatus[key] || key} ({data.bookings.filter(b => key === "all" || b.status.toLowerCase() === key).length})</button>)}</div>
      <div className="mb-6 flex flex-wrap gap-3"><label className="flex flex-col gap-1 text-sm">Buscar reserva<input className={button} value={query} onChange={e => setQuery(e.target.value)} placeholder="Quinta o ID" /></label><label className="flex flex-col gap-1 text-sm">Momento de la estadía<select className={button} value={period} onChange={e => setPeriod(e.target.value)}><option value="all">Todas las fechas</option><option value="upcoming">Próximas</option><option value="current">En estas fechas</option><option value="past">Pasadas</option><option value="review">Por calificar</option></select></label></div>
      <div className="grid items-start gap-5 lg:grid-cols-2">{bookings.map(b => <EstadiaCard key={b.id} booking={b} review={data.reviews.find(r => r.booking_id === b.id)} saved={data.favorites.some(f => f.id === b.quinta_id)} onReview={() => setRevision(v => v+1)} onFavorite={async () => { await GuestServices.favorite(user.id,b.quinta_id); setRevision(v => v+1); }} />)}</div>{bookings.length === 0 && <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center"><p>No hay reservas para estos filtros.</p><Link href="/quintas" className="mt-3 inline-block text-primaryDark underline">Explorar quintas</Link></div>}
    </section>}
    {section === "favorites" && <section aria-label="Quintas favoritas"><p className="mb-5 text-sm text-gray-500">Mostramos tus favoritas que siguen publicadas.</p>{actionError && <p role="alert" className="mb-4 text-red-700">{actionError}</p>}<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{data.favorites.map(f => <article key={f.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white"><Link href={`/quintas/${f.id}`}><img src={f.main_image || "/quinta.jpg"} alt={f.title} className="aspect-[4/3] w-full object-cover" /><div className="p-5"><h2 className="font-semibold">{f.title}</h2><p className="mt-1 text-sm text-gray-500">{f.city}</p><p className="mt-3 text-sm">{new Intl.NumberFormat("es-AR",{style:"currency",currency:f.currency_price}).format(f.price)} / noche</p></div></Link><button disabled={removing !== null} className={button + " mb-5 ml-5"} onClick={async () => { setRemoving(f.id); setActionError(""); try { await GuestServices.removeFavorite(user.id,f.id); setData(old => old ? {...old,favorites:old.favorites.filter(item => item.id !== f.id)} : old); } catch { setActionError("No pudimos quitar el favorito. Intentá nuevamente."); } finally { setRemoving(null); } }}>{removing === f.id ? "Quitando…" : "Quitar de favoritos"}</button></article>)}</div>{!data.favorites.length && <p className="py-10 text-center">Todavía no tenés favoritas publicadas. Podés guardar una quinta desde el detalle de tus reservas.</p>}</section>}
    {section === "reviews" && <BookingReviews reviews={data.reviews} title="Tus reseñas" />}
  </main>;
}
