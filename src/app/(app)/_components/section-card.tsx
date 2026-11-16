import Link from "next/link";
import type { ReactNode } from "react";
import { Card } from "@/shared/presentation/components";

/** Tarjeta de acceso a una sección de la app, para la página de inicio. */
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