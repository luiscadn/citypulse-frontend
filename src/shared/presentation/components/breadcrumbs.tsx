import Link from "next/link";
import { ChevronRightIcon } from "./icons";

export interface Crumb {
  label: string;
  /** Sin href: es la página actual */
  href?: string;
}

/** Migas de pan: dónde está la persona y cómo volver, en vez de un "← Volver" suelto. */
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
