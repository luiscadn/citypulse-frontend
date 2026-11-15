import { expect, type Page } from "@playwright/test";

/**
 * Usuarios de prueba que crea db/init.sql en el backend (datos públicos de prueba).
 * Se pueden cambiar con variables de entorno si la base tiene otros.
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

/** Archivo donde auth.setup.ts guarda la sesión de cada rol */
export const sessionFile = (role: Role) => `e2e/.auth/${role}.json`;

/** Inicia sesión desde el formulario, como lo haría una persona */
export async function login(page: Page, role: Role) {
  await page.goto("/login");
  await page.getByLabel("Correo electrónico").fill(users[role].email);
  await page.getByLabel("Contraseña").fill(users[role].password);
  await page.getByRole("button", { name: "Iniciar sesión" }).click();
  await expect(page).not.toHaveURL(/\/login/);
}
