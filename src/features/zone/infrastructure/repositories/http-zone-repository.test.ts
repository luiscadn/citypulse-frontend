import { beforeEach, describe, expect, it, vi } from "vitest";
import { HttpError } from "@/shared/infrastructure/http-client";
import {
  ZoneInUseError,
  ZoneNameTakenError,
  ZoneNotFoundError,
  ZoneParentNotFoundError,
} from "../../domain/errors/zone-errors";
import { HttpZoneRepository } from "./http-zone-repository";

const http = { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() };
const repository = new HttpZoneRepository(http);

const granadaDto = {
  id: 4,
  name: "Granada",
  description: "Zona gastronómica",
  createdAt: "2026-11-14T05:31:00.708Z",
};
const granada = { ...granadaDto, parentId: null };

beforeEach(() => vi.clearAllMocks());

describe("list", () => {
  it("mapea las zonas que devuelve el backend", async () => {
    http.get.mockResolvedValue([granadaDto]);

    await expect(repository.list()).resolves.toEqual([granada]);
    expect(http.get).toHaveBeenCalledWith("/zone");
  });

  it("usa la zona padre si el backend la envía", async () => {
    http.get.mockResolvedValue([{ ...granadaDto, parent: { id: 1, name: "Cali" } }]);

    const [zone] = await repository.list();

    expect(zone.parentId).toBe(1);
  });
});

describe("findById", () => {
  it("pide la zona por su ID", async () => {
    http.get.mockResolvedValue(granadaDto);

    await expect(repository.findById(4)).resolves.toEqual(granada);
    expect(http.get).toHaveBeenCalledWith("/zone/4");
  });

  it("traduce el 404", async () => {
    http.get.mockRejectedValue(new HttpError(404, {}));

    await expect(repository.findById(99)).rejects.toBeInstanceOf(ZoneNotFoundError);
  });
});

describe("create", () => {
  it("no envía los campos vacíos", async () => {
    http.post.mockResolvedValue(granadaDto);

    await repository.create({ name: "Granada", description: null, parentZoneId: null });

    expect(http.post).toHaveBeenCalledWith("/zone", { name: "Granada" });
  });

  it("envía la zona padre con el nombre que espera el backend", async () => {
    http.post.mockResolvedValue(granadaDto);

    await repository.create({ name: "Granada", description: "Comida", parentZoneId: 1 });

    expect(http.post).toHaveBeenCalledWith("/zone", {
      name: "Granada",
      description: "Comida",
      parentZoneId: 1,
    });
  });

  it.each([
    [404, ZoneParentNotFoundError],
    [409, ZoneNameTakenError],
  ])("traduce el %i", async (status, errorType) => {
    http.post.mockRejectedValue(new HttpError(status, {}));

    await expect(
      repository.create({ name: "Granada", description: null, parentZoneId: 1 }),
    ).rejects.toBeInstanceOf(errorType);
  });
});

describe("update", () => {
  it("envía la descripción null para borrarla y omite la zona padre sin elegir", async () => {
    http.patch.mockResolvedValue(granadaDto);

    await repository.update(4, { name: "Granada", description: null, parentZoneId: null });

    expect(http.patch).toHaveBeenCalledWith("/zone/4", { name: "Granada", description: null });
  });

  it.each([
    [404, ZoneNotFoundError],
    [409, ZoneNameTakenError],
  ])("traduce el %i", async (status, errorType) => {
    http.patch.mockRejectedValue(new HttpError(status, {}));

    await expect(
      repository.update(4, { name: "Granada", description: null, parentZoneId: null }),
    ).rejects.toBeInstanceOf(errorType);
  });
});

describe("remove", () => {
  it("borra la zona por su ID", async () => {
    http.delete.mockResolvedValue(undefined);

    await repository.remove(4);

    expect(http.delete).toHaveBeenCalledWith("/zone/4");
  });

  it.each([
    [404, ZoneNotFoundError],
    [409, ZoneInUseError],
  ])("traduce el %i", async (status, errorType) => {
    http.delete.mockRejectedValue(new HttpError(status, {}));

    await expect(repository.remove(4)).rejects.toBeInstanceOf(errorType);
  });

  it("deja pasar los errores que no conoce", async () => {
    const error = new HttpError(500, {});
    http.delete.mockRejectedValue(error);

    await expect(repository.remove(4)).rejects.toBe(error);
  });
});
