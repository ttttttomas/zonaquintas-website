"use client";
import SecondSeparator from "@/app/components/SecondSeparator";
import { useState, useMemo } from "react";
import { useQuintaForm } from "@/app/context/QuintaFormContext";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/axios";

/** Mapeo de nombre legible → key del tipo Quintas */
const CHAR_TO_KEY: Record<string, string> = {
  Sabanas: "sabanas",
  Mantas: "mantas",
  Almohadas: "almohadas",
  Toilettes: "toilettes",
  Shampoo: "shampoo",
  Toallas: "toallas",
  "Secador de pelo": "secador",
  Lavarropas: "lavarropas",
  "Cambio de toallas": "cambio_de_toallas",
  "Utensilios para cocinar": "utensilios_cocina",
  Vajilla: "vajilla",
  Freezer: "freezer",
  Televisor: "televisor",
  Radio: "radio",
  TV: "tv",
  Cable: "cable",
  Internet: "wifi",
  Jacuzzi: "jacuzzi",
  Playroom: "playroom",
  "Sofás": "sofas",
  "Estacionamiento techado": "estacionamiento_techado",
  Parrilla: "parrilla",
  "Estufa a gas": "estufa_a_gas",
  Hogar: "hogar",
  "Hamacas paraguayas": "hamacas_paraguayas",
  "Arboleda con buena sombra": "arboleda",
  "Cancha de fútbol": "cancha_futbol",
  Piscina: "piscina",
  "Cancha de basquet": "cancha_basquet",
  "Cancha de tenis": "cancha_tenis",
  "Cancha de padel": "cancha_padel",
  Hamacas: "hamacas",
  Parlantes: "parlantes",
};

