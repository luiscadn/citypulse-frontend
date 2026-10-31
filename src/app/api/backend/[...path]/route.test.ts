import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/shared/infrastructure/session/session-constants";
import { GET, POST } from "./route";

const ctx = (path: string[]) => ({ params: Promise.resolve({ path }) });

afterEach(() => vi.unstubAllGlobals());

describe("/api/backend/[...path]", () => {
  it("reenvía al backend con el token de la cookie y la query", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ data: [] }, { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const req = new NextRequest("http://localhost:3000/api/backend/users?page=2");
    req.cookies.set(SESSION_COOKIE, "jwt-de-prueba");
    const res = await GET(req, ctx(["users"]));

    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toBe("http://localhost:3001/users?page=2");
    expect((init.headers as Headers).get("authorization")).toBe("Bearer jwt-de-prueba");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ data: [] });
  });

  it("sin cookie no manda Authorization y respeta el status del backend", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ message: "Unauthorized" }, { status: 401 }));
    vi.stubGlobal("fetch", fetchMock);

    const req = new NextRequest("http://localhost:3000/api/backend/users/5/roles", {
      method: "POST",
      body: JSON.stringify({ roles: ["ADMIN"] }),
      headers: { "content-type": "application/json" },
    });
    const res = await POST(req, ctx(["users", "5", "roles"]));

    const [, init] = fetchMock.mock.calls[0];
    expect((init.headers as Headers).has("authorization")).toBe(false);
    expect(new TextDecoder().decode(init.body)).toBe('{"roles":["ADMIN"]}');
    expect(res.status).toBe(401);
  });

  it("responde 502 si el backend no está disponible", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));
    const res = await GET(new NextRequest("http://localhost:3000/api/backend/zone"), ctx(["zone"]));
    expect(res.status).toBe(502);
  });
});
