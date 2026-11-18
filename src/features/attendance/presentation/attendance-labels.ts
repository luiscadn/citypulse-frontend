import type { AttendanceStatus } from "../domain/entities/attendance";

/**
 * Diccionario de textos localizados para los estados de asistencia a eventos.
 *
 * - **¿Qué hace?**: Mapea cada valor del enum `AttendanceStatus` (`ASISTIRE`, `QUIZAS`, `NO_ASISTIRE`)
 *   a sus textos correspondientes para botones interactivos (`action`) y resúmenes en tercera persona (`summary`).
 * - **¿Cómo interactúa con el sistema en general?**: Consumido por `AttendancePicker` (para los botones)
 *   y `AttendanceList` dentro de `EventAttendance` (para las insignias de asistentes).
 * - **¿Cuál es su importancia?**: Centraliza la consistencia semántica y gramatical del texto en la UI,
 *   facilitando futuras traducciones o cambios de redacción.
 */
export const ATTENDANCE_LABEL: Record<AttendanceStatus, { action: string; summary: string }> = {
  ASISTIRE: { action: "Asistiré", summary: "Asistirá" },
  QUIZAS: { action: "Tal vez", summary: "Tal vez" },
  NO_ASISTIRE: { action: "No iré", summary: "No irá" },
};
