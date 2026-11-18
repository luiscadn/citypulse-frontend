import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "../cn";

const control =
  "w-full rounded-md border border-line-strong bg-surface px-3 text-sm text-ink " +
  "placeholder:text-ink-muted/70 transition-colors " +
  "focus:border-primary focus:outline-none focus:ring-4 focus:ring-focus-ring " +
  "disabled:cursor-not-allowed disabled:bg-neutral-soft disabled:text-ink-muted " +
  "read-only:bg-neutral-soft " +
  "aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/25";

/**
 * Componente Input: Campo de entrada de texto nativo estilizado.
 *
 * - **¿Qué hace?**: Renderiza un `<input>` con tipografía, bordes, estados de foco y estilos de error (`aria-invalid`).
 * - **¿Cómo interactúa con el sistema en general?**: Es la base de captura de texto en formularios de toda la aplicación.
 * - **¿Cuál es su importancia?**: Ofrece consistencia visual y soporte nativo para `name` e integración con Server Actions.
 */
export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, "h-10", className)} {...props} />;
}

/**
 * Componente Textarea: Área de texto multilínea nativa estilizada.
 *
 * - **¿Qué hace?**: Renderiza un `<textarea>` con alto ajustable y soporte de estilos de foco y error.
 * - **¿Cómo interactúa con el sistema en general?**: Usada en descripciones de eventos, reseñas o información de zonas.
 * - **¿Cuál es su importancia?**: Permite redactar textos extensos manteniendo los mismos estilos y tokens del diseño.
 */
export function Textarea({ className, rows = 4, ...props }: ComponentProps<"textarea">) {
  return <textarea rows={rows} className={cn(control, "py-2 leading-relaxed", className)} {...props} />;
}

/**
 * Componente Select: Menú desplegable nativo estilizado.
 *
 * - **¿Qué hace?**: Renderiza un `<select>` con un icono de chevron integrado como background SVG para aspecto moderno.
 * - **¿Cómo interactúa con el sistema en general?**: Empleado en selectores de estado, zonas y categorías.
 * - **¿Cuál es su importancia?**: Mantiene la accesibilidad y el comportamiento nativo en dispositivos móviles sin librerías pesadas.
 */
export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select className={cn(control, "h-10 appearance-none bg-no-repeat pr-9", className)} style={chevron} {...props}>
      {children}
    </select>
  );
}

// Flecha del <select> (SVG en línea, en el gris 1 de la paleta)
const chevron = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2388898c'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E\")",
  backgroundPosition: "right 0.6rem center",
  backgroundSize: "1.1rem",
};

type FieldProps = {
  label: ReactNode;
  /** Texto de ayuda bajo el control */
  hint?: ReactNode;
  /** Mensaje de error: marca el control como inválido */
  error?: string;
  required?: boolean;
  className?: string;
  children: (id: string, describedBy: string | undefined, invalid: boolean) => ReactNode;
};

/**
 * Componente Field: Envoltorio accesible para campos de formulario.
 *
 * - **¿Qué hace?**: Genera identificadores únicos con `useId()`, asocia etiquetas (`<label htmlFor>`),
 *   textos de ayuda (`hint`) y mensajes de error (`error`) mediante atributos WAI-ARIA (`aria-describedby`).
 * - **¿Cómo interactúa con el sistema en general?**: Es el componente contenedor utilizado por `TextField`, `SelectField` y `TextareaField`.
 * - **¿Cuál es su importancia?**: Garantiza conformidad con estándares de accesibilidad (WCAG) al asegurar que los lectores
 *   de pantalla anuncien inmediatamente la descripción y los errores asociados a cada control cuando el usuario se enfoca en él.
 */
export function Field({ label, hint, error, required, className, children }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
        {required && <span className="ml-0.5 text-danger-strong" aria-hidden>*</span>}
      </label>
      {children(id, describedBy, !!error)}
      {hint && !error && (
        <p id={hintId} className="text-xs text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs font-medium text-danger-strong">
          {error}
        </p>
      )}
    </div>
  );
}

type FieldShortcut = { label: ReactNode; hint?: ReactNode; error?: string };

/**
 * Componente TextField
 *
 * - **¿Qué hace?**: Combina `Field` con `Input` en un único componente de conveniencia para campos de texto.
 * - **¿Cómo interactúa con el sistema en general?**: Utilizado ampliamente en formularios de login, registro, eventos y zonas.
 * - **¿Cuál es su importancia?**: Reduce el código repetitivo en la definición de campos de formulario comunes.
 */
export function TextField({ label, hint, error, className, ...props }: FieldShortcut & ComponentProps<"input">) {
  return (
    <Field label={label} hint={hint} error={error} required={props.required} className={className}>
      {(id, describedBy, invalid) => (
        <Input id={id} aria-describedby={describedBy} aria-invalid={invalid || undefined} {...props} />
      )}
    </Field>
  );
}

/**
 * Componente TextareaField
 *
 * - **¿Qué hace?**: Combina `Field` con `Textarea` para áreas de texto con etiqueta y validación.
 * - **¿Cómo interactúa con el sistema en general?**: Usado para campos de descripción en formularios de creación y edición.
 * - **¿Cuál es su importancia?**: Automatiza la vinculación de accesibilidad y visualización de errores para campos multilínea.
 */
export function TextareaField({ label, hint, error, className, ...props }: FieldShortcut & ComponentProps<"textarea">) {
  return (
    <Field label={label} hint={hint} error={error} required={props.required} className={className}>
      {(id, describedBy, invalid) => (
        <Textarea id={id} aria-describedby={describedBy} aria-invalid={invalid || undefined} {...props} />
      )}
    </Field>
  );
}

/**
 * Componente SelectField
 *
 * - **¿Qué hace?**: Combina `Field` con `Select` para listas desplegables con etiqueta y errores.
 * - **¿Cómo interactúa con el sistema en general?**: Usado en selección de zonas, orígenes de eventos o categorías.
 * - **¿Cuál es su importancia?**: Centraliza la accesibilidad y estilos en menús de opciones en toda la aplicación.
 */
export function SelectField({ label, hint, error, className, ...props }: FieldShortcut & ComponentProps<"select">) {
  return (
    <Field label={label} hint={hint} error={error} required={props.required} className={className}>
      {(id, describedBy, invalid) => (
        // Tras una Server Action, React reinicia el formulario y un <select> vuelve a la opción
        // con la que se montó, no al defaultValue nuevo. La key lo vuelve a montar cuando cambia.
        <Select
          key={String(props.defaultValue ?? "")}
          id={id}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          {...props}
        />
      )}
    </Field>
  );
}
