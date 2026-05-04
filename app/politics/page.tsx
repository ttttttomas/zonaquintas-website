'use client'

export default function PrivacyPoliticsPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-4xl font-bold mb-4 text-center">Políticas de Privacidad</h1>
      <p className="text-center text-gray-500 mb-12 italic">
        Tu seguridad y privacidad son nuestra prioridad legal.
      </p>

      <div className="bg-white p-8 md:p-12 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 space-y-10">

        {/* 1. Introducción */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
            Introducción y Datos del Responsable
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              <strong>Quiénes somos:</strong> Zona Quintas es un emprendimiento digital, dedicado a facilitar la conexión entre propietarios de casas quintas y personas interesadas en alquilar dichas propiedades para estadías temporales.
            </p>
            <p>
              <strong>Responsable del Tratamiento:</strong> ZonaQuintas, marca registrada. Para dudas y consultas, contactese via email a: <span className="font-bold text-primaryDark underline">privacidad@zonaquintas.com</span>
            </p>
          </div>
        </section>

        {/* 2. Qué Información se Recopila */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
            Qué Información se Recopila (Tipos de Datos)
          </h2>

          <div className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-2xl">
              <h3 className="font-bold mb-4 text-gray-900 uppercase text-sm tracking-widest">Información proporcionada directamente:</h3>

              <div className="space-y-6">
                <div>
                  <p className="font-bold text-gray-800 mb-2 underline italic">Para todos los usuarios (Huéspedes y Propietarios):</p>
                  <ul className="list-disc pl-8 space-y-2 text-gray-600">
                    <li><strong>Datos de registro:</strong> Nombre completo, dirección de correo electrónico, número de teléfono, fecha de nacimiento, contraseña.</li>
                    <li><strong>Datos de perfil:</strong> Foto de perfil, descripción personal.</li>
                    <li><strong>Verificación de identidad:</strong> Foto de su DNI, pasaporte u otra identificación oficial (Por motivo de prevención, si se requiere).</li>
                    <li><strong>Comunicaciones:</strong> Registros de mensajes enviados a través de la plataforma y comunicaciones con el equipo de soporte (Cuando se implemente).</li>
                  </ul>
                </div>

                <div>
                  <p className="font-bold text-gray-800 mb-2 underline italic">Específico para Huéspedes:</p>
                  <ul className="list-disc pl-8 space-y-4 text-gray-600">
                    <li><strong>Información de pago:</strong> ZonaQuintas no recopila, almacena ni procesa directamente información financiera sensible, como datos de tarjetas de crédito o débito. Los pagos realizados por los usuarios se gestionan a través de plataformas de pago externas seguras, como Mercado Pago o Rebill, que cuentan con sus propios protocolos de seguridad y cumplimiento normativo. Te recomendamos revisar las políticas de privacidad y términos de uso del proveedor de pago correspondiente para obtener más información sobre cómo gestionan tus datos.</li>
                    <li><strong>Información de búsqueda y reserva:</strong> Destinos buscados, fechas, historial de reservas, lista de favoritos.</li>
                  </ul>
                </div>

                <div>
                  <p className="font-bold text-gray-800 mb-2 underline italic">Específico para Propietarios:</p>
                  <ul className="list-disc pl-8 space-y-2 text-gray-600">
                    <li><strong>Información de la propiedad:</strong> Dirección exacta, descripción, fotos reales de la propiedad a publicar, calendario de disponibilidad, reglas de la casa.</li>
                    <li><strong>Información de cobro:</strong> Datos de cuenta bancaria (CBU/CVU) para recibir los pagos.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-gray-200 pl-6">
              <h3 className="font-bold mb-3 text-gray-800">Información recopilada de forma automática:</h3>
              <ul className="list-disc pl-5 space-y-3 text-gray-600">
                <li><strong>Datos de ubicación:</strong> Ubicación aproximada a través de la dirección IP o ubicación precisa si el usuario da permiso en su dispositivo móvil.</li>
                <li><strong>Cookies y tecnologías similares:</strong>
                  <p className="mt-1 text-sm bg-gray-50 p-3 rounded-lg text-gray-900 italic border border-gray-100">
                    Utilizamos cookies <strong>esenciales</strong> (para mantener tu sesión activa), <strong>de rendimiento</strong> (para analizar el tráfico del sitio) y <strong>de personalización</strong> (para recordar tus preferencias). El usuario puede gestionar y desactivar estas cookies a través de la configuración de su navegador, aunque esto puede afectar la funcionalidad de la plataforma.
                  </p>
                </li>
              </ul>
            </div>

            <div className="border-l-4 border-gray-200 pl-6">
              <h3 className="font-bold mb-2 text-gray-800">Información recopilada de terceros:</h3>
              <p className="text-gray-600 leading-relaxed">
                Al momento de el usuario registrarse en nuestro sistema, recibimos todos los datos proporcionados por el mismo, como su nombre, correo electrónico, telefono, entre otros.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Finalidades */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
            Para Qué se Utiliza la Información (Finalidades)
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-gray-600">
            <div>
              <p className="font-bold text-gray-800 mb-2">Para proporcionar y mejorar el servicio:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Permitir la creación y gestión de cuentas.</li>
                <li>Facilitar las reservas y procesar los pagos.</li>
                <li>Permitir la comunicación entre huéspedes y propietarios.</li>
                <li>Personalizar la experiencia del usuario (ej: mostrar anuncios relevantes).</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-gray-800 mb-2">Para mantener un entorno seguro y de confianza:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Verificar la identidad de los usuarios.</li>
                <li>Prevenir fraudes, spam, abusos y otros incidentes de seguridad.</li>
                <li>Resolver disputas entre usuarios.</li>
              </ul>
            </div>
            <div className="md:col-span-2 mt-4">
              <p className="font-bold text-gray-800 mb-2">Para marketing y comunicación:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Enviar correos electrónicos promocionales, ofertas y newsletters (En caso de que corresponda).</li>
                <li>Informar sobre cambios en los términos, servicios o políticas.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. Con Quién se Comparte */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
            Con Quién se Comparte la Información
          </h2>
          <div className="space-y-6 text-gray-600">
            <p><strong>Entre usuarios:</strong> Al realizar una reserva, el propietario verá el nombre y foto de perfil del huésped. Del mismo modo, el huésped verá la información del propietario. <strong>La dirección exacta del alojamiento solo debe compartirse con el huésped una vez confirmada la reserva.</strong></p>

            <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
              <p className="font-bold text-gray-800">Con proveedores de servicios externos:</p>
              <ul className="list-disc pl-8 space-y-1">
                <li><strong>Procesadores de pago:</strong> Para gestionar transacciones de forma segura.</li>
                <li><strong>Proveedores de cloud hosting:</strong> DonWeb Web Hosting</li>
                <li><strong>Herramientas de atención al cliente:</strong> Software para gestionar tickets de soporte.</li>
                <li><strong>Servicios de verificación de identidad.</strong></li>
              </ul>
            </div>

            <p><strong>Por requerimientos legales:</strong> Con autoridades públicas, tribunales o fuerzas de seguridad si existe una obligación legal, citación o requerimiento judicial.</p>
            <p><strong>En caso de transacciones comerciales:</strong> Si la empresa es vendida, fusionada o adquirida, los datos pueden ser transferidos al nuevo controlador.</p>
          </div>
        </section>

        {/* 5. Base Legal */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
            Base Legal para el Tratamiento de Datos
          </h2>
          <ul className="list-disc pl-8 space-y-2 text-gray-600 leading-relaxed">
            <li><strong>Ejecución de un contrato:</strong> La mayoría de los datos se procesan porque son necesarios para cumplir el contrato con el usuario (es decir, para permitirle alquilar o publicar una propiedad).</li>
            <li><strong>Consentimiento:</strong> Para acciones específicas como el envío de marketing directo o el uso de ciertas cookies no esenciales.</li>
            <li><strong>Intereses legítimos:</strong> Para actividades como la prevención del fraude, la mejora del servicio y la seguridad de la plataforma.</li>
            <li><strong>Obligación legal:</strong> En algunos casos, debemos procesar datos personales para cumplir con normativas fiscales, regulatorias o requerimientos judiciales.</li>
          </ul>
        </section>

        {/* 6. Derechos del Usuario */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">6</span>
            Derechos del Usuario
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="p-4 border rounded-xl"><strong>Acceso:</strong> Saber qué datos se tienen y cómo se usan.</div>
            <div className="p-4 border rounded-xl"><strong>Rectificación:</strong> Corregir datos inexactos o incompletos.</div>
            <div className="p-4 border rounded-xl"><strong>Supresión:</strong> Solicitar eliminación de datos ("derecho al olvido").</div>
            <div className="p-4 border rounded-xl"><strong>Oposición:</strong> Oponerse al tratamiento para marketing directo.</div>
            <div className="p-4 border rounded-xl"><strong>Portabilidad:</strong> Recibir datos en formato estructurado.</div>
          </div>
        </section>

        {/* 7. Seguridad y Retención */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">7</span>
            Seguridad y Retención de Datos
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p><strong>Seguridad:</strong> Implementamos medidas técnicas y organizativas como encriptación de datos (SSL), firewalls en servidores de DonWeb y controles de acceso restringido para proteger tu información.</p>
            <p><strong>Retención:</strong> Los datos se conservan mientras el usuario tenga una cuenta activa y por un período posterior de hasta 10 años para cumplir con obligaciones legales, fiscales y contables.</p>
          </div>
        </section>

        {/* 8. Actualizaciones */}
        <section className="bg-gray-900 text-white p-8 md:p-12 rounded-3xl">
          <h2 className="text-2xl font-bold mb-6">8. Actualizaciones de la Política de Privacidad</h2>
          <p className="leading-relaxed text-gray-400 text-sm">
            Nos reservamos el derecho de modificar o actualizar esta Política de Privacidad en cualquier momento. Cualquier cambio significativo será notificado a nuestros usuarios a través de un aviso destacado en nuestra página web, o mediante correo electrónico a la dirección asociada a su cuenta.
            <br /><br />
            La continuidad en el uso de nuestra plataforma y servicios después de la publicación de cualquier modificación a esta Política de Privacidad se considerará como su aceptación de dichos cambios. Le recomendamos revisar periódicamente esta página para estar informado sobre cómo protegemos su información. Si no está de acuerdo con los términos de esta Política de Privacidad, no debe utilizar nuestra plataforma.
          </p>
        </section>

      </div>
    </main>
  );
}
