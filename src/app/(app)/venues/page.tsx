import type { Metadata } from "next";
import { Suspense } from "react";
import { VenueList } from "@/features/venue/presentation/components/venue-list";
import { Container, PageHeader, Spinner } from "@/shared/presentation/components";

export const metadata: Metadata = { title: "Lugares" };

export default function VenuesPage({ searchParams }: PageProps<"/venues">) {
  return (
    <Container className="flex flex-col gap-6 pb-12">
      <PageHeader
        title="Lugares"
        description="Teatros, museos y espacios donde se publican eventos oficiales."
        className="pb-0"
      />
      {/* Los filtros y la sesión dependen de la petición: van en Suspense */}
      <Suspense
        fallback={
          <div className="grid h-32 place-items-center text-primary">
            <Spinner />
          </div>
        }
      >
        <VenueList searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}
