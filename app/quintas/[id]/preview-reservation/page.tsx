"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { ProductsServices } from "@/app/services/ProductsServices";
import { BookingsServices } from "@/app/services/BookingsServices";
import { useUser } from "@/app/context/UserContext";
import { Quintas, Users } from "@/types";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { AuthServices } from "@/app/services/AuthServices";

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
  const { user } = useUser();
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const [modal, setModal] = useState<boolean>(false);

  // Read booking data from query params (coming from BookingSection)
  const startDateParam = searchParams.get("startDate") ?? "";
  const endDateParam = searchParams.get("endDate") ?? "";
  const guestsParam = Number(searchParams.get("guests")) || 1;
  const serviceCost = Number(searchParams.get("service")) || 0;

  const [quinta, setQuinta] = useState<Quintas | null>(null);
  const [userData, setUserData] = useState<Users | null>(null);
  const [owner, setOwner] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);
  const [paymentType, setPaymentType] = useState<"deposit" | "balance">("balance");
  const [submitting, setSubmitting] = useState(false);
  const ownerId = quinta?.owner_id ?? "";

  useEffect(() => {
    const fetchQuintaAndOwner = async () => {
      try {
        const res = await Promise.all([
          ProductsServices.getQuintaById(id),
          AuthServices.getUserById(ownerId),
        ]);
        const [quinta, owner] = res;
        setQuinta(quinta);
        setOwner(owner);
      } catch {
        console.error("Error cargando quinta");
      } finally {
        setLoading(false);
      }
    };
    fetchQuintaAndOwner();
  }, [id, ownerId, user]);

  // Calcular noches y precios
  const nights = useMemo(() => {
    if (!startDateParam || !endDateParam) return 1;
    const diff =
      new Date(endDateParam).getTime() - new Date(startDateParam).getTime();
    const n = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return n > 0 ? n : 1;
  }, [startDateParam, endDateParam]);

  // ¿La estadía es de 1 mes (30 noches) o más? → ofrecer seña
  const isLongStay = useMemo(() => {
    return nights >= 30;
  }, [nights]);

  // Si NO es estadía larga, forzar pago total
  useEffect(() => {
    if (!isLongStay) setPaymentType("balance");
  }, [isLongStay]);

  const pricePerNight = quinta?.price ?? 0;
  const userId = user?.id ?? "";
  const quintaId = quinta?.id ?? "";

  const currency = quinta?.currency_price ?? "USD";
  const subtotal = pricePerNight * nights;
  const total = subtotal + serviceCost;

  const formatCurrency = (val: number) =>
    `${currency} ${val.toLocaleString("es-AR")}`;

  const sendEmailToOwner = async () => {
    const res = await fetch("/api/test-email/new-booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        owner: {
          name: owner?.name,
          email: owner?.email,
        },
        guest: {
          name: user?.name,
        },
        property: {
          title: quinta?.title,
          checkIn: startDateParam,
          checkOut: endDateParam,
          guests: guestsParam,
          total: total,
          currency: currency,
          message: bookingMessage,
        },
      }),
    });
    console.log(res);
  };

  const createdBooking = async () => {
    const fixDateToMidnightUTC = (date: string | Date) => {
      const d = new Date(date);
      d.setUTCHours(0, 0, 0, 0);
      return d.toISOString();
    };

    const formattedCheckIn = fixDateToMidnightUTC(startDateParam);
    const formattedCheckOut = fixDateToMidnightUTC(endDateParam);

    console.log(formattedCheckIn, "-", formattedCheckOut);

    await BookingsServices.createBooking({
      status: "pending",
      owner_id: ownerId,
      quinta_id: quintaId,
      guest_id: userId,
      payment_type: paymentType,
      check_in: formattedCheckIn,
      check_out: formattedCheckOut,
      guest_count: guestsParam,
      message: bookingMessage || "",
      currency_price: currency,
      amount: total,
      quinta_title: quinta?.title,
      quinta_main_image: quinta?.main_image,
      quinta_address: quinta?.address,
    });
  };

  const handleAlert = () => {
    setModal(true);
  }

  const handleConfirm = async () => {
    if (!bookingMessage) {
      alert("Por favor, agrega un mensaje para el anfitrión");
      return;
    }
    setSubmitting(true);
    try {
      await Promise.all([createdBooking(), sendEmailToOwner()]);
      setTimeout(() => {
        toast.success(
          "Reserva creada exitosamente. Esperando confirmación del anfitrión.",
        );
        router.push(`/quintas/${quintaId}/success`);
      }, 2000);
    } catch (error) {
      console.error("Error al confirmar reserva desde el back:", error);
      toast.error("Error al confirmar reserva. Por favor, inténtalo de nuevo.");
    }
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full border-4 border-primaryDark border-t-transparent">
          <img src="/logo.png" width={80} height={80} alt="" />
        </div>
      </main>
    );
  }

  if (submitting) {
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full border-4 border-primaryDark border-t-transparent">
          <img src="/logo.png" width={80} height={80} alt="" />
        </div>
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
  console.log(paymentType);

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      {modal &&
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">Quinta de Prueba</h3>
              <p className="text-md text-center text-gray-500 mb-4">Esto es una quinta de prueba a modo ilustrativo, no se pueden generar reservas reales.</p>


              <button onClick={() => setModal(false)} className="mt-2 py-2 px-5 rounded-lg bg-red-500 text-white cursor-pointer mx-auto block">Cerrar</button>
            </div>

          </div>
        </div>}
      {/* Back + Title */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-black hover:text-primaryDark transition cursor-pointer"
        >
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
              className="text-sm font-semibold underline cursor-pointer hover:text-primaryDark"
            >
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
              className="text-sm font-semibold underline cursor-pointer hover:text-primaryDark"
            >
              Editar
            </button>
          </div>
          <hr className="border-gray-200" />

          {/* ── Modalidad de pago (solo si la reserva es ≥ 2 meses) ── */}
          {isLongStay && (
            <div>
              <h2 className="font-semibold mb-1">Modalidad de pago</h2>
              <p className="text-sm text-gray-500 mb-3">
                Elegí cómo querés pagar.
              </p>
              <div className="flex flex-col gap-3">
                {/* Opción: Pago total */}
                <label
                  className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${paymentType === "balance"
                    ? "border-primaryDark bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="paymentType"
                    value="balance"
                    checked={paymentType === "balance"}
                    onChange={() => setPaymentType("balance")}
                    className="mt-0.5 accent-green-600"
                  />
                  <div>
                    <p className="font-semibold text-sm">Pago total</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Pagás el total ahora:{" "}
                      <span className="font-semibold text-gray-700">{formatCurrency(total)}</span>
                    </p>
                  </div>
                </label>

                {/* Opción: Seña + saldo */}
                <label
                  className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${paymentType === "deposit"
                    ? "border-primaryDark bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="paymentType"
                    value="deposit"
                    checked={paymentType === "deposit"}
                    onChange={() => setPaymentType("deposit")}
                    className="mt-0.5 accent-green-600"
                  />
                  <div>
                    <p className="font-semibold text-sm">Pago con seña (mitad y mitad)</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Pagás el 50% ahora:{" "}
                      <span className="font-semibold text-gray-700">
                        {formatCurrency(Math.round(subtotal * 0.5) + serviceCost)}
                      </span>
                      {" "}y el resto antes del check-in.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          <hr className="border-gray-200" />

          {/* Cancellation Policy */}
          <div className="flex flex-col gap-3">
            <h2 className="font-semibold">Política de cancelación</h2>
            <p className="text-sm flex items-center gap-2 text-gray-700">
              Las cancelaciones se regirán por las Políticas de Cancelación y Reembolso vigentes en la plataforma.
            </p>
            <Link
              href="/terms"
              className="font-semibold text-sm underline hover:text-primaryDark"
            >
              Mas información
            </Link>
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
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                No realices actividades ilegales dentro del alojamiento.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                No realices fiestas o eventos sin autorización del anfitrión.
              </li>
            </ul>
          </div>

          <hr className="border-gray-200" />

          {/* Host Acceptance Notice */}
          <div className="flex flex-col items-start gap-4 bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-10 h-10 text-primaryDark shrink-0 mt-1" />
              <p className="text-sm text-gray-700">
                El anfitrión tendrá 72 horas hábiles para aceptar o rechazar tu
                estadía, no se te cobrará nada hasta que esto pase y recibirás
                por correo la notificación con la respuesta.
              </p>
            </div>
            <p className="text-sm text-gray-700">
              Una vez confirmada la reserva, te llegará un correo con las
              instrucciones para realizar la transferencia de la seña junto al
              enlace del link de pago. Tendrás 72 horas hábiles para realizar la
              misma.
            </p>
          </div>

          <hr className="border-gray-200" />
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-2">
                ¿Qué ocurre si no pago la reserva?
              </h3>

              <p className="text-sm text-gray-700">
                En caso de que no llegues a pagar la reserva dentro del plazo de
                expiración, te enviaremos un correo electrónico y te avisaremos
                de la situación.
              </p>
            </div>
          </div>
          <hr className="border-gray-200" />
          {/* Terms & Conditions */}
          <p className="text-xs text-gray-500 leading-relaxed">
            Al seleccionar el botón a continuación, acepto los{" "}
            <Link
              href="/terms"
              className="font-semibold underline text-black hover:text-primaryDark"
            >
              Términos y Condiciones
            </Link>{" "}
            y{" "}
            <Link
              href="/politics"
              className="font-semibold underline text-black hover:text-primaryDark"
            >
              Privacidad
            </Link>
            . Además, doy mi consentimiento para que se me pueda cobrar a mi
            tarjeta el monto indicado en caso de que el anfitrión acepte, y si
            soy responsable de algún daño, también se me cobrará.
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            ZonaQuintas no se hace responsable de cualquier situación que pueda
            surgir por fuera de nuestros medios de comunicación oficiales entre
            el anfitrión y el huésped. En caso de cualquier inconveniente, por
            favor contáctanos a través de nuestro centro de Soporte.
          </p>
          {/* Submit */}
          {quinta.status != "prueba" ?
            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="w-full md:w-auto bg-primaryDark hover:bg-green-700 text-white font-bold py-3 px-16 rounded-full text-lg transition cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Procesando..." : "Confirmar reserva"}
            </button> :
            <button
              onClick={handleAlert}
              disabled={submitting}
              className="w-full md:w-auto bg-primaryDark hover:bg-green-700 text-white font-bold py-3 px-16 rounded-full text-lg transition cursor-pointer disabled:opacity-50"
            >
              Confirmar Reserva
            </button>}
        </div>

        {/* ── RIGHT COLUMN — Quinta Summary Card ── */}
        <div className="md:w-[400px] shrink-0">
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
            {/* <div className="flex items-center gap-2 px-4 pb-3">
              <span className="font-semibold text-sm">4,5</span>
              <Star className="w-3.5 h-3.5 fill-yellow-400 stroke-yellow-400" />
              <span className="text-sm text-blue-600 font-medium">
                72 opiniones
              </span>
            </div> */}

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

              {paymentType === "deposit" ? (
                <>
                  <p className="text-center text-sm font-bold text-black mb-1">Pago con seña</p>
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-600">Pagarás de seña (50%):</p>
                    <span className="font-semibold">
                      {formatCurrency(Math.round(subtotal * 0.5) + serviceCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <p>Saldo restante:</p>
                    <span>{formatCurrency(Math.round(subtotal * 0.5))}</span>
                  </div>
                  <hr className="border-gray-100 my-1" />
                  <div className="flex justify-between text-sm font-bold">
                    <p>Total de la reserva:</p>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-center text-sm font-bold mb-1">Pago total</p>
                  <div className="flex justify-between text-sm font-bold">
                    <p>Total de la reserva:</p>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </>
              )}
              <p className="text-black font-semibold mb-2 underline text-center my-5">
                Agregá un mensaje para el anfitrión
              </p>
              <textarea
                className="border w-full border-gray-200 p-2"
                placeholder="Agregá un mensaje para el anfitrión..."
                value={bookingMessage || ""}
                onChange={(e) => setBookingMessage(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
