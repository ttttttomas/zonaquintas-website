# Plan de implementación: pagos de reservas

Estado: pendiente de ejecución. Prioridad: alta. [Índice](./README.md) · [Dependencia con disponibilidad](./duenos.md)

## 1. Objetivo y caso reportado

Un pago realizado en sandbox de Rebill deja la reserva en «Proceso de pago» en `/reservations` del dueño. Seguir el caso identificado en `new-tasks.md` por `rebill_payment_link_id` hasta localizar la ruptura y cubrir el flujo con pruebas. El identificador del payment link no es el ID de la transacción: deben correlacionarse con `booking_id` y `payment_id` internos.

No se consultaron todavía los registros de Rebill ni la base desplegada. No hay una causa confirmada.

## 2. Evidencia local y posibles causas

| Hallazgo verificado | Implicación que debe comprobarse |
|---|---|
| `app/api/webhook/rebill/route.ts` usa `http://localhost:8000` fijo. | El receptor podría escribir en otra API o no alcanzar FastAPI. |
| Sólo procesa `payment.created` con `payment.status === approved` y espera metadata específica. | Contrastar el evento real recibido y los datos del payment link. |
| No comprueba `response.ok` en los PATCH ni en los correos. | Un 4xx/5xx puede terminar reconocido como éxito y dejar datos incompletos. |
| Pago y reserva se actualizan en peticiones separadas. | Una actualización puede funcionar y la otra fallar. |
| `/reservations` obtiene datos en un efecto dependiente de `user`; sus acciones usan `router.refresh()`. | El estado cliente puede quedar viejo aunque la base ya haya cambiado. |
| La página de éxito obtiene el dueño, no confirma el estado del pago. | Volver desde Rebill no demuestra que la reserva se haya actualizado. |
| El backend local ya reconoce `FINISHED` y tiene pruebas de movimientos de wallet. | Verificar que esa corrección esté desplegada; no atribuirle sin evidencia todo el incidente. |
| El webhook llama `/api/emails/*`; los handlers de correo inspeccionados están en Next bajo `/api/test-email/*`. | Verificar qué rutas existen en el despliegue y corregir el destino, contrato y destinatarios. |

## 3. Contrato que debe conservarse

| Evento de negocio | Estado del pago | Estado de reserva | Billetera |
|---|---|---|---|
| Solicitud creada | Todavía sin pago | `pending` | Sin movimiento |
| Dueño acepta y se genera link | `link_deposit_sent` o `link_balance_sent` | `accepted` | Sin movimiento |
| Seña aprobada | `paid` | `paid` | Un movimiento `RETENIDO` por ese pago |
| Saldo o pago total aprobado | `finished` | `finished` | Un movimiento `RETENIDO` por ese pago |
| Pago pendiente o rechazado | Registrar resultado según contrato acordado | No promover a pagada | Sin movimiento nuevo |

`finished` significa pago completo en el contrato actual; no demuestra que la estadía ya ocurrió. Un evento viejo de seña no debe bajar una reserva de `finished` a `paid`. La liberación de fondos es otro proceso.

## 4. Etapas de implementación

### P1 — Reproducir y diagnosticar antes de corregir

- [ ] Identificar ambiente de checkout, receptor webhook, API y base; comprobar que todos correspondan al mismo sandbox.
- [ ] Consultar en modo lectura el link indicado en `new-tasks.md`, su transacción, estado, metadata y entregas del webhook: URL, hora, respuesta y reintentos.
- [ ] Comparar `booking_payments`, `bookings` y `transactions`, registrando sólo IDs técnicos y estados; no copiar payloads con datos personales o credenciales al repo.
- [ ] Consultar `GET /bookings/{id}` y `GET /bookings/owner/{owner_id}` para distinguir persistencia incorrecta de pantalla desactualizada.
- [ ] Conservar una fixture sanitizada del evento real y escribir primero una prueba que reproduzca la falla.

Salida: causa identificada con evidencia y prueba roja. Si falta acceso al sandbox o logs, dejar esa limitación explícita.

### P2 — Confirmación fiable en servidor

