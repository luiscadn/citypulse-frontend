import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  InvalidVenueError,
  VenueNameRequiredError,
  VenueNotFoundError,
} from "../../domain/errors/venue-errors";
import type { VenueRepository } from "../repositories/venue-repository";
import { CreateVenueUseCase } from "./create-venue.use-case";
import { GetVenueUseCase } from "./get-venue.use-case";
import { UpdateVenueUseCase } from "./update-venue.use-case";
import { VerifyVenueUseCase } from "./verify-venue.use-case";

const repository = {
  list: vi.fn(),
  listMine: vi.fn(),
  listMapped: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  verify: vi.fn(),
} satisfies VenueRepository;

const venue = {
  id: 1,
  name: "Teatro",
  description: null,
  address: "Cra 5",
  latitude: null,
  longitude: null,
  isVerified: false,
  zone: { id: 2, name: "Centro" },
  owner: { id: 2, username: "teatro", fullName: "Teatro" },
  createdAt: "2026-11-01T00:00:00.000Z",
};

beforeEach(() => vi.clearAllMocks());

describe("GetVenueUseCase", () => {
  it("trata un ID imposible como lugar inexistente sin llamar al backend", async () => {
    await expect(new GetVenueUseCase(repository).execute(Number.NaN)).rejects.toBeInstanceOf(VenueNotFoundError);
    expect(repository.findById).not.toHaveBeenCalled();
  });
});

describe("CreateVenueUseCase", () => {
  const useCase = new CreateVenueUseCase(repository);

  it("registra el lugar con los datos normalizados", async () => {
    repository.create.mockResolvedValue(venue);

    await useCase.execute({ name: " Teatro ", address: "Cra 5", description: "", zoneId: 2 });

    expect(repository.create).toHaveBeenCalledWith({ name: "Teatro", address: "Cra 5", description: null, zoneId: 2, latitude: null, longitude: null });
  });

  it("no llama al backend con datos inválidos", async () => {
    await expect(useCase.execute({ name: "", address: "Cra 5", zoneId: 2 })).rejects.toBeInstanceOf(
      VenueNameRequiredError,
    );
    expect(repository.create).not.toHaveBeenCalled();
  });
});

describe("UpdateVenueUseCase y VerifyVenueUseCase", () => {
  it("editar rechaza un ID inválido sin llamar al backend", async () => {
    await expect(
      new UpdateVenueUseCase(repository).execute(0, { name: "T", address: "C", zoneId: 2 }),
    ).rejects.toBeInstanceOf(InvalidVenueError);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it("verificar devuelve el lugar ya verificado", async () => {
    repository.verify.mockResolvedValue({ ...venue, isVerified: true });

    await expect(new VerifyVenueUseCase(repository).execute(1)).resolves.toMatchObject({ isVerified: true });
    expect(repository.verify).toHaveBeenCalledWith(1);
  });
});
