import { describe, expect, it } from "vitest";
import { EventOrigin, EventStatus, EventVisibility } from "@/shared/domain/enums";
import { EventDatesOrderError, InvalidEventError } from "../errors/event-errors";
import { createEvent, createEventDetail, createPendingReport, type Event, type EventDetail, type EvidenceType } from "./event";

const valid: Event = {
  id: "8f1c2c0e-5a4b-4c1e-9d0a-1b2c3d4e5f60",
  title: "Concierto en el parque",
  description: null,
  startDate: "2026-12-01T20:00:00.000Z",
  endDate: "2026-12-01T23:00:00.000Z",
  zone: { id: 2, name: "Centro" },
  venue: null,
  addressText: "Parque del Perro",
  origin: EventOrigin.REPORTE_USUARIO,
  status: EventStatus.REPORTADO,
  visibility: EventVisibility.PUBLICO,
  capacity: 200,
  ticketPrice: 0,
  createdBy: { id: 4, username: "ana", fullName: "Ana Pérez" },
};

describe("createEvent", () => {
  it("construye un evento válido y lo congela", () => {
    const event = createEvent(valid);
    expect(event).toEqual(valid);
    expect(Object.isFrozen(event)).toBe(true);
  });

  it("rechaza un título vacío", () => {
    expect(() => createEvent({ ...valid, title: " " })).toThrow(InvalidEventError);
  });

  it("exige que termine después de empezar", () => {
    expect(() => createEvent({ ...valid, endDate: valid.startDate })).toThrow(EventDatesOrderError);
  });

  it("rechaza fechas ilegibles", () => {
    expect(() => createEvent({ ...valid, startDate: "pronto" })).toThrow(InvalidEventError);
  });

  it("rechaza un estado que no existe", () => {
    expect(() => createEvent({ ...valid, status: "PERDIDO" as EventStatus })).toThrow(InvalidEventError);
  });

  it("rechaza capacidad cero y precio negativo", () => {
    expect(() => createEvent({ ...valid, capacity: 0 })).toThrow(InvalidEventError);
    expect(() => createEvent({ ...valid, ticketPrice: -1 })).toThrow(InvalidEventError);
  });

  it("acepta capacidad y precio sin definir", () => {
    expect(createEvent({ ...valid, capacity: null, ticketPrice: null }).capacity).toBeNull();
  });
});

describe("createEventDetail", () => {
  const detail: EventDetail = {
    ...valid,
    attendeeCount: 3,
    evidences: [{ id: 1, type: "FOTO", url: "https://example.com/foto.jpg", caption: null }],
    rejectionReason: null,
  };

  it("construye el detalle con sus evidencias", () => {
    expect(createEventDetail(detail)).toEqual(detail);
  });

  it("rechaza un número de asistentes negativo", () => {
    expect(() => createEventDetail({ ...detail, attendeeCount: -1 })).toThrow(InvalidEventError);
  });

  it("rechaza una evidencia de un tipo desconocido", () => {
    const evidences = [{ ...detail.evidences[0], type: "AUDIO" as EvidenceType }];
    expect(() => createEventDetail({ ...detail, evidences })).toThrow(InvalidEventError);
  });
});

describe("createPendingReport", () => {
  it("acepta un reporte en revisión con sus evidencias", () => {
    const report = createPendingReport({ ...valid, evidences: [] });
    expect(report.status).toBe(EventStatus.REPORTADO);
  });

  it("no deja en la cola un evento que ya fue revisado", () => {
    expect(() => createPendingReport({ ...valid, status: EventStatus.CONFIRMADO, evidences: [] })).toThrow(
      InvalidEventError,
    );
  });
});
