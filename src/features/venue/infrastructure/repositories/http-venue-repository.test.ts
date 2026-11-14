import { beforeEach, describe, expect, it, vi } from "vitest";
import { HttpError } from "@/shared/infrastructure/http-client";
import {
  VenueForbiddenError,
  VenueNameTakenError,
  VenueZoneNotFoundError,
} from "../../domain/errors/venue-errors";
import { HttpVenueRepository } from "./http-venue-repository";

const http = { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() };
const repository = new HttpVenueRepository(http);

const venue = {
  id: 1,
  name: "Teatro Municipal",
  description: "Teatro de la ciudad",
  address: "Cra 5 # 6-64",
  isVerified: true,
  zone: { id: 2, name: "Centro Histórico" },
  owner: { id: 2, username: "teatro", fullName: "Teatro Municipal" },
  createdAt: "2026-11-14T05:31:00.711Z",
};
// El backend manda más campos (updatedAt, y podría mandar otros del dueño): la UI no los recibe
const venueDto = {
  ...venue,
  updatedAt: "2026-11-14T05:31:00.711Z",
  owner: { ...venue.owner, email: "teatro@citypulse.co" },
};
const input = { name: "Teatro Municipal", address: "Cra 5 # 6-64", description: null, zoneId: 2 };

beforeEach(() => vi.clearAllMocks());

describe("list", () => {
  it("arma la URL con los filtros y no deja pasar el correo del dueño", async () => {
    http.get.mockResolvedValue({ data: [venueDto], total: 1, page: 2, limit: 12, lastPage: 2 });

    await expect(repository.list({ zoneId: 2, isVerified: false, page: 2 })).resolves.toEqual({
      venues: [venue],
      total: 1,
      page: 2,
      lastPage: 2,
    });
    expect(http.get).toHaveBeenCalledWith("/venues?page=2&limit=12&zoneId=2&isVerified=false");
  });

  // Sin resultados el backend responde lastPage: 0
  it("no envía los filtros vacíos y siempre hay al menos una página", async () => {
    http.get.mockResolvedValue({ data: [], total: 0, page: 1, limit: 12, lastPage: 0 });

    const page = await repository.list({ zoneId: null, isVerified: null, page: 1 });

    expect(http.get).toHaveBeenCalledWith("/venues?page=1&limit=12");
    expect(page.lastPage).toBe(1);
  });
});

describe("create", () => {
  it("no envía la descripción vacía", async () => {
    http.post.mockResolvedValue(venueDto);

    await repository.create(input);

    expect(http.post).toHaveBeenCalledWith("/venues", { name: input.name, address: input.address, zoneId: 2 });
  });

  it.each([
    [404, VenueZoneNotFoundError],
    [409, VenueNameTakenError],
  ])("traduce el %i a un error de dominio", async (status, errorType) => {
    http.post.mockRejectedValue(new HttpError(status, {}));

    await expect(repository.create(input)).rejects.toBeInstanceOf(errorType);
  });
});

describe("update y remove", () => {
  it("al editar envía la descripción null para borrarla", async () => {
    http.patch.mockResolvedValue(venueDto);

    await repository.update(1, input);

    expect(http.patch).toHaveBeenCalledWith("/venues/1", { ...input, description: null });
  });

  it("traduce el 403 de un lugar ajeno", async () => {
    http.delete.mockRejectedValue(new HttpError(403, {}));

    await expect(repository.remove(1)).rejects.toBeInstanceOf(VenueForbiddenError);
  });
});
