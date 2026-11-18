import { HttpError, type HttpClient } from "@/shared/infrastructure/http-client";
import type { InvitationRepository } from "../../application/repositories/invitation-repository";
import type {
  InvitationAnswer,
  NewInvitation,
  PendingInvitation,
} from "../../domain/entities/invitation";
import {
  InvitationAlreadyAnsweredError,
  InvitationAlreadyExistsError,
  InvitationEventNotFoundError,
  InvitationForbiddenError,
  InvitationNotAllowedError,
  InvitationNotFoundError,
} from "../../domain/errors/invitation-errors";
import type { PendingInvitationDto } from "../dtos/invitation.dto";
import { toPendingInvitation } from "../mappers/invitation.mapper";

/**
 * Adaptador HttpInvitationRepository (Infraestructura en Arquitectura Hexagonal)
 *
 * - **¿Qué hace?**: Implementa el puerto `InvitationRepository` comunicándose con los endpoints `/invitations/...`
 *   mediante `HttpClient`. Captura y traduce los códigos de error HTTP a errores fuertemente tipados del dominio
 *   (`InvitationNotAllowedError`, `InvitationAlreadyExistsError`, `InvitationAlreadyAnsweredError`, `InvitationForbiddenError`).
 * - **¿Cómo interactúa con el sistema en general?**: Se instancia en `invitation.container.ts` y sirve como el canal
 *   exclusivo de integración HTTP para invitaciones a eventos.
 * - **¿Cuál es su importancia?**: Encapsula las particularidades del protocolo REST y la traducción de errores
 *   de negocio provenientes del backend.
 */
export class HttpInvitationRepository implements InvitationRepository {
  constructor(private readonly http: HttpClient) {}

  /** Obtiene las invitaciones pendientes recibidas mediante `GET /invitations/pending`. */
  async getPending(): Promise<readonly PendingInvitation[]> {
    const dtos = await this.http.get<PendingInvitationDto[]>("/invitations/pending");
    return dtos.map(toPendingInvitation);
  }

  /** Envía una nueva invitación mediante `POST /invitations`. Mapea 403, 404 y 409 a sus respectivos errores de dominio. */
  async send(invitation: NewInvitation): Promise<void> {
    try {
      await this.http.post("/invitations", invitation);
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.status === 403) throw new InvitationNotAllowedError();
        if (error.status === 404) throw new InvitationEventNotFoundError();
        if (error.status === 409) throw new InvitationAlreadyExistsError();
      }
      throw error;
    }
  }

  /** Responde una invitación recibida mediante `PATCH /invitations/:id`. Mapea 400, 403 y 404 a errores de dominio. */
  async respond(invitationId: number, answer: InvitationAnswer): Promise<void> {
    try {
      await this.http.patch(`/invitations/${invitationId}`, { status: answer });
    } catch (error) {
      if (error instanceof HttpError) {
        if (error.status === 400) throw new InvitationAlreadyAnsweredError();
        if (error.status === 403) throw new InvitationForbiddenError();
        if (error.status === 404) throw new InvitationNotFoundError();
      }
      throw error;
    }
  }
}
