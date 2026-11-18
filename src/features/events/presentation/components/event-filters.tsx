/**
 * @file event-filters.tsx
 * @description Componente de filtrado para la cartelera de Eventos.
 * Vincula los filtros con los query parameters de la URL a través del componente `<Form>` de Next.js.
 */

import Form from "next/form";
import type { Zone } from "@/features/zone/domain/entities/zone";
import { EventOrigin, EventStatus } from "@/shared/domain/enums";
import { Button, SelectField, TextField } from "@/shared/presentation/components";
import type { EventFilters as Filters } from "../../domain/entities/event";
import { EVENT_SEARCH_MAX_LENGTH } from "../../domain/rules/event-limits";
import { EVENT_STATUS_LABELS } from "./event-status-badge";

/**
 * Formulario de filtros para el catálogo de eventos.
 *
 * - **¿Qué hace?**:
 *   Muestra campos interactivos para: búsqueda por texto libre, selector de zona geográfica,
 *   selector de estado de moderación, selector de origen (Oficial vs. Reporte ciudadano) y rango de fechas ("Desde" y "Hasta").
 *   Al usar `next/form`, realiza navegación GET actualizando la URL sin recargar completamente la página.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Incrustado en `EventList`. Su atributo `key` compuesto fuerza la actualización de los valores de los controles
 *   cuando el usuario navega hacia atrás o adelante en el historial del navegador.
 *
 * - **¿Cuál es su importancia?**:
 *   Permite una navegación bookmarkable y compartible: cualquier usuario puede copiar la URL resultante
 *   y compartir una búsqueda específica con otra persona.
 */
export function EventFilters({ filters, zones }: { filters: Filters; zones: readonly Zone[] }) {
  return (
    <Form
      key={`${filters.zoneId}-${filters.status}-${filters.origin}-${filters.search}-${filters.from}-${filters.to}`}
      action="/events"
      className="flex flex-wrap items-end gap-3"
    >
      <TextField
        label="Buscar"
        name="search"
        type="search"
        maxLength={EVENT_SEARCH_MAX_LENGTH}
        placeholder="Título o descripción"
        defaultValue={filters.search ?? ""}
        className="min-w-48 flex-[2]"
      />
      <SelectField label="Zona" name="zoneId" defaultValue={filters.zoneId ?? ""} className="min-w-40 flex-1">
        <option value="">Todas las zonas</option>
        {zones.map((zone) => (
          <option key={zone.id} value={zone.id}>
            {zone.name}
          </option>
        ))}
      </SelectField>
      <SelectField label="Estado" name="status" defaultValue={filters.status ?? ""} className="min-w-36">
        <option value="">Todos</option>
        {Object.values(EventStatus).map((status) => (
          <option key={status} value={status}>
            {EVENT_STATUS_LABELS[status]}
          </option>
        ))}
      </SelectField>
      <SelectField label="Tipo" name="origin" defaultValue={filters.origin ?? ""} className="min-w-36">
        <option value="">Todos</option>
        <option value={EventOrigin.OFICIAL}>Oficiales</option>
        <option value={EventOrigin.REPORTE_USUARIO}>Reportes ciudadanos</option>
      </SelectField>
      <TextField label="Desde" name="from" type="date" defaultValue={filters.from ?? ""} className="min-w-36" />
      <TextField label="Hasta" name="to" type="date" defaultValue={filters.to ?? ""} className="min-w-36" />
      <Button type="submit" variant="secondary">
        Filtrar
      </Button>
    </Form>
  );
}
