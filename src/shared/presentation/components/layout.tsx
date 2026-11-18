import type { ComponentProps, ReactNode } from "react";
import { cn } from "../cn";

/**
 * Componente Container: Contenedor responsivo centrado.
 *
 * - **¿Qué hace?**: Aplica un ancho máximo (`max-w-6xl`) y espaciados laterales adaptativos (`px-4 sm:px-6`) para centrar el contenido en pantalla.
 * - **¿Cómo interactúa con el sistema en general?**: Es el contenedor principal que envuelve las vistas en `src/app/(app)/...`.
 * - **¿Cuál es su importancia?**: Mantiene la cuadrícula y el alineamiento visual consistente en todas las páginas del sistema.
 */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)} {...props} />;
}

/**
 * Componente PageHeader: Encabezado estandarizado de página.
 *
 * - **¿Qué hace?**: Presenta el título principal de la vista (`title`), una descripción contextual opcional (`description`),
 *   un texto introductorio superior (`eyebrow`) y un espacio para acciones principales a la derecha (`actions`).
 * - **¿Cómo interactúa con el sistema en general?**: Se ubica al inicio de casi todas las páginas principales (`events/page.tsx`, `zones/page.tsx`, etc.).
 * - **¿Cuál es su importancia?**: Comunica claramente la jerarquía de la página y provee un punto fijo de acceso a acciones clave de creación.
 */
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
    <div className={cn("flex flex-col gap-4 py-8 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="flex flex-col gap-1.5">
        {eyebrow && (
          <p className="text-xs font-semibold tracking-wider text-primary-strong uppercase">{eyebrow}</p>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title}</h1>
        {description && <p className="max-w-2xl text-sm text-ink-muted sm:text-base">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

/**
 * Componente Card: Contenedor tipo tarjeta.
 *
 * - **¿Qué hace?**: Envuelve secciones con borde redondeado, fondo de superficie y sombra sutil.
 * - **¿Cómo interactúa con el sistema en general?**: Base de estructuración para formularios, resúmenes y paneles.
 * - **¿Cuál es su importancia?**: Delimita visualmente grupos de contenido relacionados dentro de una página.
 */
export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-lg border border-line bg-surface shadow-[0_1px_2px_rgb(30_31_38/0.04)]", className)}
      {...props}
    />
  );
}

/**
 * Componente CardHeader: Encabezado de una tarjeta.
 *
 * - **¿Qué hace?**: Muestra el título, descripción secundaria y acciones de cabecera con una línea divisoria inferior.
 * - **¿Cómo interactúa con el sistema en general?**: Se compone dentro de `Card`.
 * - **¿Cuál es su importancia?**: Estandariza la jerarquía de títulos y controles secundarios en paneles de la interfaz.
 */
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

/**
 * Componente CardBody: Cuerpo principal de una tarjeta.
 *
 * - **¿Qué hace?**: Aplica padding interno (`px-5 py-4`) al contenido central de la tarjeta.
 * - **¿Cómo interactúa con el sistema en general?**: Aloja los controles de formulario, tablas o párrafos informativos.
 * - **¿Cuál es su importancia?**: Asegura un espaciado uniforme y armónico en todo el layout de la tarjeta.
 */
export function CardBody({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("px-5 py-4", className)} {...props} />;
}

/**
 * Componente CardFooter: Pie de una tarjeta.
 *
 * - **¿Qué hace?**: Contenedor inferior alineado a la derecha con borde divisor superior para botones de acción.
 * - **¿Cómo interactúa con el sistema en general?**: Contiene botones de guardar, cancelar o avanzar.
 * - **¿Cuál es su importancia?**: Separa visualmente los controles de envío de los campos de entrada del formulario.
 */
export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center justify-end gap-2 border-t border-line px-5 py-3", className)}
      {...props}
    />
  );
}
