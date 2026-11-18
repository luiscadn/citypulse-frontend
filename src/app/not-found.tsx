import { NotFoundState } from "@/shared/presentation/components";

/**
 * Componente NotFound: Página de error 404 a nivel raíz de la aplicación.
 *
 * - **¿Qué hace?**: Renderiza el estado visual `NotFoundState` en pantalla completa (`min-h-dvh`).
 * - **¿Cómo interactúa con el sistema en general?**: Se activa automáticamente cuando el enrutador de Next.js
 *   no encuentra coincidencia con ninguna ruta del sistema o cuando se invoca `notFound()` fuera del grupo `(app)`.
 * - **¿Cuál es su importancia?**: Proporciona una respuesta visual limpia y estandarizada ante accesos a URLs inválidas
 *   sin romper la experiencia de usuario y ofreciendo un camino claro para regresar al inicio.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-1 flex-col">
      <NotFoundState />
    </main>
  );
}
