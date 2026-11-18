/**
 * Formateador dateTimeFormat
 *
 * - **¿Qué hace?**: Instancia de `Intl.DateTimeFormat` configurada para la localización colombiana (`es-CO`),
 *   con estilo de fecha largo (`dateStyle: "long"`), estilo de hora corto (`timeStyle: "short"`) y zona horaria fija `"America/Bogota"`.
 * - **¿Cómo interactúa con el sistema en general?**: Es el formateador subyacente de la función `formatDateTime`.
 * - **¿Cuál es su importancia?**: Fijar la zona horaria en `"America/Bogota"` es fundamental en Next.js Server Components:
 *   evita discrepancias de renderizado ("hydration mismatch") entre la hora procesada en el servidor (que podría correr en UTC)
 *   y la renderizada en el navegador del cliente.
 */
const dateTimeFormat = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "America/Bogota",
});

/**
 * Formateador dateFormat
 *
 * - **¿Qué hace?**: Instancia de `Intl.DateTimeFormat` configurada para fecha completa sin hora en zona horaria `"America/Bogota"`.
 * - **¿Cómo interactúa con el sistema en general?**: Se utiliza en `formatDate` para mostrar fechas de creación, cumpleaños o agendas de eventos.
 * - **¿Cuál es su importancia?**: Asegura un formato homogéneo y estandarizado en español para toda la aplicación.
 */
const dateFormat = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "long",
  timeZone: "America/Bogota",
});

/**
 * Función formatDate
 *
 * - **¿Qué hace?**: Convierte un objeto `Date` o una cadena ISO 8601 en un texto de fecha legible en español (ej. "17 de noviembre de 2026").
 * - **¿Cómo interactúa con el sistema en general?**: Consumida en componentes de detalle y listados (`event-detail.tsx`, `venue-row.tsx`, `zone-detail.tsx`).
 * - **¿Cuál es su importancia?**: Transforma marcas temporales técnicas en información comprensible y accesible para los usuarios finales.
 */
export function formatDate(date: Date | string): string {
  return dateFormat.format(new Date(date));
}

/**
 * Función formatDateTime
 *
 * - **¿Qué hace?**: Convierte una fecha ISO en un texto legible que incluye tanto la fecha como la hora (ej. "17 de noviembre de 2026, 5:30 p. m.").
 * - **¿Cómo interactúa con el sistema en general?**: Empleada en las tarjetas y vistas detalladas de eventos donde la hora de inicio y fin es crítica.
 * - **¿Cuál es su importancia?**: Facilita que los asistentes reconozcan rápidamente el horario exacto del evento sin confusiones de husos horarios.
 */
export function formatDateTime(isoDate: string): string {
  return dateTimeFormat.format(new Date(isoDate));
}
