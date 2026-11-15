import type { Metadata } from "next";
import { Breadcrumbs } from "@/shared/presentation/components/breadcrumbs";
import { Suspense } from "react";
import { MyVenues } from "@/features/venue/presentation/components/my-venues";
import { Container, PageHeader, Spinner } from "@/shared/presentation/components";

export const metadata: Metadata = { title: "Mis lugares" };

export default function MyVenuesPage() {
  return (
    <Container className="flex flex-col gap-6 pb-12">
      <Breadcrumbs items={[{ label: "Lugares", href: "/venues" }, { label: "Mis lugares" }]} />
      <PageHeader
        title="Mis lugares"
        description="Los lugares que administras, verificados y pendientes."
        className="pt-2 pb-0"
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
