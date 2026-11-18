import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../cn";
import { Spinner } from "./spinner";

/** Variantes visuales para botones de acción */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
/** Tamaños soportados para botones */
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold whitespace-nowrap " +
  "transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out " +
  "active:scale-[0.97] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-ring " +
  "disabled:pointer-events-none disabled:opacity-55";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-on-primary shadow-[0_1px_2px_rgb(0_0_0/0.12)] hover:-translate-y-px hover:bg-primary-hover " +
    "hover:shadow-[0_8px_22px_-8px_var(--primary)]",
  secondary: "border border-line-strong bg-surface text-ink hover:border-accent hover:bg-accent-soft/50",
  ghost: "text-ink hover:bg-neutral-soft",
  danger: "bg-danger text-on-danger hover:opacity-90",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

/**
 * Función buttonClasses
 *
 * - **¿Qué hace?**: Genera la cadena de clases de Tailwind combinando estilos base, la variante de color,
 *   el tamaño y clases personalizadas opcionales.
 * - **¿Cómo interactúa con el sistema en general?**: Es utilizada por los componentes `Button`, `ButtonLink` y por
 *   enlaces estilizados como botones en diversas vistas del sistema.
 * - **¿Cuál es su importancia?**: Centraliza el sistema de diseño visual de botones, garantizando que tanto los `<button>`
 *   interactivos como los enlaces `<a>` compartan exactamente los mismos estilos y estados visuales (hover, focus, disabled).
 */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Muestra un spinner y deshabilita el botón */
  loading?: boolean;
  /** Ícono a la izquierda del texto */
  icon?: ReactNode;
};

/**
 * Componente Button
 *
 * - **¿Qué hace?**: Renderiza un botón HTML estándar accesible con variantes visuales (`primary`, `secondary`, `ghost`, `danger`),
 *   soporte para estado de carga (`loading`) que intercambia el icono por un `Spinner`, y estados de deshabilitado.
 * - **¿Cómo interactúa con el sistema en general?**: Es el componente de interacción primaria utilizado en todos los formularios,
 *   diálogos de confirmación y desencadenadores de Server Actions a lo largo de toda la aplicación.
 * - **¿Cuál es su importancia?**: Mejora la experiencia de usuario y accesibilidad (gestiona `aria-busy`, deshabilita clics duplicados
 *   mientras `loading` está activo) y estandariza la interacción con el usuario en acciones críticas o destructivas.
 */
export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  className,
  disabled,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClasses(variant, size, className)}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : icon}
      {children}
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

/**
 * Componente ButtonLink
 *
 * - **¿Qué hace?**: Renderiza un enlace de Next.js (`next/link`) con la apariencia visual de un botón pero manteniendo
 *   la semántica y capacidades de navegación cliente del framework.
 * - **¿Cómo interactúa con el sistema en general?**: Utilizado para llamadas a la acción que navegan a otras pantallas
 *   (ej. "Crear Evento", "Explorar Zonas", "Volver al inicio").
 * - **¿Cuál es su importancia?**: Mantiene la semántica HTML correcta (enlaces para navegar, botones para mutaciones)
 *   evitando que los motores de búsqueda y lectores de pantalla confundan navegación con acciones de servidor.
 */
export function ButtonLink({ variant = "primary", size = "md", className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />;
}
