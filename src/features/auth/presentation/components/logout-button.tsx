"use client";

import { Button } from "@/shared/presentation/components";
import { useLogout } from "../hooks/use-logout";

export function LogoutButton() {
  const { logout } = useLogout();
  return (
    <form action={logout}>
      <Button type="submit" variant="secondary" size="sm">
        Cerrar sesión
      </Button>
    </form>
  );
}
