import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  InvalidAttendanceEventError,
  InvalidAttendanceStatusError,
} from "../../domain/errors/attendance-errors";
import type { AttendanceRepository } from "../repositories/attendance-repository";
import { GetEventAttendeesUseCase } from "./get-event-attendees.use-case";
import { GetFriendsAttendanceUseCase } from "./get-friends-attendance.use-case";
import { GetMyAttendanceUseCase } from "./get-my-attendance.use-case";
import { RespondAttendanceUseCase } from "./respond-attendance.use-case";

const repository = {
  getMyStatus: vi.fn(),
  respond: vi.fn(),
  getAttendees: vi.fn(),
  getFriendsAttendance: vi.fn(),
} satisfies AttendanceRepository;

const eventId = "3f2b8c1e-7a4d-4e9b-8c21-5d6f7a8b9c0d";
const attendance = [{ user: { id: 7, username: "ana", fullName: "Ana Pérez" }, status: "QUIZAS" }];

beforeEach(() => vi.clearAllMocks());

describe("GetMyAttendanceUseCase", () => {
  const useCase = new GetMyAttendanceUseCase(repository);

  it.each(["ASISTIRE", null])("devuelve la respuesta %j", async (status) => {
    repository.getMyStatus.mockResolvedValue(status);

    await expect(useCase.execute(eventId)).resolves.toBe(status);
    expect(repository.getMyStatus).toHaveBeenCalledWith(eventId);
  });

  it("no consulta un evento con ID inválido", async () => {
    await expect(useCase.execute("abc")).rejects.toBeInstanceOf(InvalidAttendanceEventError);
    expect(repository.getMyStatus).not.toHaveBeenCalled();
  });
});

describe("RespondAttendanceUseCase", () => {
  const useCase = new RespondAttendanceUseCase(repository);

  it.each(["ASISTIRE", "QUIZAS", "NO_ASISTIRE"])("registra la respuesta %s", async (status) => {
    repository.respond.mockResolvedValue(undefined);

    await useCase.execute(eventId, status);

    expect(repository.respond).toHaveBeenCalledWith(eventId, status);
  });

  it.each(["", "asistire", "PENDIENTE"])("no registra la respuesta %j", async (status) => {
    await expect(useCase.execute(eventId, status)).rejects.toBeInstanceOf(InvalidAttendanceStatusError);
    expect(repository.respond).not.toHaveBeenCalled();
  });

  it("no responde a un evento con ID inválido", async () => {
    await expect(useCase.execute("abc", "ASISTIRE")).rejects.toBeInstanceOf(InvalidAttendanceEventError);
    expect(repository.respond).not.toHaveBeenCalled();
  });
});

describe("GetEventAttendeesUseCase", () => {
  const useCase = new GetEventAttendeesUseCase(repository);

  it("devuelve las respuestas del repositorio", async () => {
    repository.getAttendees.mockResolvedValue(attendance);

    await expect(useCase.execute(eventId)).resolves.toEqual(attendance);
    expect(repository.getAttendees).toHaveBeenCalledWith(eventId);
  });

  it("no consulta un evento con ID inválido", async () => {
    await expect(useCase.execute("abc")).rejects.toBeInstanceOf(InvalidAttendanceEventError);
    expect(repository.getAttendees).not.toHaveBeenCalled();
  });
});

describe("GetFriendsAttendanceUseCase", () => {
  const useCase = new GetFriendsAttendanceUseCase(repository);

  it("devuelve las respuestas del repositorio", async () => {
    repository.getFriendsAttendance.mockResolvedValue(attendance);

    await expect(useCase.execute(eventId)).resolves.toEqual(attendance);
    expect(repository.getFriendsAttendance).toHaveBeenCalledWith(eventId);
  });

  it("no consulta un evento con ID inválido", async () => {
    await expect(useCase.execute("abc")).rejects.toBeInstanceOf(InvalidAttendanceEventError);
    expect(repository.getFriendsAttendance).not.toHaveBeenCalled();
  });
});
