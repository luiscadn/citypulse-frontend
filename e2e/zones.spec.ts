/**
 * @file zones.spec.ts
 * @description Suite de pruebas End-to-End (E2E) para el ciclo de vida completo de Zonas (CRUD) por parte de un Administrador.
 * Ejecuta en serie la creación, prevención de duplicados, edición, eliminación y limpieza final.
 */

import { expect, test } from "@playwright/test";
import { sessionFile } from "./fixtures";

/**
 * Pruebas secuenciales del ciclo de vida de una Zona.
 *
 * - **¿Qué hace?**:
 *   Ejecuta en modo serial:
 *   1. Creación de una nueva zona geográfica con nombre dinámico único (`Zone E2E ${Date.now()}`).
 *   2. Verificación de rechazo ante intento de duplicar la misma zona con feedback inline.
 *   3. Edición de la descripción de la zona desde su vista de detalle `/zones/[id]`.
 *   4. Eliminación confirmada de la zona con verificación de remoción en el listado.
 *   5. Hook `afterAll` de limpieza defensiva para evitar datos residuales si alguna aserción fallara prematuramente.
 *
 * - **¿Cómo interactúa con el sistema en general?**:
 *   Prueba la integración integral de Next.js App Router, Server Actions, estado de formularios React 19,
 *   y el backend NestJS con su base de datos PostgreSQL real.
 *
 * - **¿Cuál es su importancia?**:
 *   Asegura que el flujo crítico de gestión territorial funcione de punta a punta sin regresiones visuales ni de red.
 */
test.describe.configure({ mode: "serial" });
test.use({ storageState: sessionFile("admin") });

const zoneName = `Zona E2E ${Date.now()}`;

test("el ADMIN crea una zona y aparece en el listado", async ({ page }) => {
  await page.goto("/zones");
  await page.getByRole("textbox", { name: "Nombre" }).fill(zoneName);
  await page.getByRole("textbox", { name: "Descripción" }).fill("Creada por Playwright");
  await page.getByRole("button", { name: "Crear zona" }).click();

  await expect(page.getByText(`Zona "${zoneName}" creada.`)).toBeVisible();
  await expect(page.getByRole("link", { name: new RegExp(zoneName) })).toBeVisible();
});

test("no deja crear otra zona con el mismo nombre", async ({ page }) => {
  await page.goto("/zones");
  await page.getByRole("textbox", { name: "Nombre" }).fill(zoneName);
  await page.getByRole("button", { name: "Crear zona" }).click();

  await expect(page.getByText("Ya existe una zona con ese nombre")).toBeVisible();
});

test("el ADMIN edita la descripción desde el detalle", async ({ page }) => {
  await page.goto("/zones");
  await page.getByRole("link", { name: new RegExp(zoneName) }).click();
  await expect(page.getByRole("heading", { name: zoneName, level: 1 })).toBeVisible();

  await page.getByRole("textbox", { name: "Descripción" }).fill("Descripción editada");
  await page.getByRole("button", { name: "Guardar cambios" }).click();

  await expect(page.getByText("Cambios guardados.")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Descripción editada").first()).toBeVisible();
});

test("el ADMIN borra la zona tras confirmar y desaparece del listado", async ({ page }) => {
  await page.goto("/zones");
  await page.getByRole("link", { name: new RegExp(zoneName) }).click();

  await page.getByRole("button", { name: "Eliminar zona" }).click();
  await page.getByRole("button", { name: "Sí, eliminar" }).click();

  await expect(page).toHaveURL("/zones");
  await expect(page.getByRole("link", { name: new RegExp(zoneName) })).toHaveCount(0);
});

// Limpieza de seguridad: si un test falla a mitad del camino, borra la zona creada para mantener la base de datos limpia
test.afterAll(async ({ browser }) => {
  const context = await browser.newContext({ storageState: sessionFile("admin") });
  const page = await context.newPage();
  await page.goto("/zones");
  const link = page.getByRole("link", { name: new RegExp(zoneName) });
  if ((await link.count()) > 0) {
    await link.click();
    await page.getByRole("button", { name: "Eliminar zona" }).click();
    await page.getByRole("button", { name: "Sí, eliminar" }).click();
    await expect(page).toHaveURL("/zones");
  }
  await context.close();
});
