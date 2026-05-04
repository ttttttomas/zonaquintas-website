'use client'
import { useState } from "react";

export default function TermsPage() {
  const [category, setCategory] = useState<'propietarios' | 'huespedes'>('propietarios');

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-4xl font-bold mb-4 text-center">Términos y Condiciones</h1>
      <p className="text-center text-gray-500 mb-12 italic">
        Última actualización: Mayo 2026
      </p>

      {/* Selector de Categoría (Tabs) */}
      <div className="flex justify-center mb-16">
        <div className="inline-flex border-2 border-black rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() => setCategory('propietarios')}
            className={`px-10 py-4 cursor-pointer font-bold transition-all ${category === 'propietarios'
                ? 'bg-primaryDark text-white'
                : 'bg-white text-black hover:bg-gray-50'
              }`}
          >
            PROPIETARIOS
          </button>
          <div className="w-[2px] bg-black" />
          <button
            onClick={() => setCategory('huespedes')}
            className={`px-10 py-4 cursor-pointer font-bold transition-all ${category === 'huespedes'
                ? 'bg-primaryDark text-white'
                : 'bg-white text-black hover:bg-gray-50'
              }`}
          >
            HUÉSPEDES
          </button>
        </div>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50">
        {category === 'propietarios' ? (
          <div className="space-y-10 animate-in fade-in duration-500">
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                Objeto
              </h2>
              <p className="leading-relaxed text-gray-600">
                ZonaQuintas actúa como una plataforma digital de intermediación que permite a propietarios publicar sus propiedades para alquiler temporal, conectándolos con potenciales huéspedes.
                <br /><br />
                ZonaQuintas no es propietario, administrador ni responsable directo de las propiedades publicadas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                Registro del propietario
              </h2>
              <p className="mb-4 text-gray-600 font-medium">Para publicar una propiedad, el propietario deberá:</p>
              <ul className="list-disc pl-8 space-y-2 text-gray-600">
                <li>Registrarse en la plataforma con datos reales y actualizados.</li>
                <li>Aceptar los presentes términos y condiciones.</li>
                <li>Ser mayor de edad.</li>
                <li>El propietario es responsable de la veracidad de la información proporcionada.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                Publicación de la propiedad
              </h2>
              <p className="mb-4 text-gray-600 font-medium">El propietario podrá publicar su quinta incluyendo:</p>
              <ul className="list-disc pl-8 space-y-2 text-gray-600">
                <li>Fotos reales.</li>
                <li>Descripción precisa.</li>
                <li>Precio y condiciones.</li>
              </ul>
              <p className="mt-4 text-gray-600 leading-relaxed">
                ZonaQuintas se reserva el derecho de modificar, rechazar o eliminar publicaciones que no cumplan con los estándares de la plataforma. Con la publicación de la propiedad, el propietario acepta y se compromete con las Políticas de Cancelación y Reembolso.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                Membresía
              </h2>
              <ul className="list-disc pl-8 space-y-2 text-gray-600">
                <li>Para publicar propiedades, el propietario podrá contratar una membresía (mensual o anual).</li>
                <li>La membresía permite publicar en la plataforma con una visibilidad preferencial.</li>
                <li>Mientras la membresía esté activa, no se aplicarán comisiones por reservas.</li>
                <li>La membresía no es reembolsable.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
                Reservas
              </h2>
              <p className="mb-4 text-gray-600">Las reservas se gestionan a través de la plataforma. El propietario se compromete a:</p>
              <ul className="list-disc pl-8 space-y-2 text-gray-600">
                <li>Respetar las reservas confirmadas.</li>
                <li>No cancelar sin causa justificada.</li>
                <li>Brindar la propiedad en las condiciones publicadas.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">6</span>
                Pagos
              </h2>
              <p className="mb-4 text-gray-600">ZonaQuintas gestionará el cobro al huésped. Se le enviará el pago correspondiente al propietario:</p>
              <ul className="list-disc pl-8 space-y-2 text-gray-600">
                <li>El primer día hábil posterior a la finalización de la estadía (check-out).</li>
              </ul>
              <p className="mt-4 text-gray-600 font-medium italic">ZonaQuintas podrá retener o ajustar pagos en caso de:</p>
              <ul className="list-disc pl-8 space-y-1 text-gray-600">
                <li>Reclamos del huésped.</li>
                <li>Incumplimientos.</li>
                <li>Daños o conflictos.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">7</span>
                Responsabilidad del propietario
              </h2>
              <ul className="list-disc pl-8 space-y-2 text-gray-600">
                <li>El propietario es responsable de: El estado y condiciones de la propiedad, la veracidad del anuncio y cumplir con normativas locales aplicables.</li>
                <li>ZonaQuintas no se responsabiliza por daños, accidentes o conflictos ocurridos durante la estadía de el/los huésped.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">8</span>
                Cancelaciones
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Las cancelaciones y reembolsos se regirán por las Políticas de Cancelación y Reembolso vigentes en la plataforma, las cuales forman parte integrante de los presentes Términos y Condiciones. El propietario acepta que dichas políticas podrán implicar penalidades o ajustes en los pagos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">9</span>
                Baja de la publicación
              </h2>
              <p className="mb-4 text-gray-600">El propietario podrá eliminar su propiedad en cualquier momento. Sin embargo:</p>
              <ul className="list-disc pl-8 space-y-2 text-gray-600">
                <li>Deberá respetar reservas ya confirmadas.</li>
                <li>La membresía vigente no será reembolsada.</li>
              </ul>
            </section>

            <section className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h2 className="text-2xl font-bold mb-4">Rol de ZonaQuintas</h2>
              <p className="mb-4 text-gray-600">ZonaQuintas actúa únicamente como intermediario entre propietario y huésped. No será responsable por:</p>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-500">
                <div className="flex gap-2">• La ocupación de la propiedad</div>
                <div className="flex gap-2">• La presencia de conflictos</div>
                <div className="flex gap-2">• Resultados económicos</div>
                <div className="flex gap-2">• Cancelaciones del huésped</div>
                <div className="flex gap-2">• Problemas con procesadores de Pagos</div>
                <div className="flex gap-2">• Daños, pérdidas o accidentes</div>
              </div>
            </section>

            <section className="pt-10 border-t border-gray-100 text-center">
              <p className="text-lg font-bold">Aceptación</p>
              <p className="text-gray-500 text-sm">El uso de la plataforma implica la aceptación total de estos términos y condiciones.</p>
            </section>
          </div>
        ) : (
          <div className="space-y-10 animate-in fade-in duration-500">
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                Objeto
              </h2>
              <p className="leading-relaxed text-gray-600">
                ZonaQuintas es una plataforma digital que permite a los usuarios encontrar y reservar propiedades para alquiler temporal.
                <br /><br />
                ZonaQuintas actúa únicamente como intermediario entre el huésped y el propietario, no siendo titular, administrador ni responsable directo de las propiedades publicadas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                Registro y uso
              </h2>
              <ul className="list-disc pl-8 space-y-2 text-gray-600">
                <li>Para realizar una reserva, el usuario deberá registrarse proporcionando datos reales y actualizados.</li>
                <li>El usuario declara ser mayor de edad y tener capacidad legal para contratar.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                Reservas
              </h2>
              <ul className="list-disc pl-8 space-y-2 text-gray-600">
                <li>Las reservas se realizan a través de la plataforma seleccionando la propiedad, fechas y cantidad de personas.</li>
                <li>Una reserva se considerará confirmada una vez acreditado el pago correspondiente.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                Pagos
              </h2>
              <ul className="list-disc pl-8 space-y-2 text-gray-600">
                <li>Todos los pagos se realizan a través de los medios habilitados en la plataforma.</li>
                <li>ZonaQuintas actúa como intermediario en el cobro, recibiendo el pago del huésped para luego transferirlo al propietario.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
                Cancelaciones y reembolsos
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Las cancelaciones y reembolsos se regirán por las Políticas de Cancelación y Reembolso vigentes en la plataforma, las cuales forman parte integrante de los presentes términos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">6</span>
                Responsabilidad del huésped
              </h2>
              <p className="mb-4 text-gray-600">El huésped se compromete a:</p>
              <ul className="list-disc pl-8 space-y-2 text-gray-600">
                <li>Utilizar la propiedad de forma responsable.</li>
                <li>Respetar las normas establecidas por el propietario.</li>
                <li>No exceder la cantidad de personas permitidas.</li>
                <li>Responder por daños ocasionados durante la estadía.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">7</span>
                Estado de la propiedad
              </h2>
              <p className="text-gray-600 leading-relaxed">
                El huésped reconoce que las características de la propiedad son informadas por el propietario. ZonaQuintas no garantiza la exactitud total de dicha información, aunque realiza esfuerzos para mantener la calidad de las publicaciones.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">8</span>
                Check-in y check-out
              </h2>
              <ul className="list-disc pl-8 space-y-2 text-gray-600">
                <li>Los horarios de ingreso y egreso serán acordados con el propietario o indicados en la publicación.</li>
                <li>El huésped se compromete a respetar dichos horarios.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">9</span>
                Reclamos
              </h2>
              <p className="text-gray-600 leading-relaxed">
                En caso de inconvenientes durante la estadía, el huésped deberá comunicarlo a ZonaQuintas a la mayor brevedad posible. ZonaQuintas podrá intervenir como mediador entre las partes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">10</span>
                Cancelaciones y reembolsos
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Las condiciones de cancelación y reembolso aplicables a cada reserva se regirán por las Políticas de Cancelación y Reembolso vigentes en la plataforma. El huésped declara conocer y aceptar dichas políticas al momento de realizar una reserva.
              </p>
            </section>

            <section className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h2 className="text-2xl font-bold mb-4">Limitación de responsabilidad</h2>
              <p className="mb-4 text-gray-600">ZonaQuintas no será responsable por:</p>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-500">
                <div className="flex gap-2">• Daños, pérdidas o accidentes</div>
                <div className="flex gap-2">• Incumplimientos por parte del propietario</div>
                <div className="flex gap-2">• Problemas derivados del uso de la propiedad</div>
                <div className="flex gap-2">• Interrupciones en servicios públicos/privados</div>
                <div className="flex gap-2">• Cancelaciones del propietario</div>
                <div className="flex gap-2">• Problemas con procesadores de Pagos</div>
              </div>
            </section>

            <section className="pt-10 border-t border-gray-100 text-center">
              <p className="text-lg font-bold">Aceptación</p>
              <p className="text-gray-500 text-sm">El uso de la plataforma y la realización de reservas implican la aceptación total de estos términos y condiciones.</p>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
