"use client";
import { Separator } from "@/app/components/ui/Separator";
import { useUser } from "@/app/context/UserContext";
import { BookingsServices } from "@/app/services/BookingsServices";
import { Booking, Quintas } from "@/types";
import { ProductsServices } from "@/app/services/ProductsServices";
import OwnerAvailabilityCalendar from "@/app/components/OwnerAvailabilityCalendar";
import { argentinaToday } from "@/app/lib/availability";
import { createPaymentLinkRebill } from "@/lib/rebill";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import AccountSectionLayout from "@/app/components/AccountSectionLayout";
import { CalendarDays, CircleCheck, Clock3, Hourglass } from "lucide-react";

function balancePaymentDate(checkOut: string): string {
  const [year, month, day] = checkOut.slice(0, 10).split("-").map(Number);
  return new Date(year, month - 1, day - 1).toLocaleDateString("es-AR");
}

function isBalancePaymentWindowOpen(checkOut: string): boolean {
  if (process.env.NODE_ENV === "development") return true;

  const departureDate = checkOut.slice(0, 10);
  const [year, month, day] = departureDate.split("-").map(Number);
  const paymentStartDate = new Date(Date.UTC(year, month - 1, day - 1))
    .toISOString()
    .slice(0, 10);
  const today = argentinaToday();

  return today >= paymentStartDate && today <= departureDate;
}

function ReservationCard({ booking, onUpdated }: { booking: Booking; onUpdated: () => void }) {
  const { user } = useUser();

  const isDeposit = booking.payment_type === "deposit";
  const firstPaymentAmount = isDeposit ? Math.round(booking.amount * 0.5) : booking.amount;
  const secondPaymentAmount = booking.amount - firstPaymentAmount;

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
            guest: { name: booking.guest_name, email: booking.guest_email },
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
      onUpdated();
    } catch (error) {
      console.error("Error confirmando:", error);
      toast.error("Error al confirmar la reserva");
    }
  };

  const handleRejected = async (id: string) => {
    try {
      await BookingsServices.bookingAction(id, "rejected");
      toast.success("Reserva cancelada exitosamente");
      onUpdated();
    } catch (error) {
      toast.error("Error al cancelar la reserva");
    }
  };

  const handleFinish = async (id: string) => {
    if (!isBalancePaymentWindowOpen(booking.check_out)) {
      toast.error(`El link de saldo estará disponible desde el ${balancePaymentDate(booking.check_out)}`);
      return;
    }

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
          guest: { name: booking.guest_name, email: booking.guest_email },
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
      onUpdated();
    } catch (error) {
      toast.error("Error al enviar link de saldo");
    }
  };

  return (
    <div className="bg-white flex flex-col min-w-0 h-min w-full max-w-sm shadow-sm p-4 rounded-2xl border border-gray-200">
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
            &quot;{booking.message || "Sin mensaje..."}&quot;
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
          ) : !isBalancePaymentWindowOpen(booking.check_out) ? (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <p className="text-blue-700 font-bold text-sm text-center">✓ Seña pagada (50%)</p>
              <p className="text-[10px] text-blue-500 text-center mt-1 uppercase font-bold">
                Saldo restante disponible desde: {balancePaymentDate(booking.check_out)}
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
  const [properties, setProperties] = useState<Quintas[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [revision, setRevision] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const [section, setSection] = useState<"calendar" | "pending" | "process" | "finished">("calendar");

  useEffect(() => {
    if (!user) return;
    const timer = window.setInterval(() => setRevision((value) => value + 1), 30000);
    return () => window.clearInterval(timer);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const getOwnerReservations = async () => {
      try {
        const [reservations, allProperties] = await Promise.all([
          BookingsServices.getOwnerBookings(user.id),
          ProductsServices.getQuintas(),
        ]);
        setProperties((allProperties as Quintas[]).filter((property) => property.owner_id === user.id));
        setAllBookings(reservations);
        setLoadError(false);
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
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };

    getOwnerReservations();
  }, [user, revision]);

  if (loading) return <AccountSectionLayout><div aria-busy="true" aria-label="Cargando tus reservas" className="animate-pulse space-y-5"><div className="h-12 w-64 rounded-xl bg-gray-200"/><div className="h-14 rounded-xl bg-gray-200"/><div className="h-72 rounded-2xl bg-gray-200"/><div className="grid gap-4 md:grid-cols-2"><div className="h-60 rounded-2xl bg-gray-200"/><div className="h-60 rounded-2xl bg-gray-200"/></div></div></AccountSectionLayout>;

  const visibleBookings = section === "pending" ? reservationsPending : section === "process" ? [...reservationsAccepted, ...reservationsPaid] : reservationsDone;
  const sectionTitle = section === "pending" ? "Reservas pendientes" : section === "process" ? "En proceso de pago" : "Reservas finalizadas";
  return <AccountSectionLayout>
    <header className="mb-5"><h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">Mis reservas</h1><p className="mt-1 text-sm text-gray-500">Gestioná tus reservas, pagos y disponibilidad en un solo lugar.</p></header>
    {loadError && <div role="alert" className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">No se pudieron cargar las reservas. Recargá para intentar de nuevo.<button className="font-semibold underline" onClick={() => setRevision(v => v + 1)}>Reintentar</button></div>}
    <nav aria-label="Secciones de reservas" className="mb-5 flex gap-2 overflow-x-auto border-b border-gray-200">{[
      {key:"calendar",label:"Calendario",count:null,icon:CalendarDays},
      {key:"pending",label:"Pendientes",count:reservationsPending.length,icon:Clock3},
      {key:"process",label:"En proceso de pago",count:reservationsAccepted.length+reservationsPaid.length,icon:Hourglass},
      {key:"finished",label:"Finalizadas",count:reservationsDone.length,icon:CircleCheck},
    ].map(({key,label,count,icon:Icon})=><button key={key} type="button" aria-pressed={section===key} onClick={()=>setSection(key as typeof section)} className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-xs font-semibold transition md:text-sm ${section===key?"border-primaryDark text-primaryDark":"border-transparent text-gray-500 hover:text-gray-900"}`}><Icon size={17}/>{label}{count !== null && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px]">{count}</span>}</button>)}</nav>
    {section === "calendar" && !loadError && <section className="mb-5 overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 md:p-5"><h2 className="mb-4 flex items-center gap-2 font-semibold"><CalendarDays size={18} className="text-primaryDark"/>Calendario de disponibilidad</h2><OwnerAvailabilityCalendar properties={properties} bookings={allBookings} /></section>}
    {section !== "calendar" && <section aria-live="polite"><div className="mb-4 flex items-center gap-2"><span className={`size-2.5 rounded-full ${section === "pending" ? "bg-amber-400" : section === "process" ? "bg-orange-400" : "bg-green-500"}`} /><h2 className="text-lg font-semibold">{sectionTitle}</h2></div><div className="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">{visibleBookings.map(res=><ReservationCard key={res.id} booking={res} onUpdated={()=>setRevision(v=>v+1)}/>)}{visibleBookings.length === 0 && <div className="col-span-full rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center"><CircleCheck size={28} className="mx-auto mb-3 text-gray-400"/><p className="font-medium text-gray-700">{section === "pending" ? "No tenés reservas pendientes." : section === "process" ? "No hay reservas esperando el pago del huésped." : "Tu historial de reservas finalizadas aparecerá acá."}</p></div>}</div></section>}
  </AccountSectionLayout>;
}
