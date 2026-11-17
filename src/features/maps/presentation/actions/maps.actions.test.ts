import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { RoleName } from "@/shared/domain/enums";
import { mapsContainer } from "../../di/maps.container";
import { MapsUnavailableError, PlaceQueryTooShortError } from "../../domain/errors/maps-errors";
import { searchPlacesAction } from "./maps.actions";

vi.mock("next/navigation", () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT ${path}`);
  }),
}));
vi.mock("@/features/auth/infrastructure/session/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));
vi.mock("../../di/maps.container", () => ({
  mapsContainer: { searchPlacesUseCase: { execute: vi.fn() } },
}));

const search = vi.mocked(mapsContainer.searchPlacesUseCase.execute);
const owner = { id: 2, email: "teatro@citypulse.co", roles: [RoleName.OWNER] };
const place = {
  placeId: "ChIJ123",
  name: "Teatro Municipal",
  address: "Cra. 5 #6-64, Cali",
  latitude: 3.45,
  longitude: -76.53,
  googleMapsUri: null,
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getCurrentUser).mockResolvedValue(owner);
});

describe("searchPlacesAction", () => {
  it("devuelve los lugares encontrados", async () => {
    search.mockResolvedValue([place]);

    await expect(searchPlacesAction("teatro")).resolves.toEqual({ places: [place] });
    expect(search).toHaveBeenCalledWith("teatro");
  });

  // GET /maps/search exige token: sin sesión no tiene sentido llamar al backend
  it("manda al login si no hay sesión", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);

    await expect(searchPlacesAction("teatro")).rejects.toThrow("REDIRECT /login");
    expect(search).not.toHaveBeenCalled();
  });

  it.each([
    [new PlaceQueryTooShortError(), "Escribe al menos 3 letras para buscar"],
    [new MapsUnavailableError(), "El buscador de Google Maps no está disponible. Llena los datos a mano."],
  ])("explica el error %s sin romper el formulario", async (error, message) => {
    search.mockRejectedValue(error);

    await expect(searchPlacesAction("teatro")).resolves.toEqual({ places: [], error: message });
  });
});
