"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@/app/context/UserContext";
import { ReviewsServices, type ReviewItem, type ReviewReport, type ModerationEvent } from "@/app/services/ReviewsServices";

export default function AdminReviewsPage() {
  const { user, loading: authLoading } = useUser();
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [reports, setReports] = useState<ReviewReport[]>([]);
  const [events, setEvents] = useState<Record<string, ModerationEvent[]>>({});
  const [offset, setOffset] = useState(0);
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reason, setReason] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  useEffect(() => {
    if (authLoading || !user || user.role !== "admin") return;
    let active = true;
    setLoading(true); setError("");
    ReviewsServices.adminList(20, offset).then(data => { if (active) { setItems(data.items); setReports(data.reports); } }).catch(() => { if (active) setError("No pudimos cargar la moderación."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user, authLoading, offset, revision]);
  async function moderate(item: ReviewItem) {
    const action = item.moderation_status === "visible" ? "hide" : "restore";
    if ((reason[item.id] || "").trim().length < 3) return;
    setBusy(item.id); setError("");
    try { await ReviewsServices.moderate(item.id, action, reason[item.id].trim()); setRevision(value => value + 1); }
    catch { setError("No pudimos actualizar esta reseña."); }
    finally { setBusy(null); }
  }
  async function showEvents(id: string) {
    try { setEvents(previous => ({ ...previous, [id]: [] })); const value = await ReviewsServices.moderationEvents(id); setEvents(previous => ({ ...previous, [id]: value })); }
    catch { setError("No pudimos cargar el historial de moderación."); }
  }
  if (authLoading) return <main aria-busy="true" className="mx-auto max-w-6xl p-8"><div className="h-60 animate-pulse rounded-xl bg-gray-200" /></main>;
  if (!user || user.role !== "admin") return <main className="mx-auto max-w-6xl p-8"><p>Acceso exclusivo para administradores.</p></main>;
  return <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 md:px-8"><div><Link href="/dashboard" className="text-sm text-primaryDark underline">Volver al dashboard</Link><h1 className="mt-3 text-2xl font-semibold">Moderación de reseñas</h1></div>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    <section><h2 className="mb-4 text-xl font-semibold">Denuncias</h2>{loading ? <div aria-busy="true" className="h-32 animate-pulse rounded-xl bg-gray-200" /> : reports.length ? <div className="space-y-3">{reports.map(report => <article key={report.id} className="rounded-xl border bg-white p-4 text-sm"><p className="font-semibold">{report.reason} · {report.status}</p><p className="mt-1 break-words text-gray-600">{report.detail || "Sin detalle"}</p><p className="mt-1 text-xs text-gray-500">Reseña {report.review_id} · {new Date(report.created_at).toLocaleDateString("es-AR")}</p></article>)}</div> : <p className="text-sm text-gray-500">No hay denuncias.</p>}</section>
    <section><h2 className="mb-4 text-xl font-semibold">Reseñas</h2>{loading ? <div aria-busy="true" className="h-48 animate-pulse rounded-xl bg-gray-200" /> : <div className="space-y-4">{items.map(item => <article key={item.id} className="rounded-xl border bg-white p-5"><div className="flex flex-wrap justify-between gap-2"><p className="font-semibold">{item.quinta_title || "Reserva"} · {item.stars} / 5 ★</p><span className="text-sm">{item.moderation_status === "visible" ? "Visible" : "Oculta"}</span></div><p className="mt-1 text-sm text-gray-500">{item.direction === "guest_to_owner" ? "Huésped → dueño" : "Dueño → huésped"} · {item.author_name}</p><p className="mt-3 whitespace-pre-wrap break-words text-sm">{item.review_text || "Sin comentario escrito."}</p><label className="mt-4 block text-sm">Motivo de moderación<input value={reason[item.id] || ""} maxLength={1000} onChange={event => setReason(previous => ({ ...previous, [item.id]: event.target.value }))} className="mt-1 w-full rounded-lg border p-2" /></label><div className="mt-3 flex flex-wrap gap-3"><button type="button" disabled={busy !== null || (reason[item.id] || "").trim().length < 3} onClick={() => moderate(item)} className="rounded-lg border border-primaryDark px-4 py-2 text-sm text-primaryDark disabled:opacity-50">{item.moderation_status === "visible" ? "Ocultar" : "Restaurar"}</button><button type="button" onClick={() => showEvents(item.id)} className="text-sm underline">Ver historial</button></div>{events[item.id] && <ul className="mt-3 space-y-1 text-xs text-gray-500">{events[item.id].length ? events[item.id].map(event => <li key={event.id}>{event.action} · {event.reason} · {new Date(event.created_at).toLocaleDateString("es-AR")}</li>) : <li>Sin acciones previas.</li>}</ul>}</article>)}{items.length === 0 && <p className="text-sm text-gray-500">No hay reseñas.</p>}</div>}<div className="mt-5 flex gap-3"><button disabled={offset === 0} onClick={() => setOffset(value => value-20)} className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50">Anterior</button><button disabled={items.length < 20} onClick={() => setOffset(value => value+20)} className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50">Siguiente</button></div></section>
  </main>;
}
