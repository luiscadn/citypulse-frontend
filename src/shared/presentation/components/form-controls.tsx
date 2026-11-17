import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "../cn";

/*
 * Controles de formulario. Son elementos nativos (<input>, <select>, <textarea>)
 * con estilo: funcionan directo con Server Actions usando `name`.
 *
 * Uso típico:
 *   <Field label="Correo" error={state.errors?.email}>
 *     {(id, describedBy) => <Input id={id} aria-describedby={describedBy} name="email" />}
 *   </Field>
 * o, más corto, los atajos <TextField>, <SelectField>, <TextareaField>.
 */

const control =
  "w-full rounded-md border border-line-strong bg-surface px-3 text-sm text-ink " +
  "placeholder:text-ink-muted/70 transition-colors " +
  "focus:border-primary focus:outline-none focus:ring-4 focus:ring-focus-ring " +
  "disabled:cursor-not-allowed disabled:bg-neutral-soft disabled:text-ink-muted " +
  "read-only:bg-neutral-soft " +
  "aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/25";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, "h-10", className)} {...props} />;
}

export function Textarea({ className, rows = 4, ...props }: ComponentProps<"textarea">) {
  return <textarea rows={rows} className={cn(control, "py-2 leading-relaxed", className)} {...props} />;
}

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

/** Etiqueta + control + ayuda/error, con los atributos de accesibilidad conectados. */
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

export function TextField({ label, hint, error, className, ...props }: FieldShortcut & ComponentProps<"input">) {
  return (
    <Field label={label} hint={hint} error={error} required={props.required} className={className}>
      {(id, describedBy, invalid) => (
        <Input id={id} aria-describedby={describedBy} aria-invalid={invalid || undefined} {...props} />
      )}
    </Field>
  );
}

export function TextareaField({ label, hint, error, className, ...props }: FieldShortcut & ComponentProps<"textarea">) {
  return (
    <Field label={label} hint={hint} error={error} required={props.required} className={className}>
      {(id, describedBy, invalid) => (
        <Textarea id={id} aria-describedby={describedBy} aria-invalid={invalid || undefined} {...props} />
      )}
    </Field>
  );
}

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
