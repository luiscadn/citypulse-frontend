import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../cn";
import { Spinner } from "./spinner";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
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

/** Clases de botón, para aplicarlas a otros elementos (p. ej. un <Link>). */
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

/** Enlace con aspecto de botón (navegación, no acciones). */
export function ButtonLink({ variant = "primary", size = "md", className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />;
}
