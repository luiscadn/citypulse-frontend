import { RoleName } from "@/shared/domain/enums";
import { Badge, type Tone } from "@/shared/presentation/components";

const ROLE_LABEL: Record<RoleName, { label: string; tone: Tone }> = {
  [RoleName.USER]: { label: "Usuario", tone: "neutral" },
  [RoleName.OWNER]: { label: "Propietario", tone: "info" },
  [RoleName.ADMIN]: { label: "Administrador", tone: "primary" },
};

export function RoleBadges({ roles }: { roles: readonly RoleName[] }) {
  return (
    <>
      {roles.map((role) => (
        <Badge key={role} tone={ROLE_LABEL[role].tone}>
          {ROLE_LABEL[role].label}
        </Badge>
      ))}
    </>
  );
}