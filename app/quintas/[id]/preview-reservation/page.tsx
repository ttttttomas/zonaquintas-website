"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { ProductsServices } from "@/app/services/ProductsServices";
import { Quintas } from "@/types";
import { Star, ChevronLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

function formatDateDisplay(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function PreviewReservationPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;

  // Read booking data from query params (coming from BookingSection)
  const startDateParam = searchParams.get("startDate") ?? "";
  const endDateParam = searchParams.get("endDate") ?? "";
  const guestsParam = Number(searchParams.get("guests")) || 1;

  const [quinta, setQuinta] = useState<Quintas | null>(null);
  const [loading, setLoading] = useState(true);

  // Payment form state
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuinta = async () => {
      try {
        const data = await ProductsServices.getQuintaById(id);
        setQuinta(data);
      } catch {
        console.error("Error cargando quinta");
      } finally {
        setLoading(false);
      }
    };
    fetchQuinta();
  }, [id]);

  // Calcular noches y precios
  const nights = useMemo(() => {
    if (!startDateParam || !endDateParam) return 1;
    const diff =
      new Date(endDateParam).getTime() - new Date(startDateParam).getTime();
    const n = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return n > 0 ? n : 1;
  }, [startDateParam, endDateParam]);

  const pricePerNight = quinta?.price ?? 0;
  const currency = quinta?.currency_price ?? "USD";
  const subtotal = pricePerNight * nights;
  const serviceCost = Math.round(subtotal * 0.119);
  const total = subtotal + serviceCost;

  const formatCurrency = (val: number) =>
    `${currency} ${val.toLocaleString("es-AR")}`;

  const handleConfirm = async () => {
    setSubmitting(true);
    // TODO: Integrar con pasarela de pago
    setTimeout(() => {
      setSubmitting(false);
      router.push("/");
    }, 2000);
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primaryDark border-t-transparent" />
      </main>
    );
  }

  if (!quinta) {
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-lg">No se encontró la quinta.</p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      {/* Back + Title */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-black hover:text-primaryDark transition cursor-pointer">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold">Tu Reserva</h1>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Confirmá que hayas seleccionado correctamente y avanzá al proceso de
        pago
      </p>

      <div className="flex flex-col md:flex-row gap-8">
        {/* ── LEFT COLUMN ── */}
        <div className="flex-1 space-y-6">
          {/* Dates */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm mb-1">
                Fechas de ingreso y salida del alojamiento
              </p>
              <p className="text-sm text-gray-700">
                Ingreso {formatDateDisplay(startDateParam)} | Salida{" "}
                {formatDateDisplay(endDateParam)}
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="text-sm font-semibold underline cursor-pointer hover:text-primaryDark">
              Editar
            </button>
          </div>

          {/* Guests */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm mb-1">
                Cantidad de Huéspedes
              </p>
              <p className="text-sm text-gray-700">
                {guestsParam} {guestsParam === 1 ? "Huésped" : "Huéspedes"}
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="text-sm font-semibold underline cursor-pointer hover:text-primaryDark">
              Editar
            </button>
          </div>

          <hr className="border-gray-200" />

          {/* Payment Methods */}
          {/* <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Poder pagar con</h2>
              <div className="flex gap-2 items-center">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                  alt="Visa"
                  className="h-5"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                  alt="Mastercard"
                  className="h-5"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/f/fa/American_Express_logo_%282018%29.svg"
                  alt="Amex"
                  className="h-5"
                />
                <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-[8px] font-bold">PAY</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Número de tarjeta"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full md:w-2/3 border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-primaryDark transition"
              />
              <div className="flex gap-3 w-full md:w-2/3">
                <input
                  type="text"
                  placeholder="Vencimiento"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-primaryDark transition"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="w-24 border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-primaryDark transition"
                />
              </div>
              <input
                type="text"
                placeholder="Dirección de facturación"
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                className="w-full md:w-2/3 border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-primaryDark transition"
              />
              <input
                type="text"
                placeholder="Código postal"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="w-full md:w-2/3 border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-primaryDark transition"
              />
            </div>
          </div> */}

          <hr className="border-gray-200" />

          {/* Cancellation Policy */}
          <div>
            <h2 className="font-semibold mb-2">Política de cancelación</h2>
            <p className="text-sm text-gray-700">
              Esta reserva no es reembolsable.
              <Link
                href="/terms"
                className="font-semibold underline hover:text-primaryDark">
                Mas información
              </Link>
            </p>
          </div>

          <hr className="border-gray-200" />

          {/* Basic Rules */}
          <div>
            <h2 className="font-semibold mb-2">Reglas básicas</h2>
            <p className="text-sm text-gray-700 mb-3">
              Les pedimos a los huéspedes que tengan en cuenta algunos detalles
              para mantener la cordialidad de la relación entre anfitriones y
              huéspedes.
            </p>
            <ul className="text-sm text-gray-700 space-y-1 ml-4">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                Respetá las normas del anfitrión.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                Tratá el alojamiento del anfitrión como si fuese tu casa.
              </li>
            </ul>
          </div>

          <hr className="border-gray-200" />

          {/* Host Acceptance Notice */}
          <div className="flex items-start gap-4 bg-gray-50 rounded-xl p-4">
            <ShieldCheck className="w-10 h-10 text-primaryDark shrink-0 mt-1" />
            <p className="text-sm text-gray-700">
              Una vez confirmada la reserva el anfitrión tendrá 24 horas hábiles
              para aceptar o rechazar tu estadía, no se te cobrará nada hasta
              que esto pase y recibirás por correo la notificación con la
              respuesta.
            </p>
          </div>

          <hr className="border-gray-200" />

          {/* Terms & Conditions */}
          <p className="text-xs text-gray-500 leading-relaxed">
            Al seleccionar el botón de a continuación, acepto los{" "}
            <Link
              href="/terms"
              className="font-semibold underline text-black hover:text-primaryDark">
              Términos y condiciones
            </Link>{" "}
            y{" "}
            <Link
              href="/politics"
              className="font-semibold underline text-black hover:text-primaryDark">
              Privacidad
            </Link>
            . Además, doy mi consentimiento para que se pueda cobrarme a mi
            tarjeta el monto indicado en caso de que el anfitrión acepte y si
            soy responsable de algún daño también se me cobrará.
          </p>

          {/* Submit */}
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="w-full md:w-auto bg-primaryDark hover:bg-green-700 text-white font-bold py-3 px-16 rounded-full text-lg transition cursor-pointer disabled:opacity-50">
            {submitting ? "Procesando..." : "Confirmar reserva"}
          </button>
        </div>

        {/* ── RIGHT COLUMN — Quinta Summary Card ── */}
        <div className="md:w-[340px] shrink-0">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden md:sticky md:top-24">
            {/* Quinta Image + Info */}
            <div className="flex gap-3 p-4">
              <img
                src={quinta.main_image}
                alt={quinta.title}
                className="w-28 h-24 object-cover rounded-lg shrink-0"
              />
              <div className="flex flex-col justify-center min-w-0">
                <p className="font-semibold text-sm leading-tight truncate">
                  {quinta.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{quinta.city}</p>
                <p className="text-xs text-gray-400 leading-tight">
                  {quinta.address}
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 px-4 pb-3">
              <span className="font-semibold text-sm">4,5</span>
              <Star className="w-3.5 h-3.5 fill-yellow-400 stroke-yellow-400" />
              <span className="text-sm text-blue-600 font-medium">
                72 opiniones
              </span>
            </div>

            <hr className="border-gray-200" />

            {/* Price Breakdown */}
            <div className="p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {nights} {nights === 1 ? "noche" : "noches"}
                </span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Costo de servicio</span>
                <span className="font-medium">
                  {formatCurrency(serviceCost)}
                </span>
              </div>

              <hr className="border-gray-200 my-2" />

              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
