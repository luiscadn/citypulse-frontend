import type { AttendanceStatus } from "../domain/entities/attendance";

/** Textos de cada respuesta, en el orden en que se muestran. */
export const ATTENDANCE_LABEL: Record<AttendanceStatus, { action: string; summary: string }> = {
  ASISTIRE: { action: "Asistiré", summary: "Asistirá" },
  QUIZAS: { action: "Tal vez", summary: "Tal vez" },
  NO_ASISTIRE: { action: "No iré", summary: "No irá" },
};
