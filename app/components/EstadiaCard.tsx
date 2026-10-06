"use client";
import Link from "next/link";
import { useId, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { GuestServices, type GuestBooking, type BookingReview } from "@/app/services/GuestServices";
const springTransition = { type: "spring" as const, stiffness: 300, damping: 30 };
export const bookingStatus: Record<string, string> = { pending: "Pendiente", accepted: "Esperando pago", paid: "Seña pagada", finished: "Pago completo", rejected: "Rechazada", cancelled: "Cancelada" };
const money = (amount: number, currency: string) => new Intl.NumberFormat("es-AR", { style: "currency", currency }).format(Number(amount));
const date = (value?: string | null) => value ? new Date(value.slice(0,10) + "T12:00:00").toLocaleDateString("es-AR") : "Sin fecha";
const action = "rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium disabled:opacity-50";
function paymentUrl(value: string | null) {
  try { const url = new URL(value || ""); return url.protocol === "https:" && url.hostname === "pay.rebill.com" ? url.href : null; } catch { return null; }
}
export default function EstadiaCard({ booking: b, review, onReview, onFavorite, saved }: { booking: GuestBooking; review?: BookingReview; onReview: () => void; onFavorite: () => Promise<void>; saved: boolean }) {
  const [acc, setAcc] = useState(false);
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const region = useId();
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    try { await GuestServices.review(b.id, stars, comment); onReview(); }
    catch { setError("No pudimos guardar la reseña. Actualizá para comprobar si la reserva ya fue calificada."); }
    finally { setBusy(false); }
  }
  return <motion.article layout transition={springTransition} className="flex w-full flex-col overflow-hidden rounded-lg bg-white p-2 shadow-md shadow-black/10">
    <button type="button" aria-expanded={acc} aria-controls={region} onClick={() => setAcc(v => !v)} className={`flex cursor-pointer gap-4 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-primaryDark ${acc ? "flex-col" : "flex-row"}`}>
      <motion.img layout transition={springTransition} src={b.quinta_main_image || "/quinta.jpg"} alt="" className={`rounded-lg object-cover ${acc ? "h-[200px] w-full" : "h-[120px] w-[100px] shrink-0 sm:w-[120px]"}`} />
      <motion.div layout transition={springTransition} className="min-w-0 flex-1 space-y-2 p-2"><h3 className="text-lg font-medium">{b.quinta_title || "Quinta"}</h3><p className="text-sm text-gray-500">{b.quinta_address}</p><p className="text-sm">{date(b.check_in)} — {date(b.check_out)}</p><p className="text-sm font-medium text-primaryDark">{bookingStatus[b.status.toLowerCase()] || b.status}</p></motion.div>
      <span className="self-center p-2">{acc ? <ArrowUp size={18} /> : <ArrowDown size={18} />}<span className="sr-only">Detalles de reserva</span></span>
    </button>
    <AnimatePresence initial={false}>{acc && <motion.div id={region} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden"><div className="space-y-4 p-3 text-sm">
      <dl className="space-y-3 divide-y divide-gray-100"><div className="flex justify-between pt-3"><dt>Total de reserva</dt><dd className="font-semibold">{money(b.amount,b.currency_price)}</dd></div><div className="flex justify-between pt-3"><dt>Huéspedes</dt><dd>{b.guest_count}</dd></div><div className="flex justify-between pt-3"><dt>Creada</dt><dd>{date(b.created_at)}</dd></div></dl><p className="break-all text-xs text-gray-500">Reserva {b.id}</p>
      {b.payments.map(p => { const href = paymentUrl(p.rebill_payment_link_url); const payable = ["accepted","paid"].includes(b.status.toLowerCase()) && ["pending","link_deposit_sent","link_balance_sent"].includes(p.status.toLowerCase()) && !p.paid_at && p.payment_expire && new Date(p.payment_expire).getTime() > Date.now(); return <div key={p.id} className="rounded-lg bg-gray-50 p-3"><p>{p.payment_type === "deposit" ? "Seña" : "Saldo / pago total"}: {money(p.amount,p.currency)}</p><p className="mt-1 text-gray-500">{bookingStatus[p.status.toLowerCase()] || p.status} · Vencimiento: {date(p.payment_expire)}</p>{payable && href && <a className="mt-3 inline-block rounded-lg bg-green-50 px-4 py-2 font-medium text-green-700" href={href} target="_blank" rel="noopener noreferrer">Pagar {p.payment_type === "deposit" ? "seña" : "saldo"}</a>}</div>; })}
      {b.quinta_status?.toLowerCase() === "active" && <div className="flex flex-wrap gap-2"><Link className={action} href={`/quintas/${b.quinta_id}`}>Ver quinta</Link><button className={action} disabled={busy || saved} onClick={async () => { setBusy(true); setError(""); try { await onFavorite(); } catch { setError("No pudimos guardar el favorito."); } finally { setBusy(false); } }}>{saved ? "Guardada en favoritos" : "Guardar en favoritos"}</button></div>}
      {review ? <div className="border-t border-gray-100 pt-4"><p className="font-medium">Tu reseña · {review.stars} / 5 ★</p><p className="mt-2 whitespace-pre-wrap break-words">{review.review_text}</p></div> : b.can_review ? <form onSubmit={submit} className="space-y-3 border-t border-gray-100 pt-4"><h4 className="font-semibold">¿Cómo fue tu estadía?</h4><label className="block">Puntuación<select disabled={busy} value={stars} onChange={e => setStars(Number(e.target.value))} className="ml-3 rounded-lg border p-2">{[5,4,3,2,1].map(n => <option key={n} value={n}>{n} estrellas</option>)}</select></label><label className="block">Tu experiencia<textarea disabled={busy} value={comment} onChange={e => setComment(e.target.value)} maxLength={2000} rows={3} className="mt-2 w-full rounded-lg border border-gray-200 p-3" /></label><button disabled={busy} className={action + " bg-green-50 text-green-700"}>{busy ? "Guardando…" : "Publicar reseña"}</button></form> : <p className="text-xs text-gray-500">Podés calificar desde el día posterior a la salida, con el pago completo.</p>}
      {error && <p role="alert" className="text-red-700">{error}</p>}
    </div></motion.div>}</AnimatePresence>
  </motion.article>;
}
