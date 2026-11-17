import type { ReactNode } from "react";
import { cn } from "../cn";
import { ButtonLink } from "./button";
import { Spinner } from "./spinner";

/** Contenido de un loading.tsx: spinner centrado mientras la ruta carga sus datos. */
export function RouteLoading({ label = "Cargando" }: { label?: string }) {
  return (
    <div className="grid min-h-64 flex-1 place-items-center text-primary">
      <Spinner size="lg" label={label} />
    </div>
  );
}

/** Esqueleto de una página de listado: encabezado y tarjetas con brillo mientras llegan los datos. */
export function PageSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div role="status" aria-label="Cargando" className="animate-fade flex flex-col gap-6 py-8">
      <div className="flex flex-col gap-3">
        <div className="skeleton h-3 w-24" />
        <div className="skeleton h-8 w-64 max-w-full" />
        <div className="skeleton h-4 w-96 max-w-full" />
      </div>
      <div className="stagger grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cards }, (_, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-lg border border-line bg-surface p-5">
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-3 w-1/2" />
            <div className="skeleton h-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Contenido de un not-found.tsx: avisa que no existe lo que se buscaba y ofrece volver. */
export function NotFoundState({
  title = "No encontramos lo que buscas",
  description = "La página no existe o no tienes acceso a ella.",
  action,
  className,
}: {
  title?: ReactNode;
  description?: ReactNode;
  /** Por defecto, un enlace al inicio */
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center", className)}>
      <p className="text-5xl font-bold tracking-tight text-primary">404</p>
      <h1 className="text-xl font-bold tracking-tight text-ink">{title}</h1>
      <p className="max-w-sm text-sm text-ink-muted">{description}</p>
      <div className="mt-2">{action ?? <ButtonLink href="/">Volver al inicio</ButtonLink>}</div>
    </div>
  );
}