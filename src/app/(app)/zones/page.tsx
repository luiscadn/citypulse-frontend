import type { Metadata } from "next";
import { Suspense } from "react";
import { ZoneList } from "@/features/zone/presentation/components/zone-list";
import { Container, PageHeader, Spinner } from "@/shared/presentation/components";

export const metadata: Metadata = { title: "Zonas" };

export default function ZonesPage() {
  return (
    <Container className="flex flex-col gap-6 pb-12">
      <PageHeader
        title="Zonas"
        description="Barrios y sectores de la ciudad donde ocurren los eventos y están los lugares."
        className="pb-0"
      />
      {/* Los datos dependen de la petición: van en Suspense para no bloquear el resto de la página */}
      <Suspense
        fallback={
          <div className="grid h-32 place-items-center text-primary">
            <Spinner />
          </div>
        }
      >
        <ZoneList />
      </Suspense>
    </Container>
  );
}
