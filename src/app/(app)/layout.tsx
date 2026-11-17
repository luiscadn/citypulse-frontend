import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { SessionMenu } from "@/features/auth/presentation/components/session-menu";
import { SessionProvider } from "@/features/auth/presentation/context/session-context";
import { BrandMark, Container, ThemeToggle } from "@/shared/presentation/components";
import { AppNav, AppNavFallback } from "./_components/app-nav";

/** Layout de las páginas de la app: encabezado con logo, secciones, tema y sesión. */
export default function AppLayout({ children }: LayoutProps<"/">) {
  // Sin await: la sesión se resuelve dentro de los <Suspense> de quien la usa (useSession)
  const sessionPromise = getCurrentUser();

  return (
    <SessionProvider sessionPromise={sessionPromise}>
      {/* viewTransitionName: el encabezado no se mueve cuando cambia la página (globals.css) */}
      <header
        className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur"
        style={{ viewTransitionName: "site-header" }}
      >
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
        {/* Línea de "pulso": un brillo verde recorre el borde inferior del encabezado */}
        <div aria-hidden className="h-px overflow-hidden">
          <div className="h-full w-full animate-pan bg-linear-to-r from-transparent via-accent to-transparent bg-size-[200%_100%]" />
        </div>
      </header>
      <div className="flex flex-1 flex-col">{children}</div>
    </SessionProvider>
  );
}
