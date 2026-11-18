import type { ReactNode } from "react";
import { cn } from "../cn";
import { ButtonLink } from "./button";
import { Spinner } from "./spinner";

/**
 * Componente RouteLoading: Estado de carga visual para transiciones de ruta.
 *
 * - **¿Qué hace?**: Renderiza un `Spinner` de tamaño grande (`lg`) centrado en la pantalla durante la carga inicial o transición de páginas.
 * - **¿Cómo interactúa con el sistema en general?**: Es el componente invocado por los archivos de carga automática de Next.js
 *   (`loading.tsx`) en el directorio `src/app/(app)/loading.tsx` y subrutas como `admin/users/loading.tsx`.
 * - **¿Cuál es su importancia?**: Actúa como el fallback de React Suspense durante la resolución de Server Components asíncronos,
 *   garantizando que el usuario perciba progreso inmediato mientras se obtienen los datos del backend.
 */
export function RouteLoading({ label = "Cargando" }: { label?: string }) {
  return (
    <div className="grid min-h-64 flex-1 place-items-center text-primary">
      <Spinner size="lg" label={label} />
    </div>
  );
}

/**
 * Componente NotFoundState: Estado para recursos o rutas inexistentes (404).
 *
 * - **¿Qué hace?**: Muestra un indicador visual prominente de error 404, con un título, descripción explicativa
 *   y un botón o enlace para retornar a la página de inicio.
 * - **¿Cómo interactúa con el sistema en general?**: Se renderiza en los archivos `not-found.tsx` de Next.js
 *   (`src/app/not-found.tsx` y `src/app/(app)/not-found.tsx`) cuando se invoca la función `notFound()` de Next.js
 *   tras fallar la búsqueda de un evento, zona o establecimiento con ID inexistente.
 * - **¿Cuál es su importancia?**: Ofrece una navegación de salida intuitiva al usuario ante enlaces rotos o recursos eliminados,
 *   evitando callejones sin salida en la aplicación.
 */
export function NotFoundState({
  title = "No encontramos lo que buscas",
  description = "La página no existe o no tienes acceso a ella.",
  action,
  className,
}: {
  title?: ReactNode;
  description?: ReactNode;
  /** Por defecto, un enlace al inicio */
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center", className)}>
      <p className="text-5xl font-bold tracking-tight text-primary">404</p>
      <h1 className="text-xl font-bold tracking-tight text-ink">{title}</h1>
      <p className="max-w-sm text-sm text-ink-muted">{description}</p>
      <div className="mt-2">{action ?? <ButtonLink href="/">Volver al inicio</ButtonLink>}</div>
    </div>
  );
}
