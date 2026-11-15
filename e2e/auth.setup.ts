import { test as setup } from "@playwright/test";
import { login, sessionFile, type Role } from "./fixtures";

const roles: Role[] = ["admin", "owner", "user"];

for (const role of roles) {
  setup(`sesión de ${role}`, async ({ page }) => {
    await login(page, role);
    await page.context().storageState({ path: sessionFile(role) });
  });
}
