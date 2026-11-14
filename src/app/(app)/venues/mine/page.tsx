import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { MyVenues } from "@/features/venue/presentation/components/my-venues";
import { Container, PageHeader, Spinner } from "@/shared/presentation/components";

export const metadata: Metadata = { title: "Mis lugares" };

export default function MyVenuesPage() {
  return (
    <Container className="flex flex-col gap-6 pb-12">
      <Link href="/venues" className="pt-6 text-sm font-semibold text-primary-strong hover:underline">
        ← Todos los lugares
      </Link>
      <PageHeader
        title="Mis lugares"
        description="Los lugares que administras, verificados y pendientes."
        className="py-0"
      />
      {/* Lee la sesión: va en Suspense para no bloquear el resto de la página */}
      <Suspense
        fallback={
          <div className="grid h-32 place-items-center text-primary">
            <Spinner />
          </div>
        }
      >
        <MyVenues />
      </Suspense>
    </Container>
  );
}
