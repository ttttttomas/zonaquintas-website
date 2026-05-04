"use client";
import { Separator } from "@/app/components/ui/Separator";
import { useUser } from "@/app/context/UserContext";
import { BookingsServices } from "@/app/services/BookingsServices";
import { Booking } from "@/types";
import { createPaymentLinkRebill } from "@/lib/rebill";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function ReservationCard({ booking }: { booking: Booking }) {
  const { user } = useUser();
  const router = useRouter();

  // Cálculo de noches para el despeje matemático
  const nights = (() => {
    const start = new Date(booking.check_in);
    const end = new Date(booking.check_out);
    const diff = end.getTime() - start.getTime();
    const n = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return n > 0 ? n : 1;
  })();

  // Fórmula: Total = (Precio * Noches) + (Precio * 0.06)
  // Despeje: Precio = Total / (Noches + 0.06)
  const pricePerNight = booking.amount / (nights + 0.06);
  const subtotal = pricePerNight * nights;
  const serviceFee = pricePerNight * 0.06;

  const isDeposit = booking.payment_type === "deposit";
  const firstPaymentAmount = isDeposit ? (subtotal * 0.5) + serviceFee : booking.amount;
  const secondPaymentAmount = subtotal * 0.5;

  const handleAccepted = async (id: string) => {
    try {
      const paymentTypeStr: "deposit" | "balance" = isDeposit ? "deposit" : "balance";

      const bookingPayment = await BookingsServices.createBookingPayments(id, {
        payment_type: paymentTypeStr,
        currency: booking.currency_price,
        amount: firstPaymentAmount,
        status: `link_${paymentTypeStr}_sent`,
      });

      const paymentLink = await createPaymentLinkRebill({
        reservaId: id,
        paymentId: bookingPayment.id,
        paymentType: paymentTypeStr,
        ownerId: user?.id ?? "",
        prices: {
          amount: firstPaymentAmount,
          currency: booking.currency_price,
        },
      });

      await BookingsServices.updateBookingPayment(bookingPayment.id, {
        rebill_payment_link_id: paymentLink.id,
        rebill_payment_link_url: paymentLink.url,
      });

      await Promise.all([
        BookingsServices.bookingAction(id, "accepted"),
        fetch("/api/test-email/confirmed-booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            owner: { name: user?.name },
            property: {
              title: booking.quinta_title,
              check_in: booking.check_in,
              check_out: booking.check_out,
              total: booking.amount,
              currency: booking.currency_price,
            },
            linkPago: paymentLink.url,
          }),
        }),
      ]);

      toast.success("Reserva confirmada exitosamente");
      setTimeout(() => router.refresh(), 1500);
    } catch (error) {
      console.error("Error confirmando:", error);
      toast.error("Error al confirmar la reserva");
    }
  };

  const handleRejected = async (id: string) => {
    try {
      await BookingsServices.bookingAction(id, "rejected");
      toast.success("Reserva cancelada exitosamente");
      setTimeout(() => router.refresh(), 1500);
    } catch (error) {
      toast.error("Error al cancelar la reserva");
    }
  };

  const handleFinish = async (id: string) => {
    try {
      const balancePayment = await BookingsServices.createBookingPayments(id, {
        payment_type: "balance",
        currency: booking.currency_price,
        amount: secondPaymentAmount,
        status: "link_balance_sent",
      });

      const paymentLink = await createPaymentLinkRebill({
        reservaId: id,
        paymentId: balancePayment.id,
        paymentType: "balance",
        ownerId: user?.id ?? "",
        prices: {
          amount: secondPaymentAmount,
          currency: booking.currency_price,
        },
      });

      await BookingsServices.updateBookingPayment(balancePayment.id, {
        rebill_payment_link_id: paymentLink.id,
        rebill_payment_link_url: paymentLink.url,
      });

      await fetch("/api/test-email/balance-pay-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner: { name: user?.name },
          property: {
            title: booking.quinta_title,
            check_in: booking.check_in,
            check_out: booking.check_out,
            total: booking.amount,
            currency: booking.currency_price,
          },
          linkPago: paymentLink.url,
        }),
      });

      toast.success("Link de saldo enviado al huésped");
      setTimeout(() => router.refresh(), 1500);
    } catch (error) {
      toast.error("Error al enviar link de saldo");
    }
  };

  const isOneWeekBefore = (dateStr: string): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const parts = dateStr.split("-");
    const checkInDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    checkInDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  const datePayLabel = (dateStr: string): string => {
    const parts = dateStr.split("-");
    const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    d.setDate(d.getDate() - 7);
    return d.toLocaleDateString("es-AR");
  };

  return (
    <div className="bg-white flex flex-col min-w-sm h-min max-w-sm shadow-md shadow-black/50 p-4 rounded-xl border border-gray-100">
      <div className="flex gap-3 mb-4">
        <img
          src={booking.quinta_main_image}
          alt="Quinta"
          className="size-20 object-cover rounded-lg"
        />
        <div>
          <p className="font-semibold text-sm leading-tight mb-1">{booking.quinta_title}</p>
          <p className="text-xs text-gray-500">{booking.quinta_address}</p>
        </div>
      </div>

      <Separator color="bg-gray-200" />

      <div className="text-sm py-3">
        <p className="font-semibold text-gray-800 mb-1 text-xs uppercase tracking-wider">Fechas</p>
        <p className="text-gray-600">{booking.check_in} | {booking.check_out}</p>
      </div>

      <Separator color="bg-gray-200" />

      <div className="text-sm py-3">
        <p className="font-semibold text-gray-800 mb-1 text-xs uppercase tracking-wider">Huéspedes</p>
        <p className="text-gray-600">{booking.guest_count} {booking.guest_count === 1 ? "Huésped" : "Huéspedes"}</p>
      </div>

      <Separator color="bg-gray-200" />

      <div className="text-sm py-3">
        <p className="font-semibold text-gray-800 mb-1 text-xs uppercase tracking-wider">Método de pago</p>
        <p className="text-gray-600 capitalize">{booking.payment_type === "deposit" ? "Pago parcial (%50)" : "Saldo completo"}</p>
      </div>

      <Separator color="bg-gray-200" />

      <div className="flex justify-between items-center py-3">
        <span className="text-sm font-bold text-gray-800 uppercase tracking-wider">Total</span>
        <p className="font-bold text-lg text-primaryDark">
          $ {booking.amount.toLocaleString("es-AR")} {booking.currency_price}
        </p>
      </div>

      {booking.status !== "finished" ? (
        <div className="text-sm pb-4">
          <p className="font-semibold text-gray-800 mb-2 text-xs uppercase tracking-wider text-center">Mensaje del huésped</p>
          <div className="bg-gray-50 rounded-lg p-3 text-gray-600 text-xs italic border border-gray-100">
            "{booking.message || "Sin mensaje..."}"
          </div>
        </div>
      ) : (
        <p className="text-xs text-gray-500 mb-4 bg-blue-50 p-2 rounded text-center font-medium">
          Contacto: {booking.guest_email}
        </p>
      )}

      {booking.status === "pending" && (
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <button
            onClick={() => handleRejected(booking.id ?? "")}
            className="border-2 border-red-100 text-red-600 font-bold py-2 rounded-lg hover:bg-red-50 transition cursor-pointer"
          >
            Rechazar
          </button>
          <button
            onClick={() => handleAccepted(booking.id ?? "")}
            className="bg-primaryDark text-white font-bold py-2 rounded-lg hover:bg-green-700 transition shadow-sm cursor-pointer"
          >
            Aceptar
          </button>
        </div>
      )}

      {booking.status === "accepted" && (
        <div className="bg-orange-50 text-orange-600 p-2 rounded-lg text-center font-bold text-sm animate-pulse">
          Esperando pago del huésped...
        </div>
      )}

      {booking.status === "paid" && (
        <div className="flex flex-col gap-2">
          {booking.payment_type === "balance" ? (
            <div className="bg-green-50 text-primaryDark p-2 rounded-lg text-center font-bold text-sm">
              ✓ Pagada totalmente
            </div>
          ) : !isOneWeekBefore(booking.check_in) ? (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <p className="text-blue-700 font-bold text-sm text-center">✓ Seña pagada (50%)</p>
              <p className="text-[10px] text-blue-500 text-center mt-1 uppercase font-bold">
                Saldo restante: {datePayLabel(booking.check_in)}
              </p>
            </div>
          ) : (
            <button
              onClick={() => handleFinish(booking.id ?? "")}
              className="w-full bg-primaryDark text-white font-bold py-3 rounded-lg hover:bg-green-700 transition shadow-md cursor-pointer"
            >
              Enviar link de Pago
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReservationsPage() {
  const { user } = useUser();
  const [reservationsPending, setReservationsPending] = useState<Booking[]>([]);
  const [reservationsDone, setReservationsDone] = useState<Booking[]>([]);
  const [reservationsAccepted, setReservationsAccepted] = useState<Booking[]>([]);
  const [reservationsPaid, setReservationsPaid] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const getOwnerReservations = async () => {
      setLoading(true);
      try {
        const reservations = await BookingsServices.getOwnerBookings(user.id);
        const pending: Booking[] = [];
        const done: Booking[] = [];
        const accepted: Booking[] = [];
        const paid: Booking[] = [];

        reservations.forEach((res: Booking) => {
          if (res.status === "pending") pending.push(res);
          else if (res.status === "finished") done.push(res);
          else if (res.status === "accepted") accepted.push(res);
          else if (res.status === "paid") paid.push(res);
        });

        setReservationsPending(pending);
        setReservationsDone(done);
        setReservationsAccepted(accepted);
        setReservationsPaid(paid);
      } catch (error) {
        console.error("Error loading bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    getOwnerReservations();
  }, [user]);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full border-4 border-primaryDark border-t-transparent">
          <img src="logo.png" width={80} height={80} alt="" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto px-4 md:px-10 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex-1 space-y-12 w-full">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-primaryDark rounded-full" />
              Reservas pendientes
            </h2>
            <div className="flex flex-wrap gap-6">
              {reservationsPending.length > 0 ? (
                reservationsPending.map((res) => <ReservationCard key={res.id} booking={res} />)
              ) : (
                <p className="text-gray-400 italic">No tienes reservas pendientes en este momento.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-orange-400 rounded-full" />
              En proceso de pago
            </h2>
            <div className="flex flex-wrap gap-6">
              {[...reservationsAccepted, ...reservationsPaid].length > 0 ? (
                [...reservationsAccepted, ...reservationsPaid].map((res) => (
                  <ReservationCard key={res.id} booking={res} />
                ))
              ) : (
                <p className="text-gray-400 italic">No hay reservas activas esperando pago.</p>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-gray-400 rounded-full" />
              Reservas finalizadas
            </h2>
            <div className="flex flex-wrap gap-6">
              {reservationsDone.length > 0 ? (
                reservationsDone.map((res) => <ReservationCard key={res.id} booking={res} />)
              ) : (
                <p className="text-gray-400 italic">Tu historial de reservas finalizadas aparecerá aquí.</p>
              )}
            </div>
          </section>

        </div>

        <div className="w-full md:w-64 shrink-0">
          <Link
            href="/my-account"
            className="block bg-white border-2 border-primaryDark text-primaryDark hover:bg-primaryDark hover:text-white transition-all rounded-2xl p-8 text-center shadow-lg shadow-green-100 group"
          >
            <p className="text-xs uppercase tracking-widest font-black mb-2 opacity-60">Configuración</p>
            <p className="font-bold text-2xl group-hover:scale-110 transition-transform">Mis datos</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
