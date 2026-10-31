"use client";

import { useSyncExternalStore } from "react";
import { cn } from "../cn";
import { THEME_STORAGE_KEY, type Theme } from "./theme";

// El tema vive en <html data-theme>. Se lee con useSyncExternalStore para que
// el botón se actualice si el atributo cambia (por este u otro botón).
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const getTheme = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");
// En el servidor no se conoce el tema: el botón se pinta neutro y se corrige al hidratar
const getServerTheme = (): Theme | null => null;

function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Navegación privada o almacenamiento bloqueado: el tema aplica solo a esta visita
  }
}

/** Botón para alternar entre modo claro y oscuro. */
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
        // Sol
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-5" aria-hidden>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        // Luna
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden>
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}
