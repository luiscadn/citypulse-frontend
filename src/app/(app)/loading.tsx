import { Container, Spinner } from "@/shared/presentation/components";

/**
 * Componente Loading: Fallback de carga para el grupo de rutas `(app)`.
 *
 * - **¿Qué hace?**: Renderiza un contenedor centrado con un indicador giratorio `Spinner` de tamaño grande (`lg`).
 * - **¿Cómo interactúa con el sistema en general?**: Es detectado por Next.js App Router para envolver automáticamente
 *   cualquier transición de página dentro del grupo `(app)` en un límite de `Suspense`.
 * - **¿Cuál es su importancia?**: Proporciona retroalimentación visual inmediata durante la resolución asíncrona de datos
 *   en Server Components, previniendo que la aplicación parezca no responder durante cambios de ruta.
 */
export default function Loading() {
  return (
    <Container className="grid h-48 place-items-center text-primary">
      <Spinner size="lg" />
    </Container>
  );
}
