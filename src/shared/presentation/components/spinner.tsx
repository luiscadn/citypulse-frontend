import { cn } from "../cn";

const sizes = { sm: "size-4 border-2", md: "size-6 border-2", lg: "size-10 border-[3px]" };

/**
 * Componente Spinner: Indicador de carga animado accesible.
 *
 * - **¿Qué hace?**: Renderiza un círculo giratorio CSS con borde transparente parcial en diferentes tamaños (`sm`, `md`, `lg`)
 *   e incorpora roles de accesibilidad (`role="status"` y `aria-label`).
 * - **¿Cómo interactúa con el sistema en general?**: Se integra dentro de botones en estado de carga (`Button`),
 *   pantallas de transición (`RouteLoading`), y componentes con carga diferida o interactiva (búsqueda de lugares, invitaciones).
 * - **¿Cuál es su importancia?**: Proporciona retroalimentación visual inmediata durante operaciones asíncronas, evitando que el usuario
 *   perciba la aplicación como congelada o intente clics repetidos, cumpliendo además con estándares de accesibilidad para lectores de pantalla.
 */
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
