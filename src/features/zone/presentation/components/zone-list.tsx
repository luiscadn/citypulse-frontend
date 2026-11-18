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
 * Función utilitaria asTree
 *
 * - **¿Qué hace?**: Transforma una lista plana de zonas en un árbol jerárquico donde cada zona padre va inmediatamente
 *   seguida de sus subzonas directas, calculando su nivel de profundidad (`depth`).
 * - **¿Cómo interactúa con el sistema en general?**: Usada en `ZoneList` para iterar y renderizar las filas.
 * - **¿Cuál es su importancia?**: Permite proyectar estructuras de datos padre-hijo relacionales en una lista HTML
 *   con indentación visual intuitiva.
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

/**
 * Componente interno ZoneRow
 *
 * - **¿Qué hace?**: Renderiza una fila interactiva de zona aplicando margen izquierdo proporcional a su profundidad (`depth`)
 *   y borde lateral que evidencia la pertenencia jerárquica a la zona superior.
 * - **¿Cómo interactúa con el sistema en general?**: Conduce a la ruta `/zones/${zone.id}`.
 * - **¿Cuál es su importancia?**: Aporta claridad visual sobre qué barrios pertenecen a qué comunas o sectores.
 */
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
 * Componente Server Component ZoneList: Catálogo jerárquico de zonas urbanas.
 *
 * - **¿Qué hace?**: Consulta en paralelo la sesión y el listado ordenado de zonas, las organiza en árbol jerárquico con `asTree`,
 *   y renderiza la lista interactiva. Si el usuario tiene rol `ADMIN`, añade un panel lateral fijo (`sticky`)
 *   con el formulario `ZoneForm` para dar de alta nuevas zonas rápidamente.
 * - **¿Cómo interactúa con el sistema en general?**: Se monta en `src/app/(app)/zones/page.tsx` dentro de `<Suspense>`.
 * - **¿Cuál es su importancia?**: Es la pantalla central para explorar y administrar la división urbana de la ciudad,
 *   brindando a los administradores una herramienta ágil para alimentar el mapa territorial.
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
