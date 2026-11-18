/**
 * @file venue-status-badge.tsx
 * @description Componente visual para representar el estado de verificación de un Lugar (Venue).
 */

import { Badge } from "@/shared/presentation/components";

/**
 * Insignia visual indicadora del estado de certificación de un lugar (RF-2.4).
 *
 * - **¿Qué hace?**:
 *   Muestra un `Badge` con tono verde de éxito ("Verificado") si `isVerified` es verdadero,
 *   o un tono amarillo de advertencia ("Pendiente") si aún no ha sido revisado por un administrador.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Utilizado en filas de tablas y listas (`VenueRow`), encabezados de detalle (`VenueDetail`) y vistas públicas.
 *
 * - **¿Cuál es su importancia?**:
 *   Brinda claridad visual inmediata sobre la autenticidad y estado operativo de un recinto,
 *   fomentando confianza en los usuarios y alertando a los moderadores.
 */
export function VenueStatusBadge({ isVerified }: { isVerified: boolean }) {
  return isVerified ? (
    <Badge tone="success" dot>
      Verificado
    </Badge>
  ) : (
    <Badge tone="warning" dot>
      Pendiente
    </Badge>
  );
}
