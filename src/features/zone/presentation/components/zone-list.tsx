import Link from "next/link";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { Alert, Card, CardBody, CardHeader, EmptyState } from "@/shared/presentation/components";
import { zoneContainer } from "../../di/zone.container";
import type { Zone } from "../../domain/entities/zone";
import { canManageZones } from "../../domain/rules/zone-permissions";
import { ZoneForm } from "./zone-form";

function ZoneCard({ zone, parentName }: { zone: Zone; parentName?: string }) {
  return (
    <li>
      <Link
        href={`/zones/${zone.id}`}
        className="flex h-full flex-col gap-1 rounded-lg border border-line bg-surface px-5 py-4 transition-colors hover:border-primary hover:bg-primary-soft/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-ring"
      >
        {parentName && <span className="text-xs font-semibold text-primary-strong">{parentName}</span>}
        <span className="text-base font-semibold text-ink">{zone.name}</span>
        <span className="text-sm text-ink-muted">{zone.description ?? "Sin descripción"}</span>
      </Link>
    </li>
  );
}

/**
 * Listado de zonas. Al ADMIN además le muestra el formulario para crear una.
 * Lee la cookie de sesión: con Cache Components debe ir dentro de <Suspense>.
 */
export async function ZoneList() {
  const [user, zones] = await Promise.all([
    getCurrentUser(),
    zoneContainer.listZonesUseCase.execute().catch(() => null),
  ]);

  if (!zones) {
    return <Alert tone="danger">No pudimos cargar las zonas. Intenta de nuevo más tarde.</Alert>;
  }

  const isAdmin = canManageZones(user);
  const nameById = new Map(zones.map((zone) => [zone.id, zone.name]));

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
      {zones.length > 0 ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {zones.map((zone) => (
            <ZoneCard
              key={zone.id}
              zone={zone}
              parentName={zone.parentId ? nameById.get(zone.parentId) : undefined}
            />
          ))}
        </ul>
      ) : (
        <EmptyState
          title="Todavía no hay zonas"
          description={
            isAdmin
              ? "Crea la primera con el formulario. Los lugares y eventos se ubican en una zona."
              : "Cuando un administrador las registre, aparecerán aquí."
          }
        />
      )}

      {isAdmin && (
        <Card>
          <CardHeader title="Nueva zona" description="Solo los administradores pueden crearlas." />
          <CardBody>
            <ZoneForm parentOptions={zones} />
          </CardBody>
        </Card>
      )}
    </div>
  );
}
