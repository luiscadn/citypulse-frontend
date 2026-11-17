import { describe, expect, it } from "vitest";
import { RoleName } from "@/shared/domain/enums";
import {
  VenueAddressRequiredError,
  VenueLocationError,
  VenueNameRequiredError,
  VenueZoneRequiredError,
} from "../errors/venue-errors";
import { normalizeVenueInput, parseVenueFilters } from "./venue-input";
import {
  canManageVenue,
  canRegisterVenues,
  canVerifyVenues,
  editLosesVerification,
} from "./venue-permissions";

const draft = { name: "Teatro Jorge Isaacs", address: "Cra 3 # 12-28", zoneId: 2 };

describe("normalizeVenueInput", () => {
  it("quita los espacios y convierte la descripción vacía en null", () => {
    expect(normalizeVenueInput({ name: " Teatro ", address: " Cra 3 ", description: "  ", zoneId: 2 })).toEqual({
      name: "Teatro",
      address: "Cra 3",
      description: null,
      zoneId: 2,
      latitude: null,
      longitude: null,
    });
  });

  it("conserva una ubicación válida y trata NaN como sin ubicación", () => {
    expect(normalizeVenueInput({ ...draft, latitude: 3.45, longitude: -76.53 })).toMatchObject({
      latitude: 3.45,
      longitude: -76.53,
    });
    expect(normalizeVenueInput({ ...draft, latitude: Number.NaN, longitude: Number.NaN })).toMatchObject({
      latitude: null,
      longitude: null,
    });
  });

  it("rechaza una coordenada sola o fuera de rango", () => {
    expect(() => normalizeVenueInput({ ...draft, latitude: 3.45 })).toThrow(VenueLocationError);
    expect(() => normalizeVenueInput({ ...draft, latitude: 95, longitude: -76.53 })).toThrow(VenueLocationError);
  });

  it("exige nombre, dirección y zona (CreateVenueDto)", () => {
    expect(() => normalizeVenueInput({ ...draft, name: " " })).toThrow(VenueNameRequiredError);
    expect(() => normalizeVenueInput({ ...draft, address: "" })).toThrow(VenueAddressRequiredError);
    expect(() => normalizeVenueInput({ ...draft, zoneId: Number.NaN })).toThrow(VenueZoneRequiredError);
  });
});

describe("parseVenueFilters", () => {
  it("lee los filtros de la URL", () => {
    expect(parseVenueFilters({ zoneId: "3", isVerified: "false", page: "2" })).toEqual({
      zoneId: 3,
      isVerified: false,
      page: 2,
    });
  });

  // La URL la puede escribir cualquiera: un valor raro no debe romper la página
  it("ignora lo que no tiene sentido en vez de fallar", () => {
    expect(parseVenueFilters({ zoneId: "abc", isVerified: "quizás", page: "-1" })).toEqual({
      zoneId: null,
      isVerified: null,
      page: 1,
    });
  });
});

describe("permisos (RF-2.3 a RF-2.5)", () => {
  const owner = { id: 2, roles: [RoleName.USER, RoleName.OWNER] };
  const otherOwner = { id: 3, roles: [RoleName.OWNER] };
  const admin = { id: 1, roles: [RoleName.ADMIN] };
  const venue = {
    name: "Teatro",
    address: "Cra 5",
    zone: { id: 2, name: "Centro" },
    owner: { id: 2, username: "teatro", fullName: "Teatro" },
    isVerified: true,
    latitude: 3.4497,
    longitude: -76.5339,
  };

  it("solo un OWNER registra y solo un ADMIN verifica", () => {
    expect(canRegisterVenues(owner)).toBe(true);
    expect(canRegisterVenues(admin)).toBe(false);
    expect(canVerifyVenues(admin)).toBe(true);
    expect(canVerifyVenues(owner)).toBe(false);
  });

  it("el dueño y el ADMIN administran el lugar; otro OWNER no", () => {
    expect(canManageVenue(owner, venue)).toBe(true);
    expect(canManageVenue(admin, venue)).toBe(true);
    expect(canManageVenue(otherOwner, venue)).toBe(false);
  });

  describe("editLosesVerification", () => {
    const same = { name: "Teatro", address: "Cra 5", zoneId: 2, latitude: 3.4497, longitude: -76.5339 };

    it("el OWNER la pierde si cambia nombre, dirección o zona", () => {
      expect(editLosesVerification(owner, venue, { ...same, address: "Cra 6" })).toBe(true);
    });

    it("también si mueve el lugar en el mapa", () => {
      expect(editLosesVerification(owner, venue, { ...same, latitude: 3.46 })).toBe(true);
    });

    it("no la pierde si solo cambia la descripción", () => {
      expect(editLosesVerification(owner, venue, same)).toBe(false);
    });

    it("el ADMIN la conserva aunque cambie todo", () => {
      expect(editLosesVerification(admin, venue, { name: "X", address: "Y", zoneId: 9, latitude: null, longitude: null })).toBe(false);
    });
  });
});
