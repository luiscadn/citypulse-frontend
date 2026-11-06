import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  InvalidInvitationEventError,
  InvalidInvitationTargetError,
  InvitationMessageTooLongError,
  SelfInvitationError,
} from "../../domain/errors/invitation-errors";
import type { InvitationRepository } from "../repositories/invitation-repository";
import { GetPendingInvitationsUseCase } from "./get-pending-invitations.use-case";
import { RespondInvitationUseCase } from "./respond-invitation.use-case";
import { SendInvitationUseCase } from "./send-invitation.use-case";

const repository = {
  getPending: vi.fn(),
  send: vi.fn(),
  respond: vi.fn(),
} satisfies InvitationRepository;

const eventId = "3f2b8c1e-7a4d-4e9b-8c21-5d6f7a8b9c0d";

beforeEach(() => vi.clearAllMocks());

describe("GetPendingInvitationsUseCase", () => {
  it("devuelve las invitaciones del repositorio", async () => {
    const pending = [
      {
        id: 3,
        event: {
          id: eventId,
          title: "Concierto",
          startDate: "2026-12-01T20:00:00.000Z",
          endDate: "2026-12-01T23:00:00.000Z",
        },
        from: { id: 7, username: "ana", fullName: "Ana Pérez" },
        message: null,
      },
    ];
    repository.getPending.mockResolvedValue(pending);

    await expect(new GetPendingInvitationsUseCase(repository).execute()).resolves.toEqual(pending);
  });
});

describe("SendInvitationUseCase", () => {
  const useCase = new SendInvitationUseCase(repository);

  beforeEach(() => repository.send.mockResolvedValue(undefined));

  it("envía la invitación con el mensaje sin espacios alrededor", async () => {
    await useCase.execute(1, { eventId, toUserId: 7, message: "  ¡Vamos!  " });

    expect(repository.send).toHaveBeenCalledWith({ eventId, toUserId: 7, message: "¡Vamos!" });
  });

  it.each([undefined, "", "   "])("no envía el mensaje %j", async (message) => {
    await useCase.execute(1, { eventId, toUserId: 7, message });

    expect(repository.send).toHaveBeenCalledWith({ eventId, toUserId: 7 });
  });

  it("acepta un mensaje de 255 caracteres", async () => {
    const message = "a".repeat(255);

    await useCase.execute(1, { eventId, toUserId: 7, message });

    expect(repository.send).toHaveBeenCalledWith({ eventId, toUserId: 7, message });
  });

  it("no envía un mensaje de más de 255 caracteres", async () => {
    await expect(
      useCase.execute(1, { eventId, toUserId: 7, message: "a".repeat(256) }),
    ).rejects.toBeInstanceOf(InvitationMessageTooLongError);
    expect(repository.send).not.toHaveBeenCalled();
  });

  it("no se invita a uno mismo", async () => {
    await expect(useCase.execute(7, { eventId, toUserId: 7 })).rejects.toBeInstanceOf(
      SelfInvitationError,
    );
    expect(repository.send).not.toHaveBeenCalled();
  });

  it.each([0, -3, 1.5, Number.NaN])("no invita al usuario con el ID %s", async (toUserId) => {
    await expect(useCase.execute(1, { eventId, toUserId })).rejects.toBeInstanceOf(
      InvalidInvitationTargetError,
    );
    expect(repository.send).not.toHaveBeenCalled();
  });

  it.each(["", "abc", "1"])("no invita al evento con el ID %j", async (id) => {
    await expect(useCase.execute(1, { eventId: id, toUserId: 7 })).rejects.toBeInstanceOf(
      InvalidInvitationEventError,
    );
    expect(repository.send).not.toHaveBeenCalled();
  });
});

describe("RespondInvitationUseCase", () => {
  it("pasa la respuesta al repositorio", async () => {
    repository.respond.mockResolvedValue(undefined);

    await new RespondInvitationUseCase(repository).execute(3, "RECHAZADA");

    expect(repository.respond).toHaveBeenCalledWith(3, "RECHAZADA");
  });
});
