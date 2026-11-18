import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { themeInitScript } from "@/shared/presentation/theme/theme";

// Tipografía corporativa institucional
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Metadata global de la aplicación CityPulse
 *
 * - **¿Qué hace?**: Configura el título predeterminado, la plantilla dinámica de títulos (`%s · CityPulse`),
 *   y la descripción general para indexación y metadatos del navegador.
 * - **¿Cómo interactúa con el sistema en general?**: Es heredada por todas las páginas secundarias de la aplicación.
 * - **¿Cuál es su importancia?**: Mejora el posicionamiento SEO, la accesibilidad y la consistencia en las pestañas del navegador.
 */
export const metadata: Metadata = {
  title: { default: "CityPulse", template: "%s · CityPulse" },
  description: "Reportes y eventos urbanos verificados",
};

/**
 * Componente RootLayout: Layout raíz absoluto de la aplicación Next.js.
 *
 * - **¿Qué hace?**: Define la estructura fundamental HTML (`<html>` y `<body>`), inyecta las fuentes tipográficas
 *   (`Plus Jakarta Sans` y `Geist Mono`), carga los estilos globales de Tailwind CSS y ejecuta el script sincrónico
 *   `themeInitScript` en el `<head>` antes de pintar el DOM.
 * - **¿Cómo interactúa con el sistema en general?**: Envuelve todas las páginas del sistema (tanto rutas públicas
 *   como `/login`, `/register`, como el grupo autenticado `(app)`). Utiliza `suppressHydrationWarning` para permitir
 *   que el script de tema modifique `data-theme` sin provocar advertencias de desajuste de hidratación.
 * - **¿Cuál es su importancia?**: Es el punto de entrada de renderizado de Next.js. Evita el parpadeo de modo claro/oscuro (FOUC),
 *   asegura la correcta carga y rendimiento de fuentes web sin bloqueos de red y garantiza una estructura accesible base.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: el script de tema pone data-theme antes de hidratar
    <html
      lang="es"
      suppressHydrationWarning
      className={`${jakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
