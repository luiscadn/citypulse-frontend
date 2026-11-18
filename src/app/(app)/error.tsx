"use client";

import { RouteError } from "@/shared/presentation/components";

/**
 * Componente AppError: Error Boundary para páginas del grupo `(app)`.
 *
 * - **¿Qué hace?**: Renderiza el componente `RouteError` bajo el encabezado de navegación persistente,
 *   ofreciendo el mensaje de error y el botón de reintento (`retry`).
 * - **¿Cómo interactúa con el sistema en general?**: Es activado por React/Next.js cuando una página dentro
 *   de `(app)` arroja un error no controlado (ej. fallo de red o caída del backend).
 * - **¿Cuál es su importancia?**: Aísla el fallo a la vista principal sin desmontar el encabezado ni la barra
 *   de navegación, permitiendo al usuario continuar utilizando otras secciones de la app o reintentar la acción.
 */
export default function AppError({ error, retry }: { error: unknown; retry: () => void }) {
  return <RouteError error={error} retry={retry} />;
}
