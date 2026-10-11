"use client";

import { useState } from "react";
import { Booking, Quintas } from "@/types";
import { localDate } from "@/app/lib/availability";

const weekdays = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

export default function OwnerAvailabilityCalendar({ properties, bookings }: {
  properties: Quintas[];
  bookings: Booking[];
}) {
  const [quintaId, setQuintaId] = useState("");
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const selectedId = properties.some((property) => property.id === quintaId) ? quintaId : properties[0]?.id ?? "";
  const selectedProperty = properties.find((property) => property.id === selectedId);

  const firstWeekday = (month.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const changeMonth = (delta: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + delta, 1));

  return (
    <section className="w-full min-w-0 rounded-xl p-1" aria-label="Calendario de disponibilidad">
      {properties.length === 0 ? <p className="text-gray-500">Todavía no tenés quintas publicadas.</p> : <>
        <label htmlFor="owner-quinta" className="block text-sm font-semibold mb-1">Quinta</label>
        <select id="owner-quinta" className="w-full max-w-sm border rounded-lg p-2 mb-4 bg-white" value={selectedId} onChange={(event) => setQuintaId(event.target.value)}>
          {properties.map((property) => <option key={property.id} value={property.id}>{property.title}</option>)}
        </select>
        <div className="flex w-full items-center justify-between mb-3">
          <button type="button" onClick={() => changeMonth(-1)} aria-label="Mes anterior" className="p-2 rounded-full cursor-pointer hover:bg-gray-100">‹</button>
          <h3 className="font-semibold capitalize">{month.toLocaleDateString("es-AR", { month: "long", year: "numeric" })}</h3>
          <button type="button" onClick={() => changeMonth(1)} aria-label="Mes siguiente" className="p-2 rounded-full cursor-pointer hover:bg-gray-100">›</button>
        </div>
        {selectedProperty ? <>
          {!selectedProperty.rental_start_date && <p className="text-sm text-amber-700 mb-2">Esta quinta todavía no tiene un período de alquiler configurado.</p>}
          <div className="grid w-full grid-cols-7 gap-1 bg-white/50 p-2 sm:gap-2 sm:p-3 rounded-lg" role="grid" aria-label="Estado de cada día">
            {weekdays.map((day) => <span key={day} className="text-center text-xs font-semibold text-gray-500">{day}</span>)}
            {Array.from({ length: firstWeekday }, (_, index) => <span key={`empty-${index}`} />)}
            {Array.from({ length: days }, (_, index) => {
              const day = localDate(new Date(month.getFullYear(), month.getMonth(), index + 1));
              const outside = Boolean((selectedProperty.rental_start_date && day < selectedProperty.rental_start_date) ||
                (selectedProperty.rental_end_date && day >= selectedProperty.rental_end_date));
              const booking = bookings.find((item) => item.quinta_id === selectedId && item.check_in.slice(0, 10) <= day && day < item.check_out.slice(0, 10) &&
                !["rejected", "cancelled", "rechazado", "cancelado"].includes(item.status.toLowerCase()));
              const state = outside ? "Fuera de rango" : booking && ["pending", "pendiente"].includes(booking.status.toLowerCase()) ? "Pendiente" : booking ? "Reservada" : "Disponible";
              const color = outside ? "bg-gray-100 text-gray-400" : state === "Pendiente" ? "bg-amber-100 text-amber-900" : state === "Reservada" ? "bg-red-100 text-red-900" : "bg-green-50 text-green-900";
              return <span key={day} role="gridcell" aria-label={`${index + 1}: ${state}`} className={`rounded-lg py-2 text-center text-sm sm:py-3 ${color}`}>{index + 1}</span>;
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs"><span className="text-green-600">Verde: disponible</span><span className="text-amber-600">Amarillo: pendiente</span><span className="text-red-600">Rojo: reservada</span><span className="text-gray-500">Gris: fuera de rango</span></div>
        </> : null}
      </>}
    </section>
  );
}
