import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/presentation/components/auth-shell";
import { RegisterForm } from "@/features/auth/presentation/components/register-form";
import { ButtonLink } from "@/shared/presentation/components";

export const metadata: Metadata = { title: "Crear cuenta" };

export default function RegisterPage() {
  return (
    <AuthShell
      title="Crea tu cuenta"
      description="Únete a CityPulse para reportar y descubrir lo que pasa en tu ciudad."
    >
      <RegisterForm />

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 text-xs text-ink-muted">
          <span className="h-px flex-1 bg-line" />
          ¿Ya tienes cuenta?
          <span className="h-px flex-1 bg-line" />
        </div>
        <ButtonLink href="/login" variant="secondary" size="lg" className="w-full">
          Iniciar sesión
        </ButtonLink>
      </div>
    </AuthShell>
  );
}