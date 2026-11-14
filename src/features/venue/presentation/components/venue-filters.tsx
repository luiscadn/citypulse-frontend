import Form from "next/form";
import type { Zone } from "@/features/zone/domain/entities/zone";
import { Button, SelectField } from "@/shared/presentation/components";
import type { VenueFilters as Filters } from "../../domain/entities/venue";

/**
 * Filtros del listado. Viven en la URL (/venues?zoneId=2&isVerified=false):
 * se pueden compartir y el botón atrás funciona.
 */
export function VenueFilters({ filters, zones }: { filters: Filters; zones: readonly Zone[] }) {
  const verified = filters.isVerified === null ? "" : String(filters.isVerified);

  return (
    // key: al navegar a otros filtros, los selectores deben mostrar los de la URL
    <Form key={`${filters.zoneId}-${verified}`} action="/venues" className="flex flex-wrap items-end gap-3">
      <SelectField label="Zona" name="zoneId" defaultValue={filters.zoneId ?? ""} className="min-w-48 flex-1">
        <option value="">Todas las zonas</option>
        {zones.map((zone) => (
          <option key={zone.id} value={zone.id}>
            {zone.name}
          </option>
        ))}
      </SelectField>
      <SelectField label="Estado" name="isVerified" defaultValue={verified} className="min-w-40">
        <option value="">Todos</option>
        <option value="true">Verificados</option>
        <option value="false">Pendientes</option>
      </SelectField>
      <Button type="submit" variant="secondary">
        Filtrar
      </Button>
    </Form>
  );
}
