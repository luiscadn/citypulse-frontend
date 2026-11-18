/**
 * @file role-labels.ts
 * @description Catálogo visual y descriptivo para la presentación de Roles en la interfaz de usuario.
 */

import { RoleName } from "@/shared/domain/enums";
import type { Tone } from "@/shared/presentation/components";

/**
 * Mapeo de nombres de roles a etiquetas, descripciones legibles y tonos visuales (`Tone`).
 *
 * - **¿Qué hace?**:
 *   Asocia cada `RoleName` (`USER`, `OWNER`, `ADMIN`) con su texto en español, explicación breve
 *   de capacidades y el tono de color correspondiente para insignias (`Badge`).
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Utilizado en `RoleBadges` y en el editor de roles `UserRoleEditor`.
 *
 * - **¿Cuál es su importancia?**:
 *   Unifica la terminología visual y descriptiva de permisos y roles a lo largo de toda la plataforma.
 */
export const ROLE_LABEL: Record<RoleName, { label: string; description: string; tone: Tone }> = {
  [RoleName.USER]: {
    label: "Usuario",
    description: "Cuenta estándar de la plataforma.",
    tone: "neutral",
  },
  [RoleName.OWNER]: {
    label: "Propietario",
    description: "Puede registrar y administrar sus lugares.",
    tone: "info",
  },
  [RoleName.ADMIN]: {
    label: "Administrador",
    description: "Verifica lugares y gestiona zonas y roles.",
    tone: "primary",
  },
};
