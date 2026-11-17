import type { ReactNode } from "react";
import { cn } from "../cn";

export type Tone = "neutral" | "primary" | "success" | "danger" | "warning" | "info";

const badgeTones: Record<Tone, string> = {
  neutral: "bg-neutral-soft text-neutral-strong",
  primary: "bg-primary-soft text-primary-strong",
  success: "bg-success-soft text-success-strong",
  danger: "bg-danger-soft text-danger-strong",
  warning: "bg-warning-soft text-warning-strong",
  info: "bg-info-soft text-info-strong",
};

const dotTones: Record<Tone, string> = {
  neutral: "bg-neutral-strong",
  primary: "bg-primary",
  success: "bg-success",
  danger: "bg-danger",
  warning: "bg-warning",
  info: "bg-info",
};

/** Etiqueta corta de estado o categoría. */
export function Badge({
  tone = "neutral",
  dot = false,
  className,
  children,
}: {
  tone?: Tone;
  /** Punto de color antes del texto */
  dot?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        badgeTones[tone],
        className,
      )}
    >
      {dot &&
        (tone === "success" ? (
          <span className="pulse-dot size-1.5!" aria-hidden />
        ) : (
          <span className={cn("size-1.5 rounded-full", dotTones[tone])} aria-hidden />
        ))}
      {children}
    </span>
  );
}

const alertTones: Record<Exclude<Tone, "neutral" | "primary">, string> = {
  success: "border-success/40 bg-success-soft text-success-strong",
  danger: "border-danger/40 bg-danger-soft text-danger-strong",
  warning: "border-warning/40 bg-warning-soft text-warning-strong",
  info: "border-info/40 bg-info-soft text-info-strong",
};

/** Mensaje destacado (resultado de una acción, error, aviso). */
export function Alert({
  tone = "info",
  title,
  className,
  children,
}: {
  tone?: keyof typeof alertTones;
  title?: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn("animate-pop rounded-md border px-4 py-3 text-sm", alertTones[tone], className)}
    >
      {title && <p className="font-semibold">{title}</p>}
      {children && <div className={cn(title ? "mt-0.5" : undefined, "opacity-95")}>{children}</div>}
    </div>
  );
}

/** Estado vacío de un listado: qué pasa y qué puede hacer el usuario. */
export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  /** Botón o enlace para salir del estado vacío */
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex animate-rise flex-col items-center gap-3 rounded-lg border border-dashed border-line-strong px-6 py-12 text-center",
        className,
      )}
    >
      {icon && <div className="text-ink-muted">{icon}</div>}
      <p className="text-base font-semibold text-ink">{title}</p>
      {description && <p className="max-w-sm text-sm text-ink-muted">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
