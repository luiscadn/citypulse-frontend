import "server-only";

import { serverHttp } from "@/shared/di/http.server";
import { makeAssignRoles } from "../application/use-cases/assign-roles";
import { makeGetUser } from "../application/use-cases/get-user";
import { makeListUsers } from "../application/use-cases/list-users";
import { makeUpdateUser } from "../application/use-cases/update-user";
import { HttpUserRepository } from "../infrastructure/repositories/http-user-repository";

/**
 * Casos de uso de users para el SERVIDOR (Server Components y Server Actions):
 * hablan con el backend directo, con el JWT de la cookie de sesión.
 */
const users = new HttpUserRepository(serverHttp);

export const usersContainer = {
  getUser: makeGetUser({ users }),
  listUsers: makeListUsers({ users }),
  updateUser: makeUpdateUser({ users }),
  assignRoles: makeAssignRoles({ users }),
};
