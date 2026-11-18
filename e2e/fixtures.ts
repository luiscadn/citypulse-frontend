/**
 * @file fixtures.ts
 * @description Constantes, tipos y helpers compartidos para la suite de pruebas End-to-End (E2E) con Playwright.
 */

import { expect, type Page } from "@playwright/test";

/**
 * Usuarios de prueba sembrados en la base de datos de desarrollo/test (db/init.sql).
 *
 * - **¿Qué hace?**:
 *   Expone las credenciales para los 3 roles del sistema (`admin`, `owner`, `user`),
 *   permitiendo sobreescribirlas mediante variables de entorno si el entorno CI/CD lo requiere.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Consumido por `auth.setup.ts` y las suites de prueba para autenticar cada contexto de navegación.
 *
 * - **¿Cuál es su importancia?**:
 *   Estandariza los actores de prueba para validar flujos de autorización y control de acceso RBAC.
 */
export const users = {
  admin: {
    email: process.env.E2E_ADMIN_EMAIL ?? "admin@citypulse.co",
    password: process.env.E2E_ADMIN_PASSWORD ?? "Admin123*",
  },
  owner: {
    email: process.env.E2E_OWNER_EMAIL ?? "teatro@citypulse.co",
    password: process.env.E2E_OWNER_PASSWORD ?? "Owner123*",
  },
  user: {
    email: process.env.E2E_USER_EMAIL ?? "ana@citypulse.co",
    password: process.env.E2E_USER_PASSWORD ?? "User123*",
  },
} as const;

export type Role = keyof typeof users;

/**
 * Retorna la ruta al archivo JSON donde se almacena el estado de almacenamiento (`storageState`) de la sesión de un rol.
 */
export const sessionFile = (role: Role) => `e2e/.auth/${role}.json`;

/**
 * Helper de automatización que ejecuta el flujo visual de login a través del formulario de la interfaz.
 *
 * - **¿Qué hace?**:
 *   Navega a `/login`, llena los campos de correo y contraseña del rol correspondiente, hace clic en "Iniciar sesión",
 *   y espera hasta que la URL abandone la pantalla de login.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Emula el comportamiento real de un usuario humano interactuando con el DOM del cliente Next.js.
 *
 * - **¿Cuál es su importancia?**:
 *   Permite generar sesiones persistidas reutilizables en los archivos `.auth/*.json` para acelerar la ejecución de las demás pruebas.
 */
export async function login(page: Page, role: Role) {
  await page.goto("/login");
  await page.getByLabel("Correo electrónico").fill(users[role].email);
  await page.getByLabel("Contraseña").fill(users[role].password);
  await page.getByRole("button", { name: "Iniciar sesión" }).click();
  await expect(page).not.toHaveURL(/\/login/);
}
