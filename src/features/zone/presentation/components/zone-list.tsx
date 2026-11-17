import Link from "next/link";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { Card, CardBody, CardHeader, EmptyState } from "@/shared/presentation/components";
import { ChevronRightIcon } from "@/shared/presentation/components/icons";
import { cn } from "@/shared/presentation/cn";
import { zoneContainer } from "../../di/zone.container";
import type { Zone } from "../../domain/entities/zone";
import { canManageZones } from "../../domain/rules/zone-permissions";
import { ZoneForm } from "./zone-form";

/**
 * Ordena las zonas como árbol: cada zona padre seguida de sus zonas hijas, con su nivel.
 * Una zona cuyo padre no está en la lista se trata como raíz.
 */
function asTree(zones: readonly Zone[]): { zone: Zone; depth: number }[] {
  const ids = new Set(zones.map((zone) => zone.id));
  const childrenOf = (parentId: number | null) =>
    zones.filter((zone) => (zone.parentId !== null && ids.has(zone.parentId) ? zone.parentId : null) === parentId);

  const result: { zone: Zone; depth: number }[] = [];
  const visit = (parentId: number | null, depth: number) => {
    for (const zone of childrenOf(parentId)) {
      result.push({ zone, depth });
      visit(zone.id, depth + 1);
    }
  };
  visit(null, 0);
  return result;
}

function ZoneRow({ zone, depth }: { zone: Zone; depth: number }) {
  return (
    <li>
      <Link
        href={`/zones/${zone.id}`}
        className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-neutral-soft focus-visible:bg-neutral-soft focus-visible:outline-none"
      >
        {/* La sangría muestra que la zona está dentro de la de arriba */}
        <div
          className={cn("min-w-0 flex-1", depth > 0 && "border-l border-line-strong pl-4")}
          style={{ marginLeft: `${Math.max(depth - 1, 0) * 1.5}rem` }}
        >
          <p className="truncate font-semibold text-ink">{zone.name}</p>
          <p className="truncate text-sm text-ink-muted">{zone.description ?? "Sin descripción"}</p>
        </div>
        <ChevronRightIcon className="text-ink-muted transition-transform group-hover:translate-x-0.5" />
      </Link>
    </li>
  );
}

/**
 * Listado de zonas como árbol (zona padre y sus zonas hijas). Al ADMIN además le
 * muestra el formulario para crear una.
 * Lee la cookie de sesión: con Cache Components debe ir dentro de <Suspense>.
 */
export async function ZoneList() {
  const [user, zones] = await Promise.all([
    getCurrentUser(),
    zoneContainer.listZonesUseCase.execute(),
  ]);

  const isAdmin = canManageZones(user);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
      {zones.length > 0 ? (
        <section aria-labelledby="zones-heading" className="flex flex-col gap-3">
          <h2 id="zones-heading" className="text-sm text-ink-muted">
            <span className="tabular-nums">{zones.length}</span> {zones.length === 1 ? "zona" : "zonas"}
          </h2>
          <ul className="stagger divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
            {asTree(zones).map(({ zone, depth }) => (
              <ZoneRow key={zone.id} zone={zone} depth={depth} />
            ))}
          </ul>
        </section>
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
        <Card className="lg:sticky lg:top-24">
          <CardHeader title="Nueva zona" description="Barrio, comuna o sector de la ciudad." />
          <CardBody>
            <ZoneForm parentOptions={zones} />
          </CardBody>
        </Card>
      )}
    </div>
  );
}
