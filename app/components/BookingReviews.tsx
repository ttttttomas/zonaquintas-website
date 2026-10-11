"use client";
import { useState } from "react";
import type { BookingReview } from "@/app/services/GuestServices";

export default function BookingReviews({ reviews, title = "Reseñas" }: { reviews: BookingReview[]; title?: string }) {
  const [stars, setStars] = useState("all");
  const [quintaId, setQuintaId] = useState("all");
  const [page, setPage] = useState(0);
  const average = reviews.length ? (reviews.reduce((sum, review) => sum + Number(review.stars), 0) / reviews.length).toFixed(1) : null;
  const quintas = Array.from(new Map(reviews.filter(review => review.quinta_id).map(review => [review.quinta_id!, review.quinta_title || "Quinta"])).entries());
  const filtered = reviews.filter(review => (stars === "all" || Number(review.stars) === Number(stars)) && (quintaId === "all" || review.quinta_id === quintaId));
  const visible = filtered.slice(page * 10, page * 10 + 10);
  return <section className="my-8 space-y-5 rounded-2xl border border-gray-200 bg-white p-6" aria-label={title}>
    <div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-xl font-semibold">{title}</h2><p className="mt-1 text-sm text-gray-500">{average ? `★ ${average} / 5 · ${reviews.length} reseñas` : "Todavía no hay reseñas."}</p></div><div className="flex flex-wrap gap-2">{quintas.length > 1 && <label className="text-sm">Quinta <select className="ml-2 rounded-lg border border-gray-200 p-2" value={quintaId} onChange={event => { setQuintaId(event.target.value); setPage(0); }}><option value="all">Todas</option>{quintas.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label>}<label className="text-sm">Puntuación <select className="ml-2 rounded-lg border border-gray-200 p-2" value={stars} onChange={event => { setStars(event.target.value); setPage(0); }}><option value="all">Todas</option>{[5,4,3,2,1].map(value => <option key={value} value={value}>{value} estrellas ({reviews.filter(review => Number(review.stars) === value).length})</option>)}</select></label></div></div>
    <div className="grid gap-4 md:grid-cols-2">{visible.map(review => <article key={review.id} className="rounded-xl border border-gray-100 p-4"><p className="font-medium">{review.quinta_title || "Quinta"}</p><p className="mt-1 text-sm text-primaryDark">★ {review.stars} / 5 <span className="text-gray-500">{review.guest_name}</span></p><p className="mt-3 whitespace-pre-wrap break-words text-sm">{review.review_text || "Sin comentario escrito."}</p><p className="mt-3 break-all text-xs text-gray-500">{review.created_at?.slice(0,10)} · Reserva {review.booking_id}</p></article>)}</div>
    {reviews.length > 0 && filtered.length === 0 && <p className="text-sm text-gray-500">No hay reseñas con estos filtros.</p>}
    {filtered.length > 10 && <div className="flex gap-3"><button type="button" disabled={page === 0} onClick={() => setPage(value => value - 1)} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50">Anterior</button><button type="button" disabled={(page + 1) * 10 >= filtered.length} onClick={() => setPage(value => value + 1)} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50">Siguiente</button></div>}
  </section>;
}
