"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/presentation/cn";

/** Secciones de la app. Para agregar una, basta con sumarla aquí. */
const LINKS = [
  { href: "/friends", label: "Amigos" },
  { href: "/invitations", label: "Invitaciones" },
  { href: "/zones", label: "Zonas" },
] as const;

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Enlaces del encabezado; marca la sección en la que está la persona. */
export function AppNav({ className }: { className?: string }) {
  const pathname = usePathname();

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
