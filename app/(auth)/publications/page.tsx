"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useUser } from "@/app/context/UserContext";
import { ProductsServices } from "@/app/services/ProductsServices";
import AccountSectionLayout from "@/app/components/AccountSectionLayout";
import type { Quintas } from "@/types";
import { ArrowUpDown, BedDouble, Bath, ChevronRight, CircleHelp, Eye, MapPin, Plus, Search, Settings, Users } from "lucide-react";

const statusLabels: Record<string, string> = { active: "Activa", pending: "Pendiente", rejected: "Rechazada", cancelled: "Inactiva", prueba: "De prueba" };
const statusStyles: Record<string, string> = { active: "bg-green-100 text-green-800", pending: "bg-amber-100 text-amber-800", rejected: "bg-red-100 text-red-800", cancelled: "bg-gray-100 text-gray-700", prueba: "bg-blue-100 text-blue-800" };
const statusKey = (value?: string) => value?.toLowerCase() || "unknown";
const control = "min-h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-primaryDark focus:ring-2 focus:ring-primaryDark/15";

function PublicationsSkeleton() { return <AccountSectionLayout><div aria-busy="true" aria-label="Cargando tus publicaciones" className="animate-pulse space-y-5"><div className="h-12 w-64 rounded-xl bg-gray-200" /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[0,1,2,3].map(i => <div key={i} className="h-24 rounded-2xl bg-gray-200" />)}</div><div className="grid gap-5 sm:grid-cols-2"><div className="h-96 rounded-2xl bg-gray-200" /><div className="h-96 rounded-2xl bg-gray-200" /></div></div></AccountSectionLayout>; }

