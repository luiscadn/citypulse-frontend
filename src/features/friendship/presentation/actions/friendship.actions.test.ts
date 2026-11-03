import { beforeEach, describe, expect, it, vi } from "vitest";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { friendshipContainer } from "../../di/friendship.container";
import { FriendRequestAlreadyAnsweredError } from "../../domain/errors/friendship-errors";
import { respondFriendRequestAction } from "./friendship.actions";

vi.mock("next/cache", () => ({ refresh: vi.fn() }));
vi.mock("next/navigation", () => ({
  // redirect() de verdad lanza una excepción para cortar la ejecución
  redirect: vi.fn(() => {
    throw new Error("REDIRECT");
  }),
}));
vi.mock("@/features/auth/infrastructure/session/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));
vi.mock("../../di/friendship.container", () => ({
  friendshipContainer: { respondFriendRequestUseCase: { execute: vi.fn() } },
}));

const respond = vi.mocked(friendshipContainer.respondFriendRequestUseCase.execute);

function form(values: Record<string, string>): FormData {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}

describe("respondFriendRequestAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getCurrentUser).mockResolvedValue({ id: 1, email: "ana@test.com", roles: [] });
  });

  it("responde la solicitud y refresca la página", async () => {
    respond.mockResolvedValue(undefined);

    const state = await respondFriendRequestAction({}, form({ requestId: "12", answer: "ACEPTADA" }));

    expect(state).toEqual({});
    expect(respond).toHaveBeenCalledWith(12, "ACEPTADA");
    expect(refresh).toHaveBeenCalled();
  });

  it("manda al login si no hay sesión", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);

    await expect(
      respondFriendRequestAction({}, form({ requestId: "12", answer: "ACEPTADA" })),
    ).rejects.toThrow("REDIRECT");

    expect(redirect).toHaveBeenCalledWith("/login");
    expect(respond).not.toHaveBeenCalled();
  });

  it.each([
    [{ requestId: "abc", answer: "ACEPTADA" }],
    [{ requestId: "0", answer: "ACEPTADA" }],
    [{ requestId: "12", answer: "PENDIENTE" }],
    [{ requestId: "12" }],
  ])("rechaza datos inválidos: %j", async (values) => {
    const state = await respondFriendRequestAction({}, form(values));

    expect(state.error).toBe("La solicitud no es válida");
    expect(respond).not.toHaveBeenCalled();
  });

  it("muestra el mensaje de los errores de dominio", async () => {
    respond.mockRejectedValue(new FriendRequestAlreadyAnsweredError());

    const state = await respondFriendRequestAction({}, form({ requestId: "12", answer: "RECHAZADA" }));

    expect(state.error).toBe("Esta solicitud ya fue respondida");
    expect(refresh).not.toHaveBeenCalled();
  });

  it("no expone los errores inesperados", async () => {
    respond.mockRejectedValue(new Error("detalle interno"));

    const state = await respondFriendRequestAction({}, form({ requestId: "12", answer: "RECHAZADA" }));

    expect(state.error).toBe("No se pudo conectar con el servidor. Intenta de nuevo.");
  });
});
