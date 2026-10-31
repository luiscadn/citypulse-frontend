import { Button } from "@/shared/presentation/components";
import { logoutAction } from "../actions/auth.actions";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="secondary" size="sm">
        Cerrar sesión
      </Button>
    </form>
  );
}
