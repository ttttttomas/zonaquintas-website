"use client";

import { use, useEffect, useState } from "react";
import BookingReviews from "@/app/components/BookingReviews";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, House, Mail, MapPin, Phone, RefreshCw, Search, Wallet } from "lucide-react";
import { useUser } from "@/app/context/UserContext";
import { AdminServices, type OwnerOverview } from "@/app/services/AdminServices";
import { argentinaToday } from "@/app/lib/availability";

type Section = "properties" | "bookings" | "payments" | "transactions";
const sections: { key: Section; label: string }[] = [
  { key: "properties", label: "Quintas" }, { key: "bookings", label: "Reservas" },
  { key: "payments", label: "Pagos" }, { key: "transactions", label: "Movimientos" },
];
const labels: Record<string, string> = {
  active: "Activa", pending: "Pendiente", rejected: "Rechazada", cancelled: "Cancelada", prueba: "De prueba",
  accepted: "Esperando pago", paid: "Seña pagada", finished: "Pago completo",
  retenido: "Retenido", disponible: "Disponible", entregado: "Transferido",
  link_deposit_sent: "Link de seña enviado", link_balance_sent: "Link de saldo enviado",
  approved: "Aprobado", failed: "Fallido", expired: "Vencido",
};
const knownStatuses: Record<Section, string[]> = {
  properties: ["active", "pending", "rejected", "cancelled", "prueba"],
  bookings: ["pending", "accepted", "paid", "finished", "rejected", "cancelled"],
  payments: ["pending", "link_deposit_sent", "link_balance_sent", "paid", "finished", "rejected", "cancelled"],
  transactions: ["retenido", "disponible", "entregado"],
};
const normalize = (value: string | null | undefined) => (value || "sin_estado").toLowerCase();
const statusLabel = (value: string) => labels[normalize(value)] || value || "Sin estado";
const money = (value: number, currency: string) => new Intl.NumberFormat("es-AR", { style: "currency", currency, currencyDisplay: "code", maximumFractionDigits: 2 }).format(Number(value || 0));
const dateLabel = (value?: string | null) => {
  if (!value) return "Sin fecha";
  const date = new Date(value.slice(0, 10) + "T12:00:00");
  return Number.isNaN(date.getTime()) ? "Sin fecha" : date.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });
};
const button = "rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primaryDark disabled:opacity-50";

function Badge({ status }: { status: string }) {
  const key = normalize(status);
  const color = ["active", "paid", "finished", "approved", "disponible", "entregado"].includes(key)
    ? "bg-green-50 text-green-800" : ["rejected", "cancelled", "failed"].includes(key)
      ? "bg-red-50 text-red-800" : "bg-amber-50 text-amber-900";
  return <span className={"inline-flex rounded-full px-3 py-1 text-xs font-medium " + color}>{statusLabel(status)}</span>;
}
function Skeleton() {
  return <main aria-busy="true" aria-label="Cargando información del cliente" className="mx-auto max-w-7xl space-y-8 px-4 py-8 md:px-10">
    <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
    <div className="h-40 animate-pulse rounded-3xl bg-gray-200" />
    <div className="grid gap-4 md:grid-cols-3">{[0, 1, 2].map(i => <div key={i} className="h-40 animate-pulse rounded-2xl bg-gray-200" />)}</div>
    <div className="h-80 animate-pulse rounded-3xl bg-gray-200" />
  </main>;
}

