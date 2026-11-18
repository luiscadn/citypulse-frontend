/**
 * @file login-result.ts
 * @description Unión discriminada de Dominio que modela el resultado de un intento de inicio de sesión.
 */

import type { SessionUser } from "./session-user";

/**
 * Representa los dos posibles desenlaces válidos tras invocar el servicio de autenticación.
 *
 * - **¿Qué hace?**:
 *   Distingue mediante la propiedad discriminante `kind`:
 *   - `"authenticated"`: la autenticación fue exitosa, devolviendo el JWT y los datos esenciales del usuario (`SessionUser`).
 *   - `"two-factor-required"`: las credenciales primarias son correctas pero el backend exige un código de segundo factor TOTP para culminar el ingreso.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Retornado por `AuthRepository.login` y procesado por `LoginUseCase` y la Server Action `loginAction`
 *   para decidir si guardar la cookie de sesión o solicitar el paso 2FA en la UI.
 *
 * - **¿Cuál es su importancia?**:
 *   Aplica el patrón Result / Unión Tipada para modelar de forma exhaustiva los flujos de seguridad multifactor,
 *   evitando el uso de excepciones para situaciones de flujo normal de control.
 */
export type LoginResult =
  | { kind: "authenticated"; token: string; user: SessionUser }
  | { kind: "two-factor-required" };
