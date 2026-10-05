# Plan de implementación: disponibilidad y calendarios de dueños

Estado: implementado en ramas `feature/disponibilidad-duenos`; pendiente de migración y validación en MySQL de prueba. [Índice](./README.md) · [Plan de pagos](./pagos.md)

## 1. Alcance solicitado

1. Agregar al paso 3 de publicación un calendario `react-datepicker` para elegir un rango de alquiler, con atajo «Todo el año».
2. Impedir reservas fuera de ese rango o superpuestas con otra reserva.
3. Bloquear fechas cuando se crea una reserva y liberarlas conforme a sus estados.
4. Mostrar al dueño en `/reservations` un calendario con fechas disponibles y reservadas.

La primera versión contempla un rango continuo por quinta. Múltiples temporadas, precios por fecha, sincronización con calendarios externos y membresías no forman parte de estas tareas.

## 2. Punto de partida verificado

- `app/publicar-quinta/paso-3/page.tsx` pide precio y moneda; importa el CSS de datepicker pero no tiene selector de fechas.
- `QuintaFormContext.tsx`, `types.ts` y `backend-zonaquintas/models/quintas.py` no definen un rango de alquiler.
- `POST /bookings` comprueba que quinta y usuarios existan, pero no valida disponibilidad ni superposición antes de insertar.
- `app/components/Calendar.tsx` es un calendario propio, no `react-datepicker`. Tiene una restricción cliente de dos noches y no consulta ocupación.
- `/reservations` agrupa reservas por estado, sin calendario por propiedad.
- La DB configurada es MySQL; Alembic figura como dependencia pero no hay una estructura de migraciones verificada. No agregar DDL al import de routers.

## 3. Decisiones propuestas que deben quedar cerradas antes de implementar

| Tema | Propuesta para esta primera versión | Decisión pendiente |
|---|---|---|
| Semántica de fechas | Noches en intervalo `[check_in, check_out)`: la salida no ocupa esa noche y permite otro ingreso ese día. | Confirmar que no se necesita un día de limpieza entre estadías. |
| Rango de alquiler | `rental_start_date` inclusiva y `rental_end_date` como última fecha de salida admitida. La interfaz debe aclararlo. | Confirmar si el dueño espera seleccionar última noche en lugar de última salida; en ese caso convertir explícitamente. |
| «Todo el año» | Desde hoy hasta el 1 de enero siguiente como salida máxima; así se permite la noche del 31 de diciembre. | Confirmar año calendario vs próximos 12 meses. No tratar 365 días como equivalente a un año bisiesto. |
| Momento de bloqueo | Bloquear desde la creación de la solicitud `pending`, según lo pedido; mantener en `accepted`, `paid` y `finished`. | Definir vencimiento de solicitudes y links sin pagar para evitar bloqueos indefinidos. No inventar un plazo. |
| Liberación | `rejected`/`cancelled` dejan de bloquear. Un pago rechazado no cancela por sí solo la reserva. | Definir cancelaciones con dinero cobrado y conciliación de pagos tardíos. |
| Publicaciones existentes | Incorporar campos inicialmente anulables; inventariar reservas y definir rango con cada propietario antes de exigirlo. | Elegir carga asistida o período transitorio. No cerrar ni abrir fechas existentes silenciosamente. |
| Estadía mínima | Llevar al backend las dos noches que ya exige el calendario cliente. | Confirmar si esa regla de negocio es global. |

`finished` sigue bloqueando sus fechas: es pago completo, no liberación de ocupación. Fechas de negocio en `YYYY-MM-DD` y columnas `DATE`; usar America/Argentina/Buenos_Aires para «hoy», sin convertir fechas civiles con `toISOString()`.

## 4. Etapas

### D1 — Contrato de dominio y base de datos (backend separado)

- [ ] Inspeccionar esquema real, versión de MySQL, motor de tablas, índices, estados existentes y reservas superpuestas antes de diseñar la migración final.
- [ ] Agregar `rental_start_date` y `rental_end_date` a `quintas` mediante migración versionada con avance y reversión documentados. Validar orden de fechas en servidor y, si la versión lo admite, con restricción DB.
- [ ] Definir índice útil para buscar reservas por `quinta_id`, estado y fechas; verificar consulta con datos de prueba.
- [ ] Preparar estrategia para quintas existentes y conflictos históricos. La reversión de esquema nunca debe eliminar reservas o pagos.
- [ ] Si se acuerda caducidad, agregar `expires_at` y proceso idempotente de expiración; coordinarlo con vigencia de links y pagos tardíos. Esa política es requisito previo a liberar automáticamente fechas.
- [ ] Extender `QuintaCreate`, `QuintaUpdate`, INSERT/UPDATE y respuestas. Derivar dueño desde sesión/propiedad y comprobar permisos, sin confiar en `owner_id` del cliente.

