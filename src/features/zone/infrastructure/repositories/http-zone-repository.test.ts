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
  parent: { id: 1, name: "Cali" },
};
const input = { name: "Granada", description: null, parentZoneId: null };

beforeEach(() => vi.clearAllMocks());

describe("lectura", () => {
  it("mapea las zonas y toma el ID de la zona padre", async () => {
    http.get.mockResolvedValue([granadaDto]);

    await expect(repository.list()).resolves.toEqual([
      { id: 4, name: "Granada", description: "Zona gastronómica", parentId: 1, createdAt: granadaDto.createdAt },
    ]);
    expect(http.get).toHaveBeenCalledWith("/zone");
  });

  it("traduce el 404 de una zona inexistente", async () => {
    http.get.mockRejectedValue(new HttpError(404, {}));

    await expect(repository.findById(99)).rejects.toBeInstanceOf(ZoneNotFoundError);
  });
});

describe("create", () => {
  it("no envía los campos vacíos", async () => {
    http.post.mockResolvedValue(granadaDto);

    await repository.create(input);

    expect(http.post).toHaveBeenCalledWith("/zone", { name: "Granada" });
  });

  it.each([
    [404, ZoneParentNotFoundError],
    [409, ZoneNameTakenError],
  ])("traduce el %i a un error de dominio", async (status, errorType) => {
    http.post.mockRejectedValue(new HttpError(status, {}));

    await expect(repository.create(input)).rejects.toBeInstanceOf(errorType);
  });
});

describe("update", () => {
  it("envía la descripción null para borrarla y omite la zona padre sin elegir", async () => {
    http.patch.mockResolvedValue(granadaDto);

    await repository.update(4, input);

    expect(http.patch).toHaveBeenCalledWith("/zone/4", { name: "Granada", description: null });
  });
});

describe("remove", () => {
  it("traduce el 409 de una zona con lugares o eventos", async () => {
    http.delete.mockRejectedValue(new HttpError(409, {}));

    await expect(repository.remove(2)).rejects.toBeInstanceOf(ZoneInUseError);
  });

  it("deja pasar los errores que no conoce", async () => {
    const error = new HttpError(500, {});
    http.delete.mockRejectedValue(error);

    await expect(repository.remove(4)).rejects.toBe(error);
  });
});
