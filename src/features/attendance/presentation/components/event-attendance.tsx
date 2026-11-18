import { Alert, Badge, Card, CardBody, CardHeader } from "@/shared/presentation/components";
import { DomainError } from "@/shared/domain/errors/domain-error";
import { attendanceContainer } from "../../di/attendance.container";
import type { AttendanceStatus, EventAttendance as Attendance } from "../../domain/entities/attendance";
import { ATTENDANCE_LABEL } from "../attendance-labels";
import { AttendancePicker } from "./attendance-picker";

const STATUS_TONE: Record<AttendanceStatus, "success" | "warning" | "neutral"> = {
  ASISTIRE: "success",
  QUIZAS: "warning",
  NO_ASISTIRE: "neutral",
};

/**
 * Componente interno que renderiza una lista de asistentes con sus insignias de estado.
 *
 * - **¿Qué hace?**: Muestra el nombre completo, `@username` y la insignia de color correspondiente a la respuesta de cada persona.
 * - **¿Cómo interactúa con el sistema en general?**: Usada en `EventAttendance` para la sección de amigos y la lista global de asistentes.
 * - **¿Cuál es su importancia?**: Provee una presentación estructurada y accesible con estado vacío alternativo si no hay respuestas.
 */
function AttendanceList({ items, empty }: { items: readonly Attendance[]; empty: string }) {
  if (items.length === 0) return <p className="text-sm text-ink-muted">{empty}</p>;
  return (
    <ul className="stagger flex flex-col divide-y divide-line">
      {items.map(({ user, status }) => (
        <li key={user.id} className="flex items-center justify-between gap-3 py-2 text-sm">
          <span className="text-ink">
            {user.fullName} <span className="text-ink-muted">@{user.username}</span>
          </span>
          <Badge tone={STATUS_TONE[status]}>{ATTENDANCE_LABEL[status].summary}</Badge>
        </li>
      ))}
    </ul>
  );
}

/**
 * Server Component de la Sección de Asistencia de un Evento
 *
 * - **¿Qué hace?**: Realiza consultas concurrentes con `Promise.all` a través de `attendanceContainer`:
 *   1. La respuesta del usuario en sesión (`getMyAttendanceUseCase`).
 *   2. Las respuestas de los amigos del usuario (`getFriendsAttendanceUseCase`).
 *   3. Si el usuario es el autor o un administrador (`showAttendees`), la lista completa de todas las respuestas (`getEventAttendeesUseCase`).
 *   Si la carga de asistencia genera un `DomainError`, muestra una alerta no bloqueante en lugar de romper el detalle del evento.
 *
 * - **¿Cómo interactúa con el sistema en general?**: Incrustado en la página de detalle del evento (`/events/[id]`).
 *
 * - **¿Cuál es su importancia?**: Fomenta el aspecto social comunitario y de red de contactos (amigos que asistirán),
 *   aplicando resiliencia mediante aislamiento de errores para proteger la visualización principal del evento.
 */
export async function EventAttendance({ eventId, showAttendees }: { eventId: string; showAttendees: boolean }) {
  let myStatus: AttendanceStatus | null;
  let friends: readonly Attendance[];
  let attendees: readonly Attendance[] | null;
  try {
    [myStatus, friends, attendees] = await Promise.all([
      attendanceContainer.getMyAttendanceUseCase.execute(eventId),
      attendanceContainer.getFriendsAttendanceUseCase.execute(eventId),
      showAttendees ? attendanceContainer.getEventAttendeesUseCase.execute(eventId) : null,
    ]);
  } catch (error) {
    if (error instanceof DomainError) return <Alert tone="warning">{error.message}</Alert>;
    throw error;
  }

  return (
    <Card>
      <CardHeader title="¿Vas a ir?" description="Tu respuesta la ven tus amigos." />
      <CardBody className="flex flex-col gap-5">
        <AttendancePicker eventId={eventId} initialStatus={myStatus} />
        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-ink">Tus amigos</h3>
          <AttendanceList items={friends} empty="Ninguno de tus amigos ha respondido todavía." />
        </section>
        {attendees && (
          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-ink">Todas las respuestas ({attendees.length})</h3>
            <AttendanceList items={attendees} empty="Nadie ha respondido todavía." />
          </section>
        )}
      </CardBody>
    </Card>
  );
}
