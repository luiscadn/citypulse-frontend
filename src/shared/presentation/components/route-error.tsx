"use client";

import { useEffect } from "react";
import { Button } from "./button";

/**
 * Componente RouteError: Manejador de límites de error de ruta (Error Boundary).
 *
 * - **¿Qué hace?**: Muestra una interfaz de recuperación accesible con mensaje de fallo y botón "Reintentar"
 *   cuando ocurre una excepción no capturada durante el renderizado o carga de datos en una ruta.
 *   Registra el error en la consola con `useEffect`.
 * - **¿Cómo interactúa con el sistema en general?**: Es el componente utilizado por las páginas `error.tsx` de Next.js
 *   (`src/app/(app)/error.tsx`). Invoca el callback `retry` (o `reset`) para volver a intentar renderizar el segmento afectado.
 * - **¿Cuál es su importancia?**: Evita que una falla puntual en una petición al backend o un error inesperado
 *   haga colapsar toda la aplicación ("crash" completo), aislando el error al segmento y permitiendo que el usuario se recupere
 *   sin tener que refrescar toda la ventana manualmente.
 */
export function RouteError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center"
    >
      <h1 className="text-xl font-bold tracking-tight text-ink">Algo salió mal</h1>
      <p className="max-w-sm text-sm text-ink-muted">
        No pudimos cargar esta página. Revisa tu conexión e inténtalo de nuevo.
      </p>
      <Button className="mt-2" onClick={() => retry()}>
        Reintentar
      </Button>
    </div>
  );
}
