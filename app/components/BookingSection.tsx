"use client";
import { useState } from "react";
import Calendar from "@/app/components/Calendar";
import { CalendarDays } from "lucide-react";

type Props = {
  formatedPrice: string;
  costOfService: string;
  totalPrice: string;
  maxGuests: number;
  children: React.ReactNode; // servicios, descripción, etc. del server component
};

function formatDate(date: Date | null): string {
  if (!date) return "—";
  return date.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function BookingSection({
  formatedPrice,
  costOfService,
  totalPrice,
  maxGuests,
  children,
}: Props) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleDatesChange = (start: Date | null, end: Date | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <section
      className="mx-30 flex justify-between gap-20 py-6"
      id="quinta_info">
      <div className="w-1/2 space-y-6">
        {/* Server-rendered content (calificaciones, descripción, servicios) */}
        {children}

        {/* Calendario */}
        <div>
          <h3 className="font-semibold mb-2">
            Modificar tu ingreso y salida
          </h3>
          <p className="text-sm text-gray-500 mb-2">
            Estadía mínima 2 noches
          </p>
          <Calendar onDatesChange={handleDatesChange} />
        </div>
      </div>

      {/* Reservar derecha */}
      <div className="rounded-xl bg-white shadow-md shadow-black/50 py-6 px-12 flex top-22 flex-col md:sticky h-fit">
        <p className="text-2xl text-center font-semibold mb-5">
          {`${formatedPrice} por noche`}
        </p>

        <div className="border-t border-x border-black/40 rounded-t-md divide-x grid grid-cols-2 overflow-hidden">
          <div className="flex flex-col justify-center items-center py-1 px-10 text-sm">
            <p className="text-black text-sm font-semibold">
              Fecha de ingreso
            </p>
            <div className="flex items-center gap-2 justify-center">
              <p className="font-medium text-gray-700">
                {formatDate(startDate)}
              </p>
              <CalendarDays className="w-4" />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center py-1 px-10 text-sm">
            <p className="text-black text-sm font-semibold">
              Fecha de salida
            </p>
            <div className="flex items-center gap-2 justify-center">
              <p className="font-medium text-gray-700">
                {formatDate(endDate)}
              </p>
              <CalendarDays className="w-4" />
            </div>
          </div>
        </div>

        <div className="border border-black/40 rounded-b-md p-2 text-sm">
          <p className="text-black font-semibold">Cantidad de Huéspedes</p>
          <select className="w-1/2" name="huespedes">
            {Array.from({ length: maxGuests }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i === 0 ? "Huésped" : "Huéspedes"}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm space-y-1 flex flex-col gap-2 my-5 text-gray-700">
          <div className="flex justify-between">
            <span>{`${formatedPrice} por noche`}</span>
            <span className="text-black font-semibold">{formatedPrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Costo de servicio</span>
            <span className="text-black font-semibold">{costOfService}</span>
          </div>
          <div className="flex justify-between font-semibold py-5 border-t border-gray-400">
            <span>Total</span>
            <span className="text-black">${totalPrice}</span>
          </div>
        </div>

        <button className="w-full bg-primaryDark text-white py-2 rounded-md hover:bg-green-700 transition">
          Reservar
        </button>
      </div>
    </section>
  );
}
