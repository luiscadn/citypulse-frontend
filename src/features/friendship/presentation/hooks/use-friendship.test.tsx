import { Suspense, act, type ReactNode } from "react";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { FriendshipOverview } from "../../domain/entities/friendship";
import { FriendshipProvider } from "../context/friendship-context";
import { useFriendship } from "./use-friendship";

const ana = { id: 7, username: "ana", fullName: "Ana Pérez" };
const bruno = { id: 8, username: "bruno", fullName: "Bruno Díaz" };
const carla = { id: 9, username: "carla", fullName: "Carla Ruiz" };

const overview: FriendshipOverview = {
  friends: [ana],
  pendingReceived: [{ id: 1, from: bruno }],
  pendingSent: [{ id: 2, to: carla }],
};

/** useFriendship() suspende mientras se resuelve la promesa: el render se espera con act(). */
async function renderFriendship() {
  const overviewPromise = Promise.resolve(overview);
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <FriendshipProvider overviewPromise={overviewPromise}>
        <Suspense>{children}</Suspense>
      </FriendshipProvider>
    );
  }
  let rendered!: ReturnType<typeof renderHook<ReturnType<typeof useFriendship>, unknown>>;
  await act(async () => {
    rendered = renderHook(() => useFriendship(), { wrapper: Wrapper });
  });
  return rendered.result.current;
}

describe("useFriendship", () => {
  it("entrega mis amigos y mis solicitudes pendientes", async () => {
    const friendship = await renderFriendship();

    expect(friendship.friends).toEqual([ana]);
    expect(friendship.pendingReceived).toEqual(overview.pendingReceived);
    expect(friendship.pendingSent).toEqual(overview.pendingSent);
  });

  it("dice qué relación tengo con cada persona", async () => {
    const friendship = await renderFriendship();

    expect(friendship.relationWith(ana.id)).toBe("friend");
    expect(friendship.relationWith(bruno.id)).toBe("request-received");
    expect(friendship.relationWith(carla.id)).toBe("request-sent");
    expect(friendship.relationWith(99)).toBe("none");
  });

  it("falla con un mensaje claro fuera del FriendshipProvider", () => {
    expect(() => renderHook(() => useFriendship())).toThrow(
      "useFriendship debe usarse dentro de un FriendshipProvider",
    );
  });
});
