import { Badge } from "@/shared/presentation/components";

/** Verificado por un ADMIN o pendiente (RF-2.4). */
export function VenueStatusBadge({ isVerified }: { isVerified: boolean }) {
  return isVerified ? (
    <Badge tone="success" dot>
      Verificado
    </Badge>
  ) : (
    <Badge tone="warning" dot>
      Pendiente
    </Badge>
  );
}
