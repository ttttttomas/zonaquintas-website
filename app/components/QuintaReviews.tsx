"use client";

import { useEffect, useState } from "react";
import { ReviewsServices, type PublicReview, type ReviewSummary } from "@/app/services/ReviewsServices";
import { useUser } from "@/app/context/UserContext";

export default function QuintaReviews({ quintaId, onSummary }: { quintaId: string; onSummary?: (summary: ReviewSummary) => void }) {
  const { user } = useUser();
  const [items, setItems] = useState<PublicReview[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [total, setTotal] = useState(0);
  const [stars, setStars] = useState<number | undefined>();
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const [reportId, setReportId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    let active = true;
    setLoading(true); setError("");
    ReviewsServices.quinta(quintaId, 10, page * 10, stars).then(data => {
      if (!active) return;
      setItems(data.items); setSummary(data.summary); setTotal(data.total_matching); onSummary?.(data.summary);
    }).catch(() => { if (active) setError("No pudimos cargar las reseñas."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [quintaId, page, stars, onSummary, revision]);
  async function report() {
    if (!reportId || reason.trim().length < 2) return;
    setSending(true); setNotice("");
    try { await ReviewsServices.report(reportId, reason.trim()); setNotice("Recibimos tu denuncia."); setReportId(null); setReason(""); }
    catch { setNotice("No pudimos enviar la denuncia. Intentá nuevamente."); }
    finally { setSending(false); }
  }
  return <section id="opinions" aria-label="Reseñas de huéspedes" className="space-y-6 px-4 py-8 md:px-10 lg:mx-20">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><h3 className="text-xl font-semibold">Reseñas del anfitrión en esta quinta</h3><p className="mt-1 text-sm text-gray-500">{summary?.count ? `${summary.average?.toFixed(1)} ★ · ${summary.count} reseñas verificadas` : "Todavía no hay reseñas verificadas."}</p></div><label className="text-sm">Puntuación <select value={stars ?? "all"} onChange={event => { setStars(event.target.value === "all" ? undefined : Number(event.target.value)); setPage(0); }} className="ml-2 rounded-lg border border-gray-200 p-2"><option value="all">Todas</option>{[5,4,3,2,1].map(value => <option key={value} value={value}>{value} estrellas ({summary?.distribution[String(value)] || 0})</option>)}</select></label></div>
    {loading ? <div aria-busy="true" aria-label="Cargando reseñas" className="grid gap-4 md:grid-cols-2">{[0,1].map(value => <div key={value} className="h-36 animate-pulse rounded-xl bg-gray-200" />)}</div> : error ? <p role="alert" className="text-sm text-red-700">{error} <button type="button" className="underline" onClick={() => setRevision(value => value + 1)}>Reintentar</button></p> : <div className="grid gap-4 md:grid-cols-2">{items.map(review => <article key={review.id} className="rounded-xl border border-gray-200 bg-white p-5"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-sm font-semibold">{review.author_avatar_url ? <img src={review.author_avatar_url} alt="" className="size-full object-cover" /> : review.author_name.slice(0,1)}</div><div><p className="font-medium">{review.author_name}</p><p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString("es-AR")}</p></div></div><p className="mt-3 text-amber-500" aria-label={`${review.stars} de 5 estrellas`}>{"★".repeat(review.stars)}<span className="text-gray-300">{"★".repeat(5-review.stars)}</span></p>{review.review_text && <p className="mt-2 whitespace-pre-wrap break-words text-sm">{review.review_text}</p>}{user && <button type="button" className="mt-3 text-xs text-gray-500 underline" onClick={() => { setReportId(review.id); setNotice(""); }}>Denunciar reseña</button>}</article>)}{items.length === 0 && <p className="text-sm text-gray-500">No hay reseñas con este filtro.</p>}</div>}
    {total > 10 && <div className="flex items-center gap-3"><button type="button" disabled={page === 0 || loading} onClick={() => setPage(value => value - 1)} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50">Anterior</button><span className="text-sm">Página {page + 1} de {Math.ceil(total/10)}</span><button type="button" disabled={(page + 1) * 10 >= total || loading} onClick={() => setPage(value => value + 1)} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50">Siguiente</button></div>}
    {reportId && <div className="rounded-xl border border-gray-200 bg-white p-4"><label className="block text-sm font-medium">Motivo de la denuncia<input value={reason} maxLength={32} onChange={event => setReason(event.target.value)} className="mt-2 w-full rounded-lg border p-2" /></label><div className="mt-3 flex gap-3"><button type="button" disabled={sending || reason.trim().length < 2} onClick={report} className="rounded-lg bg-primaryDark px-4 py-2 text-sm text-white disabled:opacity-50">Enviar</button><button type="button" onClick={() => setReportId(null)} className="text-sm underline">Cancelar</button></div></div>}
    {notice && <p role="status" className="text-sm">{notice}</p>}
  </section>;
}
