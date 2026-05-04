'use client'
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Separator } from "../components/ui/Separator";

export default function FAQContact() {
  const { handleSubmit, register, reset } = useForm();
  const [category, setCategory] = useState<'propietarios' | 'huespedes'>('propietarios');

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await fetch("/api/test-email/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        alert("Formulario enviado correctamente");
        reset();
      } else {
        alert("Error al enviar el formulario");
      }
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div className="max-w-6xl mx-auto p-8 text-center">
      <h2 className="text-3xl font-bold mb-8">Preguntas frecuentes</h2>

      {/* Selector de Categoría (Tabs) */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex border-black rounded-lg overflow-hidden">
          <button
            onClick={() => setCategory('propietarios')}
            className={`px-8 cursor-pointer py-3 font-bold transition-colors ${category === 'propietarios'
              ? 'bg-primaryDark text-white'
              : 'bg-white text-black hover:bg-gray-100'
              }`}
          >
            PROPIETARIOS
          </button>
          <div className="w-[2px] bg-black" />
          <button
            onClick={() => setCategory('huespedes')}
            className={`px-8 cursor-pointer py-3 font-bold transition-colors ${category === 'huespedes'
              ? 'bg-primaryDark text-white'
              : 'bg-white text-black hover:bg-gray-100'
              }`}
          >
            HUÉSPEDES
          </button>
        </div>
      </div>

      {/* Contenido de FAQs */}
      <div className="space-y-8 text-left max-w-4xl mx-auto mb-20 min-h-[400px]">
        {category === 'propietarios' ? (
          <>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <p className="font-bold text-lg mb-2">¿Cómo publico mi quinta?</p>
              <p className="text-gray-600">
                Ingresá a tu cuenta, hacé clic en “Publicá tu Quinta” en el pie de
                página o el menú desplegable. Completá el formulario con los datos e
                imágenes de tu quinta. Una vez revisada por nuestro equipo, estará disponible para
                alquilar.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <p className="font-bold text-lg mb-2">¿Tiene costo publicar una quinta?</p>
              <p className="text-gray-600">
                Publicar tu Quinta es gratis. Se cobrarán comisiones por cada reserva que se realice para dicha quinta, opcionalmente puedes no pagar estas comisiones suscribiéndote a la Membresía para Anfitriones, pudiendo elegir pagar mensual o anualmente.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <p className="font-bold text-lg mb-2">¿Cómo envía ZonaQuintas el dinero de las reservas?</p>
              <p className="text-gray-600">
                Nos encargamos de intermediar entre huéspedes y propietarios, dando así mayor seguridad a ambas partes. Cuando llegue el momento el pago será transferido a la cuenta indicada. Puedes consultar el estado y la información de tus cobros desde tu panel de ingresos.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <p className="font-bold text-lg mb-2">¿Cuando envía ZonaQuintas el dinero de las reservas?</p>
              <p className="text-gray-600">
                El pago se realiza una vez que el huésped se retira de la propiedad. El dinero se transferirá a la cuenta bancaria que nos indiques a la hora de hacer la petición de retiro.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <p className="font-bold text-lg mb-2">¿Puedo dar de baja mi publicación cuando quiera?</p>
              <p className="text-gray-600">
                Sí, podes pausar o eliminar tu anuncios en cualquier momento desde tu Perfil. Si tenes reservas pendientes, recomendamos tener en cuenta las Políticas de Cancelación.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <p className="font-bold text-lg mb-2">¿Puedo cancelar una reserva?</p>
              <p className="text-gray-600">
                Sí, las reservas se pueden cancelar, siempre sujetas a las Políticas de Cancelación. Se realiza desde el panel de reservas.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <p className="font-bold text-lg mb-2">¿Qué pasa si surge un problema con un huésped?</p>
              <p className="text-gray-600">
                Ante este tipo de situaciones, deberás contactarte con nuestro soporte a través de soporte@zonaquintas.com donde buscaremos una solución en colaboración de ambas partes.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <p className="font-bold text-lg mb-2">¿Cómo reservo una Quinta?</p>
              <p className="text-gray-600">
                Podes explorar las propiedades publicadas, elegir la que más te guste y solicitar la reserva desde la plataforma. La solicitud le llegará al propietario quien la aceptara o no. Podrás seguir el proceso a través de Mis Reservas.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <p className="font-bold text-lg mb-2">¿Cómo se realiza el pago?</p>
              <p className="text-gray-600">
                El pago se hace a través de nuestra plataforma de forma segura, nosotros nos encargamos de ser los intermediarios entre vos y el Propietario.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <p className="font-bold text-lg mb-2">¿Cuáles son los métodos de pago disponibles?</p>
              <p className="text-gray-600">
                Todos los pagos se realizan de manera segura, donde podés usar tarjeta de crédito o débito.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <p className="font-bold text-lg mb-2">¿Puedo cancelar mi reserva?</p>
              <p className="text-gray-600">
                Si, esto estará sujeto a nuestras Políticas de Cancelación. Por lo que en la mayoría de casos habrá penalidades dependiendo el tiempo que haya pasado desde la realización de la reserva.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <p className="font-bold text-lg mb-2">¿Cómo sé que la propiedad es real?</p>
              <p className="text-gray-600">
                ZonaQuintas verifica la información de cada publicación antes de que sea habilitada en la plataforma. Dando así seguridad a nuestros usuarios.
              </p>
            </div>
          </>
        )}
      </div>

      <Separator color="bg-gray-300" />

      <h3 className="text-3xl font-bold mt-16 mb-4" id="form">¿Todavía tenés dudas?</h3>
      <p className="text-gray-600 mb-12">
        No hay problema, llena el formulario y te contestaremos a la brevedad.
      </p>

      <form onSubmit={onSubmit} className="bg-white shadow-xl border border-gray-100 p-8 flex flex-col gap-8 text-left w-full max-w-4xl mx-auto rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="font-bold text-gray-700" htmlFor="name">Nombre completo
            <input
              {...register("name")}
              type="text"
              id="name"
              placeholder="Ej: Juan Pérez"
              className="mt-2 border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-black outline-none transition-all"
            />
          </label>
          <label className="font-bold text-gray-700" htmlFor="email">Email
            <input
              {...register("email")}
              type="email"
              id="email"
              placeholder="juan@ejemplo.com"
              className="mt-2 border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-black outline-none transition-all"
            />
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="font-bold text-gray-700" htmlFor="phone">Teléfono
            <input
              {...register("phone")}
              type="tel"
              id="phone"
              placeholder="Cod. área + número"
              className="mt-2 border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-black outline-none transition-all"
            />
          </label>
          <label className="font-bold text-gray-700" htmlFor="role">¿A qué rol se refiere tu consulta?
            <select
              {...register("role")}
              id="role"
              className="mt-2 border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-black outline-none transition-all bg-white"
            >
              <option value="" disabled selected>Selecciona una opción</option>
              <option value="Huéspued">Huéspued</option>
              <option value="Propietario">Propietario</option>
            </select>
          </label>
        </div>
        <div>
          <label className="font-bold text-gray-700" htmlFor="message">Mensaje
            <textarea
              {...register("message")}
              id="message"
              placeholder="Detallanos tu consulta acá..."
              rows={5}
              className="mt-2 border border-gray-200 p-3 rounded-xl w-full focus:ring-2 focus:ring-black outline-none transition-all"
            />
          </label>
        </div>
        <button
          type="submit"
          className="bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-black/20"
        >
          Enviar consulta
        </button>
      </form>
    </div>
  );
}
