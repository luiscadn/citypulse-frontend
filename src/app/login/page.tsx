import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/features/auth/presentation/components/auth-shell";
import { LoginForm } from "@/features/auth/presentation/components/login-form";
import { ButtonLink, Spinner } from "@/shared/presentation/components";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default function LoginPage() {
  return (
    <AuthShell
      title="Bienvenido de nuevo"
      description="Inicia sesión con tu cuenta de CityPulse para continuar."
    >
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