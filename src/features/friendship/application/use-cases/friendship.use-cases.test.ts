import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  FriendSearchTooShortError,
  InvalidFriendTargetError,
  SelfFriendRequestError,
} from "../../domain/errors/friendship-errors";
import type { FriendshipRepository } from "../repositories/friendship-repository";
import { GetFriendshipOverviewUseCase } from "./get-friendship-overview.use-case";
import { RespondFriendRequestUseCase } from "./respond-friend-request.use-case";
import { SearchFriendCandidatesUseCase } from "./search-friend-candidates.use-case";
import { SendFriendRequestUseCase } from "./send-friend-request.use-case";

const repository = {
  getOverview: vi.fn(),
  searchUsers: vi.fn(),
  sendRequest: vi.fn(),
  respond: vi.fn(),
} satisfies FriendshipRepository;

const ana = { id: 7, username: "ana", fullName: "Ana Pérez" };

beforeEach(() => vi.clearAllMocks());

describe("GetFriendshipOverviewUseCase", () => {
  it("devuelve los amigos y las solicitudes del repositorio", async () => {
    const overview = { friends: [ana], pendingReceived: [], pendingSent: [] };
    repository.getOverview.mockResolvedValue(overview);

    await expect(new GetFriendshipOverviewUseCase(repository).execute()).resolves.toEqual(overview);
  });
});

describe("SearchFriendCandidatesUseCase", () => {
  const useCase = new SearchFriendCandidatesUseCase(repository);

  it("busca con el texto sin espacios alrededor", async () => {
    const search = { candidates: [ana], total: 1 };
    repository.searchUsers.mockResolvedValue(search);

    await expect(useCase.execute("  ana ")).resolves.toEqual(search);
    expect(repository.searchUsers).toHaveBeenCalledWith("ana");
  });

  it.each(["", "a", "   a  "])("rechaza el texto %j sin llamar al backend", async (text) => {
    await expect(useCase.execute(text)).rejects.toBeInstanceOf(FriendSearchTooShortError);
    expect(repository.searchUsers).not.toHaveBeenCalled();
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

  it.each([0, -3, 1.5, Number.NaN])("no envía la solicitud con el ID %s", async (id) => {
    await expect(useCase.execute(1, id)).rejects.toBeInstanceOf(InvalidFriendTargetError);
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
