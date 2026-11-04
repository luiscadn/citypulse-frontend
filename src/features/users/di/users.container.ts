import "server-only";

import { serverHttp } from "@/shared/di/http.server";
import { makeGetUser } from "../application/use-cases/get-user";
import { makeUpdateUser } from "../application/use-cases/update-user";
import { HttpUserRepository } from "../infrastructure/repositories/http-user-repository";

/**
 * Casos de uso de users para el SERVIDOR (Server Components y Server Actions):
 * hablan con el backend directo, con el JWT de la cookie. Para el navegador
 * está users.di.ts (pasa por /api/backend).
 */
const users = new HttpUserRepository(serverHttp);

export const usersContainer = {
  getUser: makeGetUser({ users }),
  updateUser: makeUpdateUser({ users }),
};
