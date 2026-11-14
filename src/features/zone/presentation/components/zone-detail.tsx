import { notFound } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { Alert, Card, CardBody, CardHeader, PageHeader } from "@/shared/presentation/components";
import { formatDateTime } from "@/shared/presentation/formatters/date";
import { zoneContainer } from "../../di/zone.container";
import type { Zone } from "../../domain/entities/zone";
import { ZoneNotFoundError } from "../../domain/errors/zone-errors";
import { canManageZones } from "../../domain/rules/zone-permissions";
import { DeleteZoneButton } from "./delete-zone-button";
import { ZoneForm } from "./zone-form";

/**
 * Detalle de una zona. Al ADMIN además le muestra cómo editarla o borrarla.
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
    return <Alert tone="danger">No pudimos cargar la zona. Intenta de nuevo más tarde.</Alert>;
  }

  const isAdmin = canManageZones(await getCurrentUser());
  const parent = zones.find((candidate) => candidate.id === zone.parentId);
  const children = zones.filter((candidate) => candidate.parentId === zone.id);

  return (
    <>
      <PageHeader
        eyebrow={parent ? `Zonas · ${parent.name}` : "Zonas"}
        title={zone.name}
        description={zone.description ?? "Sin descripción"}
        className="pb-0"
      />
      <p className="text-sm text-ink-muted">Registrada el {formatDateTime(zone.createdAt)}</p>

      {children.length > 0 && (
        <Card>
          <CardHeader title="Zonas dentro de esta" />
          <CardBody>
            <ul className="flex flex-wrap gap-2 text-sm text-ink">
              {children.map((child) => (
                <li key={child.id}>{child.name}</li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}

      {isAdmin && (
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader title="Editar zona" />
            <CardBody>
              <ZoneForm zone={zone} parentOptions={zones} />
            </CardBody>
          </Card>
          <Card>
            <CardHeader
              title="Eliminar zona"
              description="Solo se puede si no tiene lugares ni eventos asociados."
            />
            <CardBody>
              <DeleteZoneButton zoneId={zone.id} zoneName={zone.name} />
            </CardBody>
          </Card>
        </div>
      )}
    </>
  );
}
