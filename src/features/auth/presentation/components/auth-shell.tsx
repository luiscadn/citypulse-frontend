/**
 * @file auth-shell.tsx
 * @description Layout envolvente para las pantallas de autenticación (Login y Registro).
 * Presenta un panel de marca con ilustración y propuesta de valor en desktop, y el formulario centrado.
 */

import type { ReactNode } from "react";
import { BrandMark, ThemeToggle } from "@/shared/presentation/components";

/** Aspectos destacados de la plataforma cultural mostrados en el panel lateral. */
const highlights = [
  "Reporta lo que pasa en tu ciudad, con evidencias.",
  "Consulta eventos verificados por zona y lugar.",
  "Invita a tus amigos y confirma tu asistencia.",
];

/**
 * Cascarón visual para las vistas públicas de login y registro fuera del layout principal de la app.
 *
 * - **¿Qué hace?**:
 *   Estructura una pantalla completa en dos columnas en pantallas grandes (panel de marca con fondo degradado a la izquierda,
 *   y formulario interactivo a la derecha con conmutador de tema y encabezado).
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Utilizado en `src/app/login/page.tsx` y `src/app/register/page.tsx`.
 *
 * - **¿Cuál es su importancia?**:
 *   Garantiza coherencia de marca, diseño responsivo y una experiencia visual atractiva y profesional para nuevos usuarios y visitantes.
 */
export function AuthShell({
  title,
  description,
  children,
}: {
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="grid min-h-dvh flex-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      {/* Panel de marca (solo en pantallas grandes) */}
      <section className="relative isolate hidden overflow-hidden text-white lg:flex lg:flex-col lg:justify-between lg:px-14 lg:py-12">
        {/* Degradado de fondo en una capa aparte que se desliza con transform (no repinta) */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 -z-10 h-[200%] w-[200%] animate-pan bg-linear-135 from-brand via-brand to-brand-purple will-change-transform [--pan-y:-25%]"
        />
        <div aria-hidden className="pointer-events-none absolute -top-28 -right-28 size-[26rem] animate-float rounded-full bg-white/10" />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-24 size-[30rem] animate-float rounded-full bg-brand-green/35 blur-2xl [animation-delay:-5s]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/3 right-10 size-40 animate-float rounded-full bg-white/10 blur-xl [animation-delay:-9s]"
        />

        <BrandMark inverse className="relative" />

        <div className="relative flex max-w-md flex-col gap-8">
          <h2 className="text-[2.6rem] leading-[1.15] font-bold tracking-tight text-balance">
            El pulso de tu ciudad, verificado por su gente.
          </h2>
          <ul className="stagger flex flex-col gap-4">
            {highlights.map((text) => (
              <li key={text} className="flex items-start gap-3 text-base leading-relaxed text-white/90">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand-green/70 ring-1 ring-white/30">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="size-3.5" aria-hidden>
                    <path
                      fillRule="evenodd"
                      d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.4L8 12.58l7.3-7.3a1 1 0 011.4 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs leading-relaxed text-white/70">
          Proyecto académico · Computación en Internet III
        </p>
      </section>

      {/* Formulario */}
      <section className="relative flex flex-col px-6 py-8 sm:px-10">
        <div className="flex items-center justify-between lg:justify-end">
          <BrandMark className="lg:hidden" />
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="flex w-full max-w-sm animate-rise flex-col gap-8">
            <header className="flex flex-col gap-2">
              <h1 className="text-3xl leading-tight font-bold tracking-tight text-ink">{title}</h1>
              <p className="text-sm leading-relaxed text-ink-muted">{description}</p>
            </header>
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
