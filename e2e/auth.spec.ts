import { expect, test } from "@playwright/test";
import { login, users } from "./fixtures";

// Sin sesión guardada: cada prueba arranca como visitante
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
