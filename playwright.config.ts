import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3000);
const baseURL = `http://localhost:${PORT}`;

/**
 * Pruebas E2E: un navegador real contra el frontend y el backend corriendo.
 * El backend debe estar arriba con los datos de prueba de db/init.sql (repo del backend).
 * En local reutiliza el `npm run dev` que ya esté corriendo; en CI compila y arranca.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    locale: "es-CO",
    // E2E_CHANNEL=chrome usa el Google Chrome instalado en vez del Chromium de Playwright
    channel: process.env.E2E_CHANNEL,
  },
  projects: [
    // Inicia sesión una vez por rol y guarda la cookie; las demás pruebas la reutilizan
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], channel: process.env.E2E_CHANNEL },
      dependencies: ["setup"],
    },
  ],
  webServer: {
    command: process.env.CI ? "npm run build && npm run start" : "npm run dev",
    url: `${baseURL}/login`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
