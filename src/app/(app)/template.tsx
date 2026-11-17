import { ViewTransition } from "react";

/**
 * A diferencia del layout, el template se vuelve a montar en cada navegación: aquí el
 * contenido sale desvaneciéndose y la página nueva entra subiendo (estilos en globals.css).
 */
export default function AppTemplate({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div className="flex flex-1 flex-col">{children}</div>
    </ViewTransition>
  );
}
