import { describe, expect, it } from "vitest";
import { EventOrigin, EventStatus, RoleName } from "@/shared/domain/enums";
import {
  EventAddressTooLongError,
  EventDatesOrderError,
  EventEndDateRequiredError,
  EventStartDateRequiredError,
  EventTitleRequiredError,
  EventTitleTooLongError,
  EventZoneRequiredError,
  InvalidEventError,
} from "../errors/event-errors";
import {
  assertValidEventId,
  colombiaDayEndIso,
  colombiaDayStartIso,
  colombiaLocalToIso,
  isoToColombiaLocal,
  normalizeEventInput,
  parseEventFilters,
} from "./event-input";
import { EVENT_ADDRESS_MAX_LENGTH, EVENT_SEARCH_MAX_LENGTH, EVENT_TITLE_MAX_LENGTH } from "./event-limits";
import {
  canAddEvidence,
  canCancelEvent,
  canEditEvent,
  canModerateEvents,
  canPublishOfficialEvents,
  canReportEvents,
  canSeeAttendees,
} from "./event-permissions";

const draft = {
  title: "Feria artesanal",
  zoneId: 2,
  startDate: "2026-12-01T09:00",
  endDate: "2026-12-01T17:00",
};

describe("normalizeEventInput", () => {
  it("limpia los textos y pasa las fechas de hora de Colombia a UTC", () => {
    expect(
      normalizeEventInput({ ...draft, title: "  Feria artesanal ", description: "  ", addressText: " Plaza de Caycedo " }),
    ).toEqual({
      title: "Feria artesanal",
      description: null,
      zoneId: 2,
      addressText: "Plaza de Caycedo",
      startDate: "2026-12-01T14:00:00.000Z",
      endDate: "2026-12-01T22:00:00.000Z",
    });
  });

  it("exige título, zona y fechas", () => {
    expect(() => normalizeEventInput({ ...draft, title: "   " })).toThrow(EventTitleRequiredError);
    expect(() => normalizeEventInput({ ...draft, zoneId: Number.NaN })).toThrow(EventZoneRequiredError);
    expect(() => normalizeEventInput({ ...draft, startDate: "" })).toThrow(EventStartDateRequiredError);
    expect(() => normalizeEventInput({ ...draft, endDate: "" })).toThrow(EventEndDateRequiredError);
  });

  it("rechaza fechas que no son fechas", () => {
    expect(() => normalizeEventInput({ ...draft, startDate: "mañana" })).toThrow(EventStartDateRequiredError);
    expect(() => normalizeEventInput({ ...draft, endDate: "2026-13-45T10:00" })).toThrow(EventEndDateRequiredError);
  });

  // RF-3: el backend responde 400 si end_date no es posterior a start_date
  it("rechaza un evento que termina antes o justo cuando empieza", () => {
    expect(() => normalizeEventInput({ ...draft, endDate: "2026-12-01T08:00" })).toThrow(EventDatesOrderError);
    expect(() => normalizeEventInput({ ...draft, endDate: draft.startDate })).toThrow(EventDatesOrderError);
  });

  it("respeta los límites de largo del backend", () => {
    expect(() => normalizeEventInput({ ...draft, title: "a".repeat(EVENT_TITLE_MAX_LENGTH + 1) })).toThrow(
      EventTitleTooLongError,
    );
    expect(() => normalizeEventInput({ ...draft, addressText: "a".repeat(EVENT_ADDRESS_MAX_LENGTH + 1) })).toThrow(
      EventAddressTooLongError,
    );
  });
});

describe("fechas en hora de Colombia", () => {
  it("ida y vuelta, también cuando el desfase cambia el día", () => {
    const iso = colombiaLocalToIso("2026-12-31T22:30");
    expect(iso).toBe("2027-01-01T03:30:00.000Z");
    expect(isoToColombiaLocal(iso!)).toBe("2026-12-31T22:30");
  });

  it("rechaza lo que no tiene el formato del campo", () => {
    expect(colombiaLocalToIso("2026-12-01")).toBeNull();
    expect(colombiaLocalToIso("2026-12-01T09:00:00")).toBeNull();
  });
});

describe("assertValidEventId", () => {
  it("acepta un UUID y rechaza lo demás", () => {
    expect(() => assertValidEventId("0b7c9a52-6c1e-4f1a-9a77-2f5f1f0f7a10")).not.toThrow();
    expect(() => assertValidEventId("12")).toThrow(InvalidEventError);
    expect(() => assertValidEventId("")).toThrow(InvalidEventError);
  });
});

