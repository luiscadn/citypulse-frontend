import { RoleName } from "@/shared/domain/enums";
import type { Venue, VenueInput } from "../entities/venue";

/**
 * Réplica UX (no autoritativa) de VenueController y VenueService.
 * Sirve para mostrar u ocultar botones; si difieren, el backend gana.
 */
type Requester = { id: number; roles: readonly RoleName[] } | null;

const isAdmin = (user: Requester) => user?.roles.includes(RoleName.ADMIN) ?? false;

/** RF-2.3: solo un OWNER registra lugares (y queda como su dueño). */
export function canRegisterVenues(user: Requester): boolean {
  return user?.roles.includes(RoleName.OWNER) ?? false;
}

/** RF-2.5: el OWNER edita o borra solo sus lugares; el ADMIN, cualquiera. */
export function canManageVenue(user: Requester, venue: Pick<Venue, "owner">): boolean {
  if (!user) return false;
  return venue.owner.id === user.id || isAdmin(user);
}

/** RF-2.4: solo un ADMIN verifica lugares. */
export function canVerifyVenues(user: Requester): boolean {
  return isAdmin(user);
}

/**
 * RF-2.5: si quien edita no es ADMIN y cambia nombre, dirección, ubicación o zona de un lugar
 * verificado, el lugar vuelve a quedar pendiente. Sirve para avisarle antes de guardar.
 */
export function editLosesVerification(
  user: Requester,
  venue: Pick<Venue, "name" | "address" | "zone" | "isVerified" | "latitude" | "longitude">,
  input: Pick<VenueInput, "name" | "address" | "zoneId" | "latitude" | "longitude">,
): boolean {
  if (!venue.isVerified || isAdmin(user)) return false;
  return (
    input.name !== venue.name ||
    input.address !== venue.address ||
    input.zoneId !== venue.zone.id ||
    input.latitude !== venue.latitude ||
    input.longitude !== venue.longitude
  );
}
