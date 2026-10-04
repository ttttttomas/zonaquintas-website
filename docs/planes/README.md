# Planes de implementación — ZonaQuintas

Fecha: 2026-10-04. Fuente: `new-tasks.md` guardado y código local de ambos repositorios.
Estado: planificación; las casillas representan trabajo futuro, no implementaciones realizadas.

1. [Pagos de reservas](./pagos.md): diagnosticar el pago sandbox, corregir confirmación y sincronización, y probar el recorrido completo.
2. [Disponibilidad y calendarios de dueños](./duenos.md): rango de alquiler, prevención de reservas superpuestas y calendarios.

## Orden y alcance

- Resolver primero el contrato de estados de pagos. Disponibilidad depende de esos estados, especialmente `paid` y `finished`.
- Luego implementar migración y validaciones de disponibilidad en el backend, y finalmente conectar los calendarios del frontend.
- La tarea general de filtros queda fuera de estos dos planes; continúa registrada en `new-tasks.md`.
- Los archivos de implementación del backend, pruebas y migraciones van exclusivamente en `../backend-zonaquintas`. Estos documentos coordinan ambos repositorios desde el frontend para facilitar su lectura en VS Code.
- Hay cambios locales existentes en ambos repositorios. Revisar sus diffs antes de implementar y conservarlos. Crear la PR del backend cuando el usuario lo indique.
- Los nuevos calendarios están solicitados explícitamente. Conservar la maqueta y estilos existentes fuera de esas incorporaciones.

## Criterios de aceptación de la planificación

- [x] Cada tarea de PAGOS y DUEÑOS tiene etapas, archivos afectados y criterios verificables.
- [x] Se distinguen hallazgos del código, hipótesis y decisiones de producto pendientes.
- [x] Se contemplan migración, concurrencia, pruebas y orden de despliegue.
- [x] Los documentos tienen enlaces entre sí y una excepción acotada en `.gitignore` para poder versionarlos.

Abrir cualquiera de los archivos y usar **Ctrl+Shift+V** para la vista previa Markdown de VS Code.
