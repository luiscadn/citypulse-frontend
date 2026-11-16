"use client";

import { RouteError } from "@/shared/presentation/components";

/** Error de cualquier página de la app: se muestra bajo el encabezado, que sigue disponible. */
export default function AppError({ error, retry }: { error: unknown; retry: () => void }) {
  return <RouteError error={error} retry={retry} />;
}