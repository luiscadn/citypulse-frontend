import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/presentation/components/auth-shell";
import { RegisterForm } from "@/features/auth/presentation/components/register-form";
import { ButtonLink } from "@/shared/presentation/components";

/** Metadata para la pantalla de registro */
export const metadata: Metadata = { title: "Crear cuenta" };

/**
 * Componente RegisterPage: Página de autoregistro de nuevos usuarios.
 *
 * - **¿Qué hace?**: Renderiza el contenedor estilizado `AuthShell` junto al formulario interactivo `RegisterForm`,
 *   y un botón secundario que permite alternar hacia el formulario de inicio de sesión (`/login`).
 * - **¿Cómo interactúa con el sistema en general?**: Conecta con el flujo de registro de la capa de autenticación
 *   (`RegisterUseCase` / `registerAction`) para permitir que nuevos visitantes creen una cuenta con rol base `USER`.
 * - **¿Cuál es su importancia?**: Facilita la incorporación ("onboarding") de nuevos miembros a la comunidad
 *   de CityPulse mediante un formulario accesible con validación en servidor y cliente.
 */
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
