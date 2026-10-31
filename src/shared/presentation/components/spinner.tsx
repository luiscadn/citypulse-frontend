import { cn } from "../cn";

const sizes = { sm: "size-4 border-2", md: "size-6 border-2", lg: "size-10 border-[3px]" };

export function Spinner({
  size = "md",
  label = "Cargando",
  className,
}: {
  size?: keyof typeof sizes;
  /** Texto para lectores de pantalla */
  label?: string;
  className?: string;
}) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "inline-block animate-spin rounded-full border-current border-r-transparent",
        sizes[size],
        className,
      )}
    />
  );
}
