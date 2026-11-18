/**
 * @file auth.spec.ts
 * @description Suite de pruebas End-to-End (E2E) para verificar los flujos de autenticación y protección de rutas.
 */

import { expect, test } from "@playwright/test";
import { login, users } from "./fixtures";

/**
 * Pruebas de autenticación y control perimetral de acceso.
 *
 * - **¿Qué hace?**:
 *   Verifica que:
 *   1. Un usuario sin sesión sea redirigido a `/login?from=...` al intentar acceder a una ruta protegida y regrese a ella tras autenticarse.
 *   2. Credenciales erróneas muestren una alerta visual accesible sin expedir la cookie `cp_session`.
 *   3. El cierre de sesión elimine la cookie `cp_session` y bloquee nuevamente el acceso a rutas protegidas.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Evalúa de extremo a extremo la integración entre el middleware (`proxy.ts`), las Server Actions (`auth.actions.ts`),
 *   el almacenamiento de cookies y los componentes de React.
 *
 * - **¿Cuál es su importancia?**:
 *   Asegura que las barreras de autenticación y redirección funcionen en navegadores reales garantizando la privacidad del sistema.
 */
test.describe("autenticación", () => {
  test("sin sesión, una ruta protegida lleva al login y luego vuelve a ella", async ({ page }) => {
    await page.goto("/zones");
    await expect(page).toHaveURL(/\/login\?from=%2Fzones/);

    await page.getByLabel("Correo electrónico").fill(users.admin.email);
    await page.getByLabel("Contraseña").fill(users.admin.password);
    await page.getByRole("button", { name: "Iniciar sesión" }).click();

    await expect(page).toHaveURL("/zones");
    await expect(page.getByRole("heading", { name: "Zonas", level: 1 })).toBeVisible();
  });

  test("con una contraseña incorrecta muestra el error y no entra", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Correo electrónico").fill(users.admin.email);
    await page.getByLabel("Contraseña").fill("no-es-la-clave");
    await page.getByRole("button", { name: "Iniciar sesión" }).click();

    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
    expect((await page.context().cookies()).some((c) => c.name === "cp_session")).toBe(false);
  });

  test("cerrar sesión borra la cookie y vuelve a proteger las rutas", async ({ page }) => {
    await login(page, "user");
    expect((await page.context().cookies()).some((c) => c.name === "cp_session")).toBe(true);

    await page.getByRole("button", { name: "Cerrar sesión" }).click();
    await expect(page).toHaveURL(/\/login/);
    expect((await page.context().cookies()).some((c) => c.name === "cp_session")).toBe(false);

    await page.goto("/venues");
    await expect(page).toHaveURL(/\/login/);
  });
});