export default function Paso4Page() {
  const { form, resetForm } = useQuintaForm();
  const router = useRouter();
  const [popUp, setPopUp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Previews de las imágenes seleccionadas
  const imagePreviews = useMemo(
    () => form.images.map((file) => URL.createObjectURL(file)),
    [form.images],
  );

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      // Construir el body con las características como booleans
      const charBooleans: Record<string, boolean> = {};
      for (const [, key] of Object.entries(CHAR_TO_KEY)) {
        charBooleans[key] = false;
      }
      for (const charName of form.characteristics) {
        const key = CHAR_TO_KEY[charName];
        if (key) charBooleans[key] = true;
      }

      // FormData para enviar imágenes + datos
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("address", form.address);
      formData.append("latitude", String(form.latitude));
      formData.append("longitude", String(form.longitude));
      formData.append("city", form.city);
      formData.append("guests", String(form.guests));
      formData.append("bedrooms", String(form.bedrooms));
      formData.append("bathrooms", String(form.bathrooms));
      formData.append("ambients", String(form.ambients));
      formData.append("beds", String(form.beds));
      formData.append("price", String(form.price));
      formData.append("currency_price", form.currency_price);
      formData.append("m2", String(form.m2));

      // Características
      for (const [key, val] of Object.entries(charBooleans)) {
        formData.append(key, String(val));
      }

      // Imágenes
      for (const file of form.images) {
        formData.append("images", file);
      }

      await apiClient.post("/quintas", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      resetForm();
      setPopUp(false);
      router.push("/");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ?? "Error al publicar la quinta",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col relative items-center pb-20 justify-center">
      <div className="absolute publicar2 h-1/2 z-0 w-full">
        <img className="mx-auto" src="/logo.png" alt="" />
      </div>
      <h1 className="text-center font-semibold text-xl">
        Previsualiza y confirmá todos tus datos
      </h1>

      {/* ── PASO 1: Datos básicos ── */}
      <section className="flex items-center justify-start my-5 gap-10 px-20 w-full">
        <p className="size-20 pt-4 shrink-0 rounded-full bg-primaryDark text-5xl text-center my-auto text-white font-extrabold">
          1
        </p>
        <ul className="flex flex-col gap-5 w-full text-lg">
          <li>
            Cantidad de ambientes:{" "}
            <b className="italic">{form.ambients || "—"}</b>
          </li>
          <li>
            Cantidad de habitaciones:{" "}
            <b className="italic">{form.bedrooms || "—"}</b>
          </li>
          <li>
            Cantidad de camas:{" "}
            <b className="italic">{form.beds || "—"}</b>
          </li>
          <li>
            Cantidad de baños:{" "}
            <b className="italic">{form.bathrooms || "—"}</b>
          </li>
          <li>
            Cantidad de huéspedes:{" "}
            <b className="italic">{form.guests || "—"}</b>
          </li>
          <li>
            Cantidad de m2: <b className="italic">{form.m2 || "—"}</b>
          </li>
          <li>
            Características:{" "}
            <b className="italic">
              {form.characteristics.length > 0
                ? form.characteristics.join(", ")
                : "Ninguna seleccionada"}
            </b>
          </li>
        </ul>
      </section>

      <SecondSeparator />

      {/* ── PASO 2: Título, imágenes, ubicación ── */}
      <section className="flex items-center justify-start my-5 gap-10 px-20 w-full">
        <p className="size-20 pt-4 shrink-0 rounded-full bg-primaryDark text-5xl text-center my-auto text-white font-extrabold">
          2
        </p>
        <ul className="flex flex-col gap-5 w-full text-lg">
          <li>
            Título:{" "}
            <b className="italic">{form.title || "Sin título"}</b>
          </li>
          <li>
            Descripción:{" "}
            <b className="italic">
              {form.description || "Sin descripción"}
            </b>
          </li>
          <li className="flex items-center gap-2">
            <p>Imágenes:</p>
            <div className="flex gap-3 flex-wrap">
              {imagePreviews.length > 0 ? (
                imagePreviews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`foto ${i + 1}`}
                    className="size-14 object-cover rounded-xl"
                  />
                ))
              ) : (
                <span className="italic text-gray-400">
                  Sin imágenes
                </span>
              )}
            </div>
          </li>
          <li>
            Ubicación:{" "}
            <b className="italic">
              {form.address || "Sin dirección"}
            </b>
          </li>
          {form.city && (
            <li>
              Barrio: <b className="italic">{form.city}</b>
            </li>
          )}
        </ul>
      </section>

      <SecondSeparator />

      {/* ── PASO 3: Precios ── */}
      <section className="flex items-center justify-start my-5 gap-10 px-20 w-full">
        <p className="size-20 pt-4 shrink-0 rounded-full bg-primaryDark text-5xl text-center my-auto text-white font-extrabold">
          3
        </p>
        <ul className="flex flex-col gap-5 w-full text-lg">
          <li>
            Precio por día:{" "}
            <b className="italic">
              {form.price
                ? `${form.currency_price} ${form.price.toLocaleString()}`
                : "—"}
            </b>
          </li>
          {form.price_quincena > 0 && (
            <li>
              Precio por quincena:{" "}
              <b className="italic">
                {form.currency_quincena}{" "}
                {form.price_quincena.toLocaleString()}
              </b>
            </li>
          )}
          {form.price_mes > 0 && (
            <li>
              Precio por mes:{" "}
              <b className="italic">
                {form.currency_mes} {form.price_mes.toLocaleString()}
              </b>
            </li>
          )}
        </ul>
      </section>

      {error && (
        <p className="text-red-500 font-semibold text-center mb-4">
          {error}
        </p>
      )}

      <button
        onClick={() => setPopUp(true)}
        className="bg-primaryDark w-8/10 z-20 py-2 text-white mx-30 text-xl font-bold rounded-lg cursor-pointer">
        Confirmar publicación
      </button>

      {/* ── Pop-up de confirmación ── */}
      {popUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-tertiary text-white rounded-2xl gap-8 flex flex-col w-[550px] p-6 shadow-xl">
            <p className="text-black font-bold text-xl text-nowrap text-center">
              ¿Estás seguro de que deseas enviar tu publicación?
            </p>
            <small className="text-black text-center text-lg">
              Esta será enviada a revisión y próximamente se te notificará
              de si es aprobada o denegada.
            </small>
            <small className="text-black text-center text-lg">
              Verificá que todos los datos sean correctos.
            </small>
            <div className="flex justify-between gap-5 w-full px-10">
              <button
                disabled={submitting}
                onClick={() => setPopUp(false)}
                className="border-black cursor-pointer border py-1 rounded-xl bg-white text-primary w-1/2">
                Volver
              </button>
              <button
                disabled={submitting}
                onClick={handleSubmit}
                className="border border-primaryDark cursor-pointer py-1 bg-primaryDark text-white rounded-xl w-1/2 disabled:opacity-50">
                {submitting ? "Enviando..." : "Confirmar publicación"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
