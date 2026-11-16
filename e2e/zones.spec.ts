import { expect, test } from "@playwright/test";
import { sessionFile } from "./fixtures";

/**
 * Flujo de negocio: el ADMIN crea, edita y borra una zona.
 * Las pruebas comparten la zona, así que van en serie. El nombre es único por
 * corrida y la última prueba la borra: la suite se puede correr dos veces seguidas.
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

// Si una prueba falló a mitad del flujo, la zona quedó creada: se borra para no dejar basura
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
