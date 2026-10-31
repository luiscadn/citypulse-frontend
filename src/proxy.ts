import { NextResponse, type NextRequest } from "next/server";
import { readValidJwt } from "@/shared/infrastructure/session/jwt";
import { SESSION_COOKIE } from "@/shared/infrastructure/session/session-constants";

/**
 * Chequeo OPTIMISTA de sesión antes de cada página (Next 16: antes "middleware").
 * Solo mira si la cookie tiene un JWT legible y sin expirar; no verifica la firma
 * (eso lo hace el backend en cada petición). Sirve para redirigir rápido, no
 * como única protección de los datos.
 */

/** Rutas que se ven sin iniciar sesión */
const PUBLIC_ROUTES = ["/", "/login", "/register"];
/** Rutas que no tienen sentido con sesión abierta */
const GUEST_ONLY_ROUTES = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = readValidJwt(token);

  if (!session && !PUBLIC_ROUTES.includes(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", `${pathname}${search}`);
    const response = NextResponse.redirect(loginUrl);
    // Token vencido o corrupto: se borra para no arrastrarlo
    if (token) response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  if (session && GUEST_ONLY_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // No corre en archivos estáticos ni en las rutas internas de Next
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
