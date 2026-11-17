# CityPulse: frontend

Aplicación para reportar, verificar y difundir eventos urbanos de Cali. Este repositorio es el **frontend** en Next.js 16 (App Router y TypeScript), organizado con **Clean Architecture por feature**. Consume la API del taller anterior en NestJS ([`icesi-2026b-nestjs-taller-group-6`](https://github.com/ICESI-CI3/icesi-2026b-nestjs-taller-group-6)).

**Computación en Internet III**, Universidad Icesi, 2026-2. Grupo 6.

## Enlaces de producción

| | URL |
|---|---|
| Frontend | _pendiente_ |
| Backend (API) | https://citypulse-api-lrs2.onrender.com |
| Documentación de la API (Swagger) | https://citypulse-api-lrs2.onrender.com/api/docs |

El backend está en el plan gratis de Render: si lleva un rato sin uso, la primera petición tarda cerca de un minuto en despertarlo.

## Tecnologías

- Next.js 16 (App Router, Cache Components, Server Actions), React 19 y TypeScript
- Tailwind CSS 4 con un sistema de diseño propio (tokens en `src/app/globals.css`, componentes en `src/shared/presentation/components`)
- Vitest y Testing Library (pruebas unitarias), Playwright (pruebas E2E)
- GitHub Actions (CI)

## Cómo ejecutarlo en local

Requisitos: Node.js 24 (mínimo 20.9), npm y Docker.

### 1. Backend

En el repositorio del backend (carpeta `p2pevent`):

```bash
cp .env.example .env      # completar los valores (ver el README del backend)
docker compose up -d      # PostgreSQL 18; la primera vez carga db/init.sql con datos de prueba
npm install
npm run start:dev         # http://localhost:3001 · Swagger en /api/docs
```

### 2. Frontend

```bash
cp .env.example .env.local
npm install
npm run dev               # http://localhost:3000
```

### Variables de entorno

| Variable | Ejemplo | Para qué |
|---|---|---|
| `API_URL` | `http://localhost:3001` | URL del backend. Solo la usa el servidor de Next (no lleva `NEXT_PUBLIC_`), así que el navegador nunca la ve |

La clave de Google Maps **no** va en el frontend: el buscador de lugares llama al backend, que es el único que la tiene.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` y `npm start` | Compilación y servidor de producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | Revisión de tipos con `tsc` |
| `npm test` | Pruebas unitarias (Vitest) en modo observador; `npx vitest run` las corre una vez |
| `npm run test:e2e` | Pruebas E2E (Playwright). Necesitan el backend corriendo con los datos de `db/init.sql` |

## Cómo probar cada funcionalidad

Usuarios de prueba que crea `db/init.sql` en el backend:

| Rol | Correo | Contraseña |
|---|---|---|
| ADMIN | `admin@citypulse.co` | `Admin123*` |
| OWNER | `teatro@citypulse.co` | `Owner123*` |
| USER | `ana@citypulse.co` | `User123*` |

| Funcionalidad | Ruta | Cómo probarla |
|---|---|---|
| Inicio y cierre de sesión | `/login` | Entra con cualquiera de los usuarios. Sin sesión, cualquier ruta protegida redirige al login y después vuelve a ella. "Cerrar sesión" borra la sesión |
| Registro, perfil y 2FA | `/register`, `/profile` | Crea una cuenta. En el perfil edita tus datos y activa el 2FA con una app de autenticación |
| Amistades e invitaciones | `/friends`, `/invitations` | Busca a otra persona, envíale una solicitud y respóndela desde su cuenta |
| Zonas | `/zones` | Como ADMIN: crea, edita y borra zonas, con zona padre. Si la zona tiene lugares, el borrado se rechaza con un mensaje. Como USER solo puedes verlas |
| Lugares | `/venues`, `/venues/mine` | Filtra por zona y estado y pasa de página. Como OWNER, registra un lugar en "Mis lugares": nace pendiente. Como ADMIN, verifícalo. Si el OWNER cambia nombre, dirección o zona, vuelve a pendiente |
| Mapas | `/venues/mine` | En el formulario de lugar, busca en Google Maps (por ejemplo, "Teatro Municipal") y elige un resultado: se llenan el nombre y la dirección. Requiere `GOOGLE_MAPS_API_KEY` en el backend |
| Eventos | `/events`, `/events/new`, `/events/[id]` | Filtra por zona, estado, origen, texto y rango de fechas, y pasa de página. Reporta un evento: nace en revisión. Su autor (o un ADMIN) lo edita mientras está en revisión y lo cancela |
| Asistencia | `/events/[id]` | En el detalle de un evento abierto responde "Asistiré", "Tal vez" o "No iré" y mira qué respondieron tus amigos. El autor y los ADMIN ven además todas las respuestas |

## Arquitectura

Cada feature (`src/features/<feature>`) tiene las mismas capas:

```
domain/          entidades, errores de dominio y reglas (TypeScript puro)
application/     puertos (interfaces de repositorio) y casos de uso
infrastructure/  DTO, mappers y repositorios HTTP (adaptadores)
di/              contenedor: único lugar donde se instancian repositorios y casos de uso
presentation/    Server Actions, hooks fachada y componentes
```

- **Entidades:** cada una tiene una fábrica (`createZone`, `createVenue`, `createEvent`, `createUser`...) que comprueba sus invariantes y la congela; los mappers solo construyen entidades a través de ella, así que una entidad inválida no puede existir. Son funciones y no clases porque las entidades pasan de Server a Client Components, que solo aceptan objetos planos.
- **Hooks fachada:** los componentes de cliente no importan Server Actions ni contextos; usan hooks (`useZoneForm`, `useAttendance`, `useSession`...) que los encapsulan.

- **Sesión:** el JWT del backend se guarda en una cookie `httpOnly` (`cp_session`).
- **Llamadas al backend:**
  - Los Server Components y las Server Actions usan `serverHttp`, que adjunta `Authorization: Bearer`.
  - El navegador llama a `/api/backend/*`, un puente que hace lo mismo.
  - En los dos casos, un único `FetchHttpClient` agrega el token en cada petición.
- **Rutas protegidas:** `src/proxy.ts` revisa la sesión y redirige al login.
- **Roles:** USER, OWNER y ADMIN. La interfaz muestra u oculta según el rol, las Server Actions lo vuelven a revisar y el backend tiene la decisión final.

## Pruebas y CI

- **Unitarias:** dominio, casos de uso (repositorio simulado), repositorios HTTP y Server Actions. Archivos `*.test.ts` junto al código.
- **E2E** (`e2e/`):
  - Qué cubren:
    - Autenticación: login, contraseña incorrecta, logout y rutas protegidas.
    - Autorización: lo que ve cada rol.
    - Un flujo de negocio: el ADMIN crea, edita y borra una zona.
  - Cómo funcionan:
    - `auth.setup.ts` inicia sesión una vez por rol y guarda la cookie.
    - El flujo de zonas corre en modo serial con un nombre único y se limpia al final, así que la suite da el mismo resultado si se corre dos veces seguidas.
- **CI** (`.github/workflows/ci.yml`), en cada push:
  1. Lint, tipos, unitarias y build.
  2. E2E contra el backend real. El job elige el backend así:
     - Con el secreto `BACKEND_REPO_TOKEN` (lectura sobre el repositorio del backend, que es privado), lo levanta en el mismo job con PostgreSQL y `db/init.sql`.
     - Si no, con la variable del repositorio `E2E_API_URL`, prueba contra el backend desplegado.
     - Sin ninguno de los dos, omite las E2E y deja un aviso. Los permisos de la organización no dejan crear el token, así que hoy `E2E_API_URL` apunta al backend desplegado en Render.

Si `npx playwright install chromium` se queda descargando, `E2E_CHANNEL=chrome npm run test:e2e` usa el Google Chrome instalado.

## Equipo

| Parte | Integrante |
|---|---|
| 1. Eventos | Daniel Trujillo |
| 2. Moderación, evidencias y GraphQL | _por completar_ |
| 3. Amistades, invitaciones y asistencia | Cuellar |
| 4. Zonas, lugares y mapas; pruebas E2E y CI | Luis Cadena |
| 5. Usuarios, registro, perfil y 2FA | Carol Mosquera |
| Sistema de diseño, autenticación base y revisión de PRs | Ismael Barrionuevo |

## Uso de herramientas de IA

Cada integrante indica qué herramientas usó y para qué partes.

| Integrante | Herramienta | Para qué |
|---|---|---|
| Luis Cadena | Claude Code | Apoyo en la implementación y las pruebas de zonas, lugares y mapas; configuración de Playwright y del pipeline de CI; borrador de este README |
| _Por completar_ | | |
