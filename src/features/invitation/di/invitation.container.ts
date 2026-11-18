import "server-only";

import { serverHttp } from "@/shared/di/http.server";
import { GetPendingInvitationsUseCase } from "../application/use-cases/get-pending-invitations.use-case";
import { RespondInvitationUseCase } from "../application/use-cases/respond-invitation.use-case";
import { SendInvitationUseCase } from "../application/use-cases/send-invitation.use-case";
import { HttpInvitationRepository } from "../infrastructure/repositories/http-invitation-repository";

/**
 * Contenedor de Inyección de Dependencias invitationContainer (Capa de Composición / DI)
 *
 * - **¿Qué hace?**: Instancia `HttpInvitationRepository` con `serverHttp` y construye los tres casos de uso del módulo
 *   de invitaciones (`getPendingInvitationsUseCase`, `sendInvitationUseCase`, `respondInvitationUseCase`).
 * - **¿Cómo interactúa con el sistema en general?**: Se ejecuta únicamente en el servidor (`server-only`).
 *   Es consumido por la página `InvitationsPage`, las Server Actions (`respondInvitationAction`, `sendInvitationAction`),
 *   y otros componentes que coordinan invitaciones.
 * - **¿Cuál es su importancia?**: Centraliza la composición del módulo de invitaciones, garantizando la inyección
 *   adecuada de dependencias en un solo lugar.
 */
const invitationRepository = new HttpInvitationRepository(serverHttp);

export const invitationContainer = {
  getPendingInvitationsUseCase: new GetPendingInvitationsUseCase(invitationRepository),
  sendInvitationUseCase: new SendInvitationUseCase(invitationRepository),
  respondInvitationUseCase: new RespondInvitationUseCase(invitationRepository),
};
