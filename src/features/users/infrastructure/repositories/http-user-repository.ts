/**
 * @file http-user-repository.ts
 * @description Adaptador de Infraestructura que implementa el puerto `UserRepository`.
 * Consume la API REST de `/users` traduciendo respuestas HTTP en entidades y errores puros de Dominio.
 */

import { HttpError, type HttpClient } from "@/shared/infrastructure/http-client";
import type { UserRepository } from "../../application/repositories/user-repository";
import type { User, CreateUserParams, UpdateUserParams } from "../../domain/entities/user";
import type { RoleName } from "@/shared/domain/enums";
import {
  EmailAlreadyInUseError,
  UsernameAlreadyInUseError,
  UserNotFoundError,
  ForbiddenActionError,
} from "../../domain/errors/user-errors";
import type { UserDto } from "../dtos/user.dto";
import { toUser } from "../mappers/user.mapper";

/**
 * Implementación HTTP de `UserRepository` conectada a los endpoints de administración y perfil de usuarios.
 *
 * - **¿Qué hace?**:
 *   Maneja las peticiones de red para obtener listados de usuarios (`findAll`), consultar un usuario por ID (`findById`),
 *   crear usuarios (`create`), actualizar perfiles (`update`), borrar usuarios (`delete`) y asignar roles (`assignRoles`),
 *   traduciendo códigos de respuesta HTTP (403, 404, 409) a excepciones tipadas de Dominio.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Infraestructura. Es instanciado en `users.container.ts` usando `serverHttp`
 *   e inyectado en todos los casos de uso de usuarios.
 *
 * - **¿Cuál es su importancia?**:
 *   Aísla la infraestructura de red respecto a la lógica de perfiles y administración, permitiendo
 *   que la capa de aplicación y la interfaz permanezcan agnósticas al protocolo HTTP.
 */
export class HttpUserRepository implements UserRepository {
  constructor(private readonly http: HttpClient) {}

  /**
   * Obtiene la lista completa de usuarios registrados.
   *
   * - **¿Qué hace?**: Ejecuta `GET /users?limit=100` y mapea los resultados con `toUser`.
   * - **¿Cómo interactúa con el sistema en general?**: Invocado por `makeListUsers` para la vista de administración de roles.
   * - **¿Cuál es su importancia?**: Proporciona el catálogo de cuentas de usuario del sistema.
   */
  async findAll(): Promise<User[]> {
    const page = await this.http.get<{ data: UserDto[] }>("/users?limit=100");
    return page.data.map(toUser);
  }

  /**
   * Busca un usuario por su identificador.
   *
   * - **¿Qué hace?**: Realiza `GET /users/:id` y traduce errores 404 a `UserNotFoundError`.
   * - **¿Cómo interactúa con el sistema en general?**: Invocado por `makeGetUser`.
   * - **¿Cuál es su importancia?**: Provee la información requerida para perfiles y comprobaciones de autorización.
   */
  async findById(id: number): Promise<User> {
    try {
      const dto = await this.http.get<UserDto>(`/users/${id}`);
      return toUser(dto);
    } catch (e) {
      throw this.translate(e, id);
    }
  }

  /**
   * Crea un nuevo usuario en el sistema.
   *
   * - **¿Qué hace?**: Envía `POST /users` y traduce respuestas de conflicto 409 a `EmailAlreadyInUseError` o `UsernameAlreadyInUseError`.
   * - **¿Cómo interactúa con el sistema en general?**: Utilizado en operaciones de alta de usuarios.
   * - **¿Cuál es su importancia?**: Permite el registro administrativo con diagnóstico preciso de colisiones.
   */
  async create(params: CreateUserParams): Promise<User> {
    try {
      const dto = await this.http.post<UserDto>("/users", params);
      return toUser(dto);
    } catch (e) {
      throw this.translateCreate(e, params);
    }
  }

  /**
   * Actualiza los datos de un usuario existente.
   *
   * - **¿Qué hace?**: Envía `PATCH /users/:id` con los parámetros a modificar y traduce errores HTTP.
   * - **¿Cómo interactúa con el sistema en general?**: Invocado por `makeUpdateUser` al guardar cambios en `/profile`.
   * - **¿Cuál es su importancia?**: Mantiene la consistencia de los perfiles de usuario.
   */
  async update(id: number, params: UpdateUserParams): Promise<User> {
    try {
      const dto = await this.http.patch<UserDto>(`/users/${id}`, params);
      return toUser(dto);
    } catch (e) {
      throw this.translate(e, id);
    }
  }

  /**
   * Elimina un usuario por su identificador.
   *
   * - **¿Qué hace?**: Ejecuta `DELETE /users/:id`.
   * - **¿Cómo interactúa con el sistema en general?**: Utilizado en flujos de baja de usuarios.
   * - **¿Cuál es su importancia?**: Permite la eliminación definitiva de cuentas en el backend.
   */
  async delete(id: number): Promise<void> {
    try {
      await this.http.delete(`/users/${id}`);
    } catch (e) {
      throw this.translate(e, id);
    }
  }

  /**
   * Modifica y asigna la lista de roles del usuario.
   *
   * - **¿Qué hace?**: Envía `PATCH /users/:id/roles` con el arreglo de nombres de rol.
   * - **¿Cómo interactúa con el sistema en general?**: Invocado por `makeAssignRoles` en el panel de administración.
   * - **¿Cuál es su importancia?**: Gestiona el control de acceso y privilegios (RBAC) en el sistema.
   */
  async assignRoles(id: number, roles: readonly RoleName[]): Promise<User> {
    try {
      const dto = await this.http.patch<UserDto>(`/users/${id}/roles`, { roles });
      return toUser(dto);
    } catch (e) {
      throw this.translate(e, id);
    }
  }

  /**
   * Traduce códigos de error HTTP a excepciones de dominio.
   */
  private translate(e: unknown, userId: number): unknown {
    if (e instanceof HttpError) {
      if (e.status === 404) return new UserNotFoundError(userId);
      if (e.status === 403) return new ForbiddenActionError();
      if (e.status === 409) return new EmailAlreadyInUseError("");
    }
    return e;
  }

  /**
   * Traduce errores específicos de colisión (HTTP 409) durante la creación.
   */
  private translateCreate(e: unknown, p: CreateUserParams): unknown {
    if (e instanceof HttpError && e.status === 409) {
      const msg = String((e.body as { message?: string })?.message ?? "");
      if (msg.toLowerCase().includes("email")) return new EmailAlreadyInUseError(p.email);
      if (msg.toLowerCase().includes("username")) return new UsernameAlreadyInUseError(p.username);
    }
    return e;
  }
}
