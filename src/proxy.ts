import { NextResponse, type NextRequest } from "next/server";
import { readValidJwt } from "@/shared/infrastructure/session/jwt";
import { SESSION_COOKIE } from "@/shared/infrastructure/session/session-constants";

/**
 * Chequeo OPTIMISTA de sesión antes de cada página (Next 16: antes "middleware").
 * Solo mira si la cookie tiene un JWT legible y sin expirar; no verifica la firma
 * (eso lo hace el backend en cada petición). Sirve para redirigir rápido, no
 * como única protección de los datos.
 */

/**
 * Rutas que se ven sin iniciar sesión. "/" NO está: sin sesión, la raíz lleva
 * al login. Si el listado público de eventos termina en "/", hay que agregarla.
 */
const PUBLIC_ROUTES = ["/login", "/register"];
/**
 * Rutas exclusivas para invitados (GUEST_ONLY_ROUTES)
 *
 * - **¿Qué hace?**: Define rutas que no tienen sentido para un usuario que ya cuenta con sesión abierta (`/login`, `/register`).
 * - **¿Cómo interactúa con el sistema en general?**: Provoca una redirección automática a la raíz `"/"` si un usuario autenticado intenta accederlas.
 * - **¿Cuál es su importancia?**: Mejora la experiencia de usuario (UX) evitando que usuarios ya logueados vuelvan a ver formularios de acceso o registro.
 */
const GUEST_ONLY_ROUTES = ["/login", "/register"];

/**
 * Función proxy (Middleware de Next.js 16)
 *
 * - **¿Qué hace?**: Intercepta de forma preliminar y optimista las solicitudes HTTP antes de renderizar cualquier página.
 *   1. Extrae el token JWT de la cookie `SESSION_COOKIE`.
 *   2. Verifica si el token es estructuralmente válido y no ha expirado mediante `readValidJwt(token)`.
 *   3. Si no hay sesión y la ruta no es pública, redirige a `/login?from=...` y limpia cualquier cookie caducada.
 *   4. Si hay sesión y el usuario intenta entrar a `/login` o `/register`, lo redirige a la raíz `/`.
 *   5. En cualquier otro caso, permite que la petición continúe con `NextResponse.next()`.
 * - **¿Cómo interactúa con el sistema en general?**: Opera en el Edge Runtime de Next.js antes de ejecutar Server Components o Server Actions.
 *   Se apoya en `readValidJwt` y `SESSION_COOKIE`.
 * - **¿Cuál es su importancia?**: Proporciona protección optimista perimetral inmediata. Si bien la seguridad estricta y validación
 *   criptográfica del token la ejecuta el backend en cada petición de datos, este proxy redirige de manera instantánea en el navegador,
 *   evitando parpadeos y cargas innecesarias de páginas protegidas.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = readValidJwt(token);

  if (!session && !PUBLIC_ROUTES.includes(pathname)) {
    const loginUrl = new URL("/login", request.url);
    // ?from= para volver a donde iba después del login (no hace falta si iba a "/")
    if (pathname !== "/") loginUrl.searchParams.set("from", `${pathname}${search}`);
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

/**
 * Configuración del Matcher para el proxy
 *
 * - **¿Qué hace?**: Excluye del procesamiento de middleware las rutas de API internas, archivos estáticos, imágenes optimizadas,
 *   favicon e imágenes con extensiones comunes (`.svg`, `.png`, `.jpg`, etc.).
 * - **¿Cómo interactúa con el sistema en general?**: Le indica al motor de Next.js sobre qué peticiones debe ejecutarse la función `proxy`.
 * - **¿Cuál es su importancia?**: Optimiza el rendimiento al evitar la ejecución de middleware sobre recursos estáticos y assets multimedia.
 */
export const config = {
  // No corre en archivos estáticos ni en las rutas internas de Next
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
