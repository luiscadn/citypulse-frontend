import { beforeEach, describe, expect, it, vi } from "vitest";
import { EventOrigin, EventStatus, EventVisibility } from "@/shared/domain/enums";
import { HttpError } from "@/shared/infrastructure/http-client";
import {
  EventAlreadyCancelledError,
  EventForbiddenError,
  EventNotEditableError,
  EventNotFoundError,
  EventPrivateError,
  EventZoneNotFoundError,
  OfficialVenueForbiddenError,
  ReportAlreadyReviewedError,
  ReportWithoutEvidenceError,
} from "../../domain/errors/event-errors";
import { HttpEventRepository } from "./http-event-repository";

const http = { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() };
const repository = new HttpEventRepository(http);

const ID = "0b7c9a52-6c1e-4f1a-9a77-2f5f1f0f7a10";
const event = {
  id: ID,
  title: "Feria artesanal",
  description: null,
  startDate: "2026-12-01T14:00:00.000Z",
  endDate: "2026-12-01T22:00:00.000Z",
  zone: { id: 2, name: "Centro Histórico" },
  venue: null,
  addressText: "Plaza de Caycedo",
  origin: EventOrigin.REPORTE_USUARIO,
  status: EventStatus.REPORTADO,
  visibility: EventVisibility.PUBLICO,
  capacity: null,
  ticketPrice: null,
  createdBy: { id: 5, username: "ana", fullName: "Ana Pérez" },
};
// El backend manda más campos (fechas internas, y podría mandar el correo del autor): la UI no los recibe
const eventDto = {
  ...event,
  createdAt: "2026-11-14T05:31:00.711Z",
  updatedAt: "2026-11-14T05:31:00.711Z",
  createdBy: { ...event.createdBy, email: "ana@citypulse.co" },
};
const input = {
  title: "Feria artesanal",
  description: null,
  zoneId: 2,
  addressText: "Plaza de Caycedo",
  startDate: event.startDate,
  endDate: event.endDate,
};

beforeEach(() => vi.clearAllMocks());

describe("list", () => {
  it("arma la URL con los filtros y no deja pasar el correo del autor", async () => {
    http.get.mockResolvedValue({ data: [eventDto], total: 1, page: 2, limit: 12, lastPage: 2 });

    await expect(
      repository.list({
        zoneId: 2,
        status: EventStatus.CONFIRMADO,
        origin: EventOrigin.OFICIAL,
        search: "feria",
        from: null,
        to: null,
        page: 2,
      }),
    ).resolves.toEqual({ events: [event], total: 1, page: 2, lastPage: 2 });
    expect(http.get).toHaveBeenCalledWith("/events?page=2&limit=12&zoneId=2&status=CONFIRMADO&origin=OFICIAL&search=feria");
  });

  // Las fechas del filtro son días de Colombia: el backend las recibe como instantes UTC
  it("envía el rango de fechas como instantes que cubren los días completos", async () => {
    http.get.mockResolvedValue({ data: [], total: 0, page: 1, limit: 12, lastPage: 0 });

    await repository.list({
      zoneId: null,
      status: null,
      origin: null,
      search: null,
      from: "2026-12-01",
      to: "2026-12-31",
      page: 1,
    });

    const params = new URL(`http://x${http.get.mock.calls[0][0]}`).searchParams;
    expect(params.get("from")).toBe("2026-12-01T05:00:00.000Z");
    expect(params.get("to")).toBe("2027-01-01T04:59:59.999Z");
  });

  // Sin resultados el backend responde lastPage: 0
  it("no envía los filtros vacíos y siempre hay al menos una página", async () => {
    http.get.mockResolvedValue({ data: [], total: 0, page: 1, limit: 12, lastPage: 0 });

    const page = await repository.list({
      zoneId: null,
      status: null,
      origin: null,
      search: null,
      from: null,
      to: null,
      page: 1,
    });

    expect(http.get).toHaveBeenCalledWith("/events?page=1&limit=12");
    expect(page.lastPage).toBe(1);
  });

  it("convierte el precio, que llega como texto, a número", async () => {
    http.get.mockResolvedValue({
      data: [{ ...eventDto, ticketPrice: "45000.00", capacity: 300 }],
      total: 1,
      page: 1,
      limit: 12,
      lastPage: 1,
    });

    const { events } = await repository.list({
      zoneId: null,
      status: null,
      origin: null,
      search: null,
      from: null,
      to: null,
      page: 1,
    });

    expect(events[0]).toMatchObject({ ticketPrice: 45000, capacity: 300 });
  });
});

describe("findById", () => {
  it("devuelve el detalle con asistentes y evidencias", async () => {
    http.get.mockResolvedValue({
      ...eventDto,
      attendeeCount: 4,
      rejectionReason: null,
      evidences: [{ id: 1, type: "ENLACE", url: "https://example.com", caption: null, uploadedBy: { email: "x" } }],
    });

    await expect(repository.findById(ID)).resolves.toEqual({
      ...event,
      attendeeCount: 4,
      rejectionReason: null,
      evidences: [{ id: 1, type: "ENLACE", url: "https://example.com", caption: null }],
    });
    expect(http.get).toHaveBeenCalledWith(`/events/${ID}`);
  });

  it("acepta un detalle sin evidencias", async () => {
    http.get.mockResolvedValue({ ...eventDto, attendeeCount: 0, rejectionReason: null });
    expect((await repository.findById(ID)).evidences).toEqual([]);
  });

  it.each([
    [403, EventPrivateError],
    [404, EventNotFoundError],
  ])("traduce el %i a un error de dominio", async (status, errorType) => {
    http.get.mockRejectedValue(new HttpError(status, {}));
    await expect(repository.findById(ID)).rejects.toBeInstanceOf(errorType);
  });

  it("deja pasar los errores inesperados", async () => {
    http.get.mockRejectedValue(new HttpError(500, {}));
    await expect(repository.findById(ID)).rejects.toBeInstanceOf(HttpError);
  });
});

