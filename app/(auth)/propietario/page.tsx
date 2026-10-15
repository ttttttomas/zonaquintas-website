"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, House, Plus, Star, Wallet } from "lucide-react";
import BookingReviews from "@/app/components/BookingReviews";
import AccountSectionLayout from "@/app/components/AccountSectionLayout";
import { useUser } from "@/app/context/UserContext";
import { OwnerServices, type MyOwnerOverview } from "@/app/services/OwnerServices";
import { argentinaToday } from "@/app/lib/availability";

const labels: Record<string, string> = {
  active: "Activa", pending: "Pendiente", rejected: "Rechazada", cancelled: "Cancelada",
  suspended: "Suspendida", prueba: "De prueba", accepted: "Esperando pago", paid: "Seña pagada",
  finished: "Pago completo", retenido: "Retenido", disponible: "Disponible", entregado: "Transferido",
  approved: "Aprobado", failed: "Fallido", expired: "Vencido", completed: "Completado",
  link_deposit_sent: "Link de seña enviado", link_balance_sent: "Link de saldo enviado",
};
const normalized = (value: string) => (value || "sin_estado").toLowerCase();
const label = (value: string) => labels[normalized(value)] || value || "Sin estado";
const money = (amount: number, currency: string) => new Intl.NumberFormat("es-AR", { style: "currency", currency, currencyDisplay: "code" }).format(Number(amount || 0));
const date = (value?: string | null) => value ? new Date(`${String(value).slice(0, 10)}T12:00:00`).toLocaleDateString("es-AR") : "—";
const action = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-primaryDark";
const box = "rounded-2xl border border-gray-200 bg-white p-5";
type Section = "properties" | "bookings" | "payments" | "transactions" | "reviews";
const sections: { key: Section; title: string }[] = [
  { key: "properties", title: "Publicaciones" }, { key: "bookings", title: "Reservas" },
  { key: "payments", title: "Pagos" }, { key: "transactions", title: "Movimientos" }, { key: "reviews", title: "Reseñas recibidas" },
];

