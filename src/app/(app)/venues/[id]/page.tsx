import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { VenueDetail } from "@/features/venue/presentation/components/venue-detail";
import { Container, Spinner } from "@/shared/presentation/components";

export const metadata: Metadata = { title: "Lugar" };

export default function VenuePage({ params }: PageProps<"/venues/[id]">) {
  return (
    <Container className="flex flex-col gap-6 pb-12">
      <Link href="/venues" className="pt-6 text-sm font-semibold text-primary-strong hover:underline">
        ← Todos los lugares
      </Link>
      {/* El ID llega como promesa y el lugar depende de la petición: todo va en Suspense */}
      <Suspense
        fallback={
          <div className="grid h-32 place-items-center text-primary">
            <Spinner />
          </div>
        }
      >
        <VenueDetail venueId={params.then((p) => p.id)} />
      </Suspense>
    </Container>
  );
}
