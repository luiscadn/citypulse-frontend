import { beforeEach, describe, expect, it, vi } from "vitest";
import { HttpError } from "@/shared/infrastructure/http-client";
import {
  InvitationAlreadyAnsweredError,
  InvitationAlreadyExistsError,
  InvitationEventNotFoundError,
  InvitationForbiddenError,
  InvitationNotAllowedError,
  InvitationNotFoundError,
} from "../../domain/errors/invitation-errors";
import { HttpInvitationRepository } from "./http-invitation-repository";

const http = { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() };
const repository = new HttpInvitationRepository(http);

const eventId = "3f2b8c1e-7a4d-4e9b-8c21-5d6f7a8b9c0d";
const newInvitation = { eventId, toUserId: 7, message: "¡Vamos!" };

beforeEach(() => vi.clearAllMocks());

describe("getPending", () => {
  it("mapea las invitaciones recortando el evento y quien invita", async () => {
    const event = {
      id: eventId,
      title: "Concierto",
      startDate: "2026-12-01T20:00:00.000Z",
      endDate: "2026-12-01T23:00:00.000Z",
    };
    const from = { id: 7, username: "ana", fullName: "Ana Pérez" };
    // El backend manda las entidades Event y User completas: la UI solo debe recibir estos campos
    http.get.mockResolvedValue([
      {
        id: 3,
        message: "¡Vamos!",
        status: "PENDIENTE",
        createdAt: "2026-11-01T00:00:00.000Z",
        respondedAt: null,
        event: { ...event, description: "Secreta", capacity: 100, visibility: "PRIVADO" },
        fromUser: { ...from, email: "ana@test.com", isActive: true },
      },
    ]);

    await expect(repository.getPending()).resolves.toEqual([
      { id: 3, message: "¡Vamos!", event, from },
    ]);
    expect(http.get).toHaveBeenCalledWith("/invitations/pending");
  });

  it("devuelve una lista vacía si no hay invitaciones", async () => {
    http.get.mockResolvedValue([]);

    await expect(repository.getPending()).resolves.toEqual([]);
  });
});

describe("send", () => {
  it("envía los campos con el nombre que espera el backend", async () => {
    http.post.mockResolvedValue({});

    await repository.send(newInvitation);

    expect(http.post).toHaveBeenCalledWith("/invitations", newInvitation);
  });

  it.each([
    [403, InvitationNotAllowedError],
    [404, InvitationEventNotFoundError],
    [409, InvitationAlreadyExistsError],
  ])("traduce el %i", async (status, errorType) => {
    http.post.mockRejectedValue(new HttpError(status, {}));

    await expect(repository.send(newInvitation)).rejects.toBeInstanceOf(errorType);
  });

  it("deja pasar los errores que no conoce", async () => {
    const error = new HttpError(500, {});
    http.post.mockRejectedValue(error);

    await expect(repository.send(newInvitation)).rejects.toBe(error);
  });
});

describe("respond", () => {
  it("envía la respuesta como status", async () => {
    http.patch.mockResolvedValue({});

    await repository.respond(3, "ACEPTADA");

    expect(http.patch).toHaveBeenCalledWith("/invitations/3", { status: "ACEPTADA" });
  });

  it.each([
    [400, InvitationAlreadyAnsweredError],
    [403, InvitationForbiddenError],
    [404, InvitationNotFoundError],
  ])("traduce el %i", async (status, errorType) => {
    http.patch.mockRejectedValue(new HttpError(status, {}));

    await expect(repository.respond(3, "RECHAZADA")).rejects.toBeInstanceOf(errorType);
  });
});
