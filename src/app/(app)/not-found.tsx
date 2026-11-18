import { ButtonLink, Container, EmptyState } from "@/shared/presentation/components";

/**
 * Componente NotFound: Vista 404 para recursos no encontrados dentro del layout `(app)`.
 *
 * - **¿Qué hace?**: Muestra un `EmptyState` informando que el recurso solicitado no existe o fue eliminado,
 *   incluyendo un botón de acción rápida para retornar a la pantalla principal.
 * - **¿Cómo interactúa con el sistema en general?**: Se renderiza cuando una función de servidor invoca
 *   `notFound()` de Next.js (por ejemplo, al intentar acceder a una zona, evento o establecimiento inexistente).
 * - **¿Cuál es su importancia?**: Preserva la navegación superior y la estructura del layout principal,
 *   evitando que el usuario sea expulsado de su contexto de sesión autenticado al encontrarse con un recurso inválido.
 */
export default function NotFound() {
  return (
    <Container className="py-12">
      <EmptyState
        title="No encontramos lo que buscas"
        description="Puede que se haya eliminado o que el enlace esté mal escrito."
        action={<ButtonLink href="/">Ir al inicio</ButtonLink>}
      />
    </Container>
  );
}