describe("parseEventFilters", () => {
  it("lee los filtros de la URL", () => {
    expect(
      parseEventFilters({
        zoneId: "2",
        status: "CONFIRMADO",
        origin: "OFICIAL",
        search: " jazz ",
        from: "2026-12-01",
        to: "2026-12-31",
        page: "3",
      }),
    ).toEqual({
      zoneId: 2,
      status: EventStatus.CONFIRMADO,
      origin: EventOrigin.OFICIAL,
      search: "jazz",
      from: "2026-12-01",
      to: "2026-12-31",
      page: 3,
    });
  });

  // La URL la puede escribir cualquiera: lo que no sirve se ignora en vez de fallar
  it("ignora valores que no tienen sentido", () => {
    expect(
      parseEventFilters({ zoneId: "-1", status: "NADA", origin: "x", search: "  ", from: "ayer", to: "2026-02-31", page: "0" }),
    ).toEqual({
      zoneId: null,
      status: null,
      origin: null,
      search: null,
      from: null,
      to: null,
      page: 1,
    });
  });

  it("recorta la búsqueda al máximo que acepta el backend", () => {
    const { search } = parseEventFilters({ search: "a".repeat(EVENT_SEARCH_MAX_LENGTH + 20) });
    expect(search).toHaveLength(EVENT_SEARCH_MAX_LENGTH);
  });
});

describe("rango de un día de Colombia", () => {
  // Un día de Colombia va de las 05:00 UTC de ese día a las 04:59 UTC del siguiente
  it("empieza a medianoche y termina a las 23:59:59.999, hora de Colombia", () => {
    expect(colombiaDayStartIso("2026-12-01")).toBe("2026-12-01T05:00:00.000Z");
    expect(colombiaDayEndIso("2026-12-01")).toBe("2026-12-02T04:59:59.999Z");
  });
});

describe("permisos", () => {
  const author = { id: 5, roles: [RoleName.USER] };
  const stranger = { id: 6, roles: [RoleName.USER] };
  const admin = { id: 1, roles: [RoleName.ADMIN] };
  const reported = { createdBy: { id: 5, username: "ana", fullName: "Ana" }, status: EventStatus.REPORTADO };

  it("cualquier usuario con sesión puede reportar; sin sesión, no", () => {
    expect(canReportEvents(stranger)).toBe(true);
    expect(canReportEvents(null)).toBe(false);
  });

  it("el autor y el ADMIN editan un reporte; otro usuario no", () => {
    expect(canEditEvent(author, reported)).toBe(true);
    expect(canEditEvent(admin, reported)).toBe(true);
    expect(canEditEvent(stranger, reported)).toBe(false);
    expect(canEditEvent(null, reported)).toBe(false);
  });

  // RF-3.5: solo se edita mientras está en REPORTADO
  it("no se edita un evento que ya fue revisado o cancelado", () => {
    for (const status of [EventStatus.CONFIRMADO, EventStatus.RECHAZADO, EventStatus.CANCELADO]) {
      expect(canEditEvent(author, { ...reported, status })).toBe(false);
    }
  });

  it("el autor y el ADMIN cancelan un evento, salvo que ya esté cancelado", () => {
    expect(canCancelEvent(author, { ...reported, status: EventStatus.CONFIRMADO })).toBe(true);
    expect(canCancelEvent(admin, reported)).toBe(true);
    expect(canCancelEvent(stranger, reported)).toBe(false);
    expect(canCancelEvent(author, { ...reported, status: EventStatus.CANCELADO })).toBe(false);
  });

  // RF-5.7: la lista completa de respuestas es solo para el autor y el ADMIN
  it("solo el autor y el ADMIN ven a todos los que respondieron", () => {
    expect(canSeeAttendees(author, reported)).toBe(true);
    expect(canSeeAttendees(admin, reported)).toBe(true);
    expect(canSeeAttendees(stranger, reported)).toBe(false);
    expect(canSeeAttendees(null, reported)).toBe(false);
  });

  it("solo un ADMIN modera reportes", () => {
    expect(canModerateEvents(admin)).toBe(true);
    expect(canModerateEvents(author)).toBe(false);
    expect(canModerateEvents(null)).toBe(false);
  });

  it("el autor y el ADMIN adjuntan evidencias solo mientras el reporte está en revisión", () => {
    expect(canAddEvidence(author, reported)).toBe(true);
    expect(canAddEvidence(admin, reported)).toBe(true);
    expect(canAddEvidence(stranger, reported)).toBe(false);
    expect(canAddEvidence(author, { ...reported, status: EventStatus.CONFIRMADO })).toBe(false);
  });

  it("solo un OWNER o un ADMIN publica eventos oficiales", () => {
    expect(canPublishOfficialEvents({ id: 9, roles: [RoleName.OWNER] })).toBe(true);
    expect(canPublishOfficialEvents(admin)).toBe(true);
    expect(canPublishOfficialEvents(stranger)).toBe(false);
    expect(canPublishOfficialEvents(null)).toBe(false);
  });
});
