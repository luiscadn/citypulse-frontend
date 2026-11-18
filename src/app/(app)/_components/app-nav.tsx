"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/presentation/cn";

/** Secciones principales de la barra de navegación */
const LINKS = [
  { href: "/events", label: "Eventos" },
  { href: "/friends", label: "Amigos" },
  { href: "/invitations", label: "Invitaciones" },
  { href: "/zones", label: "Zonas" },
  { href: "/venues", label: "Lugares" },
] as const;

/**
 * Función isActive
 *
 * - **¿Qué hace?**: Determina si un enlace de navegación coincide exactamente con la URL actual (`pathname === href`)
 *   o si la ruta actual es una subruta de dicho enlace (`pathname.startsWith("${href}/")`).
 * - **¿Cómo interactúa con el sistema en general?**: Usada en `NavLinks` para aplicar estilos de pestaña activa y `aria-current="page"`.
 * - **¿Cuál es su importancia?**: Permite que las pantallas secundarias y de detalle (ej. `/events/123` o `/zones/new`)
 *   mantengan encendida la pestaña correspondiente en el menú superior.
 */
function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Componente interno NavLinks
 *
 * - **¿Qué hace?**: Renderiza la lista ordenada de enlaces de navegación aplicando clases condicionales
 *   de acuerdo al estado de activación (`active`).
 * - **¿Cómo interactúa con el sistema en general?**: Es compartido por `AppNav` (con ruta activa) y `AppNavFallback` (sin ruta activa).
 * - **¿Cuál es su importancia?**: Reutiliza la lógica de marcado HTML y estilos en ambos estados, eliminando código duplicado.
 */
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

/**
 * Componente AppNav: Barra de navegación interactiva en el cliente.
 *
 * - **¿Qué hace?**: Obtiene la ruta actual mediante el hook `usePathname()` de Next.js y renderiza los enlaces
 *   con resaltado de sección activa.
 * - **¿Cómo interactúa con el sistema en general?**: Se monta dentro de `AppLayout`. Al utilizar `usePathname()`,
 *   Next.js puede suspender en rutas dinámicas, por lo que se ejecuta dentro de un límite `<Suspense>`.
 * - **¿Cuál es su importancia?**: Proporciona orientación visual inmediata sobre en qué sección de la plataforma
 *   se encuentra navegando el usuario.
 */
export function AppNav({ className }: { className?: string }) {
  return <NavLinks pathname={usePathname()} className={className} />;
}

/**
 * Componente AppNavFallback: Estado de reserva para SSR y rutas suspendidas.
 *
 * - **¿Qué hace?**: Renderiza los mismos enlaces de navegación con `pathname = null` (sin ninguna sección resaltada).
 * - **¿Cómo interactúa con el sistema en general?**: Es el fallback directo de `<Suspense fallback={<AppNavFallback />}>` en `AppLayout`.
 * - **¿Cuál es su importancia?**: En rutas con parámetros dinámicos (como `/zones/[id]`), `usePathname()` suspende durante
 *   la generación estática inicial (`next build`). Si no se proveyera este fallback dentro de un Suspense boundary,
 *   la compilación del proyecto fallaría.
 */
export function AppNavFallback({ className }: { className?: string }) {
  return <NavLinks pathname={null} className={className} />;
}
