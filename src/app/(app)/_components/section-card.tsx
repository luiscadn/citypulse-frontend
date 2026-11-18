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
      <Card className="flex h-full flex-col gap-1.5 p-5 transition-colors group-hover:border-primary">
        <span className="flex items-center gap-2">
          <span className="text-base font-semibold text-ink group-hover:text-primary-strong">{title}</span>
          {badge}
        </span>
        <span className="text-sm text-ink-muted">{description}</span>
      </Card>
    </Link>
  );
}
