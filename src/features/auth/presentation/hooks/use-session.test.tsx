import { Suspense, act, type ReactNode } from "react";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RoleName } from "@/shared/domain/enums";
import type { SessionUser } from "../../domain/entities/session-user";
import { SessionProvider } from "../context/session-context";
import { useSession } from "./use-session";

/** useSession() suspende mientras se resuelve la promesa: el render se espera con act(). */
async function renderSession(user: SessionUser | null) {
  const sessionPromise = Promise.resolve(user);
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <SessionProvider sessionPromise={sessionPromise}>
        <Suspense>{children}</Suspense>
      </SessionProvider>
    );
  }
  let rendered!: ReturnType<typeof renderHook<ReturnType<typeof useSession>, unknown>>;
  await act(async () => {
    rendered = renderHook(() => useSession(), { wrapper: Wrapper });
  });
  return rendered.result.current;
}

describe("useSession", () => {
  it("entrega el usuario de la sesión y sus roles", async () => {
    const admin = { id: 1, email: "admin@test.com", roles: [RoleName.ADMIN] };

    const session = await renderSession(admin);

    expect(session.user).toEqual(admin);
    expect(session.isAuthenticated).toBe(true);
    expect(session.hasRole(RoleName.ADMIN)).toBe(true);
    expect(session.hasRole(RoleName.OWNER)).toBe(false);
  });

  it("sin sesión no hay usuario ni roles", async () => {
    const session = await renderSession(null);

    expect(session.user).toBeNull();
    expect(session.isAuthenticated).toBe(false);
    expect(session.hasRole(RoleName.USER)).toBe(false);
  });

  it("falla con un mensaje claro fuera del SessionProvider", () => {
    expect(() => renderHook(() => useSession())).toThrow(
      "useSession debe usarse dentro de un SessionProvider",
    );
  });
});
