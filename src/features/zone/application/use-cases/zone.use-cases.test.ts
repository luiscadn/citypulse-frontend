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
  const useCase = new GetZoneUseCase(repository);

  it("busca la zona por ID", async () => {
    repository.findById.mockResolvedValue(zone(2, "Granada"));

    await expect(useCase.execute(2)).resolves.toEqual(zone(2, "Granada"));
    expect(repository.findById).toHaveBeenCalledWith(2);
  });

  it.each([0, -1, Number.NaN])("trata el ID %s como zona inexistente sin llamar al backend", async (id) => {
    await expect(useCase.execute(id)).rejects.toBeInstanceOf(ZoneNotFoundError);
    expect(repository.findById).not.toHaveBeenCalled();
  });
});

describe("CreateZoneUseCase", () => {
  const useCase = new CreateZoneUseCase(repository);

  it("crea la zona con los datos normalizados", async () => {
    repository.create.mockResolvedValue(zone(5, "Cristo Rey"));

    await useCase.execute({ name: " Cristo Rey ", description: "", parentZoneId: 1 });

    expect(repository.create).toHaveBeenCalledWith({
      name: "Cristo Rey",
      description: null,
      parentZoneId: 1,
    });
  });

  it("no llama al backend si el nombre está vacío", async () => {
    await expect(useCase.execute({ name: " " })).rejects.toBeInstanceOf(ZoneNameRequiredError);
    expect(repository.create).not.toHaveBeenCalled();
  });
});

describe("UpdateZoneUseCase", () => {
  const useCase = new UpdateZoneUseCase(repository);

  it("edita la zona indicada", async () => {
    repository.update.mockResolvedValue(zone(2, "Granada"));

    await useCase.execute(2, { name: "Granada", description: "Zona gastronómica" });

    expect(repository.update).toHaveBeenCalledWith(2, {
      name: "Granada",
      description: "Zona gastronómica",
      parentZoneId: null,
    });
  });

  it("no deja que la zona sea su propia zona padre", async () => {
    await expect(useCase.execute(2, { name: "Granada", parentZoneId: 2 })).rejects.toBeInstanceOf(
      ZoneSelfParentError,
    );
    expect(repository.update).not.toHaveBeenCalled();
  });

  it("rechaza un ID inválido", async () => {
    await expect(useCase.execute(0, { name: "Granada" })).rejects.toBeInstanceOf(InvalidZoneError);
  });
});

describe("DeleteZoneUseCase", () => {
  const useCase = new DeleteZoneUseCase(repository);

  it("borra la zona indicada", async () => {
    repository.remove.mockResolvedValue(undefined);

    await useCase.execute(3);

    expect(repository.remove).toHaveBeenCalledWith(3);
  });

  it("rechaza un ID inválido sin llamar al backend", async () => {
    await expect(useCase.execute(-2)).rejects.toBeInstanceOf(InvalidZoneError);
    expect(repository.remove).not.toHaveBeenCalled();
  });
});