### D2 — Disponibilidad y reserva sin doble ocupación

- [ ] Crear servicio de disponibilidad reutilizable: fecha válida, quinta reservable, rango permitido, estadía mínima y ausencia de superposición.
- [ ] Exponer `GET /quintas/{id}/availability?from=YYYY-MM-DD&to=YYYY-MM-DD` (contrato propuesto) con rango de alquiler e intervalos bloqueados; acotar horizonte y excluir datos personales.
- [ ] Para datos privados del calendario del dueño, usar una consulta autenticada que compruebe propiedad o rol admin. No publicar IDs/datos de huéspedes junto con la disponibilidad pública.
- [ ] Validar siempre en `POST /bookings`, aunque el cliente haya consultado disponibilidad segundos antes.
- [ ] Dentro de una misma transacción MySQL, bloquear la fila de la quinta con `SELECT ... FOR UPDATE`, comprobar rango/ocupación e insertar. Todos los caminos que crean, reactivan o cambian fechas de reservas deben tomar ese mismo bloqueo.
- [ ] Usar la condición de cruce `existing.check_in < requested.check_out AND existing.check_out > requested.check_in`, filtrando los estados bloqueantes acordados. Devolver `409` ante conflicto y `422` ante rango inválido.
- [ ] Aplicar el mismo control al modificar el rango de alquiler: no dejar reservas vigentes fuera de él. Rechazar con detalle útil o definir una política explícita de excepción.
- [ ] Normalizar estados históricos conocidos; el código tiene variantes en inglés/español y mayúsculas. Inventariar antes de migrar y no interpretar un estado desconocido como libre.
- [ ] Evitar que el webhook reactive una reserva cancelada/expirada si ya existe otra ocupación. Registrar el cobro tardío para conciliación, no reasignar automáticamente fechas.

La consulta de disponibilidad es informativa. La garantía contra dos solicitudes simultáneas pertenece a la transacción que crea la reserva.

### D3 — Calendario en paso 3 y persistencia del wizard

