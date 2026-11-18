# Comentarios tuyos que no encontraron su lugar exacto

El código que tenían debajo cambió en `main`. Ubícalos a mano sobre el código nuevo equivalente.

## `src/features/events/domain/entities/event.ts`
Estaba encima de: `readonly startDate: string;`

```ts
  /** Fechas en formato ISO 8601 (UTC). */
```

## `src/features/events/domain/entities/event.ts`
Estaba encima de: `readonly addressText: string | null;`

```ts
  /** Dirección en texto libre cuando el evento no se realiza en un venue registrado. */
```

## `src/features/events/domain/entities/event.ts`
Estaba encima de: `export type EvidenceType = "FOTO" | "ENLACE" | "DOCUMENTO";`

```ts
/**
 * Tipos de evidencia permitidos que pueden respaldar un reporte comunitario de evento.
 */
```

## `src/features/events/presentation/components/event-detail.tsx`
Estaba encima de: `function isWebUrl(url: string): boolean {`

```ts
/**
 * Verifica si una URL tiene un protocolo seguro web (`http:` o `https:`).
 */
```

## `src/features/maps/presentation/components/place-search.tsx`
Estaba encima de: `function search() {`

```ts
  /** Dispara la búsqueda asíncrona dentro de una transición de React */
```

## `src/features/users/infrastructure/dtos/user.dto.ts`
Estaba encima de: `createdAt: string;`

```ts
  /** Marca de tiempo de creación en formato ISO 8601. */
```

## `src/features/users/infrastructure/dtos/user.dto.ts`
Estaba encima de: `userRoles?: { role: { name: string } }[];`

```ts
  /** Estructura anidada devuelta por la relación de roles en TypeORM. */
```

## `src/features/users/infrastructure/mappers/user.mapper.ts`
Estaba encima de: `function normalizeRoles(raw: UserDto["userRoles"]): RoleName[] {`

```ts
/**
 * Función auxiliar para normalizar y validar los roles recibidos desde el DTO.
 *
 * - **¿Qué hace?**: Extrae el nombre de cada rol anidado y filtra solo aquellos que coincidan con los valores del enum `RoleName`.
 * - **¿Cómo interactúa con el sistema en general?**: Usada internamente en `toUser`.
 * - **¿Cuál es su importancia?**: Previene que valores arbitrarios o corruptos de la base de datos rompan el tipado del dominio.
 */
```

## `src/features/users/presentation/components/user-role-editor.tsx`
Estaba encima de: `const sameRoles = (a: readonly RoleName[], b: readonly RoleName[]) =>`

```ts
/** Comprueba si dos listas de roles contienen exactamente los mismos elementos. */
```

## `src/features/venue/presentation/actions/venue-form-state.ts`
Estaba encima de: `error?: string;`

```ts
  /** Mensaje de error global no asociado a un campo específico. */
```

## `src/features/venue/presentation/actions/venue-form-state.ts`
Estaba encima de: `export const emptyVenueFormValues: VenueFormValues = { name: "", address: "", description: "", zoneId: "" };`

```ts
/**
 * Valores iniciales vacíos para el formulario de alta de un lugar.
 */
```

## `src/proxy.ts`
Estaba encima de: `const PUBLIC_ROUTES = ["/login", "/register", "/ui"];`

```ts
/**
 * Rutas públicas (PUBLIC_ROUTES): Rutas accesibles sin contar con una sesión activa.
 *
 * - **¿Qué hace?**: Enumera los paths del frontend donde un visitante no autenticado puede entrar libremente (`/login`, `/register`, `/ui`).
 *   La ruta raíz `"/"` requiere autenticación; de lo contrario, redirige al login.
 * - **¿Cómo interactúa con el sistema en general?**: Es consultada por la función `proxy` en cada petición entrante.
 * - **¿Cuál es su importancia?**: Define la lista blanca de acceso público para evitar que usuarios no autenticados naveguen en áreas privadas.
 */
```

## `src/shared/presentation/components/index.ts`
Estaba encima de: `export { Button, ButtonLink, buttonClasses, type ButtonVariant, type ButtonSize } from "./button";`

```ts
/**
 * Barril de exportación (Barrel File) de Componentes Compartidos de Presentación
 *
 * - **¿Qué hace?**: Reexporta de forma centralizada todos los componentes base del sistema de diseño de CityPulse:
 *   botones, controles de formulario, insignias, tarjetas, contenedores, indicadores de carga y estados de ruta.
 * - **¿Cómo interactúa con el sistema en general?**: Permite importar cualquier componente base desde un único módulo
 *   (ej. `import { Button, Card, TextField } from "@/shared/presentation/components"`), evitando rutas de importación relativas largas.
 * - **¿Cuál es su importancia?**: Simplifica las importaciones en toda la aplicación, desacopla la ubicación física interna
 *   de los componentes individuales y ofrece una API pública limpia para el sistema de diseño.
 */
```
