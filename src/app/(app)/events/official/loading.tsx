import { Container, PageSkeleton } from "@/shared/presentation/components";

/**
 * Estado de Carga para la Página de Publicación de Evento Oficial (Next.js Suspense Boundary)
 *
 * - **¿Qué hace?**: Muestra una estructura visual de carga (`PageSkeleton`) mientras se resuelve la sesión y
 *   la verificación de permisos en la ruta `/events/official`.
 * - **¿Cómo interactúa con el sistema en general?**: Montado por el App Router como fallback automático.
 * - **¿Cuál es su importancia?**: Ofrece una experiencia de usuario consistente evitando bloqueos de interfaz.
 */
export default function Loading() {
  return (
    <Container>
      <PageSkeleton cards={3} />
    </Container>
  );
}
