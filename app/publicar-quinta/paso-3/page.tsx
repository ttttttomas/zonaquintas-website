"use client";
import { useState } from "react";
import { useQuintaForm } from "@/app/context/QuintaFormContext";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import { argentinaToday, dateFromISO, localDate } from "@/app/lib/availability";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

registerLocale("es", es);

const formatNumber = (val: string | number): string => {
  if (!val && val !== 0) return "";
  const clean = val.toString().replace(/\D/g, "");
  if (clean === "") return "";
  return Number(clean).toLocaleString("es-AR", { maximumFractionDigits: 0 });
};

export default function Paso3Page() {
  const { form, updateForm } = useQuintaForm();
  const router = useRouter();

  const [guestPrice, setGuestPrice] = useState<string>(
    form.price ? formatNumber(form.price) : ""
  );
  const [ownerPrice, setOwnerPrice] = useState<string>(
    form.price
      ? formatNumber(Math.round(form.price * 0.9))
      : ""
  );

  const handleGuestPriceChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    if (cleanValue === "") {
      setGuestPrice("");
      setOwnerPrice("");
      updateForm({ price: 0 });
      return;
    }
    const num = Number(cleanValue);
    if (!isNaN(num) && num >= 0) {
      const ownerVal = Math.round(num * 0.9);
      setGuestPrice(formatNumber(cleanValue));
      setOwnerPrice(formatNumber(ownerVal));
      updateForm({ price: num });
    }
  };

  const handleOwnerPriceChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    if (cleanValue === "") {
      setOwnerPrice("");
      setGuestPrice("");
      updateForm({ price: 0 });
      return;
    }
    const num = Number(cleanValue);
    if (!isNaN(num) && num >= 0) {
      const guestVal = Math.round(num / 0.9);
      setOwnerPrice(formatNumber(cleanValue));
      setGuestPrice(formatNumber(guestVal));
      updateForm({ price: guestVal });
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const { price } = form;

    if (!price || price <= 0) {
      toast.error("Por favor ingresa un precio válido");
      return;
    }
    if (!form.rental_start_date || !form.rental_end_date || form.rental_end_date <= form.rental_start_date) {
      toast.error("Seleccioná el período de alquiler completo");
      return;
    }

    router.push("/publicar-quinta/paso-4");
  };

  return (
    <main className="flex md:flex-row flex-col mb-10 md:mb-0 gap-10 md:gap-0 md:min-h-[50vh] items-center justify-between mx-5 md:mx-20">
      <section className="flex flex-col items-start justify-center w-full md:w-1/3">
        <h1 className="font-semibold md:text-xl mb-5">
          Brindanos la ultima información para tu publicación
        </h1>
        <div className="flex flex-col gap-2 mb-5">
          <p className="text-black/50 text-xs">Indica el precio que queres que el huesped pague por día o el que queres recibir.</p>
          <p className="text-black/50 text-xs">Recorda que ZonaQuintas cuenta con una comisión del 10%.</p>
        </div>
        <form onSubmit={handleContinue} className="w-full flex flex-col gap-3 rounded-xl">
          <div className="w-full flex flex-col md:flex-row items-center bg-black/10 rounded-lg px-3 md:gap-2">
            <span className="text-sm text-black whitespace-nowrap">Huesped paga:</span>
            <input
              placeholder="Ponele precio a tu quinta (Por dia)*"
              className="p-2 w-full flex-1 outline-none"
              type="text"
              value={`$${guestPrice}`}
              onChange={(e) => handleGuestPriceChange(e.target.value)}
            />
            <select
              value={form.currency_price}
              className="bg-transparent pr-2 outline-none cursor-pointer font-semibold text-gray-700"
              onChange={(e) =>
                updateForm({
                  currency_price: e.target.value as "ARS" | "USD",
                })
              }>
              <option value="ARS">ARS</option>
              <option value="USD">USD</option>
            </select>
          </div>
          <div className="flex justify-center gap-1 ">
            <small className="text-xs text-gray-500 font-bold">Comision ZonaQuintas</small>
            <small className="text-xs text-gray-500">(10%): </small>
            <small className="text-xs text-gray-500">
              {guestPrice ? `$${formatNumber(Math.round(Number(guestPrice.replace(/\D/g, "")) * 0.1))}` : "—"}
            </small>
          </div>
          <div className="w-full flex flex-col md:flex-row items-center bg-black/10 rounded-lg px-3 gap-2">
            <span className="text-sm text-black whitespace-nowrap">Vos recibís:</span>
            <input
              placeholder="Monto a recibir"
              className="p-2 flex-1 w-full outline-none"
              type="text"
              value={`$${ownerPrice}`}
              onChange={(e) => handleOwnerPriceChange(e.target.value)}
            />
            <span className="pr-2 font-semibold text-gray-700">
              {form.currency_price}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="rental-period" className="text-sm font-semibold">Período de alquiler</label>
            <p className="text-xs text-gray-500">Elegí desde el primer ingreso hasta la última salida permitida.</p>
            <DatePicker
              id="rental-period"
              selectsRange
              startDate={form.rental_start_date ? dateFromISO(form.rental_start_date) : null}
              endDate={form.rental_end_date ? dateFromISO(form.rental_end_date) : null}
              onChange={([start, end]) => updateForm({
                rental_start_date: start ? localDate(start) : "",
                rental_end_date: end ? localDate(end) : "",
              })}
              minDate={dateFromISO(argentinaToday())}
              locale="es"
              dateFormat="dd/MM/yyyy"
              placeholderText="Seleccioná ingreso y última salida"
              className="w-full rounded-lg bg-black/10 p-2 outline-none focus-visible:ring-2 focus-visible:ring-primaryDark"
              wrapperClassName="w-full"
              isClearable
            />
            <div className="flex gap-4 text-sm">
              <button type="button" className="underline cursor-pointer" onClick={() => {
                const today = dateFromISO(argentinaToday());
                updateForm({ rental_start_date: localDate(today), rental_end_date: localDate(new Date(today.getFullYear() + 1, 0, 1)) });
              }}>Todo el año</button>
              <button type="button" className="underline cursor-pointer" onClick={() => updateForm({ rental_start_date: "", rental_end_date: "" })}>Limpiar</button>
            </div>
          </div>
          <button
            type="submit"
            className="bg-primaryDark text-center cursor-pointer text-white py-2 font-bold text-xl rounded-lg">
            Continuar
          </button>
        </form>
      </section>
      <img src="/paso3.png" className="h-90 md:block hidden object-cover" alt="paso 3" />
    </main>
  );
}
