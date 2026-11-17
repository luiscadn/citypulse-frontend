import { Suspense, act, type ReactNode } from "react";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { PendingInvitation } from "../../domain/entities/invitation";
import { InvitationProvider } from "../context/invitation-context";
import { useInvitations } from "./use-invitations";

const invitation: PendingInvitation = {
  id: 3,
  event: {
    id: "3f2b8c1e-7a4d-4e9b-8c21-5d6f7a8b9c0d",
    title: "Concierto",
    startDate: "2026-12-01T20:00:00.000Z",
    endDate: "2026-12-01T23:00:00.000Z",
  },
  from: { id: 7, username: "ana", fullName: "Ana Pérez" },
  message: "¡Vamos!",
};

/** useInvitations() suspende mientras se resuelve la promesa: el render se espera con act(). */
async function renderInvitations(pending: readonly PendingInvitation[]) {
  const pendingPromise = Promise.resolve(pending);
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <InvitationProvider pendingPromise={pendingPromise}>
        <Suspense>{children}</Suspense>
      </InvitationProvider>
    );
  }
  let rendered!: ReturnType<typeof renderHook<ReturnType<typeof useInvitations>, unknown>>;
  await act(async () => {
    rendered = renderHook(() => useInvitations(), { wrapper: Wrapper });
  });
  return rendered.result.current;
}

describe("useInvitations", () => {
  it("entrega las invitaciones pendientes", async () => {
    const { pending } = await renderInvitations([invitation]);

    expect(pending).toEqual([invitation]);
  });

  it("entrega una lista vacía si no hay pendientes", async () => {
    const { pending } = await renderInvitations([]);

    expect(pending).toEqual([]);
  });

  it("falla con un mensaje claro fuera del InvitationProvider", () => {
    expect(() => renderHook(() => useInvitations())).toThrow(
      "useInvitations debe usarse dentro de un InvitationProvider",
    );
  });
});
