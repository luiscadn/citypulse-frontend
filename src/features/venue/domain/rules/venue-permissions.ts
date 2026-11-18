/**
 * @file venue-permissions.ts
 * @description Reglas de Dominio que calculan permisos y autorizaciones para la gestión de Lugares.
 * Actúan como una réplica orientada a la experiencia de usuario (UX) de las políticas de seguridad del backend;
 * no son autoritativas (el backend siempre tiene la última palabra).
 */

import { RoleName } from "@/shared/domain/enums";
import type { Venue, VenueInput } from "../entities/venue";

/**
 * Representa al usuario que realiza la consulta o acción, conteniendo sus roles e identificador.
 */
type Requester = { id: number; roles: readonly RoleName[] } | null;

/**
 * Función auxiliar para verificar si el usuario tiene rol de Administrador.
 *
 * - **¿Qué hace?**: Evalúa si el solicitante posee el rol `RoleName.ADMIN`.
 * - **¿Cómo interactúa con el sistema en general?**: Usada internamente en las funciones de decisión de permisos de este módulo.
 * - **¿Cuál es su importancia?**: Centraliza la lógica de chequeo del rol ADMIN evitando repeticiones.
 */
const isAdmin = (user: Requester) => user?.roles.includes(RoleName.ADMIN) ?? false;

/**
 * Determina si el usuario tiene permiso para registrar nuevos lugares (Requisito Funcional RF-2.3).
 *
 * - **¿Qué hace?**:
 *   Verifica si el usuario autenticado posee el rol `OWNER` (dueño de establecimiento).
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Utilizada en Server Components (`MyVenues`), Server Actions (`createVenueAction`) y vistas
 *   de navegación para habilitar o restringir el acceso a formularios de alta.
 *
 * - **¿Cuál es su importancia?**:
 *   Previene que usuarios con roles básicos (USER) o invitados accedan a funciones comerciales de registro.
 */
export function canRegisterVenues(user: Requester): boolean {
  return user?.roles.includes(RoleName.OWNER) ?? false;
}

/**
 * Determina si un usuario puede editar o eliminar un lugar específico (Requisito Funcional RF-2.5).
 *
 * - **¿Qué hace?**:
 *   Comprueba si el usuario autenticado es el legítimo dueño del venue (`venue.owner.id === user.id`)
 *   o si cuenta con privilegios globales de Administrador (`isAdmin`).
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Consumida por componentes de detalle (`VenueDetail`) para decidir si se renderizan los formularios
 *   de edición y botones destructivos de eliminación.
 *
 * - **¿Cuál es su importancia?**:
 *   Garantiza que un OWNER solo pueda modificar sus propios locales, mientras que un ADMIN mantenga
 *   la facultad de moderar o corregir cualquier lugar del catálogo.
 */
export function canManageVenue(user: Requester, venue: Pick<Venue, "owner">): boolean {
  if (!user) return false;
  return venue.owner.id === user.id || isAdmin(user);
}

/**
 * Determina si un usuario tiene potestad para verificar oficialmente un lugar (Requisito Funcional RF-2.4).
 *
 * - **¿Qué hace?**:
 *   Verifica si el usuario posee exclusivamente el rol `ADMIN`.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Utilizada en `VenueDetail`, `VerifyVenueButton` y `verifyVenueAction` para mostrar u ocultar
 *   los controles de certificación de lugares.
 *
 * - **¿Cuál es su importancia?**:
 *   La verificación es un sello de confianza oficial que solo el staff administrativo de la plataforma
 *   puede otorgar, evitando la auto-verificación por parte de dueños de locales.
 */
export function canVerifyVenues(user: Requester): boolean {
  return isAdmin(user);
}

/**
 * Evalúa si una edición planificada causará la pérdida de verificación del lugar (RF-2.5).
 *
 * - **¿Qué hace?**:
 *   Detecta si un usuario no administrador está alterando datos críticos (nombre, dirección física
 *   o zona geográfica) de un lugar que ya se encontraba previamente verificado.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Consumida por `VenueDetail` y `VenueForm` para mostrar una advertencia contextual preventiva
 *   antes de que el usuario envíe el formulario.
 *
 * - **¿Cuál es su importancia?**:
 *   Previene fraudes o confusiones: si un local certificado cambia su nombre o ubicación sustancialmente,
 *   debe someterse nuevamente a revisión administrativa. Al advertir al usuario en UI, se mejora la transparencia.
 */
export function editLosesVerification(
  user: Requester,
  venue: Pick<Venue, "name" | "address" | "zone" | "isVerified">,
  input: Pick<VenueInput, "name" | "address" | "zoneId">,
): boolean {
  if (!venue.isVerified || isAdmin(user)) return false;
  return input.name !== venue.name || input.address !== venue.address || input.zoneId !== venue.zone.id;
}
