import { expect, test } from "@playwright/test";
import { sessionFile } from "./fixtures";

// La interfaz muestra u oculta según el rol; el backend igual lo valida en cada petición
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

test.describe("como OWNER", () => {
  test.use({ storageState: sessionFile("owner") });

  test("puede registrar lugares pero no gestionar zonas", async ({ page }) => {
    await page.goto("/venues/mine");
    await expect(page.getByText("Registrar un lugar")).toBeVisible();

    await page.goto("/zones");
    await expect(page.getByText("Nueva zona")).toHaveCount(0);
  });
});

test.describe("como ADMIN", () => {
  test.use({ storageState: sessionFile("admin") });

  test("gestiona zonas y revisa los lugares por verificar", async ({ page }) => {
    await page.goto("/zones");
    await expect(page.getByText("Nueva zona")).toBeVisible();

    await page.goto("/venues");
    await expect(page.getByRole("link", { name: "Lugares por verificar" })).toBeVisible();
  });
});
