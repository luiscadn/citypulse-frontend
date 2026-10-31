import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { themeInitScript } from "@/shared/presentation/theme/theme";

// Fuente institucional de la Universidad Icesi
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "CityPulse", template: "%s · CityPulse" },
  description: "Reportes y eventos urbanos verificados",
};

/*
 * Layout raíz: solo html, fuentes y tema. El encabezado vive en
 * app/(app)/layout.tsx; las páginas sin encabezado (como /login) van fuera
 * de ese grupo. Los paréntesis no cambian la URL: app/(app)/ui → /ui.
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
