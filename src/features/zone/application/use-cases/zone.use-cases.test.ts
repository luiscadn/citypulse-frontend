import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  InvalidZoneError,
  ZoneNameRequiredError,
  ZoneNotFoundError,
  ZoneSelfParentError,
} from "../../domain/errors/zone-errors";
import type { ZoneRepository } from "../repositories/zone-repository";
import { CreateZoneUseCase } from "./create-zone.use-case";
import { DeleteZoneUseCase } from "./delete-zone.use-case";
import { GetZoneUseCase } from "./get-zone.use-case";
import { ListZonesUseCase } from "./list-zones.use-case";
import { UpdateZoneUseCase } from "./update-zone.use-case";

const repository = {
  list: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
} satisfies ZoneRepository;

const zone = (id: number, name: string) => ({
  id,
  name,
  description: null,
  parentId: null,
  createdAt: "2026-11-01T00:00:00.000Z",
});

beforeEach(() => vi.clearAllMocks());

describe("ListZonesUseCase", () => {
  it("ordena las zonas por nombre, con tildes en español", async () => {
    repository.list.mockResolvedValue([zone(1, "San Antonio"), zone(2, "Ávila"), zone(3, "Granada")]);

    const zones = await new ListZonesUseCase(repository).execute();

    expect(zones.map((z) => z.name)).toEqual(["Ávila", "Granada", "San Antonio"]);
  });
});

describe("GetZoneUseCase", () => {
  it("trata un ID imposible como zona inexistente sin llamar al backend", async () => {
    await expect(new GetZoneUseCase(repository).execute(Number.NaN)).rejects.toBeInstanceOf(ZoneNotFoundError);
    expect(repository.findById).not.toHaveBeenCalled();
  });
});

describe("CreateZoneUseCase", () => {
  const useCase = new CreateZoneUseCase(repository);

  it("crea la zona con los datos normalizados", async () => {
    repository.create.mockResolvedValue(zone(5, "Cristo Rey"));

    await useCase.execute({ name: " Cristo Rey ", description: "", parentZoneId: 1 });

    expect(repository.create).toHaveBeenCalledWith({ name: "Cristo Rey", description: null, parentZoneId: 1 });
  });

  it("no llama al backend si los datos son inválidos", async () => {
    await expect(useCase.execute({ name: " " })).rejects.toBeInstanceOf(ZoneNameRequiredError);
    expect(repository.create).not.toHaveBeenCalled();
  });
});

describe("UpdateZoneUseCase", () => {
  it("no deja que la zona sea su propia zona padre", async () => {
    await expect(
      new UpdateZoneUseCase(repository).execute(2, { name: "Granada", parentZoneId: 2 }),
    ).rejects.toBeInstanceOf(ZoneSelfParentError);
    expect(repository.update).not.toHaveBeenCalled();
  });
});

describe("DeleteZoneUseCase", () => {
  it("rechaza un ID inválido sin llamar al backend", async () => {
    await expect(new DeleteZoneUseCase(repository).execute(-2)).rejects.toBeInstanceOf(InvalidZoneError);
    expect(repository.remove).not.toHaveBeenCalled();
  });
});
