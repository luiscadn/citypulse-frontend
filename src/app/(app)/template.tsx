/**
 * =================================================================================================
 * [PALABRAS CLAVE / COMMAND + F]: VIEWTRANSITION, TRANSICIONES DE PÁGINA, TEMPLATE VS LAYOUT,
 * ANIMACIONES NAVEGACIÓN, PAGE-ENTER, PAGE-EXIT, REACT 19 VIEW TRANSITIONS
 * =================================================================================================
 *
 * Plantilla de Envoltorio de Rutas de la Aplicación (Next.js App Router Template)
 *
 * - **¿Por qué se usa template.tsx en vez de layout.tsx para las transiciones?**:
 *   Porque en Next.js los `layout` preservan estado y NO se remontan; los `template` crean una
 *   instancia nueva en cada cambio de ruta, disparando la animación de entrada/salida.
 */
import { ViewTransition } from "react";

/**
 * Plantilla de Envoltorio de Rutas de la Aplicación (Next.js App Router Template)
 *
 * - **¿Qué hace?**: Envuelve el contenido de cada página bajo el grupo `(app)` dentro del componente
 *   experimental `<ViewTransition>` de React 19, configurando animaciones de entrada (`page-enter`)
 *   y salida (`page-exit`) declaradas en `globals.css`.
 * - **¿Cómo interactúa con el sistema en general?**: Se ubica en la jerarquía del App Router entre `layout.tsx` y `page.tsx`.
 *   A diferencia de un `layout` (que preserva su estado e instancia entre cambios de ruta), un `template` se desmonta
 *   y se vuelve a montar en cada navegación interna.
 * - **¿Cuál es su importancia?**: Permite transiciones visuales fluidas (View Transitions API) al navegar entre vistas,
 *   reiniciando estados de animación y ofreciendo una sensación nativa tipo SPA sin requerir librerías externas de animación pesadas.
 */
export default function AppTemplate({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      <div className="flex flex-1 flex-col">{children}</div>
    </ViewTransition>
  );
}
