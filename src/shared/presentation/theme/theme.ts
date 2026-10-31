/*
 * Tema claro/oscuro.
 * - El tema activo se marca en <html data-theme="light|dark">; los colores
 *   oscuros de globals.css cuelgan de ese atributo.
 * - La elección del usuario se guarda en localStorage. Si nunca eligió,
 *   se usa la preferencia del sistema operativo.
 */
export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "cp-theme";

/**
 * Script que corre ANTES de pintar la página (va en el <head>): aplica el
 * tema guardado o el del sistema, para que no haya un destello de tema claro.
 * Es un string porque se inyecta tal cual en una etiqueta <script>.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}})();`;
