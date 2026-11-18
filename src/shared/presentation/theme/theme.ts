/**
 * Tipo Theme: Modos de apariencia admitidos por la aplicación.
 *
 * - **¿Qué hace?**: Restringe los temas válidos a `"light"` (modo claro) o `"dark"` (modo oscuro).
 * - **¿Cómo interactúa con el sistema en general?**: Se sincroniza con el atributo HTML `data-theme` en `<html data-theme="...">`,
 *   las variables CSS de `src/app/globals.css`, y el componente selector `ThemeToggle`.
 * - **¿Cuál es su importancia?**: Ofrece consistencia de tipos en el manejo de personalización visual de la plataforma.
 */
export type Theme = "light" | "dark";

/**
 * Constante THEME_STORAGE_KEY: Llave de persistencia en almacenamiento local (`"cp-theme"`).
 *
 * - **¿Qué hace?**: Define el identificador con el que se almacena y recupera la preferencia del usuario en `localStorage`.
 * - **¿Cómo interactúa con el sistema en general?**: Es compartida por el script de inicialización temprana (`themeInitScript`)
 *   y la función `setTheme` del componente `ThemeToggle`.
 * - **¿Cuál es su importancia?**: Evita discrepancias en el almacenamiento local y garantiza la persistencia entre sesiones y pestañas.
 */
export const THEME_STORAGE_KEY = "cp-theme";

/**
 * Constante themeInitScript: Script inline de ejecución inmediata y sincrónica para el `<head>`.
 *
 * - **¿Qué hace?**: Lee inmediatamente la preferencia en `localStorage` o consulta la media query del sistema (`prefers-color-scheme: dark`)
 *   y aplica el valor resultante al atributo `document.documentElement.dataset.theme` antes de que el navegador comience a renderizar el DOM.
 * - **¿Cómo interactúa con el sistema en general?**: Se inyecta en el layout raíz de Next.js (`src/app/layout.tsx`) dentro de una etiqueta `<script>`.
 * - **¿Cuál es su importancia?**: Resuelve el problema del "Flash of Unstyled/Incorrect Theme" (FOUC). Si se hiciera dentro de un `useEffect`
 *   en React, el usuario vería una pantalla blanca o un parpadeo molesto antes de cargarse el modo oscuro.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}})();`;
