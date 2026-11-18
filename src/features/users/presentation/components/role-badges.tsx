/**
 * @file role-badges.tsx
 * @description Componente visual para renderizar la lista de insignias de roles asociados a un usuario.
 */

import type { RoleName } from "@/shared/domain/enums";
import { Badge } from "@/shared/presentation/components";
import { ROLE_LABEL } from "../role-labels";

/**
 * Renderiza una serie de insignias (`Badge`) correspondientes a los roles del usuario.
 *
 * - **¿Qué hace?**: Itera sobre los roles proporcionados mostrando un badge estilizado con el tono y texto definidos en `ROLE_LABEL`.
 * - **¿Cómo interactúa con el sistema en general?**: Usado en listas de usuarios, encabezados y menús de sesión.
 * - **¿Cuál es su importancia?**: Ofrece una visualización rápida y consistente de las credenciales de rol asignadas.
 */
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
