import { beforeEach, describe, expect, it, vi } from "vitest";
import { refresh } from "next/cache";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { EventOrigin, EventStatus, EventVisibility, RoleName } from "@/shared/domain/enums";
import { eventContainer } from "../../di/event.container";
import { EventForbiddenError, EventNotEditableError } from "../../domain/errors/event-errors";
import { cancelEventAction, reportEventAction, updateEventAction } from "./event.actions";
import { initialEventFormState } from "./event-form-state";

vi.mock("next/cache", () => ({ refresh: vi.fn() }));
vi.mock("next/navigation", () => ({
  // redirect() de verdad lanza una excepción para cortar la ejecución
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT ${path}`);
  }),
}));
vi.mock("@/features/auth/infrastructure/session/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));
vi.mock("../../di/event.container", () => ({
  eventContainer: {
    reportEventUseCase: { execute: vi.fn() },
    updateEventUseCase: { execute: vi.fn() },
    cancelEventUseCase: { execute: vi.fn() },
  },
}));

const report = vi.mocked(eventContainer.reportEventUseCase.execute);
const update = vi.mocked(eventContainer.updateEventUseCase.execute);
const cancel = vi.mocked(eventContainer.cancelEventUseCase.execute);

const user = { id: 5, email: "ana@citypulse.co", roles: [RoleName.USER] };

const ID = "0b7c9a52-6c1e-4f1a-9a77-2f5f1f0f7a10";
const event = {
  id: ID,
  title: "Feria artesanal",
  description: null,
  startDate: "2026-12-01T14:00:00.000Z",
  endDate: "2026-12-01T22:00:00.000Z",
  zone: { id: 2, name: "Centro" },
  venue: null,
  addressText: null,
  origin: EventOrigin.REPORTE_USUARIO,
  status: EventStatus.REPORTADO,
  visibility: EventVisibility.PUBLICO,
  capacity: null,
  ticketPrice: null,
  createdBy: { id: 5, username: "ana", fullName: "Ana" },
};
const fields = {
  title: "Feria artesanal",
  description: "",
  zoneId: "2",
  addressText: "",
  startDate: "2026-12-01T09:00",
  endDate: "2026-12-01T17:00",
};

function form(values: Record<string, string>): FormData {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(getCurrentUser).mockResolvedValue(user);
});

describe("reportEventAction", () => {
  it("reporta el evento y lleva a su detalle", async () => {
    report.mockResolvedValue(event);

    await expect(reportEventAction(initialEventFormState(), form(fields))).rejects.toThrow(`REDIRECT /events/${ID}`);
    expect(report).toHaveBeenCalledWith({
      title: "Feria artesanal",
      description: "",
      zoneId: 2,
      addressText: "",
      startDate: "2026-12-01T09:00",
      endDate: "2026-12-01T17:00",
    });
  });

  it("sin sesión lleva al login sin llamar al backend", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);

    await expect(reportEventAction(initialEventFormState(), form(fields))).rejects.toThrow("REDIRECT /login");
    expect(report).not.toHaveBeenCalled();
  });

  it("deja el error de las fechas en el campo de fin y conserva lo escrito", async () => {
    const { EventDatesOrderError } = await import("../../domain/errors/event-errors");
    report.mockRejectedValue(new EventDatesOrderError());

    const state = await reportEventAction(initialEventFormState(), form(fields));

    expect(state.errors).toEqual({ endDate: "El evento debe terminar después de empezar" });
    expect(state.values.title).toBe("Feria artesanal");
  });

  it("un error que no es de un campo va como error general", async () => {
    report.mockRejectedValue(new Error("se cayó"));

    const state = await reportEventAction(initialEventFormState(), form(fields));

    expect(state.errors).toEqual({});
    expect(state.error).toBe("No se pudo conectar con el servidor. Intenta de nuevo.");
  });
});

describe("updateEventAction", () => {
  it("guarda los cambios y refresca la página", async () => {
    update.mockResolvedValue(event);

    const state = await updateEventAction(initialEventFormState(), form({ ...fields, eventId: ID }));

    expect(update).toHaveBeenCalledWith(ID, expect.objectContaining({ title: "Feria artesanal", zoneId: 2 }));
    expect(refresh).toHaveBeenCalled();
    expect(state.success).toBe("Cambios guardados.");
  });

  it("muestra por qué no se puede editar un reporte que ya fue revisado", async () => {
    update.mockRejectedValue(new EventNotEditableError());

    const state = await updateEventAction(initialEventFormState(), form({ ...fields, eventId: ID }));

    expect(state.error).toBe("Solo se puede editar un reporte que aún no ha sido revisado");
    expect(refresh).not.toHaveBeenCalled();
  });
});

describe("cancelEventAction", () => {
  it("cancela el evento y refresca el detalle", async () => {
    cancel.mockResolvedValue(undefined);

    await expect(cancelEventAction({}, form({ eventId: ID }))).resolves.toEqual({});
    expect(cancel).toHaveBeenCalledWith(ID);
    expect(refresh).toHaveBeenCalled();
  });

  it("devuelve el error si quien cancela no es el autor", async () => {
    cancel.mockRejectedValue(new EventForbiddenError());

    const state = await cancelEventAction({}, form({ eventId: ID }));

    expect(state.error).toBe("Solo el autor del evento o un administrador puede hacer esto");
    expect(refresh).not.toHaveBeenCalled();
  });

  it("sin sesión lleva al login", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);

    await expect(cancelEventAction({}, form({ eventId: ID }))).rejects.toThrow("REDIRECT /login");
    expect(cancel).not.toHaveBeenCalled();
  });
});
