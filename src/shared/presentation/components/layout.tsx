import type { ComponentProps, ReactNode } from "react";
import { cn } from "../cn";

/** Contenedor de página: ancho máximo y márgenes laterales consistentes. */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)} {...props} />;
}

/** Encabezado de página: título, descripción y acciones a la derecha. */
export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  /** Botones a la derecha (p. ej. "Reportar evento") */
  actions?: ReactNode;
  /** Texto pequeño sobre el título (sección, migas de pan) */
  eyebrow?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("animate-rise flex flex-col gap-4 py-8 sm:flex-row sm:items-end sm:justify-between", className)}
    >
      <div className="flex flex-col gap-1.5">
        {eyebrow && (
          <p className="text-xs font-semibold tracking-wider text-primary-strong uppercase">{eyebrow}</p>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title}</h1>
        <span aria-hidden className="mt-1 h-1 w-12 origin-left animate-rise rounded-full bg-linear-to-r from-primary to-accent" />
        {description && <p className="max-w-2xl text-sm text-ink-muted sm:text-base">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

/** Tarjeta: agrupa contenido sobre una superficie con borde. */
export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "animate-rise rounded-lg border border-line bg-surface shadow-[0_1px_2px_rgb(0_0_0/0.04)]",
        "transition-[border-color,box-shadow,transform] duration-300 ease-out",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  title,
  description,
  actions,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4 border-b border-line px-5 py-4", className)}>
      <div className="flex flex-col gap-0.5">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        {description && <p className="text-sm text-ink-muted">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

export function CardBody({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("px-5 py-4", className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center justify-end gap-2 border-t border-line px-5 py-3", className)}
      {...props}
    />
  );
}
