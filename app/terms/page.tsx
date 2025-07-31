export default function TermsPage() {
  return (
    <main className="mx-10 px-4 py-8 text-gray-800">
      <h1 className="text-xl font-bold mb-6">1. Aceptación de los Términos</h1>
      <p className="mb-6">
        Al utilizar nuestros servicios de alquiler temporal, usted acepta automáticamente estos Términos y Condiciones en su totalidad. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios.
      </p>

      <h2 className="text-xl font-semibold mb-4">2. Reservas y Pagos</h2>
      <ul className="list-disc pl-6 mb-6 space-y-1">
        <li>Todas las reservas requieren pago completo al momento de la reservación</li>
        <li>No se aceptan pagos en efectivo bajo ninguna circunstancia</li>
        <li>No se permiten cancelaciones ni reembolsos una vez confirmada la reserva</li>
        <li>El titular de la reserva debe tener al menos 18 años</li>
      </ul>

      <h2 className="text-xl font-semibold mb-4">3. Documentación Requerida</h2>
      <p className="mb-2">Para completar su reserva debe proporcionar:</p>
      <ul className="list-disc pl-6 mb-6 space-y-1">
        <li>Fotografía del DNI (frente y dorso) de todos los huéspedes</li>
        <li>Selfie actual del titular de la reserva</li>
        <li>Información de contacto válida</li>
      </ul>

      <h2 className="text-xl font-semibold mb-4">4. Normas de la Propiedad</h2>
      <ul className="list-disc pl-6 mb-6 space-y-1">
        <li>Check-in: A partir de las 15:00 hs | Check-out: Hasta las 10:00 hs</li>
        <li>Prohibido fumar en todas las áreas de la propiedad</li>
        <li>No se permiten mascotas a menos que se especifique lo contrario</li>
        <li>Prohibido realizar fiestas o eventos sin autorización</li>
        <li>No se permite el ingreso de personas no registradas</li>
        <li>El huésped es responsable por daños a la propiedad</li>
      </ul>

      <h2 className="text-xl font-semibold mb-4">5. Seguridad y Vigilancia</h2>
      <p className="mb-6">
        Todas nuestras propiedades cuentan con cámaras de seguridad en áreas exteriores (accesos, pasillos). No hay cámaras en espacios privados interiores. El sistema de seguridad no debe ser manipulado.
      </p>

      <h2 className="text-xl font-semibold mb-4">6. Responsabilidades</h2>
      <p className="mb-2">Zona Quintas actúa como intermediario entre propietarios y huéspedes. No somos responsables por:</p>
      <ul className="list-disc pl-6 mb-6 space-y-1">
        <li>Daños o pérdidas de objetos personales</li>
        <li>Problemas derivados del incumplimiento de las normas por parte del huésped</li>
        <li>Eventos fuera de nuestro control (cortes de servicio, condiciones climáticas, etc.)</li>
      </ul>

      <h2 className="text-xl font-semibold mb-4">7. Modificaciones</h2>
      <p>
        Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en nuestro sitio web.
      </p>
    </main>
  )
}
