"use client";
import { Separator } from "@/app/components/ui/Separator";
import { useUser } from "@/app/context/UserContext";
import { BookingsServices } from "@/app/services/BookingsServices";
import { Booking } from "@/types";
import { createPaymentLinkRebill, getPaymentLinkRebill } from "@/lib/rebill";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function ReservationCard({ booking }: { booking: Booking }) {
  const { user } = useUser();
  const router = useRouter();
  const handleAccepted = async (id: string) => {
    try {
      const bookingPaymentDeposit =
        await BookingsServices.createBookingPayments(id ?? "", {
          payment_type: "deposit",
          currency: booking.currency_price,
          amount: booking.amount * 0.3,
          status: "link_sent",
        }).catch((err) => {
          // Capturamos el error específico de este paso
          console.error("createBookingPayments falló:", err);
          throw err;
        });
      console.log("bookingPaymentDeposit completo:", bookingPaymentDeposit); // 👈 ver qué trae
      const paymentLink = await createPaymentLinkRebill({
        reservaId: id ?? "",
        paymentId: bookingPaymentDeposit.id, // 👈 cambiar .payment_id por .id
        paymentType: "deposit",
        ownerId: user?.id ?? "",
        prices: {
          amount: booking.amount * 0.3,
          currency: booking.currency_price,
        },
      });

      await BookingsServices.updateBookingPayment(bookingPaymentDeposit.id, {
        // 👈 también acá
        rebill_payment_link_id: paymentLink.id,
        rebill_payment_link_url: paymentLink.url,
      });
      // Verificá que lleguen bien los datos
      console.log("paymentLink response:", paymentLink);
      console.log("id:", paymentLink.id);
      console.log("url:", paymentLink.url);

      await Promise.all([
        BookingsServices.bookingAction(id ?? "", "accepted"),
        fetch("/api/test-email/confirmed-booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            owner: {
              name: user?.name,
            },
            property: {
              title: booking.quinta_title,
              check_in: booking.check_in,
              check_out: booking.check_out,
              total: booking.amount,
              currency: booking.currency_price,
            },
            linkPago: paymentLink.url,
          }),
        }).catch((err) => {
          console.error("❌ mail:", err);
          throw err;
        }),
      ]);

      toast.success("Reserva confirmada exitosamente");
      setTimeout(() => router.refresh(), 1500);
    } catch (error) {
      console.error("Error completo:", error);
      toast.error("Error al confirmar la reserva");
    }
  };

  const handleRejected = async (id: string) => {
    try {
      await BookingsServices.bookingAction(id ?? "", "rejected");
      toast.success("Reserva cancelada exitosamente");
      setTimeout(() => {
        router.refresh();
      }, 1500);
    } catch (error) {
      toast.error("Error al cancelar la reserva");
    }
  };

  const handleFinish = async (id: string) => {
    // 1. Crear booking_payment de balance
    const balancePayment = await BookingsServices.createBookingPayments(id, {
      payment_type: "balance",
      currency: booking.currency_price,
      amount: booking.amount * 0.7,
      status: "link_balance_sent",
    });

    // 2. Generar link de Rebill
    const paymentLink = await createPaymentLinkRebill({
      reservaId: id,
      paymentId: balancePayment.id,
      paymentType: "balance",
      ownerId: user?.id ?? "",
      prices: {
        amount: booking.amount * 0.7,
        currency: booking.currency_price,
      },
    });

    // 3. Actualizar payment con datos de Rebill
    await BookingsServices.updateBookingPayment(balancePayment.id, {
      rebill_payment_link_id: paymentLink.id,
      rebill_payment_link_url: paymentLink.url,
    });

    // 4. Mail al huésped con link de saldo
    await fetch("/api/test-email/balance-pay-booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        owner: {
          name: user?.name,
        },
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
  };

  const isOneDayBefore = (dateToCheck: string | Date): boolean => {
    /**
     * Verifica si la fecha dada es exactamente un día después de hoy.
     * @param dateToCheck string | Date - fecha a verificar.
     * @returns boolean - true si falta un día para esa fecha desde hoy.
     */
    const today = new Date();

    // Reiniciar la hora para hacer comparación solo de fechas
    today.setHours(0, 0, 0, 0);

    let targetDate: Date;
    if (typeof dateToCheck === "string") {
      const parts = dateToCheck.split("-");
      targetDate = new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2]),
      );
    } else {
      targetDate = new Date(dateToCheck);
    }
    targetDate.setHours(0, 0, 0, 0);

    // Calcular la diferencia en milisegundos
    const diffMs = targetDate.getTime() - today.getTime();

    // Un día en milisegundos
    const oneDayMs = 24 * 60 * 60 * 1000;

    return diffMs === oneDayMs; // true si falta exactamente un día
  };

  // UN DIA ANTES DEL CHECK OUT MOSTRAR FECHA DE PAGO RESTANTE
  const datePayCheckOut = (date: string) => {
    const parts = date.split("-"); // "2026-05-08" => ["2026", "05", "08"]
    // mes en JS va de 0 a 11, por eso restamos 1 al mes
    const d = new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2]),
    );
    d.setDate(d.getDate() - 1);
    return d.toLocaleDateString("es-AR");
  };

  return (
    <div className="bg-white flex flex-col min-w-sm h-min max-w-sm shadow-md shadow-black/50 p-2 rounded-xl">
      <div className="flex gap-3 mb-5">
        <img
          src={booking.quinta_main_image}
          alt="foto de la quinta"
          className="size-20 object-cover rounded-xl"
        />
        <div>
          <p className="font-semibold text-sm">{booking.quinta_title}</p>
          <p>{booking.quinta_address}</p>
        </div>
      </div>
      <Separator color="bg-gray-400" />
      <div className="text-sm flex flex-col gap-2 my-3">
        <p className="font-semibold">
          Fecha de ingreso y salida del alojamiento
        </p>
        <p>
          {booking.check_in} | {booking.check_out}
        </p>
      </div>
      <Separator color="bg-gray-400" />
      <div className="text-sm flex flex-col gap-2 my-3">
        <p className="font-semibold">Cantidad de Huéspedes</p>
        <p>
          {booking.guest_count}{" "}
          {booking.guest_count === 1 ? "Huésped" : "Huéspedes"}
        </p>
      </div>
      <Separator color="bg-gray-400" />
      <div className="text-sm font-semibold flex justify-between gap-2  my-3">
        <span>Total</span>
        <p className="font-semibold">
          $ {booking.amount.toFixed(2).toLocaleString()}{" "}
          {booking.currency_price}
        </p>
      </div>
      {booking.status !== "finished" ? (
        <div className="text-sm font-semibold flex flex-col items-center justify-between gap-2 my-2">
          <Separator color="bg-gray-400" />
          <span>Mensaje</span>
          <p className="font-semibold border w-full text-center text-wrap border-gray-400 rounded-md p-2 text-sm">
            {booking.message || "No envio ningun mensaje..."}
          </p>
        </div>
      ): (
        <p className="text-sm">contacto de huesped: {booking.guest_email}</p>
      )}
      {booking.status === "pending" && (
        <div className="flex justify-between mt-2 flex-1 items-center">
          <button
            onClick={() => handleRejected(booking.id ?? "")}
            className="bg-red-700 cursor-pointer text-white py-2 px-4 rounded-md hover:bg-red-600"
          >
            Cancelar
          </button>
          <button
            onClick={() => handleAccepted(booking.id ?? "")}
            className="bg-green-700 cursor-pointer text-white py-2 px-4 rounded-md hover:bg-green-600"
          >
            Aceptar
          </button>
        </div>
      )}
      {booking.status === "accepted" && (
        <div className="flex justify-center mt-2 flex-1 items-center">
          <p className="font-semibold text-orange-400">Esperando pago...</p>
        </div>
      )}
      {booking.status === "paid" && (
        <div className="flex justify-center mt-2 flex-col gap-2 items-center">
          {!isOneDayBefore(booking.check_out) ? (
            <>
              <p className="font-semibold text-primaryDark">Reserva pagada</p>
              <p className="font-medium text-sm">
                Fecha de pago del saldo restante:{" "}
                {datePayCheckOut(booking.check_out)}
              </p>
            </>
          ) : (
            <button
              onClick={() => handleFinish(booking.id ?? "")}
              className="bg-green-700 cursor-pointer text-white py-2 px-4 rounded-md hover:bg-green-600"
            >
              Enviar link de pago
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ReserservationsPage() {
  const { user } = useUser();
  const [reservationsPending, setReservationsPending] = useState<Booking[]>([]);
  const [reservationsDone, setReservationsDone] = useState<Booking[]>([]);
  const [reservationsAccepted, setReservationsAccepted] = useState<Booking[]>(
    [],
  );
  const [reservationsPaid, setReservationsPaid] = useState<Booking[]>([]);
  const [reservationsFinished, setReservationsFinished] = useState<Booking[]>(
    [],
  );
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
        const finished: Booking[] = [];

        reservations.forEach((reservation: Booking) => {
          if (reservation.status === "pending") pending.push(reservation);
          else if (reservation.status === "finished") done.push(reservation);
          else if (reservation.status === "accepted")
            accepted.push(reservation);
          else if (reservation.status === "paid") paid.push(reservation);
        });

        setReservationsPending(pending);
        setReservationsDone(done);
        setReservationsAccepted(accepted);
        setReservationsPaid(paid);
        setReservationsFinished(finished);
      } catch (error) {
        console.error("Error loading bookings:", error);
        // opcional: manejar un estado de error
      } finally {
        setLoading(false);
      }
    };

    getOwnerReservations();
  }, [user]);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primaryDark border-t-transparent" />
      </main>
    );
  }

  return (
    <main className="mx-10 flex flex-col">
      <section className="flex my-5 justify-between gap-10">
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl font-semibold">Reservas pendientes</h2>
          <div className="flex flex-wrap gap-10">
            {reservationsPending &&
              reservationsPending.map((reservation) => (
                <ReservationCard key={reservation.id} booking={reservation} />
              ))}
            {reservationsPending.length === 0 && (
              <p>No tenes reservas pendientes...</p>
            )}
          </div>
          <h2 className="text-2xl my-5 font-semibold">Reservas finalizadas</h2>
          <div className="flex flex-wrap gap-10">
            {reservationsDone &&
              reservationsDone.map((reservation) => (
                <ReservationCard key={reservation.id} booking={reservation} />
              ))}
            {reservationsDone.length === 0 && (
              <p>No tenes reservas finalizadas...</p>
            )}
          </div>
          <h2 className="text-2xl my-5 font-semibold">Reservas aceptadas</h2>
          <div className="flex flex-wrap gap-10">
            {reservationsAccepted &&
              reservationsAccepted.map((reservation) => (
                <ReservationCard key={reservation.id} booking={reservation} />
              ))}
            {reservationsPaid &&
              reservationsPaid.map((reservation) => (
                <ReservationCard key={reservation.id} booking={reservation} />
              ))}
            {reservationsPaid.length === 0 && (
              <p>No tenes reservas pagadas...</p>
            )}
          </div>
          <h2 className="text-2xl my-5 font-semibold">Reservas pagadas</h2>
          <div className="flex flex-wrap gap-10"></div>
        </div>
        <Link
          href="/my-account"
          className="bg-primaryDark text-white rounded-full cursor-pointer h-40 w-50 text-center pt-16 font-bold text-2xl"
        >
          Mis datos
        </Link>
      </section>
    </main>
  );
}
