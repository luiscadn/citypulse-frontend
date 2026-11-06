import { beforeEach, describe, expect, it, vi } from "vitest";
import { HttpError } from "@/shared/infrastructure/http-client";
import {
  AttendanceEventForbiddenError,
  AttendanceEventNotFoundError,
  AttendeesForbiddenError,
} from "../../domain/errors/attendance-errors";
import { HttpAttendanceRepository } from "./http-attendance-repository";

const http = { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() };
const repository = new HttpAttendanceRepository(http);

const eventId = "3f2b8c1e-7a4d-4e9b-8c21-5d6f7a8b9c0d";

// Los listados mandan la entidad User completa: la UI solo debe recibir estos campos
const ana = { id: 7, username: "ana", fullName: "Ana Pérez" };
const attendanceDto = {
  id: 9,
  status: "NO_ASISTIRE",
  respondedAt: "2026-11-01T00:00:00.000Z",
  user: { ...ana, email: "ana@test.com", isActive: true },
};
const attendance = { status: "NO_ASISTIRE", user: ana };

beforeEach(() => vi.clearAllMocks());

describe("getMyStatus", () => {
  it.each(["QUIZAS", null])("devuelve la respuesta %j", async (status) => {
    http.get.mockResolvedValue({ status });

    await expect(repository.getMyStatus(eventId)).resolves.toBe(status);
    expect(http.get).toHaveBeenCalledWith(`/attendance/event/${eventId}/me`);
  });

  it("traduce el 404", async () => {
    http.get.mockRejectedValue(new HttpError(404, {}));

    await expect(repository.getMyStatus(eventId)).rejects.toBeInstanceOf(AttendanceEventNotFoundError);
  });
});

describe("respond", () => {
  it("envía la respuesta como status", async () => {
    http.post.mockResolvedValue({});

    await repository.respond(eventId, "ASISTIRE");

    expect(http.post).toHaveBeenCalledWith(`/attendance/event/${eventId}`, { status: "ASISTIRE" });
  });

  it.each([
    [403, AttendanceEventForbiddenError],
    [404, AttendanceEventNotFoundError],
  ])("traduce el %i", async (status, errorType) => {
    http.post.mockRejectedValue(new HttpError(status, {}));

    await expect(repository.respond(eventId, "ASISTIRE")).rejects.toBeInstanceOf(errorType);
  });

  it("deja pasar los errores que no conoce", async () => {
    const error = new HttpError(500, {});
    http.post.mockRejectedValue(error);

    await expect(repository.respond(eventId, "ASISTIRE")).rejects.toBe(error);
  });
});

describe("getAttendees", () => {
  it("mapea las respuestas recortando los usuarios", async () => {
    http.get.mockResolvedValue([attendanceDto]);

    await expect(repository.getAttendees(eventId)).resolves.toEqual([attendance]);
    expect(http.get).toHaveBeenCalledWith(`/attendance/event/${eventId}`);
  });

  it.each([
    [403, AttendeesForbiddenError],
    [404, AttendanceEventNotFoundError],
  ])("traduce el %i", async (status, errorType) => {
    http.get.mockRejectedValue(new HttpError(status, {}));

    await expect(repository.getAttendees(eventId)).rejects.toBeInstanceOf(errorType);
  });
});

describe("getFriendsAttendance", () => {
  it("mapea las respuestas recortando los usuarios", async () => {
    http.get.mockResolvedValue([attendanceDto]);

    await expect(repository.getFriendsAttendance(eventId)).resolves.toEqual([attendance]);
    expect(http.get).toHaveBeenCalledWith(`/attendance/event/${eventId}/friends`);
  });

  it("traduce el 404", async () => {
    http.get.mockRejectedValue(new HttpError(404, {}));

    await expect(repository.getFriendsAttendance(eventId)).rejects.toBeInstanceOf(
      AttendanceEventNotFoundError,
    );
  });
});
