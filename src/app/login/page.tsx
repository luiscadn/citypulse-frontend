import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth/presentation/components/login-form";
import { BrandMark, ButtonLink, Spinner, ThemeToggle } from "@/shared/presentation/components";

export const metadata: Metadata = { title: "Iniciar sesión" };

const highlights = [
  "Reporta lo que pasa en tu ciudad, con evidencias.",
  "Consulta eventos verificados por zona y lugar.",
  "Invita a tus amigos y confirma tu asistencia.",
];

// Pantalla completa, sin el encabezado de la app (está fuera del grupo (app))
export default function LoginPage() {
  return (
    <main className="grid min-h-dvh flex-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
      {/* Panel de marca (solo en pantallas grandes) */}
      <section className="relative hidden overflow-hidden bg-brand text-white lg:flex lg:flex-col lg:justify-between lg:px-14 lg:py-12">
        <div aria-hidden className="pointer-events-none absolute -top-28 -right-28 size-[26rem] rounded-full bg-white/10" />
        <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-24 size-[30rem] rounded-full bg-black/10" />

        <BrandMark inverse className="relative" />

        <div className="relative flex max-w-md flex-col gap-8">
          <h2 className="text-[2.6rem] leading-[1.15] font-bold tracking-tight text-balance">
            El pulso de tu ciudad, verificado por su gente.
          </h2>
          <ul className="flex flex-col gap-4">
            {highlights.map((text) => (
              <li key={text} className="flex items-start gap-3 text-base leading-relaxed text-white/90">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-white/20">
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
          <div className="flex w-full max-w-sm flex-col gap-8">
            <header className="flex flex-col gap-2">
              <h1 className="text-3xl leading-tight font-bold tracking-tight text-ink">Bienvenido de nuevo</h1>
              <p className="text-sm leading-relaxed text-ink-muted">
                Inicia sesión con tu cuenta de CityPulse para continuar.
              </p>
            </header>

            {/* LoginForm lee ?from= con useSearchParams: dato de la petición → Suspense */}
            <Suspense
              fallback={
                <div className="grid h-64 place-items-center text-primary">
                  <Spinner />
                </div>
              }
            >
              <LoginForm />
            </Suspense>

            {/* El formulario de /register lo implementa la feature de usuarios/auth (persona 5) */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-xs text-ink-muted">
                <span className="h-px flex-1 bg-line" />
                ¿Aún no tienes cuenta?
                <span className="h-px flex-1 bg-line" />
              </div>
              <ButtonLink href="/register" variant="secondary" size="lg" className="w-full">
                Crear una cuenta
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
