import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="max-w-7xl h-[50vh] flex flex-col mx-auto gap-5 px-4 md:px-8 py-8">
      <div className="flex flex-col gap-3 flex-1">
        <h1 className="text-3xl font-extrabold text-center">
          ¡Reserva exitosa!
        </h1>
        <p className="text-gray-700 text-center font-medium md:mx-2">
          Tu reserva ha sido creada exitosamente. El anfitrión revisará tu
          solicitud y se te avisarará por email una vez que la confirme para
          realizar el pago.
        </p>
        <p className="text-gray-700 text-center font-medium md:mx-2">
          Gracias por usar ZonaQuintas. ¡Esperamos que puedas disfrutar de tu estancia!
        </p>
      </div>
      <Link
        href="/"
        className="text-primaryDark mx-auto text-xl font-semibold hover:underline"
      >
        Volver al Inicio
      </Link>
    </main>
  );
}
