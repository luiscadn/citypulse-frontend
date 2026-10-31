import "server-only";

import {
  clearSessionToken,
  setSessionToken,
} from "@/shared/infrastructure/session/session-cookie";
import type { SessionStore } from "../../application/repositories/session-store";

export class CookieSessionStore implements SessionStore {
  save(token: string): Promise<void> {
    return setSessionToken(token);
  }

  clear(): Promise<void> {
    return clearSessionToken();
  }
}
