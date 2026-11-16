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