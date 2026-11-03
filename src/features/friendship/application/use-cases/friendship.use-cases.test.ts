import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  InvalidFriendTargetError,
  SelfFriendRequestError,
} from "../../domain/errors/friendship-errors";
import type { FriendshipRepository } from "../repositories/friendship-repository";
import { FindFriendCandidateUseCase } from "./find-friend-candidate.use-case";
import { GetFriendshipOverviewUseCase } from "./get-friendship-overview.use-case";
import { RespondFriendRequestUseCase } from "./respond-friend-request.use-case";
import { SendFriendRequestUseCase } from "./send-friend-request.use-case";

const repository = {
  getOverview: vi.fn(),
  findUser: vi.fn(),
  sendRequest: vi.fn(),
  respond: vi.fn(),
} satisfies FriendshipRepository;

const ana = { id: 7, username: "ana", fullName: "Ana Pérez", email: "ana@test.com" };

beforeEach(() => vi.clearAllMocks());

describe("GetFriendshipOverviewUseCase", () => {
  it("devuelve los amigos y las solicitudes del repositorio", async () => {
    const overview = { friends: [ana], pendingReceived: [], pendingSent: [] };
    repository.getOverview.mockResolvedValue(overview);

    await expect(new GetFriendshipOverviewUseCase(repository).execute()).resolves.toEqual(overview);
  });
});

describe("FindFriendCandidateUseCase", () => {
  const useCase = new FindFriendCandidateUseCase(repository);

  it("busca al usuario cuando el ID es válido", async () => {
    repository.findUser.mockResolvedValue(ana);

    await expect(useCase.execute(1, 7)).resolves.toEqual(ana);
    expect(repository.findUser).toHaveBeenCalledWith(7);
  });

  it.each([0, -3, 1.5, Number.NaN])("rechaza el ID %s sin llamar al backend", async (id) => {
    await expect(useCase.execute(1, id)).rejects.toBeInstanceOf(InvalidFriendTargetError);
    expect(repository.findUser).not.toHaveBeenCalled();
  });

  it("no deja buscarse a uno mismo", async () => {
    await expect(useCase.execute(7, 7)).rejects.toBeInstanceOf(SelfFriendRequestError);
    expect(repository.findUser).not.toHaveBeenCalled();
  });
});

describe("SendFriendRequestUseCase", () => {
  const useCase = new SendFriendRequestUseCase(repository);

  it("envía la solicitud al usuario indicado", async () => {
    repository.sendRequest.mockResolvedValue(undefined);

    await useCase.execute(1, 7);

    expect(repository.sendRequest).toHaveBeenCalledWith(7);
  });

  it("no envía una solicitud a uno mismo", async () => {
    await expect(useCase.execute(7, 7)).rejects.toBeInstanceOf(SelfFriendRequestError);
    expect(repository.sendRequest).not.toHaveBeenCalled();
  });

  it("no envía la solicitud con un ID inválido", async () => {
    await expect(useCase.execute(1, 0)).rejects.toBeInstanceOf(InvalidFriendTargetError);
    expect(repository.sendRequest).not.toHaveBeenCalled();
  });
});

describe("RespondFriendRequestUseCase", () => {
  it("pasa la respuesta al repositorio", async () => {
    repository.respond.mockResolvedValue(undefined);

    await new RespondFriendRequestUseCase(repository).execute(12, "ACEPTADA");

    expect(repository.respond).toHaveBeenCalledWith(12, "ACEPTADA");
  });
});