- [ ] Extender `QuintaFormData`, valores iniciales y tipos de API; conservar el rango al avanzar y volver entre pasos.
- [ ] Incorporar `react-datepicker` con selección de rango, fechas pasadas deshabilitadas, locale español, labels y navegación por teclado.
- [ ] Agregar el atajo «Todo el año» y acción de limpiar mediante controles del calendario; ambos deben actualizar el mismo estado que la selección manual.
- [ ] Comprobar la API de la versión instalada antes de implementarlos. Los [ejemplos oficiales](https://reactdatepicker.com/) muestran selección de rangos y personalización del contenedor; no asumir que existe una prop universal de presets o shortcuts.
- [ ] Validar rango obligatorio antes de continuar; mostrarlo en el resumen del paso 4 y enviarlo dentro del JSON `data` del `FormData` existente.
- [ ] Adaptar únicamente el espacio necesario para el calendario solicitado, preservando precios, comisión, botones y el resto de la maqueta.

### D4 — Calendario y validación del huésped

- [ ] Cargar disponibilidad en detalle y conectar `BookingSection.tsx` y `Calendar.tsx` con los límites e intervalos bloqueados. Mantener el diseño del calendario actual del huésped.
- [ ] Impedir seleccionar un intervalo cuyo interior atraviese fechas ocupadas, aunque ingreso y salida individualmente estén libres.
- [ ] Permitir salida el mismo día del siguiente ingreso según la regla `[entrada, salida)`; no deshabilitar indiscriminadamente endpoints válidos.
- [ ] Validar otra vez en preview y antes de enviar la reserva. Si la API devuelve `409`, recargar disponibilidad y conservar los demás datos del formulario.
- [ ] Usar skeleton mientras se consulta disponibilidad y bloquear confirmación ante error o respuesta incompleta; no interpretar una falla de red como calendario vacío.

### D5 — Calendario del dueño en `/reservations`

- [ ] Incorporar calendario y selector de quinta para propietarios con varias publicaciones, evitando mezclar ocupación de distintas propiedades.
- [ ] Distinguir disponible, pendiente/bloqueada, reservada y fuera de rango mediante colores y leyenda textual accesible.
- [ ] Consultar sólo propiedades autorizadas; limitar por mes/horizonte para no cargar toda la historia.
- [ ] Refrescar calendario y listas tras aceptar, rechazar, cancelar y confirmar pagos; reutilizar la recarga del plan de pagos.
- [ ] Incluir carga, error, sin propiedades y quinta sin rango configurado.

## 5. Archivos previstos

| Repositorio | Cambios |
|---|---|
| Frontend | `types.ts`, `app/context/QuintaFormContext.tsx`, `app/publicar-quinta/paso-3/page.tsx`, `paso-4/page.tsx`, `app/services/ProductsServices.tsx`, `BookingsServices.tsx`. |
| Frontend | `app/components/Calendar.tsx`, `BookingSection.tsx`, `app/quintas/[id]/page.tsx`, `preview-reservation/page.tsx`, `app/(auth)/reservations/page.tsx` y componente de calendario de dueño por crear. |
| Backend separado | `models/quintas.py`, `models/bookings.py`, `routers/quintas.py`, `routers/bookings.py`; servicio de disponibilidad, migraciones y tests nuevos dentro de `backend-zonaquintas`. |

## 6. Pruebas y criterios de aceptación

- [ ] Crear quinta con rango manual o atajo, volver de paso y confirmar: el rango se conserva y persiste correctamente.
- [ ] Rango invertido, incompleto, pasado, fuera de temporada o menor al mínimo recibe validación coherente en UI y API.
- [ ] Reserva válida bloquea inmediatamente las noches y se ve en ambos calendarios.
- [ ] Cubrir cruce al inicio, al final, contención completa, rango idéntico y noches adyacentes sin cruce; validar límites exactos de temporada.
- [ ] Dos solicitudes concurrentes sobre la misma quinta/rango en MySQL de prueba: una sola se crea, la otra recibe `409`. Fechas iguales en distintas quintas no interfieren.
- [ ] Rechazo/cancelación libera fechas; `paid`/`finished` no las libera. Caducidad y pago tardío se prueban según política acordada.
- [ ] Cambiar rango no invalida reservas existentes; un usuario no puede consultar datos privados ni modificar la quinta de otro.
- [ ] Cubrir cambio de año, febrero bisiesto, distintas zonas del navegador, selección manual/atajo y rangos que atraviesan fechas ocupadas.
- [ ] Calendarios responden a teclado y móvil, muestran carga/error y mantienen selección coherente al cambiar de propiedad.
- [ ] Ejecutar tests de dominio, integración MySQL, tipos/build, lint disponible y recorrido UI. No dar concurrencia por verificada sólo con SQLite o mocks.

## 7. Entrega incremental y riesgos

1. Cerrar decisiones del apartado 3 y contrato de estados con el plan de pagos.
2. Publicar migración compatible y backend con disponibilidad/transacciones; comprobar datos existentes antes de habilitar restricciones obligatorias.
3. Integrar wizard y calendario huésped contra la API ya disponible.
4. Integrar calendario del dueño y completar pruebas de concurrencia y sandbox.
5. Preparar cambios y evidencia para revisión en cada repositorio. La PR del backend se crea cuando el usuario lo indique.

Rollback: revertir la interfaz si fuera necesario conservando las validaciones de backend para no reabrir dobles reservas. No quitar columnas con información ya cargada sin respaldo y evaluación de compatibilidad. Los mayores riesgos son bloqueo indefinido de solicitudes, pagos tardíos, estados históricos ambiguos y fechas con interpretación diferente entre cliente y servidor.

## 8. Estado de ejecución

- Implementados: migración SQL versionada y preflight, período obligatorio para quintas nuevas, actualización autenticada del período, disponibilidad pública sin datos de huéspedes, bloqueo transaccional por quinta en altas y reactivaciones, calendario del wizard, selección del huésped y calendario mensual del dueño.
- Las quintas existentes conservan `NULL/NULL` como política transitoria sin temporada limitada; el dueño puede configurarla con `PATCH /quintas/{id}/rental-period`. No hay caducidad automática de solicitudes pendientes.
- Verificados localmente: 7 tests SQLite/HTTP de disponibilidad, compilación Python, tipos y build Next, y ESLint directo sobre los archivos tocados. `npm run lint` sigue apuntando a `next lint`, retirado en Next 16. La prueba de concurrencia real y la ejecución de la migración requieren MySQL/InnoDB de prueba; no se ejecutaron sobre una base desplegada.
- El webhook conserva un cobro confirmado cuando la reserva ya no tiene disponibilidad y marca `reconciliation_required` en su respuesta, sin volver a ocupar fechas ni enviar confirmación. La conciliación operativa queda pendiente de definir.