export default function ClienteDataPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [data, setData] = useState<OwnerOverview | null>(null);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);
  const [section, setSection] = useState<Section>("properties");
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [currency, setCurrency] = useState("all");

  useEffect(() => {
    if (authLoading) return;
    if (user?.role !== "admin") { router.replace("/"); return; }
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    AdminServices.getOwnerOverview(id, controller.signal)
      .then(result => { if (!controller.signal.aborted) { setData(result); setLoadedId(id); } })
      .catch((failure: { response?: { status?: number } }) => {
        if (controller.signal.aborted) return;
        setError(failure.response?.status === 404 ? "No encontramos este cliente." : failure.response?.status === 403 ? "No tenés permisos para consultar este cliente." : "No pudimos cargar la información del cliente. Intentá nuevamente.");
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [id, user?.role, authLoading, router, revision]);

  if (authLoading || user?.role !== "admin" || loading) return <Skeleton />;
  if (error || !data || loadedId !== id) return <main className="mx-auto max-w-7xl space-y-6 px-4 py-12 md:px-10">
    <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm"><ArrowLeft size={16} /> Volver al dashboard</Link>
    <div role="alert" className="rounded-2xl border border-gray-200 bg-white p-8"><p>{error || "No hay información disponible."}</p><button className={button + " mt-5"} onClick={() => setRevision(v => v + 1)}>Reintentar</button></div>
  </main>;

  const owner = data.owner;
  const today = argentinaToday();
  const confirmed = data.bookings.filter(b => ["paid", "finished"].includes(normalize(b.status)));
  const upcoming = confirmed.filter(b => b.check_in.slice(0, 10) >= today).sort((a, b) => a.check_in.localeCompare(b.check_in)).slice(0, 3);
  const inProgress = confirmed.filter(b => b.check_in.slice(0, 10) <= today && b.check_out.slice(0, 10) > today).length;
  const entries = data[section];
  const statuses = [...new Set([...knownStatuses[section], ...entries.map(row => normalize(row.status))])];
  const matchesStatus = (value: string) => status === "all" || normalize(value) === status;
  const matchesCurrency = (value: string) => currency === "all" || currency === value;
  const matchesText = (...values: (string | null | undefined)[]) => values.some(value => (value || "").toLocaleLowerCase("es").includes(query.trim().toLocaleLowerCase("es")));
  const properties = data.properties.filter(p => matchesStatus(p.status) && matchesCurrency(p.currency_price) && matchesText(p.title, p.city, p.address, p.id));
  const bookings = data.bookings.filter(b => matchesStatus(b.status) && matchesCurrency(b.currency_price) && matchesText(b.quinta_title, b.guest_name, b.guest_email, b.id));
  const bookingName = (bookingId: string | null) => data.bookings.find(b => b.id === bookingId)?.quinta_title;
  const payments = data.payments.filter(p => matchesStatus(p.status) && matchesCurrency(p.currency) && matchesText(p.id, p.booking_id, bookingName(p.booking_id)));
  const movements = data.transactions.filter(t => matchesStatus(t.status) && matchesCurrency(t.currency) && matchesText(t.quinta_name, t.description, t.booking_id, t.id));
  const count = { properties: properties.length, bookings: bookings.length, payments: payments.length, transactions: movements.length }[section];
  const showPending = (target: Section) => { setSection(target); setStatus("pending"); setQuery(""); setCurrency("all"); };

  return <main className="mx-auto max-w-7xl px-4 py-8 text-gray-900 md:px-10 md:py-10">
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium hover:underline"><ArrowLeft size={16} /> Volver a administración</Link>
      <button onClick={() => setRevision(v => v + 1)} className={button + " inline-flex items-center gap-2"}><RefreshCw size={15} /> Actualizar</button>
    </div>
    <header className="flex flex-col justify-between gap-6 border-b border-gray-200 pb-8 md:flex-row md:items-center">
      <div className="flex items-center gap-5">
        {owner.pictures?.[0]?.url ? <img src={owner.pictures[0].url} alt={"Foto de " + owner.name} className="size-20 rounded-full object-cover" /> : <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-gray-900 text-3xl font-semibold text-white">{owner.name?.charAt(0) || "D"}</div>}
        <div><p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primaryDark">Perfil del anfitrión</p><h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{owner.name || "Sin nombre"}</h1><p className="mt-2 text-sm text-gray-500">En ZonaQuintas desde {dateLabel(owner.created_at)}</p></div>
      </div>
      <div className="space-y-2 text-sm">
        {owner.email && <a href={"mailto:" + owner.email} className="flex items-center gap-2 break-all hover:underline"><Mail size={15} className="shrink-0 text-gray-400" />{owner.email}</a>}
        {owner.phone && <a href={"tel:" + owner.phone} className="flex items-center gap-2 hover:underline"><Phone size={15} className="text-gray-400" />{owner.phone}</a>}
        <p className="flex items-center gap-2 text-gray-500"><MapPin size={15} className="shrink-0" />{owner.owner_location || owner.address || "Ubicación sin completar"}</p>
      </div>
    </header>
    <section aria-label="Resumen de billetera" className="my-8 grid gap-4 md:grid-cols-3">
      {([{ key: "retenido", title: "Saldo retenido", note: "Cobros pendientes de liberación" }, { key: "disponible", title: "Saldo disponible", note: "Fondos disponibles para transferir" }, { key: "entregado", title: "Total transferido", note: "Movimientos marcados como entregados" }] as const).map(item => <article key={item.key} className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-5 flex items-center justify-between"><h2 className="text-sm font-medium text-gray-600">{item.title}</h2><Wallet size={18} className="text-primaryDark" /></div>
        <p className="text-2xl font-semibold tracking-tight">{money(data.balances[item.key].ARS, "ARS")}</p><p className="mt-1 text-sm text-gray-500">{money(data.balances[item.key].USD, "USD")}</p><p className="mt-5 text-xs text-gray-500">{item.note}</p>
      </article>)}
    </section>
    <section aria-label="Actividad del anfitrión" className="mb-10 grid gap-6 lg:grid-cols-3">
      <div className="rounded-2xl border border-gray-200 p-6"><h2 className="mb-4 font-semibold">De un vistazo</h2><dl className="space-y-3 text-sm">{[["Quintas publicadas", data.properties.length], ["Reservas registradas", data.bookings.length], ["Estadías en curso", inProgress]].map(([label, value]) => <div key={label} className="flex justify-between gap-4"><dt className="text-gray-500">{label}</dt><dd className="font-semibold">{value}</dd></div>)}</dl><p className="mt-4 text-xs text-gray-500">Las estadías en curso se calculan por fechas y pagos confirmados.</p></div>
      <div className="rounded-2xl border border-gray-200 p-6"><h2 className="mb-4 font-semibold">Pendientes de atención</h2><button className="mb-3 flex w-full items-center justify-between text-left text-sm hover:underline" onClick={() => showPending("properties")}><span>{data.properties.filter(p => normalize(p.status) === "pending").length} quintas por revisar</span><ArrowUpRight size={16} /></button><button className="flex w-full items-center justify-between text-left text-sm hover:underline" onClick={() => showPending("bookings")}><span>{data.bookings.filter(b => normalize(b.status) === "pending").length} reservas pendientes</span><ArrowUpRight size={16} /></button>{owner.description && <p className="mt-4 line-clamp-3 text-xs leading-relaxed text-gray-500">{owner.description}</p>}</div>
      <div className="rounded-2xl border border-gray-200 p-6"><h2 className="mb-4 flex items-center gap-2 font-semibold"><CalendarDays size={17} /> Próximos ingresos</h2>{upcoming.length ? <ul className="space-y-3">{upcoming.map(b => <li key={b.id} className="flex justify-between gap-3 text-sm"><span className="truncate">{b.quinta_title || "Quinta"}</span><span className="shrink-0 text-gray-500">{dateLabel(b.check_in)}</span></li>)}</ul> : <p className="text-sm text-gray-500">No hay ingresos confirmados próximos.</p>}</div>
    </section>
    <BookingReviews reviews={data.reviews || []} title="Reseñas del anfitrión" />
    <nav aria-label="Información del cliente" className="flex gap-6 overflow-x-auto border-b border-gray-200">
      {sections.map(item => <button key={item.key} aria-pressed={section === item.key} onClick={() => { setSection(item.key); setStatus("all"); setQuery(""); setCurrency("all"); }} className={"shrink-0 border-b-2 pb-4 text-sm font-semibold " + (section === item.key ? "border-primaryDark text-primaryDark" : "border-transparent text-gray-500 hover:text-gray-900")}>{item.label}<span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{data[item.key].length}</span></button>)}
    </nav>
    <section aria-label={sections.find(s => s.key === section)?.label} className="py-6">
      <div className="mb-5 flex flex-wrap gap-2">{["all", ...statuses].map(key => <button key={key} aria-pressed={status === key} onClick={() => setStatus(key)} className={"rounded-full border px-3 py-2 text-xs font-medium " + (status === key ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-600 hover:border-gray-400")}>{key === "all" ? "Todos" : statusLabel(key)} <span className="ml-1 opacity-70">{key === "all" ? entries.length : entries.filter(row => normalize(row.status) === key).length}</span></button>)}</div>
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row">
        <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 focus-within:ring-2 focus-within:ring-primaryDark sm:w-80"><Search size={17} className="text-gray-400" /><span className="sr-only">Buscar registros</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar por nombre, quinta o ID" className="w-full bg-transparent text-sm outline-none" /></label>
        <div className="flex items-center gap-3"><p aria-live="polite" className="text-sm text-gray-500">{count} resultados</p><label><span className="sr-only">Filtrar por moneda</span><select value={currency} onChange={e => setCurrency(e.target.value)} className={button}><option value="all">Todas las monedas</option><option value="ARS">ARS</option><option value="USD">USD</option></select></label></div>
      </div>
      {count === 0 && <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center text-sm text-gray-500">No hay registros para estos filtros.</div>}
      {section === "properties" && <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{properties.map(p => <article key={p.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="relative aspect-[16/10] bg-gray-100">{p.main_image ? <img src={p.main_image} alt={p.title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center"><House size={36} className="text-gray-300" /></div>}<div className="absolute left-3 top-3"><Badge status={p.status} /></div></div>
        <div className="p-5"><Link href={"/quintas/" + p.id} className="flex items-start justify-between gap-2 font-semibold hover:underline">{p.title}<ArrowUpRight size={18} className="shrink-0" /></Link><p className="mt-1 text-sm text-gray-500">{p.city} · {p.address}</p><p className="mt-4 text-xs text-gray-500">{p.guests} huéspedes · {p.bedrooms} habitaciones · {p.bathrooms} baños</p><p className="mt-3 text-sm"><strong>{money(p.price, p.currency_price)}</strong> <span className="text-gray-500">/ noche</span></p><p className="mt-3 border-t border-gray-100 pt-3 text-xs text-gray-500">En alquiler: {dateLabel(p.rental_start_date)} — {dateLabel(p.rental_end_date)}</p></div>
      </article>)}</div>}
      {section === "bookings" && <div className="space-y-3">{bookings.map(b => <article key={b.id} className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row"><div><div className="mb-2 flex flex-wrap items-center gap-3"><Link href={"/quintas/" + b.quinta_id} className="font-semibold hover:underline">{b.quinta_title || "Quinta"}</Link><Badge status={b.status} /></div><p className="text-sm text-gray-500">{dateLabel(b.check_in)} — {dateLabel(b.check_out)} · {b.guest_count} huéspedes</p><p className="mt-2 text-sm">{b.guest_name || b.guest_email || "Huésped sin nombre"}</p></div><div className="md:text-right"><p className="font-semibold">{money(b.amount, b.currency_price)}</p><p className="mt-1 text-xs text-gray-500">Total de reserva · {b.payment_type === "deposit" ? "Seña y saldo" : "Pago total"}</p></div></div>
        <details className="mt-4 border-t border-gray-100 pt-3 text-sm"><summary className="cursor-pointer font-medium text-gray-600">Ver información de la reserva</summary><dl className="mt-3 grid gap-3 text-xs sm:grid-cols-2"><div><dt className="text-gray-500">ID de reserva</dt><dd className="break-all">{b.id}</dd></div><div><dt className="text-gray-500">Creada</dt><dd>{dateLabel(b.created_at)}</dd></div><div><dt className="text-gray-500">Contacto del huésped</dt><dd className="break-all">{b.guest_email || "Sin email"} · {b.guest_phone || "Sin teléfono"}</dd></div><div><dt className="text-gray-500">Mensaje</dt><dd>{b.message || "Sin mensaje"}</dd></div></dl></details>
      </article>)}</div>}
      {(section === "payments" || section === "transactions") && count > 0 && <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white"><table className="w-full min-w-[680px] text-left text-sm"><caption className="sr-only">{section === "payments" ? "Pagos de las reservas" : "Historial de movimientos de billetera"}</caption><thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500"><tr>{["Fecha", "Concepto / quinta", "Estado", "Importe"].map(title => <th scope="col" key={title} className="px-5 py-4 font-medium">{title}</th>)}</tr></thead><tbody>
        {section === "payments" ? payments.map(p => <tr key={p.id} className="border-b border-gray-100 last:border-0"><td className="px-5 py-4">{dateLabel(p.created_at)}<p className="mt-1 text-xs text-gray-500">{p.paid_at ? "Pagado: " + dateLabel(p.paid_at) : "Sin fecha de cobro"}</p></td><td className="px-5 py-4"><p className="font-medium">{bookingName(p.booking_id) || "Reserva"}</p><p className="mt-1 text-xs text-gray-500">{p.payment_type === "deposit" ? "Seña" : "Saldo / pago completo"}</p><p className="mt-1 text-xs text-gray-400">Reserva: {p.booking_id}</p></td><td className="px-5 py-4"><Badge status={p.status} /></td><td className="whitespace-nowrap px-5 py-4 font-semibold">{money(p.amount, p.currency)}</td></tr>) : movements.map(t => <tr key={t.id} className="border-b border-gray-100 last:border-0"><td className="px-5 py-4">{dateLabel(t.date)}{t.transfer_date_estimate && <p className="mt-1 text-xs text-gray-500">Transferencia estimada: {dateLabel(t.transfer_date_estimate)}</p>}</td><td className="px-5 py-4"><p className="font-medium">{t.quinta_name || "Sin quinta asociada"}</p><p className="mt-1 max-w-sm break-words text-xs text-gray-500">{t.description || "Sin descripción"}</p></td><td className="px-5 py-4"><Badge status={t.status} /></td><td className="whitespace-nowrap px-5 py-4 font-semibold">{money(t.amount, t.currency)}</td></tr>)}
      </tbody></table></div>}
    </section>
  </main>;
}
