/**
 * @file users.container.ts
 * @description Contenedor de Inyección de Dependencias (DI) para el módulo de Usuarios.
 * Conecta el repositorio HTTP del servidor con los casos de uso para Server Components y Server Actions.
 */

import "server-only";

import { serverHttp } from "@/shared/di/http.server";
import { makeAssignRoles } from "../application/use-cases/assign-roles";
import { makeGetUser } from "../application/use-cases/get-user";
import { makeListUsers } from "../application/use-cases/list-users";
import { makeUpdateUser } from "../application/use-cases/update-user";
import { HttpUserRepository } from "../infrastructure/repositories/http-user-repository";

/**
 * Instancia del repositorio de usuarios inicializada con el cliente HTTP seguro del servidor (`serverHttp`).
 */
const users = new HttpUserRepository(serverHttp);

/**
 * Contenedor de dependencias exportado para el módulo de Usuarios.
 *
 * - **¿Qué hace?**:
 *   Expone los casos de uso funcionales (`getUser`, `listUsers`, `updateUser`, `assignRoles`)
 *   inyectándoles la instancia del repositorio concreto `HttpUserRepository`.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Composición / DI. Consumido por Server Components (`UserRolesAdmin`)
 *   y Server Actions (`profile.actions.ts`, `admin-users.actions.ts`).
 *
 * - **¿Cuál es su importancia?**:
 *   Centraliza la resolución de dependencias, asegurando que las funciones de aplicación reciban
 *   su infraestructura de persistencia sin acoplamiento rígido ni inicializaciones dispersas.
 */
export const usersContainer = {
  getUser: makeGetUser({ users }),
  listUsers: makeListUsers({ users }),
  updateUser: makeUpdateUser({ users }),
  assignRoles: makeAssignRoles({ users }),
};
