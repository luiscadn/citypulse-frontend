/**
 * Función makeJwt: Generador de JWT para suites de pruebas automatizadas.
 *
 * - **¿Qué hace?**: Construye una cadena JWT sintética válida en estructura (`header.payload.signature`) codificada
 *   en Base64URL, utilizando una firma simulada (`.firma`), ya que el frontend realiza comprobaciones optimistas sin validar la firma criptográfica.
 * - **¿Cómo interactúa con el sistema en general?**: Se utiliza en pruebas unitarias y de integración (`jwt.test.ts`, `use-session.test.tsx`,
 *   pruebas de repositorios y Server Actions) para simular tokens emitidos por el backend con diferentes roles, IDs o fechas de caducidad.
 * - **¿Cuál es su importancia?**: Permite escribir pruebas deterministas para verificar expiraciones, permisos y control de acceso
 *   sin depender de una instancia real del backend ni de claves secretas compartidas.
 */
export function makeJwt(payload: Record<string, unknown>): string {
  const encode = (value: unknown) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ alg: "HS256", typ: "JWT" })}.${encode(payload)}.firma`;
}

/**
 * Función nowInSeconds
 *
 * - **¿Qué hace?**: Retorna la marca de tiempo actual (`Date.now()`) convertida a segundos (formato Unix Epoch).
 * - **¿Cómo interactúa con el sistema en general?**: Usada en pruebas unitarias para calcular claims `exp` e `iat` en tokens sintéticos.
 * - **¿Cuál es su importancia?**: Proporciona el formato de tiempo exacto que utilizan los estándares JWT para cálculos de expiración.
 */
export const nowInSeconds = () => Math.floor(Date.now() / 1000);
