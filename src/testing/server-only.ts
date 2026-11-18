/**
 * Mock de 'server-only' para Vitest
 *
 * - **¿Qué hace?**: Provee una exportación vacía para interceptar y anular la importación del paquete `server-only`
 *   durante la ejecución de pruebas unitarias con Vitest (configurado en `vitest.config.mts`).
 * - **¿Cómo interactúa con el sistema en general?**: El paquete oficial `server-only` de Next.js está diseñado para
 *   lanzar un error si un archivo que lo importa es incluido en un paquete cliente durante el build de Next.js.
 *   Sin este mock en Vitest, los tests unitarios que importan módulos con `server-only` fallarían artificialmente.
 * - **¿Cuál es su importancia?**: Permite testear lógica del servidor (repositorios, Server Actions, utilidades de sesión)
 *   en un entorno de testing aislado (Vitest/Node.js) sin que `server-only` interrumpa la ejecución de las pruebas.
 */
export {};
