import Link from "next/link";
import type { ReactNode } from "react";
import { Card } from "@/shared/presentation/components";

/**
 * Componente SectionCard: Tarjeta interactiva de acceso a secciones en el home.
 *
 * - **¿Qué hace?**: Renderiza un enlace `next/link` estilizado como una tarjeta `Card` que reacciona al hover
 *   cambiando el color del borde y del título hacia los colores primarios de la marca. Admite un `badge` opcional.
 * - **¿Cómo interactúa con el sistema en general?**: Se renderiza en la cuadrícula de inicio (`src/app/(app)/page.tsx`)
 *   para cada elemento del arreglo `SECTIONS` y en `AdminSectionCard`.
 * - **¿Cuál es su importancia?**: Ofrece una vía de navegación táctil y visualmente atractiva con retroalimentación inmediata,
 *   optimizada para accesibilidad mediante foco de teclado (`focus-visible`).
 */
export function SectionCard({
  href,
  title,
  description,
  badge,
}: {
  href: string;
  title: string;
  description: string;
  badge?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-ring"
    >
      <Card
        className={
          "relative flex h-full flex-col gap-1.5 overflow-hidden p-5 " +
          "group-hover:-translate-y-1 group-hover:border-accent group-hover:shadow-[0_14px_30px_-14px_var(--accent)]"
        }
      >
        {/* Barra azul → verde que se despliega arriba al pasar el cursor */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-linear-to-r from-primary to-accent transition-transform duration-500 ease-out group-hover:scale-x-100"
        />
        <span className="flex items-center gap-2">
          <span className="text-base font-semibold text-ink transition-colors group-hover:text-accent-strong">
            {title}
          </span>
          {badge}
          <span
            aria-hidden
            className="ml-auto -translate-x-2 text-accent-strong opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
          >
            →
          </span>
        </span>
        <span className="text-sm text-ink-muted">{description}</span>
      </Card>
    </Link>
  );
}
