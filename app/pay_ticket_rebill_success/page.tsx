'use client';
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AuthServices } from "../services/AuthServices";
import { Users } from "@/types";

function SuccessContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const [owner, setOwner] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOwner = async () => {
      const owner = await AuthServices.getUserById(id);
      setOwner(owner);
      setLoading(false);
    };
    loadOwner();
  }, [id]);

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
    <main className="max-w-7xl flex flex-col mx-auto gap-10 px-4 md:px-8 py-8">
      <div className="flex flex-col gap-3 flex-1">
        <h1 className="text-3xl mb-10 font-extrabold text-center">
          ¡Tu pago se realizo con exito!
        </h1>
        <p className="text-gray-700 text-center font-medium md:mx-2">
          Finalizaste el ultimo paso para reservar tu estadia en la Quinta que elegiste.
        </p>
        <p className="text-gray-700 text-center font-medium md:mx-2">
          Llegando al final de la reserva, te enviaremos un correo con las instrucciones para finalizar el pago con el saldo restante.
        </p>
      </div>
      <div className="flex flex-col gap-3 flex-1">
        <h2 className="text-3xl font-extrabold text-center">Contacto</h2>
        <p className="text-gray-700 text-center font-medium md:mx-2">
          Ya podes contactarte con el anfitrión para obtener más información sobre tu estadia en la Quinta.
        </p>
        <ul className="flex flex-col justify-center items-center gap-2">
          <li>Nombre: {owner?.name}</li>
          <li>Email: {owner?.email}</li>
          <li>Teléfono: {owner?.phone}</li>
          <li>Dirección: {owner?.address}</li>
        </ul>
      </div>
      <p className="text-gray-700 text-center font-medium md:mx-2">
        Gracias por usar ZonaQuintas. ¡Disfruta de tu estancia!
      </p>
      <Link
        href="/"
        className="text-primaryDark mx-auto text-xl font-semibold hover:underline"
      >
        Volver al Inicio
      </Link>
    </main>
  );
}

const Spinner = () => (
  <main className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full border-4 border-primaryDark border-t-transparent">
      <img src="logo.png" width={80} height={80} alt="" />
    </div>
  </main>
);

export default function SuccessRebillPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <SuccessContent />
    </Suspense>
  );
}