export default function PublicationsPage() {
  const { user, loading: authLoading } = useUser();
  const [quintas, setQuintas] = useState<Quintas[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("recent");
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.id) { setLoading(false); return; }
    let active = true;
    setLoading(true); setError(false);
    ProductsServices.getQuintas().then((items: Quintas[] | null) => {
      if (active) setQuintas((items || []).filter(item => item.owner_id === user.id));
    }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user?.id,authLoading,revision]);

  const counts = useMemo(() => ({ total: quintas.length, active: quintas.filter(q => statusKey(q.status) === "active").length, pending: quintas.filter(q => statusKey(q.status) === "pending").length, inactive: quintas.filter(q => ["rejected","cancelled"].includes(statusKey(q.status))).length }), [quintas]);
  const visible = useMemo(() => quintas.filter(q => {
    const key = statusKey(q.status);
    const matchesStatus = status === "all" || key === status || (status === "inactive" && ["rejected","cancelled"].includes(key));
    const matchesText = `${q.title} ${q.city || ""} ${q.address || ""}`.toLocaleLowerCase("es").includes(query.trim().toLocaleLowerCase("es"));
    return matchesStatus && matchesText;
  }).sort((a,b) => sort === "price-low" ? a.price-b.price : sort === "price-high" ? b.price-a.price : sort === "name" ? a.title.localeCompare(b.title,"es") : String(b.created_at || "").localeCompare(String(a.created_at || ""))), [quintas,status,query,sort]);

  if (loading || authLoading) return <PublicationsSkeleton />;
  return <AccountSectionLayout>
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">Mis publicaciones</h1><p className="mt-1 text-sm text-gray-500">Gestioná tus propiedades y consultá su estado.</p></div><Link href="/publicar-quinta/paso-1" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primaryDark px-5 text-sm font-semibold text-white shadow-sm hover:bg-green-700"><Plus size={18} />Publicar nueva</Link></header>
    <section aria-label="Resumen de publicaciones" className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">{[{label:"Publicaciones totales",value:counts.total,icon:Eye,tone:"text-primaryDark bg-green-50"},{label:"Activas",value:counts.active,icon:CircleHelp,tone:"text-green-700 bg-green-50"},{label:"Pendientes",value:counts.pending,icon:ArrowUpDown,tone:"text-amber-600 bg-amber-50"},{label:"Inactivas",value:counts.inactive,icon:CircleHelp,tone:"text-red-600 bg-red-50"}].map(({label,value,icon:Icon,tone})=><article key={label} className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4"><span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${tone}`}><Icon size={19}/></span><span><strong className="block text-xl">{value}</strong><span className="text-xs text-gray-500">{label}</span></span></article>)}</section>
    <section aria-label="Filtrar publicaciones" className="mb-5 grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-[minmax(200px,1fr)_180px_180px]">
      <label className="relative block"><span className="sr-only">Buscar por nombre o ubicación</span><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input className={`${control} w-full pl-10`} placeholder="Buscar por nombre o ubicación..." value={query} onChange={e=>setQuery(e.target.value)}/></label>
      <label className="flex items-center gap-2 text-xs text-gray-500">Estado<select className={`${control} min-w-0 flex-1`} value={status} onChange={e=>setStatus(e.target.value)}><option value="all">Todos</option><option value="active">Activas</option><option value="pending">Pendientes</option><option value="inactive">Inactivas</option><option value="rejected">Rechazadas</option><option value="cancelled">Canceladas</option></select></label>
      <label className="flex items-center gap-2 text-xs text-gray-500">Ordenar<select className={`${control} min-w-0 flex-1`} value={sort} onChange={e=>setSort(e.target.value)}><option value="recent">Más recientes</option><option value="name">Nombre</option><option value="price-low">Menor precio</option><option value="price-high">Mayor precio</option></select></label>
    </section>
    {error && <div role="alert" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">No pudimos cargar tus publicaciones.<button className="font-semibold underline" onClick={()=>setRevision(v=>v+1)}>Reintentar</button></div>}
    <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_260px]">
      <section aria-label="Listado de quintas" aria-live="polite" className="grid gap-4 md:grid-cols-2">{visible.map(quinta=>{
        const key=statusKey(quinta.status);
        return <article key={quinta.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="relative aspect-[16/9] bg-gray-100"><img src={quinta.main_image || "/quinta.jpg"} alt={quinta.title} className="size-full object-cover"/><span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[key] || "bg-gray-100 text-gray-700"}`}>{statusLabels[key] || "Sin estado"}</span><span className="absolute bottom-3 right-3 rounded-full bg-black/65 px-2 py-1 text-xs text-white">{quinta.images?.length ? `${quinta.images.length + 1} fotos` : "Ver fotos"}</span></div>
          <div className="p-4"><h2 className="truncate font-semibold text-gray-900">{quinta.title}</h2><p className="mt-1 flex items-center gap-1 truncate text-xs text-gray-500"><MapPin size={13}/>{quinta.city ? `${quinta.city}, ` : ""}{quinta.address}</p><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500"><span className="inline-flex items-center gap-1"><Users size={14}/>{quinta.guests} huésped{quinta.guests === 1 ? "" : "es"}</span><span className="inline-flex items-center gap-1"><BedDouble size={14}/>{quinta.bedrooms} hab.</span><span className="inline-flex items-center gap-1"><Bath size={14}/>{quinta.bathrooms} baño{quinta.bathrooms === 1 ? "" : "s"}</span></div><p className="mt-3 text-sm"><strong className="text-primaryDark">{new Intl.NumberFormat("es-AR",{style:"currency",currency:quinta.currency_price}).format(quinta.price)}</strong><span className="text-gray-500"> por día</span></p>
            {key === "rejected" && <p className="mt-3 rounded-lg bg-red-50 p-3 text-xs text-red-700">Esta publicación fue rechazada. Contactá a soporte para conocer los detalles.</p>}
            <div className="mt-4 grid grid-cols-2 gap-2"><Link href={key === "rejected" ? "/support#form" : `/quintas/${quinta.id}`} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 px-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"><Eye size={15}/>{key === "rejected" ? "Contactar soporte" : "Ver detalle"}</Link><button type="button" disabled title="La edición de publicaciones todavía no está disponible." className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2 text-xs font-semibold text-gray-400">Editar</button></div>
          </div>
        </article>;
      })}
      {!error && visible.length === 0 && <div className="col-span-full rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center"><p className="font-medium text-gray-700">{quintas.length ? "No hay publicaciones que coincidan con los filtros." : "Aún no tenés publicaciones."}</p>{!quintas.length && <Link href="/publicar-quinta/paso-1" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primaryDark underline"><Plus size={16}/>Publicar mi primera quinta</Link>}</div>}
      </section>
      <aside className="hidden space-y-4 xl:block"><section className="rounded-2xl border border-gray-200 bg-white p-5"><h2 className="flex items-center gap-2 text-sm font-semibold"><Settings size={17} className="text-primaryDark"/>Configuración</h2><Link href="/my-account" className="mt-4 flex items-center justify-between rounded-xl bg-gray-50 p-4 text-sm hover:bg-green-50"><span><strong className="block">Mis datos</strong><span className="text-xs text-gray-500">Editá tu información personal.</span></span><ChevronRight size={18} className="text-primaryDark"/></Link></section><section className="rounded-2xl border border-green-100 bg-green-50/60 p-5"><h2 className="text-sm font-semibold text-gray-900">¿Necesitás ayuda?</h2><p className="mt-2 text-xs leading-relaxed text-gray-600">Si tenés dudas sobre tus publicaciones, contactá a nuestro equipo de soporte.</p><Link href="/support" className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-lg border border-green-200 bg-white px-3 text-xs font-semibold text-green-800 hover:bg-green-100">Contactar a soporte</Link></section></aside>
    </div>
  </AccountSectionLayout>;
}
