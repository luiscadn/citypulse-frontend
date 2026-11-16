import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  EventDatesOrderError,
  EventNotFoundError,
  EventTitleRequiredError,
  InvalidEventError,
} from "../../domain/errors/event-errors";
import type { EventRepository } from "../repositories/event-repository";
import { CancelEventUseCase } from "./cancel-event.use-case";
import { GetEventUseCase } from "./get-event.use-case";
import { ListEventsUseCase } from "./list-events.use-case";
import { ReportEventUseCase } from "./report-event.use-case";
import { UpdateEventUseCase } from "./update-event.use-case";

const repository = {
  list: vi.fn(),
  findById: vi.fn(),
  report: vi.fn(),
  update: vi.fn(),
  cancel: vi.fn(),
} satisfies EventRepository;

const ID = "0b7c9a52-6c1e-4f1a-9a77-2f5f1f0f7a10";
const draft = { title: " Feria ", zoneId: 2, startDate: "2026-12-01T09:00", endDate: "2026-12-01T17:00" };
const input = {
  title: "Feria",
  description: null,
  zoneId: 2,
  addressText: null,
  startDate: "2026-12-01T14:00:00.000Z",
  endDate: "2026-12-01T22:00:00.000Z",
};

beforeEach(() => vi.clearAllMocks());

describe("ListEventsUseCase", () => {
  it("pasa los filtros tal cual al repositorio", async () => {
    const filters = { zoneId: 2, status: null, origin: null, search: "jazz", from: null, to: null, page: 1 };
    repository.list.mockResolvedValue({ events: [], total: 0, page: 1, lastPage: 1 });

    await new ListEventsUseCase(repository).execute(filters);

    expect(repository.list).toHaveBeenCalledWith(filters);
  });
});

describe("GetEventUseCase", () => {
  it("trata un ID imposible como evento inexistente sin llamar al backend", async () => {
    await expect(new GetEventUseCase(repository).execute("12")).rejects.toBeInstanceOf(EventNotFoundError);
    expect(repository.findById).not.toHaveBeenCalled();
  });

  it("pide el evento con un UUID válido", async () => {
    await new GetEventUseCase(repository).execute(ID);
    expect(repository.findById).toHaveBeenCalledWith(ID);
  });
});

describe("ReportEventUseCase", () => {
  const useCase = new ReportEventUseCase(repository);

  it("reporta el evento con los datos normalizados", async () => {
    await useCase.execute(draft);
    expect(repository.report).toHaveBeenCalledWith(input);
  });

  it("no llama al backend con datos inválidos", async () => {
    await expect(useCase.execute({ ...draft, title: "" })).rejects.toBeInstanceOf(EventTitleRequiredError);
    await expect(useCase.execute({ ...draft, endDate: "2026-12-01T08:00" })).rejects.toBeInstanceOf(
      EventDatesOrderError,
    );
    expect(repository.report).not.toHaveBeenCalled();
  });
});

describe("UpdateEventUseCase", () => {
  it("edita con los datos normalizados", async () => {
    await new UpdateEventUseCase(repository).execute(ID, draft);
    expect(repository.update).toHaveBeenCalledWith(ID, input);
  });

  it("rechaza un ID inválido sin llamar al backend", async () => {
    await expect(new UpdateEventUseCase(repository).execute("x", draft)).rejects.toBeInstanceOf(InvalidEventError);
    expect(repository.update).not.toHaveBeenCalled();
  });
});

describe("CancelEventUseCase", () => {
  it("cancela el evento", async () => {
    await new CancelEventUseCase(repository).execute(ID);
    expect(repository.cancel).toHaveBeenCalledWith(ID);
  });

  it("rechaza un ID inválido sin llamar al backend", async () => {
    await expect(new CancelEventUseCase(repository).execute("x")).rejects.toBeInstanceOf(InvalidEventError);
    expect(repository.cancel).not.toHaveBeenCalled();
  });
});
