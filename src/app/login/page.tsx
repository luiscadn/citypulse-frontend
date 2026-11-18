import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/features/auth/presentation/components/auth-shell";
import { LoginForm } from "@/features/auth/presentation/components/login-form";
import { ButtonLink, Spinner } from "@/shared/presentation/components";

/** Metadata específica para la pantalla de inicio de sesión */
export const metadata: Metadata = { title: "Iniciar sesión" };

/**
 * Componente LoginPage: Página de autenticación de usuarios.
 *
 * - **¿Qué hace?**: Renderiza el cascarón visual de autenticación (`AuthShell`), el formulario de login (`LoginForm`)
 *   y un enlace de navegación secundaria hacia el registro de nuevas cuentas (`/register`).
 *   Envuelve a `LoginForm` dentro de un límite de `Suspense` con un `Spinner` de fallback.
 * - **¿Cómo interactúa con el sistema en general?**: Al usar `useSearchParams()` internamente en `LoginForm` para
 *   leer el parámetro de redirección previa (`?from=...`), Next.js requiere obligatoriamente envolver el componente
 *   en `<Suspense>` para evitar la desactivación del prerenderizado estático de la página.
 * - **¿Cuál es su importancia?**: Es el punto neurálgico de acceso al sistema. Garantiza una carga progresiva fluida,
 *   preserva la ruta que el usuario intentaba visitar originalmente y cumple con los requerimientos de compilación de Next.js App Router.
 */
export default function LoginPage() {
  return (
    <AuthShell
      title="Bienvenido de nuevo"
      description="Inicia sesión con tu cuenta de CityPulse para continuar."
    >
      <Suspense
        fallback={
          <div className="grid h-64 place-items-center text-primary">
            <Spinner />
          </div>
        }
      >
        <LoginForm />
      </Suspense>

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
    </AuthShell>
  );
}
