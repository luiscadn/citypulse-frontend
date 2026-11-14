import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ZoneDetail } from "@/features/zone/presentation/components/zone-detail";
import { Container, Spinner } from "@/shared/presentation/components";

export const metadata: Metadata = { title: "Zona" };

export default function ZonePage({ params }: PageProps<"/zones/[id]">) {
  return (
    <Container className="flex flex-col gap-6 pb-12">
      <Link href="/zones" className="pt-6 text-sm font-semibold text-primary-strong hover:underline">
        ← Todas las zonas
      </Link>
      {/* El ID llega como promesa y la zona depende de la petición: todo va en Suspense */}
      <Suspense
        fallback={
          <div className="grid h-32 place-items-center text-primary">
            <Spinner />
          </div>
        }
      >
        <ZoneDetail zoneId={params.then((p) => p.id)} />
      </Suspense>
    </Container>
  );
}
