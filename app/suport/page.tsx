import React from "react";
import { Separator } from "../components/ui/Separator";

export default function FAQContact() {
  return (
    <div className="max-w-4xl mx-auto p-8 text-center">
      <h2 className="text-2xl font-bold mb-8">Preguntas frecuentes</h2>

      <div className="space-y-6">
        <div>
          <h3 className="font-bold">¿Cómo publico mi quinta?</h3>
          <p>
            Ingresá a tu cuenta, hacé clic en “Publicá tu Quinta” en el pie de página,
            seguí los pasos completá el formulario con los datos e imágenes de tu quinta.
            Una vez revisada, estará disponible para alquilar.
          </p>
        </div>

        <div>
          <h3 className="font-bold">¿Tiene costo publicar una quinta?</h3>
          <p>
            Publicar es totalmente gratuito. Solo cobramos una pequeña comisión por reserva confirmada.
          </p>
        </div>

        <div>
          <h3 className="font-bold">¿Cómo se realiza el pago por el alquiler?</h3>
          <p>
            Los pagos se gestionan de forma segura a través de la plataforma y se transfieren al propietario una vez finalizada la estadía.
          </p>
        </div>

        <div>
          <h3 className="font-bold">¿Puedo modificar los datos de mi publicación?</h3>
          <p>
            Sí. Desde tu panel de anfitrión podés editar la información, fotos, precios y disponibilidad en cualquier momento.
          </p>
        </div>

        <div>
          <h3 className="font-bold">¿Cómo me contacto con los interesados?</h3>
          <p>
            Cada consulta llega a tu panel y a tu correo. Podés responder desde la plataforma.
          </p>
        </div>

        <div>
          <h3 className="font-bold">¿Qué pasa si necesito cancelar una reserva?</h3>
          <p>
            Las cancelaciones se deben realizar desde el panel y están sujetas a nuestra política de cancelación.
            Se recomienda avisar con la mayor anticipación posible.
          </p>
        </div>

        <div>
          <h3 className="font-bold">¿Qué tipo de propiedades se pueden publicar?</h3>
          <p>
            Aceptamos quintas, casas de campo, chacras o propiedades vacacionales ubicadas en entornos naturales y preparadas para alquiler temporal.
          </p>
        </div>
      </div>

      <Separator className="my-10" color="bg-gray-200" />

      <h2 className="text-2xl font-bold mb-4">¿Tenés otra consulta?</h2>
      <p className="mb-6">No hay problema, llena el formulario y te contestaremos a la brevedad.</p>

      <form className="space-y-6 flex flex-col text-left max-w-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Nombre completo" className="shadow-md shadow-black/40 p-2 rounded w-full" />
          <input type="email" placeholder="Email" className="shadow-md shadow-black/40 p-2 rounded w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Telefono" className="shadow-md shadow-black/40 p-2 rounded w-full" />
          <select className="text-gray-500 shadow-md py-2 md:py-0 shadow-black/40" name="" id="">
            <option>Selecciona una opción</option>
            <option>Huéspued</option>
            <option>Propietario</option>
          </select>
        </div>
        <div>
          <textarea placeholder="Detallanos tu consulta acá..." className="shadow-md shadow-black/40 p-2 rounded w-full h-24" />
        </div>
        <button type="submit" className="bg-green-600 mx-auto text-white py-2 px-10 cursor-pointer font-bold rounded-xl hover:bg-green-700">
          Enviar
        </button>
      </form>
    </div>
  );
}

