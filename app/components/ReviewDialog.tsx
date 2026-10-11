"use client";

import { useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { ReviewsServices, utcDate, type BookingReviewState } from "@/app/services/ReviewsServices";

const reasons: Record<string, string> = {
  not_completed: "Podés calificar cuando se haya completado el pago y termine la estadía.",
  not_open: "Podés calificar desde el día posterior a la salida.",
  expired: "El plazo de 14 días para calificar ya venció.",
  already_reviewed: "Ya enviaste tu reseña para esta reserva.",
  self_booking: "No podés calificarte a vos mismo.",
};

export default function ReviewDialog({ bookingId, onClose, onSaved }: { bookingId: string; onClose: () => void; onSaved: () => void }) {
  const [state, setState] = useState<BookingReviewState | null>(null);
  const [loading, setLoading] = useState(true);
  const [stars, setStars] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLElement>(null);
  useEffect(() => {
    let active = true;
    ReviewsServices.booking(bookingId).then(value => { if (active) setState(value); }).catch(() => { if (active) setError("No pudimos cargar esta reserva."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [bookingId]);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const elements = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button:not(:disabled), textarea:not(:disabled), input:not(:disabled)"));
      if (!elements.length) return;
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => { document.removeEventListener("keydown", handleKey); previous?.focus(); };
  }, [onClose]);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!stars || !state?.can_review) return;
    setBusy(true); setError("");
    try { await ReviewsServices.create(bookingId, stars, comment.trim()); onSaved(); onClose(); }
    catch (failure) {
      const status = isAxiosError(failure) ? failure.response?.status : null;
      if (status === 409) {
        try { const latest = await ReviewsServices.booking(bookingId); setState(latest); if (latest.written) onSaved(); }
        catch { /* Keep the draft while the user retries the read. */ }
      }
      setError(status === 401 ? "Iniciá sesión para enviar tu reseña." : status === 403 ? "No podés calificar esta reserva." : status === 409 ? "Esta reseña ya se envió o terminó el plazo. Revisá el estado de la reserva." : status === 422 ? "Revisá la puntuación y el comentario." : "No pudimos guardar la reseña. Intentá nuevamente.");
    }
    finally { setBusy(false); }
  }
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="review-dialog-title" className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 text-gray-900 shadow-xl">
      <div className="flex items-start justify-between gap-4"><div className="flex items-center gap-3"><div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-lg font-semibold">{state?.recipient_avatar_url ? <img src={state.recipient_avatar_url} alt="" className="size-full object-cover" /> : state?.recipient_name?.slice(0,1) || "?"}</div><div><h2 id="review-dialog-title" className="text-xl font-semibold">Calificar a {state?.recipient_name || "tu contraparte"}</h2><p className="mt-1 text-sm text-gray-500">{state?.quinta_title}</p></div></div><button type="button" onClick={onClose} aria-label="Cerrar" className="rounded-lg px-2 py-1 text-xl focus-visible:outline-2 focus-visible:outline-primaryDark">×</button></div>
      {loading ? <div aria-busy="true" aria-label="Cargando reseña" className="mt-6 space-y-3"><div className="h-14 animate-pulse rounded-lg bg-gray-200"/><div className="h-28 animate-pulse rounded-lg bg-gray-200"/></div> : state?.written ? <div className="mt-6 space-y-3"><p className="font-medium">Tu reseña · {state.written.stars} / 5 ★</p><p className="whitespace-pre-wrap break-words text-sm">{state.written.review_text || "Sin comentario escrito."}</p><p className="text-xs text-gray-500">{utcDate(state.written.reveal_at).getTime() > Date.now() ? "La otra persona la verá cuando también califique o termine el plazo." : "Tu reseña ya es visible."}</p></div> : state?.can_review ? <form onSubmit={submit} className="mt-6 space-y-5">
        <p className="text-sm text-gray-600">Calificás a {state.recipient_name} por la reserva en {state.quinta_title} ({state.check_in?.slice(0,10)} al {state.check_out?.slice(0,10)}). La otra persona verá tu reseña cuando ambas hayan calificado o termine el plazo.</p>
        <fieldset disabled={busy}><legend className="mb-2 text-sm font-medium">Puntuación</legend><div className="flex gap-2">{[1,2,3,4,5].map(value => <button key={value} type="button" aria-label={`${value} ${value === 1 ? "estrella" : "estrellas"}`} aria-pressed={stars === value} onClick={() => setStars(value)} className={`rounded-lg border px-3 py-2 text-xl focus-visible:outline-2 focus-visible:outline-primaryDark ${stars !== null && value <= stars ? "border-amber-400 text-amber-500" : "border-gray-200 text-gray-400"}`}>★</button>)}</div></fieldset>
        <label className="block text-sm font-medium">Comentario opcional<textarea disabled={busy} value={comment} onChange={event => setComment(event.target.value)} maxLength={2000} rows={4} className="mt-2 w-full rounded-lg border border-gray-200 p-3 focus-visible:outline-2 focus-visible:outline-primaryDark" placeholder="Contá cómo fue tu experiencia"/></label>
        <p className="text-xs text-gray-500">{comment.length}/2000 caracteres · Plazo hasta {state.review_deadline_at ? new Date(utcDate(state.review_deadline_at).getTime() - 1).toLocaleDateString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" }) : "—"} inclusive</p>
        <button disabled={busy || !stars} className="rounded-lg bg-primaryDark px-5 py-2 font-semibold text-white disabled:opacity-50">{busy ? "Enviando…" : "Enviar reseña"}</button>
      </form> : <p className="mt-6 text-sm text-gray-600">{state?.review_reason ? reasons[state.review_reason] || "Esta reserva todavía no se puede calificar." : "Esta reserva todavía no se puede calificar."}</p>}
      {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
    </section>
  </div>;
}
