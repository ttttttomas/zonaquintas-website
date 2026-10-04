"use client";

import { useEffect, useState } from "react";
import { Booking, QuintaAvailability, Quintas } from "@/types";
import { ProductsServices } from "@/app/services/ProductsServices";
import { localDate } from "@/app/lib/availability";

const weekdays = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

export default function OwnerAvailabilityCalendar({ properties, bookings, revision }: {
  properties: Quintas[];
  bookings: Booking[];
  revision: number;
}) {
  const [quintaId, setQuintaId] = useState("");
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [availability, setAvailability] = useState<QuintaAvailability | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const selectedId = properties.some((property) => property.id === quintaId) ? quintaId : properties[0]?.id ?? "";
  const from = localDate(month);
  const to = localDate(new Date(month.getFullYear(), month.getMonth() + 1, 1));

  useEffect(() => {
    if (!selectedId) return;
    let active = true;
    setLoading(true);
    setError(false);
    ProductsServices.getAvailability(selectedId, from, to)
      .then((data) => { if (active) setAvailability(data); })
      .catch(() => { if (active) { setAvailability(null); setError(true); } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [selectedId, from, to, revision]);

  const firstWeekday = (month.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const changeMonth = (delta: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));

  return (
    <section className="mb-10 rounded-xl bg-white p-5 shadow-md" aria-label="Calendario de disponibilidad">
      <h2 className="text-xl font-bold mb-4">Disponibilidad de mis quintas</h2>
      {properties.length === 0 ? <p className="text-gray-500">Todavía no tenés quintas publicadas.</p> : <>
        <label htmlFor="owner-quinta" className="block text-sm font-semibold mb-1">Quinta</label>
        <select id="owner-quinta" className="w-full max-w-sm border rounded-lg p-2 mb-4 bg-white" value={selectedId} onChange={(event) => setQuintaId(event.target.value)}>
          {properties.map((property) => <option key={property.id} value={property.id}>{property.title}</option>)}
        </select>
        <div className="flex items-center justify-between max-w-md mb-3">
          <button type="button" onClick={() => changeMonth(-1)} aria-label="Mes anterior" className="p-2 rounded-full hover:bg-gray-100">‹</button>
          <h3 className="font-semibold capitalize">{month.toLocaleDateString("es-AR", { month: "long", year: "numeric" })}</h3>
          <button type="button" onClick={() => changeMonth(1)} aria-label="Mes siguiente" className="p-2 rounded-full hover:bg-gray-100">›</button>
        </div>
        {loading ? <div className="max-w-md h-72 rounded-lg bg-gray-100 animate-pulse" aria-label="Cargando calendario" /> :
          error || !availability ? <p role="alert" className="text-red-600">No se pudo cargar la disponibilidad.</p> : <>
            {!availability.rental_start_date && <p className="text-sm text-amber-700 mb-2">Esta quinta todavía no tiene un período de alquiler configurado.</p>}
            <div className="grid grid-cols-7 gap-1 max-w-md" role="grid" aria-label="Estado de cada día">
              {weekdays.map((day) => <span key={day} className="text-center text-xs font-semibold text-gray-500">{day}</span>)}
              {Array.from({ length: firstWeekday }, (_, index) => <span key={`empty-${index}`} />)}
              {Array.from({ length: days }, (_, index) => {
                const day = localDate(new Date(month.getFullYear(), month.getMonth(), index + 1));
                const outside = Boolean((availability.rental_start_date && day < availability.rental_start_date) ||
                  (availability.rental_end_date && day >= availability.rental_end_date));
                const booking = bookings.find((item) => item.quinta_id === selectedId && item.check_in.slice(0, 10) <= day && day < item.check_out.slice(0, 10) &&
                  !["rejected", "cancelled", "rechazado", "cancelado"].includes(item.status.toLowerCase()));
                const state = outside ? "Fuera de rango" : booking && ["pending", "pendiente"].includes(booking.status.toLowerCase()) ? "Pendiente" : booking ? "Reservada" : "Disponible";
                const color = outside ? "bg-gray-100 text-gray-400" : state === "Pendiente" ? "bg-amber-100 text-amber-900" : state === "Reservada" ? "bg-red-100 text-red-900" : "bg-green-50 text-green-900";
                return <span key={day} role="gridcell" aria-label={`${index + 1}: ${state}`} className={`rounded-lg py-2 text-center text-sm ${color}`}>{index + 1}</span>;
              })}
            </div>
            <p className="mt-3 text-xs text-gray-600">Verde: disponible · Amarillo: pendiente · Rojo: reservada · Gris: fuera de rango</p>
          </>}
      </>}
    </section>
  );
}
