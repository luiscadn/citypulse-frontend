import { Container, RouteLoading } from "@/shared/presentation/components";

/**
 * Componente AdminUsersLoading: Fallback de carga para la sección de administración de usuarios y roles.
 *
 * - **¿Qué hace?**: Muestra el indicador `RouteLoading` con el texto "Cargando usuarios" dentro del contenedor de página.
 * - **¿Cómo interactúa con el sistema en general?**: Es activado por Next.js automáticamente mientras se resuelven
 *   los datos del servidor en `src/app/(app)/admin/users/page.tsx`.
 * - **¿Cuál es su importancia?**: Ofrece una respuesta visual contextualizada que previene el congelamiento de pantalla
 *   mientras se consulta la lista de usuarios del sistema desde el backend.
 */
export default function AdminUsersLoading() {
  return (
    <Container className="flex flex-1 flex-col">
      <RouteLoading label="Cargando usuarios" />
    </Container>
  );
}
