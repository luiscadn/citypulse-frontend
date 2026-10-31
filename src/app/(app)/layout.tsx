import Link from "next/link";
import { Suspense } from "react";
import { SessionMenu } from "@/features/auth/presentation/components/session-menu";
import { BrandMark, Container, ThemeToggle } from "@/shared/presentation/components";

/** Layout de las páginas de la app: encabezado con logo, tema y sesión. */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
        <Container className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-ring"
            aria-label="CityPulse, inicio"
          >
            <BrandMark />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* Lee la cookie de sesión: va en Suspense para no bloquear el resto de la página */}
            <Suspense>
              <SessionMenu />
            </Suspense>
          </div>
        </Container>
      </header>
      <div className="flex flex-1 flex-col">{children}</div>
    </>
  );
}
