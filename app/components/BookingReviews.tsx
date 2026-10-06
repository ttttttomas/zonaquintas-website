"use client";
import { useState } from "react";
import type { BookingReview } from "@/app/services/GuestServices";
export default function BookingReviews({ reviews, title = "Reseñas" }: { reviews: BookingReview[]; title?: string }) {
  const [stars, setStars] = useState("all");
  const average = reviews.length ? (reviews.reduce((sum, r) => sum + Number(r.stars), 0) / reviews.length).toFixed(1) : null;
  const filtered = reviews.filter(r => stars === "all" || Number(r.stars) === Number(stars));
  return <section className="my-8 space-y-5 rounded-2xl border border-gray-200 bg-white p-6" aria-label={title}>
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-xl font-semibold">{title}</h2><p className="mt-1 text-sm text-gray-500">{average ? `★ ${average} / 5 · ${reviews.length} reseñas` : "Todavía no hay reseñas."}</p></div><label className="text-sm">Puntuación <select className="ml-2 rounded-lg border border-gray-200 p-2" value={stars} onChange={e => setStars(e.target.value)}><option value="all">Todas</option>{[5,4,3,2,1].map(n => <option key={n} value={n}>{n} estrellas ({reviews.filter(r => Number(r.stars) === n).length})</option>)}</select></label></div>
    <div className="grid gap-4 md:grid-cols-2">{filtered.map(r => <article key={r.id} className="rounded-xl border border-gray-100 p-4"><p className="font-medium">{r.quinta_title || "Quinta"}</p><p className="mt-1 text-sm text-primaryDark">★ {r.stars} / 5 <span className="text-gray-500">{r.guest_name}</span></p><p className="mt-3 whitespace-pre-wrap break-words text-sm">{r.review_text || "Sin comentario escrito."}</p><p className="mt-3 break-all text-xs text-gray-500">{r.created_at?.slice(0,10)} · Reserva {r.booking_id}</p></article>)}</div>
    {reviews.length > 0 && filtered.length === 0 && <p className="text-sm text-gray-500">No hay reseñas con esta puntuación.</p>}
  </section>;
}
