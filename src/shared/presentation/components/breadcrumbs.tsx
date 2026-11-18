import Link from "next/link";
import { ChevronRightIcon } from "./icons";

/** Interfaz Crumb: Representa un eslabón dentro de la ruta de navegación jerárquica. */
export interface Crumb {
  label: string;
  /** Sin href: es la página actual (nodo hoja) */
  href?: string;
}

/**
 * Componente Breadcrumbs (Migas de pan)
 *
 * - **¿Qué hace?**: Renderiza una lista horizontal ordenada (`<ol>`) con enlaces navegables a páginas padre y el nombre
 *   de la página actual marcado semánticamente con `aria-current="page"`.
 * - **¿Cómo interactúa con el sistema en general?**: Se ubica en la parte superior de las páginas de detalle
 *   (`zones/[id]`, `venues/[id]`, `events/[id]`, `events/new`), permitiendo al usuario ubicarse en la jerarquía del sitio.
 * - **¿Cuál es su importancia?**: Mejora notablemente la usabilidad y navegación contextual (orientación espacial),
 *   sustituyendo botones genéricos de "Volver" por una ruta clara hacia los ancestros de la página.
 */
export function Breadcrumbs({ items }: { items: readonly Crumb[] }) {
  return (
    <nav aria-label="Ruta" className="pt-6 text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-ink-muted">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1">
            {index > 0 && <ChevronRightIcon className="size-3.5" />}
            {item.href ? (
              <Link
                href={item.href}
                className="rounded-sm font-medium hover:text-ink hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-ring"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="truncate font-semibold text-ink">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
