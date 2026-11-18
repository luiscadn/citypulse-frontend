/**
 * @file venue-filters.tsx
 * @description Componente de filtrado para el catálogo público de Lugares (Venues).
 * Utiliza el componente `<Form>` de Next.js para sincronizar filtros con los search parameters de la URL.
 */

import Form from "next/form";
import type { Zone } from "@/features/zone/domain/entities/zone";
import { Button, SelectField } from "@/shared/presentation/components";
import type { VenueFilters as Filters } from "../../domain/entities/venue";

/**
 * Formulario de filtros para el listado de lugares.
 *
 * - **¿Qué hace?**:
 *   Permite filtrar por zona geográfica y por estado de verificación (Verificados / Pendientes).
 *   Al ser un formulario nativo de Next.js (`next/form`), envía los datos vía GET actualizando la URL
 *   (`/venues?zoneId=2&isVerified=false`) sin recargas completas.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Renderizado dentro de `VenueList`. Su clave (`key`) se recalcula ante cambios en los filtros para
 *   mantener sincronizados los selectores con la URL cuando se navega con el historial del navegador.
 *
 * - **¿Cuál es su importancia?**:
 *   Bookmarkability y experiencia de usuario: permite compartir enlaces con filtros preestablecidos
 *   y asegura que los botones de 'Atrás' y 'Adelante' del navegador funcionen fielmente.
 */
export function VenueFilters({ filters, zones }: { filters: Filters; zones: readonly Zone[] }) {
  const verified = filters.isVerified === null ? "" : String(filters.isVerified);

  return (
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