export default function OwnerHome() {
  const { user, loading: authLoading } = useUser();
  const [result, setResult] = useState<{ userId: string; data: MyOwnerOverview } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [revision, setRevision] = useState(0);
  const [section, setSection] = useState<Section>("properties");
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  useEffect(() => {
    if (authLoading || !user?.id) return;
    const controller = new AbortController();
    setLoading(true); setError(false);
    OwnerServices.overview(controller.signal).then(data => {
      if (!controller.signal.aborted) setResult({ userId: user.id, data });
    }).catch(() => { if (!controller.signal.aborted) setError(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [authLoading, user?.id, revision]);

  if (!authLoading && !user) return <AccountSectionLayout><Link href="/login" className={action}>Iniciar sesión</Link></AccountSectionLayout>;
  if (authLoading || loading) return <AccountSectionLayout><div aria-busy="true" aria-label="Cargando inicio de propietario" className="animate-pulse space-y-6"><div className="h-20 rounded-2xl bg-gray-200" /><div className="grid gap-4 sm:grid-cols-3">{[0, 1, 2].map(i => <div key={i} className="h-32 rounded-2xl bg-gray-200" />)}</div><div className="h-80 rounded-2xl bg-gray-200" /></div></AccountSectionLayout>;
  if (error || !result || result.userId !== user?.id) return <AccountSectionLayout><div role="alert" className={box}><p>No pudimos cargar tu información.</p><button type="button" className={`${action} mt-4`} onClick={() => setRevision(v => v + 1)}>Reintentar</button></div></AccountSectionLayout>;

  const data = result.data;
  const today = argentinaToday();
  const confirmed = data.bookings.filter(b => ["paid", "finished"].includes(normalized(b.status)));
  const upcoming = confirmed.filter(b => String(b.check_in).slice(0, 10) >= today).sort((a, b) => String(a.check_in).localeCompare(String(b.check_in))).slice(0, 4);
  const departures = confirmed.filter(b => String(b.check_out).slice(0, 10) >= today).sort((a, b) => String(a.check_out).localeCompare(String(b.check_out))).slice(0, 4);
  const inProgress = confirmed.filter(b => String(b.check_in).slice(0, 10) <= today && String(b.check_out).slice(0, 10) >= today).length;
  const pending = data.bookings.filter(b => normalized(b.status) === "pending").length;
  const waitingPayment = data.bookings.filter(b => ["accepted", "paid"].includes(normalized(b.status))).length;
  const toReview = data.bookings.filter(b => b.can_review).length;
  const propertyCounts = data.properties.reduce<Record<string, number>>((acc, p) => { const key = normalized(p.status); acc[key] = (acc[key] || 0) + 1; return acc; }, {});
  const rows = section === "properties" ? data.properties.map(p => ({ id: p.id, title: p.title, detail: p.city || p.address, status: p.status, amount: money(p.price, p.currency_price), when: date(p.created_at), href: `/quintas/${p.id}` }))
    : section === "bookings" ? data.bookings.map(b => ({ id: b.id, title: b.quinta_title || "Reserva", detail: `${b.guest_name || "Huésped"} · ${date(b.check_in)} → ${date(b.check_out)}`, status: b.status, amount: money(b.amount, b.currency_price), when: date(b.created_at), href: "/reservations" }))
    : section === "payments" ? data.payments.map(p => ({ id: p.id, title: p.payment_type === "deposit" ? "Seña" : "Saldo", detail: `Reserva ${p.booking_id}`, status: p.status, amount: money(p.amount, p.currency), when: date(p.paid_at || p.created_at), href: "/reservations" }))
    : section === "transactions" ? data.transactions.map(t => ({ id: t.id, title: t.quinta_name || "Movimiento", detail: t.description || "", status: t.status, amount: money(t.amount, t.currency), when: date(t.date), href: "/wallet" })) : [];
  const statuses = [...new Set(rows.map(r => normalized(r.status)))];
  const visible = rows.filter(r => (status === "all" || normalized(r.status) === status) && `${r.title} ${r.detail}`.toLocaleLowerCase("es").includes(query.trim().toLocaleLowerCase("es")));

  return <AccountSectionLayout>
    <header className="mb-7 flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-medium text-primaryDark">Tu espacio como propietario</p><h1 className="mt-1 text-2xl font-semibold md:text-3xl">Hola, {data.owner.name || "bienvenido"}</h1><p className="mt-2 text-sm text-gray-500">Tus quintas, reservas e ingresos, en un solo lugar.</p></div><Link href="/publicar-quinta/paso-1" className={action}><Plus size={18} />Publicar quinta</Link></header>

    {!data.properties.length && <section className={`${box} mb-6 border-green-200 bg-green-50`}><h2 className="text-lg font-semibold">Todo listo para recibir huéspedes</h2><p className="mt-2 text-sm text-gray-600">Publicá tu primera quinta. Desde acá vas a poder seguir sus reservas, pagos y reseñas.</p><div className="mt-4 flex flex-wrap gap-3"><Link href="/publicar-quinta/paso-1" className={action}>Publicar mi primera quinta</Link><Link href="/my-account" className={action}>Completar mis datos</Link></div></section>}

    <section aria-label="Resumen de actividad" className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
      {[{ title: "Publicaciones", value: data.properties.length, icon: House, href: "/publications" }, { title: "Solicitudes pendientes", value: pending, icon: CalendarDays, href: "/reservations" }, { title: "Estadías en curso", value: inProgress, icon: CalendarDays, href: "/reservations" }, { title: `${data.reviews.length} reseñas como anfitrión`, value: data.owner.average_opinions == null ? "Sin puntaje" : `${Number(data.owner.average_opinions).toFixed(1)} / 5`, icon: Star, href: "/reservations" }].map(({ title, value, icon: Icon, href }) => <Link key={title} href={href} className={`${box} hover:border-green-300`}><Icon size={20} className="mb-4 text-primaryDark" aria-hidden="true" /><strong className="block text-2xl">{value}</strong><span className="mt-1 block text-sm text-gray-500">{title}</span></Link>)}
    </section>

    <section aria-label="Saldos por moneda" className="mb-6 grid gap-4 md:grid-cols-3">{([{ key: "retenido", title: "Saldo retenido" }, { key: "disponible", title: "Saldo disponible" }, { key: "entregado", title: "Total transferido" }] as const).map(({ key, title }) => <article key={key} className={box}><h2 className="flex items-center gap-2 text-sm text-gray-600"><Wallet size={17} aria-hidden="true" />{title}</h2><p className="mt-3 text-xl font-semibold">{money(data.balances[key].ARS, "ARS")}</p><p className="mt-1 text-sm text-gray-500">{money(data.balances[key].USD, "USD")}</p><Link href="/wallet" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primaryDark">Ver Wallet <ArrowUpRight size={16} /></Link></article>)}</section>

    <div className="mb-6 grid gap-4 xl:grid-cols-3">
      <section className={box}><h2 className="font-semibold">Para atender</h2><ul className="mt-4 space-y-3 text-sm"><li><Link href="/reservations?section=pending" className="underline">{pending} solicitudes por responder</Link></li><li><Link href="/reservations?section=process" className="underline">{waitingPayment} reservas con pagos pendientes</Link></li><li><Link href="/reservations?section=reviews" className="underline">{toReview} huéspedes por calificar</Link></li><li><Link href="/publications" className="underline">{(propertyCounts.rejected || 0) + (propertyCounts.suspended || 0)} publicaciones que requieren atención</Link></li></ul><p className="mt-4 text-xs text-gray-500">Las reseñas pendientes respetan el plazo y las condiciones de cada reserva.</p></section>
      {[{ title: "Próximas entradas", items: upcoming, key: "check_in" as const }, { title: "Próximas salidas", items: departures, key: "check_out" as const }].map(({ title, items, key }) => <section key={key} className={box}><h2 className="font-semibold">{title}</h2><ul className="mt-4 divide-y divide-gray-100">{items.map(b => <li key={b.id} className="py-3 text-sm"><Link href="/reservations" className="font-medium hover:underline">{b.quinta_title}</Link><p className="mt-1 text-gray-500">{date(b[key])} · {b.guest_name || "Huésped"}</p></li>)}</ul>{!items.length && <p className="mt-4 text-sm text-gray-500">No hay estadías confirmadas próximas.</p>}</section>)}
    </div>

    <section className={box}>
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold">Tu actividad</h2><div className="flex flex-wrap gap-2 text-xs">{Object.entries(propertyCounts).map(([key, count]) => <span key={key} className="rounded-full bg-gray-100 px-3 py-1">{label(key)}: {count}</span>)}</div></div>
      <nav aria-label="Actividad del propietario" className="mt-4 flex gap-5 overflow-x-auto border-b border-gray-200">{sections.map(item => <button key={item.key} type="button" aria-pressed={section === item.key} onClick={() => { setSection(item.key); setStatus("all"); setQuery(""); }} className={`shrink-0 border-b-2 py-3 text-sm font-medium ${section === item.key ? "border-primaryDark text-primaryDark" : "border-transparent text-gray-500"}`}>{item.title} ({data[item.key].length})</button>)}</nav>
      {section === "reviews" ? <BookingReviews reviews={data.reviews} title="Reseñas como anfitrión" /> : <>
        <div className="my-4 flex flex-wrap gap-3"><label className="flex min-w-0 flex-1 flex-col gap-1 text-xs text-gray-500">Buscar<input value={query} onChange={e => setQuery(e.target.value)} placeholder="Quinta, reserva o detalle" className="min-h-11 rounded-xl border border-gray-200 px-3 text-sm text-gray-900" /></label><label className="flex flex-col gap-1 text-xs text-gray-500">Estado<select value={status} onChange={e => setStatus(e.target.value)} className="min-h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900"><option value="all">Todos</option>{statuses.map(s => <option key={s} value={s}>{label(s)}</option>)}</select></label></div>
        <ul className="divide-y divide-gray-100">{visible.map(row => <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 py-4"><div className="min-w-0 flex-1"><Link href={row.href} className="font-medium hover:underline">{row.title}</Link><p className="mt-1 break-words text-xs text-gray-500">{row.detail}</p><span className="mt-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs">{label(row.status)}</span></div><div className="text-right"><p className="text-sm font-semibold">{row.amount}</p><p className="mt-1 text-xs text-gray-500">{row.when}</p></div></li>)}</ul>{!visible.length && <p className="py-8 text-center text-sm text-gray-500">No hay resultados para esta selección.</p>}
      </>}
    </section>
  </AccountSectionLayout>;
}
