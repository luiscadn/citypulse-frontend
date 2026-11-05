import { beforeEach, describe, expect, it, vi } from "vitest";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { invitationContainer } from "../../di/invitation.container";
import { InvitationAlreadyAnsweredError } from "../../domain/errors/invitation-errors";
import { respondInvitationAction } from "./invitation.actions";

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
vi.mock("../../di/invitation.container", () => ({
  invitationContainer: {
    respondInvitationUseCase: { execute: vi.fn() },
  },
}));

const respond = vi.mocked(invitationContainer.respondInvitationUseCase.execute);

function form(values: Record<string, string>): FormData {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}

describe("respondInvitationAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getCurrentUser).mockResolvedValue({ id: 1, email: "ana@test.com", roles: [] });
  });

  it("responde la invitación y refresca la página", async () => {
    respond.mockResolvedValue(undefined);

    const state = await respondInvitationAction({}, form({ invitationId: "3", answer: "ACEPTADA" }));

    expect(state).toEqual({});
    expect(respond).toHaveBeenCalledWith(3, "ACEPTADA");
    expect(refresh).toHaveBeenCalled();
  });

  it("manda al login si no hay sesión", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);

    await expect(
      respondInvitationAction({}, form({ invitationId: "3", answer: "ACEPTADA" })),
    ).rejects.toThrow("REDIRECT");

    expect(redirect).toHaveBeenCalledWith("/login");
    expect(respond).not.toHaveBeenCalled();
  });

  it.each([
    [{ invitationId: "abc", answer: "ACEPTADA" }],
    [{ invitationId: "0", answer: "ACEPTADA" }],
    [{ invitationId: "3", answer: "PENDIENTE" }],
    [{ invitationId: "3" }],
  ])("rechaza datos inválidos: %j", async (values) => {
    const state = await respondInvitationAction({}, form(values));

    expect(state.error).toBe("La invitación no es válida");
    expect(respond).not.toHaveBeenCalled();
  });

  it("muestra el mensaje de los errores de dominio", async () => {
    respond.mockRejectedValue(new InvitationAlreadyAnsweredError());

    const state = await respondInvitationAction({}, form({ invitationId: "3", answer: "RECHAZADA" }));

    expect(state.error).toBe("Esta invitación ya fue respondida");
    expect(refresh).not.toHaveBeenCalled();
  });

  it("no expone los errores inesperados", async () => {
    respond.mockRejectedValue(new Error("detalle interno"));

    const state = await respondInvitationAction({}, form({ invitationId: "3", answer: "RECHAZADA" }));

    expect(state.error).toBe("No se pudo conectar con el servidor. Intenta de nuevo.");
  });
});
