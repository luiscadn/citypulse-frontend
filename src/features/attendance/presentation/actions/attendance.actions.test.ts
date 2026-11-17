import { beforeEach, describe, expect, it, vi } from "vitest";
import { refresh } from "next/cache";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { attendanceContainer } from "../../di/attendance.container";
import { AttendanceEventForbiddenError } from "../../domain/errors/attendance-errors";
import { respondAttendanceAction } from "./attendance.actions";

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
vi.mock("../../di/attendance.container", () => ({
  attendanceContainer: { respondAttendanceUseCase: { execute: vi.fn() } },
}));

const respond = vi.mocked(attendanceContainer.respondAttendanceUseCase.execute);
const EVENT_ID = "8f1c2c0e-5a4b-4c1e-9d0a-1b2c3d4e5f60";

function form(status: string): FormData {
  const data = new FormData();
  data.set("eventId", EVENT_ID);
  data.set("status", status);
  return data;
}

describe("respondAttendanceAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getCurrentUser).mockResolvedValue({ id: 4, email: "ana@citypulse.co", roles: [] });
  });

  it("sin sesión manda al login y no llama al backend", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);
    await expect(respondAttendanceAction({ status: null }, form("ASISTIRE"))).rejects.toThrow("REDIRECT");
    expect(respond).not.toHaveBeenCalled();
  });

  it("guarda la respuesta, refresca la página y la devuelve como nuevo estado", async () => {
    respond.mockResolvedValue();
    const state = await respondAttendanceAction({ status: null }, form("QUIZAS"));
    expect(respond).toHaveBeenCalledWith(EVENT_ID, "QUIZAS");
    expect(refresh).toHaveBeenCalled();
    expect(state).toEqual({ status: "QUIZAS" });
  });

  it("si falla, conserva la respuesta anterior y muestra el error", async () => {
    respond.mockRejectedValue(new AttendanceEventForbiddenError());
    const state = await respondAttendanceAction({ status: "ASISTIRE" }, form("NO_ASISTIRE"));
    expect(state).toEqual({ status: "ASISTIRE", error: "No tienes acceso a este evento privado" });
    expect(refresh).not.toHaveBeenCalled();
  });
});
