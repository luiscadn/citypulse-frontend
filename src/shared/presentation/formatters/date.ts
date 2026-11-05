/** La zona va fija: el servidor puede estar en otra y la fecha debe verse igual para todos. */
const dateTimeFormat = new Intl.DateTimeFormat("es-CO", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "America/Bogota",
});

/** Fecha y hora legibles a partir de una fecha ISO del backend. */
export function formatDateTime(isoDate: string): string {
  return dateTimeFormat.format(new Date(isoDate));
}
