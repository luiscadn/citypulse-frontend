import { beforeEach, describe, expect, it, vi } from "vitest";
import { HttpError } from "@/shared/infrastructure/http-client";
import {
  FriendRequestAlreadyAnsweredError,
  FriendRequestAlreadyExistsError,
  FriendRequestForbiddenError,
  FriendRequestNotFoundError,
  FriendTargetNotFoundError,
} from "../../domain/errors/friendship-errors";
import { HttpFriendshipRepository } from "./http-friendship-repository";

const http = { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() };
const repository = new HttpFriendshipRepository(http);

// El backend manda la entidad User completa: la UI solo debe recibir estos campos
const ana = { id: 7, username: "ana", fullName: "Ana Pérez", email: "ana@test.com" };
const anaDto = { ...ana, isActive: true, twoFactorEnabled: false, createdAt: "2026-10-01T00:00:00Z" };

beforeEach(() => vi.clearAllMocks());

describe("getOverview", () => {
  it("mapea amigos y solicitudes recortando los usuarios", async () => {
    http.get.mockResolvedValue({
      friends: [anaDto],
      pendingReceived: [{ id: 1, from: anaDto }],
      pendingSent: [{ id: 2, to: anaDto }],
    });

    await expect(repository.getOverview()).resolves.toEqual({
      friends: [ana],
      pendingReceived: [{ id: 1, from: ana }],
      pendingSent: [{ id: 2, to: ana }],
    });
    expect(http.get).toHaveBeenCalledWith("/friendships");
  });
});

describe("findUser", () => {
  it("consulta el usuario y lo recorta", async () => {
    http.get.mockResolvedValue(anaDto);

    await expect(repository.findUser(7)).resolves.toEqual(ana);
    expect(http.get).toHaveBeenCalledWith("/users/7");
  });

  it("traduce el 404", async () => {
    http.get.mockRejectedValue(new HttpError(404, {}));

    await expect(repository.findUser(7)).rejects.toBeInstanceOf(FriendTargetNotFoundError);
  });
});

describe("sendRequest", () => {
  it("envía el ID con el nombre que espera el backend", async () => {
    http.post.mockResolvedValue({});

    await repository.sendRequest(7);

    expect(http.post).toHaveBeenCalledWith("/friendships", { toUserId: 7 });
  });

  it.each([
    [404, FriendTargetNotFoundError],
    [409, FriendRequestAlreadyExistsError],
  ])("traduce el %i", async (status, errorType) => {
    http.post.mockRejectedValue(new HttpError(status, {}));

    await expect(repository.sendRequest(7)).rejects.toBeInstanceOf(errorType);
  });

  it("deja pasar los errores que no conoce", async () => {
    const error = new HttpError(500, {});
    http.post.mockRejectedValue(error);

    await expect(repository.sendRequest(7)).rejects.toBe(error);
  });
});

describe("respond", () => {
  it("envía la respuesta como status", async () => {
    http.patch.mockResolvedValue({});

    await repository.respond(12, "RECHAZADA");

    expect(http.patch).toHaveBeenCalledWith("/friendships/12", { status: "RECHAZADA" });
  });

  it.each([
    [400, FriendRequestAlreadyAnsweredError],
    [403, FriendRequestForbiddenError],
    [404, FriendRequestNotFoundError],
  ])("traduce el %i", async (status, errorType) => {
    http.patch.mockRejectedValue(new HttpError(status, {}));

    await expect(repository.respond(12, "ACEPTADA")).rejects.toBeInstanceOf(errorType);
  });
});
