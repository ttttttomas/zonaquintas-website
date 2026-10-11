"use client";

import { useEffect, useState } from "react";
import { ReviewsServices, utcDate, type ReviewItem, type ReviewSummary } from "@/app/services/ReviewsServices";

export default function MyReviewsPanel({ userId, role, revision = 0, quintas = [] }: { userId: string; role: "guest" | "owner"; revision?: number; quintas?: {id: string; title: string}[] }) {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [offset, setOffset] = useState(0);
  const [quintaId, setQuintaId] = useState("");
  const [reportId, setReportId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    let active = true;
    setLoading(true); setError("");
    ReviewsServices.mine(20, offset, quintaId || undefined).then(result => {
      if (!active) return;
      setItems(result.items); setSummary(role === "owner" ? result.host_summary : result.guest_summary);
    }).catch(() => { if (active) setError("No pudimos cargar tus reseñas."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [userId, role, revision, offset, retry, quintaId]);
  async function report() {
    if (!reportId || reason.trim().length < 2) return;
    setSending(true); setNotice("");
    try { await ReviewsServices.report(reportId, reason.trim()); setNotice("Recibimos tu denuncia."); setReportId(null); setReason(""); }
    catch { setNotice("No pudimos enviar la denuncia. Intentá nuevamente."); }
    finally { setSending(false); }
  }
  const direction = role === "owner" ? "guest_to_owner" : "owner_to_guest";
  const related = items.filter(item => item.direction === direction);
  const written = items.filter(item => item.author_id === userId && item.direction !== direction);
  const received = related.filter(item => item.recipient_id === userId);
  function list(rows: ReviewItem[], receivedList: boolean) {
    return rows.length ? <div className="grid gap-4 md:grid-cols-2">{rows.map(item => <article key={item.id} className="rounded-xl border border-gray-200 bg-white p-5"><p className="font-semibold">{item.quinta_title || "Reserva"}</p><p className="mt-1 text-amber-500">{item.stars} / 5 ★</p><p className="mt-2 whitespace-pre-wrap break-words text-sm">{item.review_text || "Sin comentario escrito."}</p><p className="mt-2 text-xs text-gray-500">{receivedList ? `De ${item.author_name}` : utcDate(item.reveal_at).getTime() > Date.now() ? "Se publicará cuando la otra persona califique o termine el plazo." : "Reseña publicada"}</p>{receivedList && <button type="button" className="mt-3 text-xs text-gray-500 underline" onClick={() => setReportId(item.id)}>Denunciar reseña</button>}</article>)}</div> : <p className="text-sm text-gray-500">Todavía no hay reseñas en esta sección.</p>;
  }
  return <section aria-label="Mis reseñas" className="space-y-6">{role === "owner" && quintas.length > 1 && <label className="block text-sm">Quinta <select value={quintaId} onChange={event => { setQuintaId(event.target.value); setOffset(0); }} className="ml-2 rounded-lg border p-2"><option value="">Todas</option>{quintas.map(quinta => <option key={quinta.id} value={quinta.id}>{quinta.title}</option>)}</select></label>}<div className="rounded-2xl border border-gray-200 bg-white p-6"><h2 className="text-xl font-semibold">Mis reseñas</h2><p className="mt-1 text-sm text-gray-500">{summary?.count ? `Puntuación recibida: ${summary.average?.toFixed(1)} / 5 · ${summary.count} reseñas visibles` : "Aún no tenés puntuación visible."}</p></div>{loading ? <div aria-busy="true" aria-label="Cargando reseñas" className="h-40 animate-pulse rounded-xl bg-gray-200" /> : error ? <p role="alert" className="text-red-700">{error} <button type="button" className="underline" onClick={() => setRetry(value => value + 1)}>Reintentar</button></p> : <><div><h3 className="mb-3 font-semibold">Reseñas recibidas</h3>{list(received, true)}</div><div><h3 className="mb-3 font-semibold">Reseñas que escribiste</h3>{list(written, false)}</div><div className="flex gap-3"><button type="button" disabled={offset === 0} onClick={() => setOffset(value => Math.max(0, value-20))} className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50">Anterior</button><button type="button" disabled={items.length < 20} onClick={() => setOffset(value => value+20)} className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50">Siguiente</button></div></>}
    {reportId && <div className="rounded-xl border bg-white p-4"><label className="block text-sm">Motivo de la denuncia<input value={reason} maxLength={32} onChange={event => setReason(event.target.value)} className="mt-2 w-full rounded-lg border p-2" /></label><div className="mt-3 flex gap-3"><button type="button" disabled={sending || reason.trim().length < 2} onClick={report} className="rounded-lg bg-primaryDark px-4 py-2 text-sm text-white disabled:opacity-50">Enviar</button><button type="button" onClick={() => setReportId(null)} className="text-sm underline">Cancelar</button></div></div>}{notice && <p role="status" className="text-sm">{notice}</p>}
  </section>;
}
