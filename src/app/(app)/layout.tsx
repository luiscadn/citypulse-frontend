import Link from "next/link";
import { Suspense } from "react";
import { SessionMenu } from "@/features/auth/presentation/components/session-menu";
import { BrandMark, Container, ThemeToggle } from "@/shared/presentation/components";
import { AppNav, AppNavFallback } from "./_components/app-nav";

/** Layout de las páginas de la app: encabezado con logo, secciones, tema y sesión. */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
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
            {/* Lee la cookie de sesión: va en Suspense para no bloquear el resto de la página */}
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
    </>
  );
}