- [ ] Configurar destino de FastAPI por variable de entorno; comprobar ruta y alcance desde el receptor desplegado.
- [ ] Validar forma del evento y metadata antes de acceder a sus campos. Verificar autenticidad conforme al contrato vigente de Rebill; probar cuerpo crudo, firma y configuración sin exponer secretos.
- [ ] Mantener las credenciales y consultas privadas a Rebill del lado servidor. Revisar `lib/rebill.ts`, que es importado por una página cliente.
- [ ] Comprobar respuestas HTTP, tiempos de espera y errores; no responder éxito si la confirmación obligatoria falló. Los eventos irrelevantes deben tener tratamiento explícito.
- [ ] Concentrar la confirmación pago/reserva/wallet en una operación transaccional de FastAPI, consumida por Next con autenticación de servidor. No permitir que el navegador marque pagos como aprobados.
- [ ] Verificar vínculo entre pago, reserva, monto, moneda y transacción Rebill usando datos persistidos; la metadata por sí sola no autoriza un cobro.
- [ ] Diseñar idempotencia persistente por transacción/pago y una restricción única apropiada. La deduplicación actual por monto/descripción no garantiza exclusión frente a dos requests concurrentes. Inspeccionar datos antes de migrar.
- [ ] Separar el envío de correo de la transacción monetaria, con registro de envío/reintento, para no duplicar movimientos ni correos ante entregas repetidas.

Salida: confirmación atómica e idempotente; errores recuperables observables; ninguna regresión de estados por eventos fuera de orden.

### P3 — Actualización del dueño y retorno del checkout

- [ ] Extraer una función de recarga de reservas y usarla tras acciones exitosas; no depender únicamente de `router.refresh()` para el estado cliente.
- [ ] Actualizar al recuperar el foco y, si hace falta, usar polling acotado mientras existan pagos en proceso, con limpieza, errores y estados de carga.
- [ ] En el retorno del checkout, consultar una reserva/pago autorizado en el servidor. No declarar un pago aprobado por los parámetros de la URL.
- [ ] Reutilizar skeletons y mensajes existentes; cualquier ajuste visual adicional se revisa antes de implementarlo.

### P4 — Recuperación del caso y entrega

- [ ] Una vez confirmado el cobro por Rebill, reconciliar el caso reportado mediante la misma operación idempotente. No alterar manualmente sólo el estado para ocultar el problema.
- [ ] Registrar si existen otros pagos históricos afectados; no efectuar una reparación masiva sin evaluar y acordar su alcance.
- [ ] Desplegar migración/backend antes del webhook que consuma el nuevo contrato, manteniendo compatibilidad durante la transición.
- [ ] Repetir el caso sandbox y verificar API, wallet, panel del dueño y correos. Conservar evidencia sanitizada de resultado y versión desplegada.

## 5. Archivos y repositorios

| Repositorio | Archivos actuales / incorporación propuesta |
|---|---|
| Frontend | `app/api/webhook/rebill/route.ts`, `lib/rebill.ts`, `app/services/BookingsServices.tsx`, `app/(auth)/reservations/page.tsx`, `app/pay_ticket_rebill_success/page.tsx`, handlers y templates de correo afectados. |
| Backend separado | `routers/bookings.py`, `models/bookings.py`, consultas de `routers/wallet.py`, operación de confirmación y migración de idempotencia por crear. |
| Pruebas | Ampliar `backend-zonaquintas/tests/test_booking_payment_wallet.py`; incorporar pruebas del webhook con FastAPI/Rebill/correo simulados en el frontend. |

## 6. Matriz de pruebas y aceptación

- [ ] Seña aprobada, saldo aprobado y pago total directo producen los estados esperados y los importes correctos.
- [ ] Eventos pendientes/rechazados no acreditan fondos; un duplicado no genera otro movimiento ni otro correo.
- [ ] Dos confirmaciones concurrentes de la misma transacción acreditan una sola vez.
- [ ] Evento sin metadata, firma inválida, vínculo incorrecto o monto/moneda distinto no modifica pagos.
- [ ] Backend inaccesible, 4xx/5xx y fallo entre operaciones no se reportan falsamente como éxito; el reintento recupera sin duplicados.
- [ ] Evento antiguo no revierte el pago completo. Un pago tardío de una reserva cancelada se deriva a conciliación sin reactivar fechas ocupadas por otro huésped.
- [ ] El panel abierto del dueño refleja el cambio sin cerrar sesión; el retorno de checkout no fabrica una aprobación.
- [ ] Las pruebas aisladas pasan sin DB real ni correos reales. Agregar integración contra MySQL de prueba para transacciones, restricciones y concurrencia: SQLite no prueba esas garantías.
- [ ] Ejecutar tipos/build y lint en entorno compatible, documentando bloqueos previos. Completar al menos un recorrido real en sandbox antes de dar el incidente por resuelto.

## 7. Referencia externa

Verificar payload, firma y respuestas contra la [documentación oficial de webhooks de Rebill](https://docs.rebill.com/guides/webhooks) y contrastarlos con la entrega sandbox real. No asumir que un ejemplo documental reproduce la configuración de esta cuenta.
