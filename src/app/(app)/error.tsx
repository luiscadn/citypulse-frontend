"use client";

import { Button, ButtonLink, Container, EmptyState } from "@/shared/presentation/components";

/**
 * Error inesperado en una página de la app (por ejemplo, el backend no responde).
 * Debe ser Client Component: es un Error Boundary de React. `retry` vuelve a pedir el segmento.
 */
export default function AppError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <Container className="py-12">
      <EmptyState
        title="Algo salió mal"
        description="No pudimos cargar esta página. Puede ser un problema de conexión con el servidor."
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={() => retry()}>Intentar de nuevo</Button>
            <ButtonLink href="/" variant="secondary">
              Ir al inicio
            </ButtonLink>
          </div>
        }
      />
    </Container>
  );
}
