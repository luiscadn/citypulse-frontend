import { Container, RouteLoading } from "@/shared/presentation/components";

/**
 * Componente ProfileLoading: Indicador de carga para la vista de perfil de usuario.
 *
 * - **¿Qué hace?**: Muestra el componente `RouteLoading` con el mensaje "Cargando tu perfil" dentro del `Container`.
 * - **¿Cómo interactúa con el sistema en general?**: Es activado por Next.js automáticamente mientras se obtiene
 *   el usuario autenticado y su estado 2FA en `src/app/(app)/profile/page.tsx`.
 * - **¿Cuál es su importancia?**: Ofrece retroalimentación visual al usuario mientras la información de su cuenta
 *   se recupera del servidor, mejorando la percepción de rendimiento.
 */
export default function ProfileLoading() {
  return (
    <Container className="flex flex-1 flex-col">
      <RouteLoading label="Cargando tu perfil" />
    </Container>
  );
}
