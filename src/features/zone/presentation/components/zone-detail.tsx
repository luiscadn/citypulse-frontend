import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { ButtonLink, Card, CardBody, CardFooter, CardHeader, PageHeader } from "@/shared/presentation/components";
import { Breadcrumbs, type Crumb } from "@/shared/presentation/components/breadcrumbs";
import { ChevronRightIcon } from "@/shared/presentation/components/icons";
import { formatDateTime } from "@/shared/presentation/formatters/date";
import { zoneContainer } from "../../di/zone.container";
import type { Zone } from "../../domain/entities/zone";
import { ZoneNotFoundError } from "../../domain/errors/zone-errors";
import { canManageZones } from "../../domain/rules/zone-permissions";
import { DeleteZoneButton } from "./delete-zone-button";
import { ZoneForm } from "./zone-form";

/**
 * Detalle de una zona: dónde está, qué zonas contiene y acceso a sus lugares.
 * Al ADMIN además le muestra cómo editarla o borrarla.
 * Recibe el ID como promesa (params de la ruta) y lee la sesión: va dentro de <Suspense>.
 */
export async function ZoneDetail({ zoneId }: { zoneId: Promise<string> }) {
  const id = Number(await zoneId);

  let zone: Zone;
  let zones: Zone[];
  try {
    [zone, zones] = await Promise.all([
      zoneContainer.getZoneUseCase.execute(id),
      zoneContainer.listZonesUseCase.execute(),
    ]);
  } catch (error) {
    if (error instanceof ZoneNotFoundError) notFound();
    // Cualquier otro fallo lo muestra error.tsx
    throw error;
  }

  const isAdmin = canManageZones(await getCurrentUser());
  const parent = zones.find((candidate) => candidate.id === zone.parentId);
  const children = zones.filter((candidate) => candidate.parentId === zone.id);

  const crumbs: Crumb[] = [
    { label: "Zonas", href: "/zones" },
    ...(parent ? [{ label: parent.name, href: `/zones/${parent.id}` }] : []),
    { label: zone.name },
  ];

  return (
    <>
      <Breadcrumbs items={crumbs} />
      <PageHeader
        title={zone.name}
        description={zone.description ?? "Sin descripción"}
        actions={
          <ButtonLink href={`/venues?zoneId=${zone.id}`} variant="secondary">
            Ver lugares de esta zona
          </ButtonLink>
        }
        className="pt-2 pb-0"
      />
      <p className="text-sm text-ink-muted">Registrada el {formatDateTime(zone.createdAt)}</p>

      {children.length > 0 && (
        <section aria-labelledby="children-heading" className="flex flex-col gap-3">
          <h2 id="children-heading" className="text-base font-semibold text-ink">
            Zonas dentro de {zone.name}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {children.map((child) => (
              <li key={child.id}>
                <Link
                  href={`/zones/${child.id}`}
                  className="inline-flex items-center gap-1 rounded-md border border-line bg-surface px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:border-primary hover:text-primary-strong focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-ring"
                >
                  {child.name}
                  <ChevronRightIcon className="size-3.5 text-ink-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {isAdmin && (
        <Card className="max-w-2xl">
          <CardHeader title="Editar zona" description="Solo los administradores pueden cambiarla." />
          <CardBody>
            <ZoneForm zone={zone} parentOptions={zones} />
          </CardBody>
          {/* Lo destructivo va aparte y al final, para no confundirlo con guardar */}
          <CardFooter className="flex-wrap justify-between gap-4">
            <p className="max-w-sm text-sm text-ink-muted">
              Eliminar la zona no se puede deshacer. Solo se permite si no tiene lugares ni eventos.
            </p>
            <DeleteZoneButton zoneId={zone.id} zoneName={zone.name} />
          </CardFooter>
        </Card>
      )}
    </>
  );
}
