/**
 * @file auth.setup.ts
 * @description Fase de preparación global ("setup project") de Playwright.
 * Genera y almacena en disco las cookies de sesión para cada uno de los roles antes de ejecutar los specs.
 */

import { test as setup } from "@playwright/test";
import { login, sessionFile, type Role } from "./fixtures";

const roles: Role[] = ["admin", "owner", "user"];

/**
 * Automatización de inicio de sesión por rol para generar archivos `storageState`.
 *
 * - **¿Qué hace?**:
 *   Itera sobre los roles `admin`, `owner` y `user`, ejecuta el helper `login` y vuelca las cookies
 *   y almacenamiento local al archivo `e2e/.auth/[role].json`.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Se ejecuta una sola vez al inicio de la suite de Playwright. Sus archivos de estado son consumidos
 *   por `roles.spec.ts` y `zones.spec.ts` mediante `test.use({ storageState: ... })`.
 *
 * - **¿Cuál es su importancia?**:
 *   Optimización masiva del tiempo de ejecución en pruebas E2E: evita que cada prueba deba iniciar sesión
 *   individualmente desde cero, garantizando sesiones aisladas y preautenticadas.
 */
for (const role of roles) {
  setup(`sesión de ${role}`, async ({ page }) => {
    await login(page, role);
    await page.context().storageState({ path: sessionFile(role) });
  });
}
