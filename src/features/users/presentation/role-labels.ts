import { RoleName } from "@/shared/domain/enums";
import type { Tone } from "@/shared/presentation/components";

/** Cómo se muestra cada rol en la interfaz. */
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
