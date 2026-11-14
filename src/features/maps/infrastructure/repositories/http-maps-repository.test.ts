import { beforeEach, describe, expect, it, vi } from "vitest";
import { HttpError } from "@/shared/infrastructure/http-client";
import { MapsUnavailableError, MapsUpstreamError } from "../../domain/errors/maps-errors";
import { HttpMapsRepository } from "./http-maps-repository";

const http = { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() };
const repository = new HttpMapsRepository(http);

// Respuesta de GET /maps/search (PlaceResult del backend)
const placeDto = {
  placeId: "ChIJ123",
  name: "Teatro Municipal Enrique Buenaventura",
  address: "Cra. 5 #6-64, Cali, Valle del Cauca",
  latitude: 3.45,
  longitude: -76.53,
  rating: 4.7,
  types: ["performing_arts_theater"],
  googleMapsUri: "https://maps.google.com/?cid=1",
};

beforeEach(() => vi.clearAllMocks());

describe("searchPlaces", () => {
  it("pide la búsqueda con el texto codificado y solo pasa a la UI lo que usa", async () => {
    http.get.mockResolvedValue([placeDto]);

    await expect(repository.searchPlaces("teatro & cali", 5)).resolves.toEqual([
      {
        placeId: "ChIJ123",
        name: "Teatro Municipal Enrique Buenaventura",
        address: "Cra. 5 #6-64, Cali, Valle del Cauca",
        latitude: 3.45,
        longitude: -76.53,
        googleMapsUri: "https://maps.google.com/?cid=1",
      },
    ]);
    expect(http.get).toHaveBeenCalledWith("/maps/search?query=teatro+%26+cali&limit=5");
  });

  // 503: el backend no tiene GOOGLE_MAPS_API_KEY configurada
  it("traduce el 503 a buscador no disponible", async () => {
    http.get.mockRejectedValue(new HttpError(503, {}));

    await expect(repository.searchPlaces("teatro", 5)).rejects.toBeInstanceOf(MapsUnavailableError);
  });

  // 502: Google respondió con error; 504: Google tardó más de 8 s
  it.each([502, 504])("traduce el %i a un fallo de Google", async (status) => {
    http.get.mockRejectedValue(new HttpError(status, {}));

    await expect(repository.searchPlaces("teatro", 5)).rejects.toBeInstanceOf(MapsUpstreamError);
  });
});
