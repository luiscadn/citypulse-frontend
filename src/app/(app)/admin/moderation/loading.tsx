import { Container, PageSkeleton } from "@/shared/presentation/components";

/**
 * Estado de Carga para la Página de Moderación (Next.js Suspense Boundary)
 *
 * - **¿Qué hace?**: Renderiza un contenedor con esqueletos visuales animados (`PageSkeleton` con 3 tarjetas)
 *   mientras el Server Component `ModerationPage` valida la sesión y obtiene los reportes pendientes de la API.
 * - **¿Cómo interactúa con el sistema en general?**: Es el límite de carga predeterminado del App Router para `/admin/moderation`.
 * - **¿Cuál es su importancia?**: Ofrece retroalimentación visual inmediata durante la navegación,
 *   evitando pantallas en blanco o parpadeos molestos mientras se resuelven las llamadas de red.
 */
export default function Loading() {
  return (
    <Container>
      <PageSkeleton cards={3} />
    </Container>
  );
}
