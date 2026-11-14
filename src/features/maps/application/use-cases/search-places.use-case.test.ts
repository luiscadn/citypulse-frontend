import { beforeEach, describe, expect, it, vi } from "vitest";
import { PlaceQueryTooShortError } from "../../domain/errors/maps-errors";
import type { MapsRepository } from "../repositories/maps-repository";
import { PLACE_SEARCH_LIMIT, SearchPlacesUseCase } from "./search-places.use-case";

const repository = { searchPlaces: vi.fn() } satisfies MapsRepository;
const useCase = new SearchPlacesUseCase(repository);

const place = {
  placeId: "ChIJ123",
  name: "Teatro Municipal Enrique Buenaventura",
  address: "Cra. 5 #6-64, Cali, Valle del Cauca",
  latitude: 3.45,
  longitude: -76.53,
  googleMapsUri: "https://maps.google.com/?cid=1",
};

beforeEach(() => vi.clearAllMocks());

describe("SearchPlacesUseCase", () => {
  it("busca el texto limpio con un límite corto de resultados", async () => {
    repository.searchPlaces.mockResolvedValue([place]);

    await expect(useCase.execute("  teatro municipal ")).resolves.toEqual([place]);
    expect(repository.searchPlaces).toHaveBeenCalledWith("teatro municipal", PLACE_SEARCH_LIMIT);
    expect(PLACE_SEARCH_LIMIT).toBe(5);
  });

  it("no llama al backend con un texto demasiado corto", async () => {
    await expect(useCase.execute("te")).rejects.toBeInstanceOf(PlaceQueryTooShortError);
    expect(repository.searchPlaces).not.toHaveBeenCalled();
  });
});
