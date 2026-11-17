import { beforeEach, describe, expect, it, vi } from "vitest";
import { refresh } from "next/cache";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { RoleName } from "@/shared/domain/enums";
import { eventContainer } from "../../di/event.container";
import { ReportWithoutEvidenceError } from "../../domain/errors/event-errors";
import { confirmReportAction, rejectReportAction } from "./moderation.actions";

vi.mock("next/cache", () => ({ refresh: vi.fn() }));
vi.mock("next/navigation", () => ({
  // redirect() de verdad lanza una excepción para cortar la ejecución
  redirect: vi.fn(() => {
    throw new Error("REDIRECT");
  }),
}));
vi.mock("@/features/auth/infrastructure/session/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));
vi.mock("../../di/event.container", () => ({
  eventContainer: {
    confirmReportUseCase: { execute: vi.fn() },
    rejectReportUseCase: { execute: vi.fn() },
  },
}));

const confirm = vi.mocked(eventContainer.confirmReportUseCase.execute);
const reject = vi.mocked(eventContainer.rejectReportUseCase.execute);
const ID = "0b7c9a52-6c1e-4f1a-9a77-2f5f1f0f7a10";
const admin = { id: 1, email: "admin@citypulse.co", roles: [RoleName.ADMIN] };
const user = { id: 4, email: "ana@citypulse.co", roles: [RoleName.USER] };

function form(values: Record<string, string>): FormData {
  const data = new FormData();
  Object.entries(values).forEach(([key, value]) => data.set(key, value));
  return data;
}

beforeEach(() => vi.clearAllMocks());

describe("confirmReportAction", () => {
  it("un ADMIN confirma el reporte y se refresca la página", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(admin);
    await expect(confirmReportAction({}, form({ eventId: ID }))).resolves.toEqual({});
    expect(confirm).toHaveBeenCalledWith(ID);
    expect(refresh).toHaveBeenCalled();
  });

  it("otro rol no puede confirmar aunque mande el POST a mano", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(user);
    const state = await confirmReportAction({}, form({ eventId: ID }));
    expect(state.error).toMatch(/administrador/);
    expect(confirm).not.toHaveBeenCalled();
  });

  it("muestra el error de dominio, por ejemplo si falta la evidencia", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(admin);
    confirm.mockRejectedValue(new ReportWithoutEvidenceError());
    const state = await confirmReportAction({}, form({ eventId: ID }));
    expect(state.error).toBe(new ReportWithoutEvidenceError().message);
  });
});

describe("rejectReportAction", () => {
  it("rechaza con el motivo y deja el formulario vacío", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(admin);
    const state = await rejectReportAction({ reason: "" }, form({ eventId: ID, reason: "Sin pruebas" }));
    expect(reject).toHaveBeenCalledWith(ID, "Sin pruebas");
    expect(state).toEqual({ reason: "" });
  });

  it("si falla, conserva el motivo escrito", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(admin);
    reject.mockRejectedValue(new Error("caída"));
    const state = await rejectReportAction({ reason: "" }, form({ eventId: ID, reason: "Sin pruebas" }));
    expect(state.reason).toBe("Sin pruebas");
    expect(state.error).toBeDefined();
  });
});
