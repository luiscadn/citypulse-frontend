import "server-only";

import { LoginUseCase } from "../application/use-cases/login.use-case";
import { LogoutUseCase } from "../application/use-cases/logout.use-case";
import { HttpAuthRepository } from "../infrastructure/repositories/http-auth-repository";
import { CookieSessionStore } from "../infrastructure/session/cookie-session-store";

/** Arma los casos de uso de auth con sus implementaciones concretas. */
const authRepository = new HttpAuthRepository();
const sessionStore = new CookieSessionStore();

export const authContainer = {
  loginUseCase: new LoginUseCase(authRepository, sessionStore),
  logoutUseCase: new LogoutUseCase(sessionStore),
};
