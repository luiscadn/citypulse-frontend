# 🎓 Guía de Sustentación Rápida & Mapa del Código (CityPulse Frontend)

> **💡 CÓMO USAR ESTA GUÍA DURANTE LA SUSTENTACIÓN:**
> Ten este archivo abierto en el editor. Cuando el profesor pregunte algo, presiona **`Command + F`** (o `Ctrl + F`), escribe la palabra clave de su pregunta (ej. `token`, `cookie`, `bearer`, `middleware`, `2fa`, `roles`, `invariantes`, `backend`, `mapa 3d`, `bff`) y tendrás de inmediato el **archivo exacto**, la **línea de código** y la **explicación teórica** para responderle con total seguridad.

---

## 📑 Índice de Preguntas Frecuentes del Profesor

1. [¿Dónde se guarda el token JWT y por qué es seguro?](#1-dónde-se-guarda-el-token-jwt-y-por-qué-es-seguro)
2. [¿Dónde se inyecta el token en las peticiones HTTP hacia el backend?](#2-dónde-se-inyecta-el-token-en-las-peticiones-http-hacia-el-backend)
3. [¿Dónde está el Middleware / Proxy que protege las rutas privadas?](#3-dónde-está-el-middleware--proxy-que-protege-las-rutas-privadas)
4. [¿Dónde se valida el token y cómo se sabe si ya expiró?](#4-dónde-se-valida-el-token-y-cómo-se-sabe-si-ya-expiró)
5. [¿Dónde está configurada la URL de la API del Backend NestJS?](#5-dónde-está-configurada-la-url-de-la-api-del-backend-nestjs)
6. [¿Dónde está el Reverse Proxy / BFF (Backend For Frontend) y para qué sirve?](#6-dónde-está-el-reverse-proxy--bff-backend-for-frontend-y-para-qué-sirve)
7. [¿Cómo funciona la autenticación en dos pasos (2FA / TOTP / QR)?](#7-cómo-funciona-la-autenticación-en-dos-pasos-2fa--totp--qr)
8. [¿Dónde y cómo se manejan los roles y permisos (RBAC)?](#8-dónde-y-cómo-se-manejan-los-roles-y-permisos-rbac)
9. [¿Dónde están las Entidades de Dominio y cómo garantizan inmutabilidad y validez?](#9-dónde-están-las-entidades-de-dominio-y-cómo-garantizan-inmutabilidad-y-validez)
10. [¿Dónde está la Inversión de Dependencias (DI Containers / SOLID)?](#10-dónde-está-la-inversión-de-dependencias-di-containers--solid)
11. [¿Dónde están los DTOs y Mappers y por qué se usan?](#11-dónde-están-los-dtos-y-mappers-y-por-qué-se-usan)
12. [¿Cómo funcionan las Server Actions y cómo se revalida la caché?](#12-cómo-funcionan-las-server-actions-y-cómo-se-revalida-la-caché)
13. [¿Dónde están los Hooks Fachada y por qué se usan con React 19?](#13-dónde-están-los-hooks-fachada-y-por-qué-se-usan-con-react-19)
14. [¿Dónde y cómo está implementado el Mapa 3D de Cali (WebGL / MapLibre)?](#14-dónde-y-cómo-está-implementado-el-mapa-3d-de-cali-webgl--maplibre)
15. [¿Dónde están las Transiciones de Vista y cuál es la diferencia entre template.tsx y layout.tsx?](#15-dónde-están-las-transiciones-de-vista-y-cuál-es-la-diferencia-entre-templatetsx-y-layouttsx)
16. [¿Dónde se obtiene el usuario logueado en Server Components?](#16-dónde-se-obtiene-el-usuario-logueado-en-server-components)
17. [¿Dónde se manejan los errores de Dominio vs errores de Infraestructura?](#17-dónde-se-manejan-los-errores-de-dominio-vs-errores-de-infraestructura)
18. [¿Qué medidas de seguridad previenen XSS, CSRF y BOLA en el frontend?](#18-qué-medidas-de-seguridad-previenen-xss-csrf-y-bola-en-el-frontend)
19. [¿Dónde están las pruebas automatizadas y qué cubren?](#19-dónde-están-las-pruebas-automatizadas-y-qué-cubren)
20. [¿Dónde está el Pipeline de CI/CD?](#20-dónde-está-el-pipeline-de-cicd)

---

### 1. ¿Dónde se guarda el token JWT y por qué es seguro?
* **Términos de búsqueda:** `token`, `cookie`, `httponly`, `guardar token`, `cp_session`, `session-cookie`.
* **Archivos clave:**
  * [`src/shared/infrastructure/session/session-cookie.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/shared/infrastructure/session/session-cookie.ts#L27-L40) (`setSessionToken`, `getSessionToken`, `clearSessionToken`)
  * [`src/shared/infrastructure/session/session-constants.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/shared/infrastructure/session/session-constants.ts#L11) (`SESSION_COOKIE = "cp_session"`)
  * [`src/features/auth/infrastructure/session/cookie-session-store.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/features/auth/infrastructure/session/cookie-session-store.ts#L27-L35) (`CookieSessionStore`)
* **Qué responderle al profesor:**
  > *"El token JWT jamás se guarda en `localStorage` ni en variables globales de cliente porque cualquier script inyectado (XSS) podría robarlo. Se almacena exclusivamente en una cookie HTTP del servidor llamada `cp_session` configurada con `httpOnly: true` (inaccesible desde JavaScript en el navegador), `sameSite: 'lax'` (protege contra ataques CSRF), `secure: true` en producción y con un `maxAge` que se sincroniza exactamente con la fecha de expiración `exp` del JWT."*

---

### 2. ¿Dónde se inyecta el token en las peticiones HTTP hacia el backend?
* **Términos de búsqueda:** `bearer`, `authorization`, `inyectar token`, `cabeceras`, `fetchhttpclient`.
* **Archivos clave:**
  * [`src/shared/infrastructure/fetch-http-client.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/shared/infrastructure/fetch-http-client.ts#L50-L58) (líneas 50 y 55 en `request()`)
  * [`src/shared/di/http.server.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/shared/di/http.server.ts#L20-L23) (`serverHttp` inyectando `getSessionToken()`)
* **Qué responderle al profesor:**
  > *"La inyección del token está completamente centralizada. La clase `FetchHttpClient` recibe en su constructor una función asíncrona proveedora de tokens `getToken()`. En `src/shared/di/http.server.ts`, instanciamos el singleton `serverHttp` pasándole `async () => (await getSessionToken()) ?? null`. Cuando cualquier repositorio de infraestructura hace un `get`, `post`, `patch` o `delete`, el método privado `request()` resuelve el token y agrega automáticamente la cabecera `Authorization: Bearer <token>`."*

---

### 3. ¿Dónde está el Middleware / Proxy que protege las rutas privadas?
* **Términos de búsqueda:** `middleware`, `proxy`, `rutas protegidas`, `public_routes`, `redirección login`.
* **Archivo clave:**
  * [`src/proxy.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/proxy.ts#L37-L78)
* **Qué responderle al profesor:**
  > *"En Next.js 16 la función perimetral se define en `src/proxy.ts`. Actúa en el Edge Runtime interceptando cada petición antes de renderizar páginas:
  > 1. Extrae la cookie `cp_session` y verifica el JWT con `readValidJwt(token)`.
  > 2. Si el usuario NO tiene sesión válida y la ruta no está en `PUBLIC_ROUTES` (`['/login', '/register']`), lo redirige inmediatamente a `/login?from=<ruta>` y elimina cookies corruptas.
  > 3. Si el usuario SÍ tiene sesión e intenta entrar a `/login` o `/register`, lo redirige a la raíz `/`.
  > 4. Es un chequeo optimista perimetral que evita pantallas en blanco y protege la experiencia del usuario, mientras que la seguridad estricta y firma del token se valida en el backend en cada petición."*

---

### 4. ¿Dónde se valida el token y cómo se sabe si ya expiró?
* **Términos de búsqueda:** `readvalidjwt`, `decodejwt`, `expiración token`, `base64url`, `claims`.
* **Archivo clave:**
  * [`src/shared/infrastructure/session/jwt.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/shared/infrastructure/session/jwt.ts#L50-L95) (`decodeJwt` y `readValidJwt`)
* **Qué responderle al profesor:**
  > *"En `src/shared/infrastructure/session/jwt.ts`. La función `decodeJwt(token)` separa las 3 partes del JWT (`header.payload.signature`) y decodifica el segmento de payload usando Base64URL sin librerías externas de Node.js (apto para Edge Runtime). Luego, `readValidJwt(token)` revisa que el claim de expiración `payload.exp * 1000` sea mayor que `Date.now()`. Si el token expiró o está corrupto, devuelve `null` de forma segura sin arrojar excepciones no controladas."*

---

### 5. ¿Dónde está configurada la URL de la API del Backend NestJS?
* **Términos de búsqueda:** `api_url`, `url del backend`, `getbackendurl`, `3001`, `variables de entorno`.
* **Archivo clave:**
  * [`src/shared/infrastructure/backend-proxy.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/shared/infrastructure/backend-proxy.ts#L23-L25) (`getBackendUrl()`)
* **Qué responderle al profesor:**
  > *"En `src/shared/infrastructure/backend-proxy.ts`, la función `getBackendUrl()` retorna `process.env.API_URL ?? 'http://localhost:3001'`. No le pusimos el prefijo `NEXT_PUBLIC_` deliberadamente para que la URL del backend y su topología de red queden restringidas al entorno servidor y nunca se filtren al código JavaScript del navegador."*

---

### 6. ¿Dónde está el Reverse Proxy / BFF (Backend For Frontend) y para qué sirve?
* **Términos de búsqueda:** `bff`, `backend for frontend`, `reverse proxy`, `api/backend`, `bad gateway`, `route handler`.
* **Archivo clave:**
  * [`src/app/api/backend/[...path]/route.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/app/api/backend/[...path]/route.ts#L20-L65)
* **Qué responderle al profesor:**
  > *"Es un Route Handler catch-all en `/api/backend/[...path]`. Implementa el patrón Backend For Frontend (BFF) y Reverse Proxy:
  > 1. Cuando el cliente hace una petición a `/api/backend/eventos`, Next.js recibe la llamada en el mismo dominio, eliminando cualquier problema de CORS.
  > 2. Como la cookie `cp_session` es `httpOnly`, el navegador la envía automáticamente a Next.js pero el JS del cliente no puede leerla.
  > 3. La función `forward()` lee la cookie, le añade `Authorization: Bearer <token>` y la reenvía por red interna al backend NestJS.
  > 4. Si el backend está caído, captura el fallo y devuelve HTTP 502 Bad Gateway sin tumbar la aplicación."*

---

### 7. ¿Cómo funciona la autenticación en dos pasos (2FA / TOTP / QR)?
* **Términos de búsqueda:** `2fa`, `two factor`, `totp`, `código qr`, `starttwofactoraction`, `enabletwofactoraction`.
* **Archivos clave:**
  * Casos de uso: [`src/features/auth/application/use-cases/two-factor.use-cases.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/features/auth/application/use-cases/two-factor.use-cases.ts) (`SetupTwoFactorUseCase`, `EnableTwoFactorUseCase`, `DisableTwoFactorUseCase`)
  * Server Actions: [`src/features/auth/presentation/actions/two-factor.actions.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/features/auth/presentation/actions/two-factor.actions.ts)
  * Hook fachada: [`src/features/auth/presentation/hooks/use-two-factor.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/features/auth/presentation/hooks/use-two-factor.ts)
* **Qué responderle al profesor:**
  > *"El flujo de 2FA se divide en dos pasos:
  > 1. **Enrolamiento (`SetupTwoFactorUseCase`)**: El backend genera un secreto TOTP y un código QR (`data:image/png;base64,...`) que el usuario escanea con Google Authenticator.
  > 2. **Confirmación y Activación (`EnableTwoFactorUseCase`)**: El usuario digita el código de 6 dígitos; el caso de uso valida que sean dígitos numéricos y el backend comprueba criptográficamente el algoritmo TOTP. Al iniciar sesión posteriormente, `loginUseCase` detecta el estado `two-factor-required` y solicita el código antes de emitir y guardar el JWT."*

---

### 8. ¿Dónde y cómo se manejan los roles y permisos (RBAC)?
* **Términos de búsqueda:** `roles`, `rbac`, `hasrole`, `admin`, `owner`, `canmoderateevents`, `isauthororadmin`.
* **Archivos clave:**
  * Enums: [`src/shared/domain/enums.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/shared/domain/enums.ts#L1-L15) (`RoleName: USER, OWNER, ADMIN`)
  * Verificación en sesión: [`src/features/auth/domain/rules/session-roles.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/features/auth/domain/rules/session-roles.ts#L16-L18) (`hasRole(user, role)`)
  * Reglas de negocio de eventos: [`src/features/events/domain/rules/event-permissions.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/features/events/domain/rules/event-permissions.ts) (`canModerateEvents`, `canPublishOfficialEvents`, `canCancelEvent`)
  * Asignación por Admin: [`src/features/users/presentation/actions/admin-users.actions.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/features/users/presentation/actions/admin-users.actions.ts) (`assignRolesAction`)
* **Qué responderle al profesor:**
  > *"Implementamos Role-Based Access Control (RBAC) con Defensa en Profundidad:
  > 1. En la UI, `hasRole(user, RoleName.ADMIN)` u `OWNER` condiciona qué botones o pestañas se ven.
  > 2. En las Server Actions (ej. `moderation.actions.ts`), la función `requireModerator()` re-valida la sesión y los roles directamente en el servidor antes de invocar los casos de uso.
  > 3. Aunque alguien intente hacer un POST malicioso directo a la Server Action, el servidor rechaza la ejecución si no tiene el rol correspondiente."*

---

### 9. ¿Dónde están las Entidades de Dominio y cómo garantizan inmutabilidad y validez?
* **Términos de búsqueda:** `invariantes`, `object.freeze`, `createevent`, `createuser`, `createzone`, `createvenue`, `ispositiveint`.
* **Archivos clave:**
  * Predicados de invariantes: [`src/shared/domain/invariants.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/shared/domain/invariants.ts)
  * Entidad Evento: [`src/features/events/domain/entities/event.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/features/events/domain/entities/event.ts#L220-L280) (`createEvent`, `createEventDetail`, `createPendingReport`)
* **Qué responderle al profesor:**
  > *"Siguiendo Domain-Driven Design (DDD), las entidades son el núcleo del sistema. En lugar de clases con métodos mutadores, usamos interfaces con propiedades `readonly` y funciones fábrica puras (`createEvent`, `createUser`, `createZone`, `createVenue`). La fábrica evalúa invariantes (fechas cronológicas, IDs enteros positivos, cadenas no vacías) y retorna el objeto sellado con `Object.freeze()`. Esto garantiza que jamás exista una entidad con estado corrupto y permite transferirlas como objetos planos entre Server Components y Client Components."*

---

### 10. ¿Dónde está la Inversión de Dependencias (DI Containers / SOLID)?
* **Términos de búsqueda:** `inversión de dependencias`, `di container`, `container`, `composition root`, `solid`.
* **Archivos clave:**
  * Servidor HTTP: [`src/shared/di/http.server.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/shared/di/http.server.ts)
  * Contenedores por feature:
    * Eventos: [`src/features/events/di/event.container.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/features/events/di/event.container.ts)
    * Lugares: [`src/features/venue/di/venue.container.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/features/venue/di/venue.container.ts)
    * Asistencia: [`src/features/attendance/di/attendance.container.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/features/attendance/di/attendance.container.ts)
    * Zonas: [`src/features/zone/di/zone.container.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/features/zone/di/zone.container.ts)
    * Amistades: [`src/features/friendship/di/friendship.container.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/features/friendship/di/friendship.container.ts)
* **Qué responderle al profesor:**
  > *"Aplicamos el Principio de Inversión de Dependencias (DIP): la capa de aplicación y los casos de uso dependen exclusivamente de interfaces/puertos (ej. `EventRepository`), nunca de librerías concretas. En cada módulo existe una carpeta `di/` que actúa como Composition Root: crea la instancia del repositorio concreto (`HttpEventRepository(serverHttp)`) y la inyecta por constructor a cada caso de uso."*

---

### 11. ¿Dónde están los DTOs y Mappers y por qué se usan?
* **Términos de búsqueda:** `dto`, `mapper`, `desacoplamiento`, `toevent`, `touser`, `tozone`.
* **Archivos clave:**
  * DTOs: `src/features/*/infrastructure/dtos/*.dto.ts` (ej. `user.dto.ts`, `event.dto.ts`)
  * Mappers: `src/features/*/infrastructure/mappers/*.mapper.ts` (ej. `user.mapper.ts`, `event.mapper.ts`)
* **Qué responderle al profesor:**
  > *"Los DTOs definen la estructura exacta que entrega la API REST externa (con nomenclaturas de base de datos, snake_case o IDs anidados). Los Mappers convierten esos DTOs en Entidades inmutables de Dominio limpiando datos y normalizando tipos. Si el backend cambia el nombre de una columna o el formato de una tabla, solo modificamos el Mapper en Infraestructura; el Dominio y la Presentación no se rompen."*

---

### 12. ¿Cómo funcionan las Server Actions y cómo se revalida la caché?
* **Términos de búsqueda:** `server actions`, `use server`, `revalidar`, `refresh`, `next/cache`.
* **Archivos clave:**
  * Eventos: [`src/features/events/presentation/actions/event.actions.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/features/events/presentation/actions/event.actions.ts)
  * Moderación: [`src/features/events/presentation/actions/moderation.actions.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/features/events/presentation/actions/moderation.actions.ts)
* **Qué responderle al profesor:**
  > *"Las Server Actions son funciones asíncronas identificadas con `'use server'` que se ejecutan en el servidor. Al completar una mutación (crear, editar o moderar un evento), invocan `refresh()` de `next/cache`. Esto le indica a Next.js que revalide los datos y re-renderice los Server Components afectados transmitiendo solo el diferencial (RSC payload) al navegador, sin recargar toda la página."*

---

### 13. ¿Dónde están los Hooks Fachada y por qué se usan con React 19?
* **Términos de búsqueda:** `useactionstate`, `hooks fachada`, `usetransition`, `presentation/hooks`.
* **Archivos clave:**
  * `src/features/*/presentation/hooks/*.ts` (ej. `use-attendance.ts`, `use-login.ts`, `use-place-search.ts`, `use-role-editor.ts`)
* **Qué responderle al profesor:**
  > *"Los hooks fachada desacoplan los componentes de interfaz de las Server Actions. Utilizan `useActionState` de React 19: reciben la Server Action y el estado inicial, y entregan a la vista una tupla limpia `{ state, formAction, pending, error }`. De este modo, los formularios HTML ejecutan mutaciones asíncronas con feedback instantáneo y deshabilitación de botones durante el envío."*

---

### 14. ¿Dónde y cómo está implementado el Mapa 3D de Cali (WebGL / MapLibre)?
* **Términos de búsqueda:** `mapa 3d`, `webgl`, `maplibre`, `openfreemap`, `shared-map`, `cameraorbit`, `building-3d`.
* **Archivos clave:**
  * Componente React: [`src/features/venue/presentation/components/city-map/city-map.tsx`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/features/venue/presentation/components/city-map/city-map.tsx)
  * Singleton en memoria: [`src/features/venue/presentation/components/city-map/shared-map.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/features/venue/presentation/components/city-map/shared-map.ts)
  * Estilos y 3D: [`src/features/venue/presentation/components/city-map/map-style.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/features/venue/presentation/components/city-map/map-style.ts)
  * Órbita de cámara: [`src/features/venue/presentation/components/city-map/camera-orbit.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/features/venue/presentation/components/city-map/camera-orbit.ts)
* **Qué responderle al profesor:**
  > *"Utiliza MapLibre GL con mosaicos vectoriales de OpenFreeMap:
  > 1. **Extrusión 3D**: En `map-style.ts`, añadimos una capa `fill-extrusion` ('building-3d') que lee la altura real de OpenStreetMap (`render_height`).
  > 2. **Rendimiento Singleton**: Crear y destruir un contexto WebGL tarda 1 segundo. En `shared-map.ts`, mantenemos una única instancia del mapa en memoria; al salir del home se desanexa del DOM (`detachCityMap`) y al regresar se reanexa al instante (`attachCityMap`).
  > 3. **Rotación suave**: `CameraOrbit` encadena tramos de 90° con `rotateTo()` en lugar de mover la cámara por cuadro, permitiendo a MapLibre recalcular etiquetas de forma incremental y consumiendo 10 veces menos GPU."*

---

### 15. ¿Dónde están las Transiciones de Vista y cuál es la diferencia entre template.tsx y layout.tsx?
* **Términos de búsqueda:** `viewtransition`, `template vs layout`, `page-enter`, `page-exit`, `template.tsx`.
* **Archivo clave:**
  * [`src/app/(app)/template.tsx`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/app/(app)/template.tsx)
* **Qué responderle al profesor:**
  > *"En `src/app/(app)/template.tsx`, usamos `<ViewTransition enter='page-enter' exit='page-exit'>` de React 19.
  > La diferencia fundamental en Next.js es que los `layout.tsx` son persistentes (mantienen su instancia y estado entre navegaciones de ruta), mientras que los `template.tsx` se destruyen y se vuelven a montar en cada cambio de página. Esto es lo que permite reiniciar y disparar las animaciones de entrada y salida visuales."*

---

### 16. ¿Dónde se obtiene el usuario logueado en Server Components?
* **Términos de búsqueda:** `getcurrentuser`, `usuario actual`, `quién está logueado`, `sesión server`.
* **Archivo clave:**
  * [`src/features/auth/infrastructure/session/get-current-user.ts`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/src/features/auth/infrastructure/session/get-current-user.ts#L29-L35)
* **Qué responderle al profesor:**
  > *"En `src/features/auth/infrastructure/session/get-current-user.ts`. La función `getCurrentUser()` lee la cookie segura `cp_session`, decodifica el JWT con `readValidJwt` y extrae `{ id, email, roles }`. Se ejecuta en el servidor en tiempo constante (0 ms) sin hacer peticiones de red adicionales al backend."*

---

### 17. ¿Dónde se manejan los errores de Dominio vs errores de Infraestructura?
* **Términos de búsqueda:** `domainerror`, `httperror`, `actionerrormessage`, `manejo de errores`.
* **Archivos clave:**
  * Error base dominio: `src/shared/domain/errors/domain-error.ts`
  * Error HTTP: `src/shared/infrastructure/http-client.ts` (`HttpError`)
  * Formateador UI: `src/shared/presentation/action-error.ts` (`actionErrorMessage`)
* **Qué responderle al profesor:**
  > *"Seguimos una jerarquía estricta: los errores de reglas de negocio heredan de `DomainError` (ej. `EventDatesOrderError`, `InvalidEventError`). Los fallos de red lanzan `HttpError` con el código de estado (401, 403, 404, 500). En la capa de presentación, la función `actionErrorMessage()` captura cualquier tipo de error y produce un mensaje amigable para mostrar en los componentes de alerta de la interfaz."*

---

### 18. ¿Qué medidas de seguridad previenen XSS, CSRF y BOLA en el frontend?
* **Términos de búsqueda:** `seguridad`, `xss`, `csrf`, `bola`, `isweburl`, `textcontent`.
* **Archivos clave:**
  * Anti-XSS en Cookies: `src/shared/infrastructure/session/session-cookie.ts` (`httpOnly: true`)
  * Anti-XSS en Enlaces: `src/features/events/domain/rules/event-input.ts` (`isWebUrl` descarta protocolos peligrosos como `javascript:` o `data:`)
  * Anti-XSS en DOM: `src/features/venue/presentation/components/city-map/shared-map.ts` (`venueCard` utiliza `textContent`, jamás `innerHTML`)
  * Anti-CSRF: `session-cookie.ts` (`sameSite: 'lax'`)
  * Anti-BOLA: `src/features/events/presentation/actions/official-event.actions.ts` (verifica que el `venueId` seleccionado pertenezca a los recintos del usuario mediante `listMyVenuesUseCase`)
* **Qué responderle al profesor:**
  > *"Aplicamos seguridad multicapa: cookies `httpOnly` para que scripts maliciosos no alcancen el token; validación de URLs (`isWebUrl`) para impedir inyecciones `javascript:`; manipulación de popups WebGL con `textContent` en vez de `innerHTML`; y prevención de BOLA en el servidor verificando la pertenencia de los recursos antes de mutar datos."*

---

### 19. ¿Dónde están las pruebas automatizadas y qué cubren?
* **Términos de búsqueda:** `vitest`, `playwright`, `pruebas unitarias`, `pruebas e2e`, `test`.
* **Archivos clave:**
  * Pruebas Unitarias: Archivos `*.test.ts` ubicados junto al código en `src/` (47 suites de prueba, 355 tests pasando al 100%).
  * Pruebas E2E: Directorio `e2e/` (`auth.setup.ts`, `zones.spec.ts`).
  * Configuración: `vitest.config.ts`, `playwright.config.ts`.
* **Qué responderle al profesor:**
  > *"Tenemos una pirámide de pruebas completa: 355 pruebas unitarias con Vitest que cubren entidades de dominio, casos de uso con repositorios mockeados, clientes HTTP, mappers y Server Actions. Además, tenemos pruebas End-to-End con Playwright en `e2e/` que prueban en un navegador real el flujo de login, autorización por roles y el ciclo de vida CRUD de zonas."*

---

### 20. ¿Dónde está el Pipeline de CI/CD?
* **Términos de búsqueda:** `ci`, `cd`, `github actions`, `pipeline`, `workflow`, `ci.yml`.
* **Archivo clave:**
  * [`.github/workflows/ci.yml`](file:///Users/luiscadena/Documents/Universidad/Semestre8/Compunet3/comentarios/icesi-2026b-2026b-nextjs-taller-group-6/.github/workflows/ci.yml)
* **Qué responderle al profesor:**
  > *"En `.github/workflows/ci.yml`. Con cada push o pull request, GitHub Actions ejecuta automáticamente:
  > 1. Verificación estricta de tipos de TypeScript (`next typegen && tsc --noEmit`).
  > 2. Análisis estático con ESLint (`npm run lint`).
  > 3. Ejecución de las 355 pruebas unitarias en Vitest (`npm run test:unit`).
  > 4. Compilación del proyecto de Next.js (`npm run build`).
  > 5. Ejecución de pruebas E2E con Playwright contra el backend."*
