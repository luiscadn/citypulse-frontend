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

// GET /friendships manda la entidad User completa: la UI solo debe recibir estos campos
const ana = { id: 7, username: "ana", fullName: "Ana Pérez" };
const anaDto = { ...ana, email: "ana@test.com", isActive: true, createdAt: "2026-10-01T00:00:00Z" };

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

describe("searchUsers", () => {
  it("mapea la página de resultados", async () => {
    http.get.mockResolvedValue({ data: [ana], total: 25, page: 1, limit: 10, lastPage: 3 });

    await expect(repository.searchUsers("ana")).resolves.toEqual({ candidates: [ana], total: 25 });
    expect(http.get).toHaveBeenCalledWith("/users/search?q=ana&limit=10");
  });

  it("codifica el texto para que no altere la URL", async () => {
    http.get.mockResolvedValue({ data: [], total: 0 });

    await repository.searchUsers("a&limit=1 é");

    expect(http.get).toHaveBeenCalledWith("/users/search?q=a%26limit%3D1+%C3%A9&limit=10");
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
