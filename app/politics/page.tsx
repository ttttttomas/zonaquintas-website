export default function PoliticsPage() {
  return (
    <main className="mx-10 px-4 py-8 text-gray-800">
      <h1 className="text-xl font-bold mb-6">1. Introducción</h1>
      <p className="mb-6">
        En Zona Quintas, nos comprometemos a proteger la privacidad de nuestros
        usuarios. Esta política explica cómo recopilamos, usamos y protegemos la
        información personal que obtenemos a través de nuestro sitio web y
        servicios de alquiler temporal.
      </p>

      <h2 className="text-xl font-semibold mb-4">2. Información que Recopilamos</h2>
      <ul className="list-disc pl-6 mb-6 space-y-1">
        <li>Nombre completo, documento de identidad (DNI), fotografía y selfie de verificación.</li>
        <li>Dirección de email, número de teléfono, dirección física.</li>
        <li>Información necesaria para procesar transacciones (sin almacenar datos de tarjetas completas).</li>
        <li>Dirección IP, tipo de dispositivo, páginas visitadas y patrones de navegación.</li>
      </ul>

      <h2 className="text-xl font-semibold mb-4">3. Finalidad del Tratamiento</h2>
      <ul className="list-disc pl-6 mb-6 space-y-1">
        <li>Verificar su identidad y prevenir fraudes</li>
        <li>Procesar reservas y pagos</li>
        <li>Brindar soporte al cliente</li>
        <li>Cumplir con obligaciones legales</li>
        <li>Mejorar nuestros servicios</li>
      </ul>

      <h2 className="text-xl font-semibold mb-4">4. Bases Legales</h2>
      <ul className="list-disc pl-6 mb-6 space-y-1">
        <li>Ejecución del contrato de alquiler</li>
        <li>Cumplimiento de obligaciones legales (Ley 25.326 de Protección de Datos Personales)</li>
        <li>Consentimiento explícito para finalidades específicas</li>
      </ul>

      <h2 className="text-xl font-semibold mb-4">5. Compartir Información</h2>
      <ul className="list-disc pl-6 mb-6 space-y-1">
        <li>Proveedores de pago (Mercado Pago, procesadores de tarjetas)</li>
        <li>Autoridades competentes cuando lo exija la ley</li>
        <li>Proveedores de servicios tecnológicos (con estrictos acuerdos de confidencialidad)</li>
      </ul>
      <p className="mb-6">No vendemos ni compartimos datos con fines comerciales no autorizados.</p>

      <h2 className="text-xl font-semibold mb-4">6. Seguridad de Datos</h2>
      <ul className="list-disc pl-6 mb-6 space-y-1">
        <li>Encriptación de datos sensibles</li>
        <li>Accesos restringidos y autenticación</li>
        <li>Protocolos de seguridad para pagos</li>
        <li>Copias de seguridad seguras</li>
      </ul>

      <h2 className="text-xl font-semibold mb-4">7. Retención de Datos</h2>
      <ul className="list-disc pl-6 mb-6 space-y-1">
        <li>Datos de reservas: 5 años (obligaciones fiscales)</li>
        <li>Documentación de identidad: 3 años después de la última reserva</li>
        <li>No datos de contacto: Hasta que solicite su eliminación</li>
      </ul>

      <h2 className="text-xl font-semibold mb-4">8. Sus Derechos</h2>
      <ul className="list-disc pl-6 mb-6 space-y-1">
        <li>Acceder a sus datos personales</li>
        <li>Solicitar corrección de información inexacta</li>
        <li>Pedir la eliminación de sus datos (cuando aplicable)</li>
        <li>Limitar u oponerse al tratamiento</li>
        <li>Retirar consentimiento</li>
        <li>Solicitar portabilidad de datos</li>
      </ul>
      <p className="mb-6">
        Para ejercer estos derechos, contacte a nuestro Encargado de Protección de Datos.
      </p>

      <h2 className="text-xl font-semibold mb-4">9. Cookies y Tecnologías Similares</h2>
      <p>
        Usamos cookies esenciales para el funcionamiento del sitio y analíticas para
        mejorar nuestros servicios. Puede configurar su navegador para rechazar
        cookies no esenciales.
      </p>
    </main>
  );
}
