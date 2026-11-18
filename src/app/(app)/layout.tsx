import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { SessionMenu } from "@/features/auth/presentation/components/session-menu";
import { SessionProvider } from "@/features/auth/presentation/context/session-context";
import { BrandMark, Container, ThemeToggle } from "@/shared/presentation/components";
import { AppNav, AppNavFallback } from "./_components/app-nav";

/**
 * Componente AppLayout: Layout principal para la aplicación autenticada.
 *
 * - **¿Qué hace?**: Provee la barra de navegación superior fija (`header sticky`), el selector de temas (`ThemeToggle`),
 *   el menú de usuario (`SessionMenu`), la barra de enlaces (`AppNav`) responsiva (con soporte móvil en segunda fila),
 *   y envuelve el árbol de componentes dentro de `SessionProvider`.
 * - **¿Cómo interactúa con el sistema en general?**: Obtiene la promesa de sesión con `getCurrentUser()` sin bloquear
 *   con `await` a nivel del layout. Pasa la promesa (`sessionPromise`) directamente a `SessionProvider`, permitiendo
 *   que los componentes que consumen la sesión se suspendan de manera granular mediante React 19 / Next.js Streaming SSR.
 * - **¿Cuál es su importancia?**: Evita bloqueos de renderizado en cascada (waterfalls). La barra de navegación y el contenido
 *   general se transmiten al navegador de inmediato, mientras que los datos de sesión y navegación activa se resuelven
 *   dentro de sus respectivos límites de `<Suspense>`, logrando un First Contentful Paint (FCP) óptimo.
 */
export default function AppLayout({ children }: LayoutProps<"/">) {
  // Sin await: la sesión se resuelve dentro de los <Suspense> de quien la usa (useSession)
  const sessionPromise = getCurrentUser();

  return (
    <SessionProvider sessionPromise={sessionPromise}>
      <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
        <Container className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-ring"
              aria-label="CityPulse, inicio"
            >
              <BrandMark />
            </Link>
            {/* usePathname() suspende en rutas con parámetros: sin Suspense, `next build` falla */}
            <Suspense fallback={<AppNavFallback className="hidden md:block" />}>
              <AppNav className="hidden md:block" />
            </Suspense>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* Espera la sesión: va en Suspense para no bloquear el resto de la página */}
            <Suspense>
              <SessionMenu />
            </Suspense>
          </div>
        </Container>
        {/* En pantallas pequeñas no caben junto al logo: van en una segunda fila */}
        <Container className="pb-2 md:hidden">
          <Suspense fallback={<AppNavFallback />}>
            <AppNav />
          </Suspense>
        </Container>
      </header>
      <div className="flex flex-1 flex-col">{children}</div>
    </SessionProvider>
  );
}
