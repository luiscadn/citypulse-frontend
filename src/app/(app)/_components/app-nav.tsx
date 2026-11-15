"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/presentation/cn";

/** Secciones de la app. Para agregar una, basta con sumarla aquí. */
const LINKS = [
  { href: "/friends", label: "Amigos" },
  { href: "/invitations", label: "Invitaciones" },
  { href: "/zones", label: "Zonas" },
  { href: "/venues", label: "Lugares" },
] as const;

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLinks({ pathname, className }: { pathname: string | null; className?: string }) {
  return (
    <nav aria-label="Secciones" className={className}>
      <ul className="flex items-center gap-1">
        {LINKS.map(({ href, label }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-8 items-center rounded-md px-3 text-sm font-semibold transition-colors",
                  "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-ring",
                  active
                    ? "bg-primary-soft text-primary-strong"
                    : "text-ink-muted hover:bg-neutral-soft hover:text-ink",
                )}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Enlaces del encabezado; marca la sección en la que está la persona. */
export function AppNav({ className }: { className?: string }) {
  return <NavLinks pathname={usePathname()} className={className} />;
}

/**
 * Los mismos enlaces sin marcar la sección activa. Es el fallback del <Suspense> de AppNav:
 * en rutas con parámetros (/zones/[id]) la ruta no se conoce al prerenderizar y
 * usePathname() suspende; sin Suspense, `next build` falla.
 */
export function AppNavFallback({ className }: { className?: string }) {
  return <NavLinks pathname={null} className={className} />;
}
