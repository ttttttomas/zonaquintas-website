'use client';
import Link from "next/link";
import { Suspense } from "react";

function SuccessContent() {
    return (
        <main className="max-w-7xl flex flex-col mx-auto gap-10 px-4 md:px-8 py-8">
            <div className="flex flex-col gap-3 flex-1">
                <h1 className="text-3xl mb-10 font-extrabold text-center">
                    ¡Tu pago se realizo con exito!
                </h1>
                <p className="text-gray-700 text-center font-medium md:mx-2">
                    ¡Gracias por tu compra! Tu suscripción a ZonaQuintas ha sido activada.
                </p>
                <p className="text-gray-700 text-center font-medium md:mx-2">
                    Ahora tienes acceso completo a todos los beneficios de nuestra plataforma.
                </p>
            </div>
            <p className="text-gray-700 text-center font-medium md:mx-2">
                Gracias por confiar en ZonaQuintas. ¡Estamos para ayudarte!
            </p>
            <div className="flex flex-col gap-3 flex-1">
                <h2 className="text-3xl font-extrabold text-center">Centro de Ayuda</h2>
                <p className="text-gray-700 text-center font-medium md:mx-2">
                    Si tienes alguna duda o necesitas ayuda, no dudes en entrar a nuestro centro de ayuda.
                </p>
            </div>
            <Link
                href="/support"
                className="text-primaryDark mx-auto text-xl font-semibold hover:underline"
            >
                Centro de Ayuda
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
