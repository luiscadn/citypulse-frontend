/**
 * Función utilitaria cn (Class Names)
 *
 * - **¿Qué hace?**: Concatena múltiples clases de Tailwind CSS en una sola cadena, filtrando automáticamente
 *   valores falsy (`false`, `null`, `undefined`, `""`).
 * - **¿Cómo interactúa con el sistema en general?**: Se utiliza en prácticamente todos los componentes de presentación
 *   del sistema (`Button`, `Card`, `Input`, `Badge`, `AppNav`, etc.) para componer estilos base con clases condicionales
 *   y permitir sobreescritura mediante la propiedad `className`.
 * - **¿Cuál es su importancia?**: Proporciona una forma limpia, sin dependencias externas pesadas, de alternar estilos dinámicos
 *   en componentes React basados en estados de carga, errores, variantes visuales o propiedades recibidas.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
