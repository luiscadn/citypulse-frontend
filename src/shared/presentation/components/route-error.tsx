"use client";

import { useEffect } from "react";
import { Button } from "./button";

/**
 * Contenido de un error.tsx: se muestra si algo falla al cargar la ruta
 * (por ejemplo, el backend no responde) y deja reintentar sin recargar toda la página.
 * `retry` es el nombre que usa esta versión de Next (en otras se llama `reset`).
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