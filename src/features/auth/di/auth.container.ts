/**
 * @file auth.container.ts
 * @description Contenedor de Inyección de Dependencias (DI) para el módulo de Autenticación.
 * Configura los repositorios HTTP, el almacén de cookies y todos los casos de uso de autenticación y 2FA.
 */

import "server-only";

import { LoginUseCase } from "../application/use-cases/login.use-case";
import { LogoutUseCase } from "../application/use-cases/logout.use-case";
import { RegisterUseCase } from "../application/use-cases/register.use-case";
import {
  DisableTwoFactorUseCase,
  EnableTwoFactorUseCase,
  SetupTwoFactorUseCase,
} from "../application/use-cases/two-factor.use-cases";
import { HttpAuthRepository } from "../infrastructure/repositories/http-auth-repository";
import { HttpTwoFactorRepository } from "../infrastructure/repositories/http-two-factor-repository";
import { CookieSessionStore } from "../infrastructure/session/cookie-session-store";

/** Instancias de repositorios de infraestructura. */
const authRepository = new HttpAuthRepository();
const twoFactorRepository = new HttpTwoFactorRepository();
const sessionStore = new CookieSessionStore();

const loginUseCase = new LoginUseCase(authRepository, sessionStore);

/**
 * Contenedor de dependencias exportado para el módulo de Autenticación.
 *
 * - **¿Qué hace?**:
 *   Expone los casos de uso (`loginUseCase`, `logoutUseCase`, `registerUseCase`,
 *   `setupTwoFactorUseCase`, `enableTwoFactorUseCase`, `disableTwoFactorUseCase`) cableados con sus repositorios.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Consumido por Server Actions (`auth.actions.ts`, `two-factor.actions.ts`).
 *
 * - **¿Cuál es su importancia?**:
 *   Asegura Inversión de Control (IoC), facilitando pruebas y manteniendo una arquitectura modular limpia.
 */
export const authContainer = {
  loginUseCase,
  logoutUseCase: new LogoutUseCase(sessionStore),
  registerUseCase: new RegisterUseCase(authRepository, loginUseCase),
  setupTwoFactorUseCase: new SetupTwoFactorUseCase(twoFactorRepository),
  enableTwoFactorUseCase: new EnableTwoFactorUseCase(twoFactorRepository),
  disableTwoFactorUseCase: new DisableTwoFactorUseCase(twoFactorRepository),
};
