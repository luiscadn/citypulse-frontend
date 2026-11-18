import type { ReactNode } from "react";
import { cn } from "../cn";

/** Tonos semánticos disponibles para retroalimentación visual */
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

/**
 * Componente Badge (Insignia o Etiqueta)
 *
 * - **¿Qué hace?**: Muestra una cápsula de texto compacta para comunicar estados, categorías o roles
 *   (ej. "ADMIN", "CONFIRMADO", "OFICIAL"), con opción de incluir un punto de estado de color (`dot`).
 * - **¿Cómo interactúa con el sistema en general?**: Se utiliza en tablas, listas y cabeceras de detalle
 *   (`venue-status-badge.tsx`, estados de eventos, roles en administración de usuarios).
 * - **¿Cuál es su importancia?**: Sintetiza información crítica del estado de un recurso en un elemento visualmente
 *   rápido de escanear y estandarizado semánticamente por colores.
 */
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
      {dot && <span className={cn("size-1.5 rounded-full", dotTones[tone])} aria-hidden />}
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

/**
 * Componente Alert (Mensaje de retroalimentación o banner de notificación)
 *
 * - **¿Qué hace?**: Renderiza un contenedor destacado con borde coloreado para presentar avisos, errores de validación,
 *   o confirmaciones de éxito resultantes de una Server Action.
 * - **¿Cómo interactúa con el sistema en general?**: Se monta condicionalmente en formularios (`login-form.tsx`, `register-form.tsx`,
 *   `event-form.tsx`, `venue-form.tsx`) cuando el estado de la acción (`state.message` o `state.error`) contiene un mensaje.
 * - **¿Cuál es su importancia?**: Asigna automáticamente roles de accesibilidad (`role="alert"` para peligro y `role="status"` para otros),
 *   asegurando que los lectores de pantalla anuncien inmediatamente el resultado de la acción al usuario.
 */
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
      className={cn("rounded-md border px-4 py-3 text-sm", alertTones[tone], className)}
    >
      {title && <p className="font-semibold">{title}</p>}
      {children && <div className={cn(title ? "mt-0.5" : undefined, "opacity-95")}>{children}</div>}
    </div>
  );
}

/**
 * Componente EmptyState (Estado vacío)
 *
 * - **¿Qué hace?**: Renderiza una interfaz explicativa cuando una consulta o listado no contiene registros
 *   (ej. "No hay eventos en esta fecha", "No tienes solicitudes pendientes").
 * - **¿Cómo interactúa con el sistema en general?**: Se muestra en las pantallas de listados (`event-list.tsx`, `venue-list.tsx`,
 *   `invitation-inbox.tsx`, `friend-search-results.tsx`) cuando el arreglo de datos está vacío.
 * - **¿Cuál es su importancia?**: Evita pantallas en blanco desorientadoras ("white screen of silence"), orientando al usuario
 *   sobre por qué no hay datos y qué acción puede tomar para continuar (ej. cambiar filtros o crear el primer recurso).
 */
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
        "flex flex-col items-center gap-3 rounded-lg border border-dashed border-line-strong px-6 py-12 text-center",
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
