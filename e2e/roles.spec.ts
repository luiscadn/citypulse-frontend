/**
 * @file roles.spec.ts
 * @description Suite de pruebas End-to-End (E2E) para verificar el control de acceso basado en roles (RBAC).
 * Comprueba la visibilidad condicional de botones y pantallas según el rol del usuario conectado.
 */

import { expect, test } from "@playwright/test";
import { sessionFile } from "./fixtures";

/**
 * Pruebas bajo el perfil de rol USER.
 *
 * - **¿Qué hace?**: Verifica que el usuario estándar pueda visualizar zonas pero no el formulario de creación, y no pueda registrar locales en `/venues/mine`.
 * - **¿Cómo interactúa con el sistema en general?**: Comprueba el comportamiento de los Server Components ante usuarios sin roles especiales.
 * - **¿Cuál es su importancia?**: Valida que la interfaz respete el principio de mínimo privilegio para la ciudadanía.
 */
test.describe("como USER", () => {
  test.use({ storageState: sessionFile("user") });

  test("ve las zonas pero no puede crearlas", async ({ page }) => {
    await page.goto("/zones");
    await expect(page.getByRole("heading", { name: "Zonas", level: 1 })).toBeVisible();
    await expect(page.getByText("Nueva zona")).toHaveCount(0);
  });

  test("no puede registrar lugares", async ({ page }) => {
    await page.goto("/venues/mine");
    await expect(page.getByText("Esta sección es para dueños de lugares")).toBeVisible();
    await expect(page.getByText("Registrar un lugar")).toHaveCount(0);
  });
});

/**
 * Pruebas bajo el perfil de rol OWNER.
 *
 * - **¿Qué hace?**: Verifica que un dueño de establecimiento pueda acceder al formulario de alta en `/venues/mine` pero no pueda administrar zonas.
 * - **¿Cómo interactúa con el sistema en general?**: Comprueba las reglas de negocio de `venue-permissions` aplicadas en la interfaz.
 * - **¿Cuál es su importancia?**: Asegura la segregación comercial entre dueños de recintos y la administración pública de zonas.
 */
test.describe("como OWNER", () => {
  test.use({ storageState: sessionFile("owner") });

  test("puede registrar lugares pero no gestionar zonas", async ({ page }) => {
    await page.goto("/venues/mine");
    await expect(page.getByText("Registrar un lugar")).toBeVisible();

    await page.goto("/zones");
    await expect(page.getByText("Nueva zona")).toHaveCount(0);
  });
});

/**
 * Pruebas bajo el perfil de rol ADMIN.
 *
 * - **¿Qué hace?**: Verifica que el administrador tenga acceso completo a la creación de zonas y al listado de locales pendientes de verificación.
 * - **¿Cómo interactúa con el sistema en general?**: Valida la renderización de opciones de moderación en Server Components de zonas y venues.
 * - **¿Cuál es su importancia?**: Comprueba que las herramientas de moderación y gobierno de la plataforma estén habilitadas para el superusuario.
 */
test.describe("como ADMIN", () => {
  test.use({ storageState: sessionFile("admin") });

  test("gestiona zonas y revisa los lugares por verificar", async ({ page }) => {
    await page.goto("/zones");
    await expect(page.getByText("Nueva zona")).toBeVisible();

    await page.goto("/venues");
    await expect(page.getByRole("link", { name: "Lugares por verificar" })).toBeVisible();
  });
});
