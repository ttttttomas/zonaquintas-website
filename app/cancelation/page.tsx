'use client'

export default function CancelationPoliticsPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-4xl font-bold mb-4 text-center">Política de Cancelación</h1>
      <p className="text-center text-gray-500 mb-12 italic">
        Información detallada sobre reembolsos y procesos de cancelación.
      </p>

      <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 space-y-12">

        {/* 1. Periodo de Gracia */}
        <section className="relative overflow-hidden bg-green-50/50 p-8 rounded-3xl border border-green-100">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-green-900">
              <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg shadow-green-200">1</span>
              Periodo de gracia para reembolso completo
            </h2>
            <p className="leading-relaxed text-green-800">
              <strong>Cancelación hasta 24 horas después de realizada la reserva:</strong> Tienes un plazo de 24 horas a partir del momento en que realizaste la reserva para cancelarla y recibir un reembolso completo del monto total pagado.
            </p>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" /></svg>
          </div>
        </section>

        {/* 2. Reembolso Parcial */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
            Cancelación con reembolso parcial
          </h2>
          <div className="border-l-4 border-primaryDark pl-6 py-2">
            <p className="leading-relaxed text-gray-600">
              <strong>Cancelación desde 24 horas después de la reserva y hasta 10 días antes de la llegada:</strong> Si cancelas después de las 24 horas iniciales pero con al menos 10 días de antelación a la fecha de llegada, se te reembolsará el <strong>50% del monto total</strong> de la reserva.
            </p>
          </div>
        </section>

        {/* 3. Sin Reembolso */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
            Cancelación sin reembolso
          </h2>
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
            <p className="leading-relaxed text-red-800">
              <strong>Cancelación 10 días o menos antes de la llegada:</strong> Las cancelaciones realizadas con 10 días o menos de antelación a la fecha de llegada no son elegibles para un reembolso. En este caso, se te cobrará el <strong>100% del monto total</strong> de la reserva.
            </p>
          </div>
        </section>

        {/* 4. No-show */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
            No presentarse (No-show)
          </h2>
          <p className="leading-relaxed text-gray-600">
            Si no te presentas en la fecha y hora acordadas sin haber notificado una cancelación, se considerará un "no-show". En este caso, se te cobrará el <strong>100% del monto total</strong> de la reserva y no tendrás derecho a ningún reembolso.
          </p>
        </section>

        {/* 5. Proceso */}
        <section className="bg-gray-900 text-white p-8 md:p-12 rounded-3xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="bg-white text-black w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
            Proceso de cancelación
          </h2>
          <p className="leading-relaxed text-gray-400 mb-6">
            Para cancelar tu reserva, debes contactarnos por escrito a través del medio acordado (correo electrónico, plataforma de reservas, etc.). La fecha y hora de la cancelación se considerarán a partir del momento en que recibamos tu notificación.
          </p>
        </section>
      </div>
    </main>
  );
}
