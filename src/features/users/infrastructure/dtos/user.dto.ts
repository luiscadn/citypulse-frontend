/**
 * DTO que representa un usuario tal como lo entrega la API REST externa de NestJS.
 *
 * - **¿Qué hace?**:
 *   Estructura la carga útil: identificador, correo, nombre de usuario, nombre completo,
 *   estado de activación, segundo factor, zona geográfica, marca de tiempo ISO de creación
 *   y la colección anidada de roles (`userRoles`).
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Pertenece a la capa de Infraestructura. Recibido por `HttpUserRepository` y procesado
 *   por el mapper `toUser` para generar la entidad de dominio `User`.
 *
 * - **¿Cuál es su importancia?**:
 *   Fija el contrato de transporte estricto con el backend, confirmando que la API no emite
 *   campos confidenciales como contraseñas hasheadas o secretos de autenticación.
 */
export interface UserDto {
  id: number;
  email: string;
  username: string;
  fullName: string;
  isActive: boolean;
  twoFactorEnabled: boolean;
  zoneId?: number | null;
  createdAt: string;            // ISO
  userRoles?: { role: { name: string } }[];  // ← nested, snake/camel según backend
}