import type { RoleName } from "@/shared/domain/enums";
import { Badge } from "@/shared/presentation/components";
import { ROLE_LABEL } from "../role-labels";

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
