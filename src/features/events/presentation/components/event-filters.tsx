import Form from "next/form";
import type { Zone } from "@/features/zone/domain/entities/zone";
import { EventOrigin, EventStatus } from "@/shared/domain/enums";
import { Button, SelectField, TextField } from "@/shared/presentation/components";
import type { EventFilters as Filters } from "../../domain/entities/event";
import { EVENT_SEARCH_MAX_LENGTH } from "../../domain/rules/event-limits";
import { EVENT_STATUS_LABELS } from "./event-status-badge";

/**
 * Filtros del listado. Viven en la URL (/events?zoneId=2&status=CONFIRMADO):
 * se pueden compartir y el botón atrás funciona.
 */
export function EventFilters({ filters, zones }: { filters: Filters; zones: readonly Zone[] }) {
  return (
    // key: al navegar a otros filtros, los campos deben mostrar los de la URL
    <Form
      key={`${filters.zoneId}-${filters.status}-${filters.origin}-${filters.search}`}
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
      <Button type="submit" variant="secondary">
        Filtrar
      </Button>
    </Form>
  );
}
