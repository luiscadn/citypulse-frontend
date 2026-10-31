/** Arma un JWT de prueba (firma falsa): el frontend nunca verifica firmas. */
export function makeJwt(payload: Record<string, unknown>): string {
  const encode = (value: unknown) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ alg: "HS256", typ: "JWT" })}.${encode(payload)}.firma`;
}

export const nowInSeconds = () => Math.floor(Date.now() / 1000);
