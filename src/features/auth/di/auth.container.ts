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

/** Arma los casos de uso de auth con sus implementaciones concretas. */
const authRepository = new HttpAuthRepository();
const twoFactorRepository = new HttpTwoFactorRepository();
const sessionStore = new CookieSessionStore();

const loginUseCase = new LoginUseCase(authRepository, sessionStore);

export const authContainer = {
  loginUseCase,
  logoutUseCase: new LogoutUseCase(sessionStore),
  registerUseCase: new RegisterUseCase(authRepository, loginUseCase),
  setupTwoFactorUseCase: new SetupTwoFactorUseCase(twoFactorRepository),
  enableTwoFactorUseCase: new EnableTwoFactorUseCase(twoFactorRepository),
  disableTwoFactorUseCase: new DisableTwoFactorUseCase(twoFactorRepository),
};