describe("report", () => {
  it("no envía los textos vacíos", async () => {
    http.post.mockResolvedValue(eventDto);

    await repository.report({ ...input, addressText: null });

    expect(http.post).toHaveBeenCalledWith("/events/report", {
      title: "Feria artesanal",
      zoneId: 2,
      startDate: input.startDate,
      endDate: input.endDate,
    });
  });

  it("traduce el 404 a zona inexistente", async () => {
    http.post.mockRejectedValue(new HttpError(404, {}));
    await expect(repository.report(input)).rejects.toBeInstanceOf(EventZoneNotFoundError);
  });
});

describe("update", () => {
  it("envía siempre descripción y dirección, vacías como texto vacío", async () => {
    http.patch.mockResolvedValue(eventDto);

    await repository.update(ID, { ...input, addressText: null });

    expect(http.patch).toHaveBeenCalledWith(`/events/${ID}`, {
      title: "Feria artesanal",
      zoneId: 2,
      startDate: input.startDate,
      endDate: input.endDate,
      description: "",
      addressText: "",
    });
  });

  it.each([
    [403, {}, EventForbiddenError],
    [404, {}, EventNotFoundError],
    [400, { message: "Solo se puede editar un evento en estado REPORTADO" }, EventNotEditableError],
  ])("traduce el %i a un error de dominio", async (status, body, errorType) => {
    http.patch.mockRejectedValue(new HttpError(status, body));
    await expect(repository.update(ID, input)).rejects.toBeInstanceOf(errorType);
  });

  it("deja pasar los demás 400 con su mensaje de validación", async () => {
    http.patch.mockRejectedValue(new HttpError(400, { message: ["title must be shorter"] }));
    await expect(repository.update(ID, input)).rejects.toBeInstanceOf(HttpError);
  });
});

describe("cancel", () => {
  it("cancela con DELETE", async () => {
    http.delete.mockResolvedValue(undefined);
    await repository.cancel(ID);
    expect(http.delete).toHaveBeenCalledWith(`/events/${ID}`);
  });

  it.each([
    [400, EventAlreadyCancelledError],
    [403, EventForbiddenError],
    [404, EventNotFoundError],
  ])("traduce el %i a un error de dominio", async (status, errorType) => {
    http.delete.mockRejectedValue(new HttpError(status, {}));
    await expect(repository.cancel(ID)).rejects.toBeInstanceOf(errorType);
  });
});

describe("moderación, evidencias y eventos oficiales", () => {
  const evidence = { id: 1, type: "FOTO", url: "https://example.com/a.jpg", caption: null };

  it("mapea la cola de moderación con sus evidencias", async () => {
    http.get.mockResolvedValue([{ ...eventDto, evidences: [evidence] }]);
    const [report] = await repository.listPendingReports();
    expect(http.get).toHaveBeenCalledWith("/moderation/pending");
    expect(report.evidences).toEqual([evidence]);
    expect(report.createdBy).toEqual(event.createdBy);
  });

  it("distingue los dos 400 de confirmar por el texto del backend", async () => {
    http.patch.mockRejectedValueOnce(
      new HttpError(400, { message: "El reporte debe tener al menos una evidencia para ser confirmado" }),
    );
    await expect(repository.confirmReport(ID)).rejects.toBeInstanceOf(ReportWithoutEvidenceError);

    http.patch.mockRejectedValueOnce(new HttpError(400, { message: "El evento ya fue procesado" }));
    await expect(repository.confirmReport(ID)).rejects.toBeInstanceOf(ReportAlreadyReviewedError);
  });

  it("envía el motivo del rechazo", async () => {
    http.patch.mockResolvedValue({});
    await repository.rejectReport(ID, "Sin pruebas");
    expect(http.patch).toHaveBeenCalledWith(`/moderation/${ID}/reject`, { reason: "Sin pruebas" });
  });

  it("adjunta una evidencia sin enviar la descripción vacía", async () => {
    http.post.mockResolvedValue({});
    await repository.addEvidence(ID, { type: "ENLACE", url: "https://example.com", caption: null });
    expect(http.post).toHaveBeenCalledWith(`/evidence/event/${ID}`, { type: "ENLACE", url: "https://example.com" });
  });

  it("publica un evento oficial y traduce el 403 de lugar ajeno", async () => {
    const official = { ...input, venueId: 7, visibility: EventVisibility.PUBLICO, capacity: null, ticketPrice: 0 };
    http.post.mockResolvedValueOnce({ ...eventDto, origin: EventOrigin.OFICIAL, status: EventStatus.CONFIRMADO });
    await repository.publishOfficial(official);
    expect(http.post).toHaveBeenCalledWith(
      "/events/official",
      expect.objectContaining({ venueId: 7, visibility: "PUBLICO", ticketPrice: 0 }),
    );
    expect(http.post.mock.calls[0][1]).not.toHaveProperty("capacity");

    http.post.mockRejectedValueOnce(new HttpError(403, {}));
    await expect(repository.publishOfficial(official)).rejects.toBeInstanceOf(OfficialVenueForbiddenError);
  });
});
