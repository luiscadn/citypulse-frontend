"use client";

import { useSyncExternalStore } from "react";
import { cn } from "../cn";
import { THEME_STORAGE_KEY, type Theme } from "./theme";

/**
 * Función subscribe para ThemeToggle
 *
 * - **¿Qué hace?**: Registra un `MutationObserver` sobre `document.documentElement` para escuchar cambios
 *   específicamente en el atributo `data-theme`. Cuando ocurre una mutación, invoca el callback `onChange`.
 * - **¿Cómo interactúa con el sistema en general?**: Actúa como el suscriptor del hook `useSyncExternalStore` de React 19.
 * - **¿Cuál es su importancia?**: Permite que cualquier instancia del botón `ThemeToggle` en la interfaz se entere
 *   si otra instancia o script modificó el tema, manteniendo el icono y estado perfectamente sincronizados sin re-renderizar todo el árbol.
 */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

/** Obtiene el tema actual leyendo directamente el DOM (`data-theme`). */
const getTheme = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

/** Snapshot para SSR: en el servidor no se conoce el tema, retornando `null` para evitar mismatch en hidratación inicial. */
const getServerTheme = (): Theme | null => null;

/**
 * Función setTheme
 *
 * - **¿Qué hace?**: Asigna el nuevo valor de tema al atributo `data-theme` del HTML e intenta persistirlo en `localStorage`.
 * - **¿Cómo interactúa con el sistema en general?**: Se ejecuta al hacer clic en el botón `ThemeToggle`.
 * - **¿Cuál es su importancia?**: Actualiza instantáneamente las variables CSS de la aplicación y almacena la preferencia
 *   para futuras visitas, controlando fallos potenciales en modos de navegación privada o almacenamiento bloqueado.
 */
function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Modo incógnito o cookies/localStorage deshabilitados: se mantiene el tema solo en memoria de sesión
  }
}

/**
 * Componente ThemeToggle: Botón accesible para alternar entre modo claro y oscuro.
 *
 * - **¿Qué hace?**: Renderiza un botón interactivo con iconos SVG animados (Sol / Luna) que alterna entre los modos `"light"` y `"dark"`.
 * - **¿Cómo interactúa con el sistema en general?**: Se integra en la barra de navegación principal (`AppNav`) y en vistas públicas.
 *   Utiliza `useSyncExternalStore` para reaccionar a cambios en el DOM sin provocar desajustes entre SSR y cliente.
 * - **¿Cuál es su importancia?**: Mejora la accesibilidad y la experiencia de usuario (UX), permitiendo personalizar la interfaz
 *   según las condiciones de iluminación del usuario y respetando los lineamientos de contraste.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore<Theme | null>(subscribe, getTheme, getServerTheme);
  const isDark = theme === "dark";
  const label = isDark ? "Activar modo claro" : "Activar modo oscuro";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
      className={cn(
        "grid size-9 place-items-center rounded-md text-ink-muted transition-colors",
        "hover:bg-neutral-soft hover:text-ink",
        "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-ring",
        className,
      )}
    >
      {theme === null ? (
        <span className="size-5" aria-hidden />
      ) : isDark ? (
        // Icono Sol para cambiar a modo claro
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-5" aria-hidden>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        // Icono Luna para cambiar a modo oscuro
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden>
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}
