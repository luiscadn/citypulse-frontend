// src/shared/domain/errors/domain-error.ts

/**
 * Clase base abstracta DomainError para todos los errores de dominio de la aplicación.
 *
 * - **¿Qué hace?**: Extiende la clase nativa `Error` de JavaScript/TypeScript, asignando automáticamente
 *   como nombre (`this.name`) el nombre concreto de la subclase instanciada (`new.target.name`).
 * - **¿Cómo interactúa con el sistema en general?**: Funciona como la raíz de la jerarquía de errores
 *   en la capa de Dominio (Domain Layer). Cada módulo o bounded context (Auth, Events, Venue, Zone, Friendship, etc.)
 *   extiende esta clase para definir sus errores de negocio específicos (ej. `InvalidCredentialsError`, `VenueNotFoundError`).
 *   En la capa de presentación, las Server Actions y los mappers de errores (`action-error.ts`) comprueban
 *   si un error es instancia de `DomainError` para diferenciar un fallo de regla de negocio (mostrable al usuario)
 *   de una excepción inesperada del sistema o de infraestructura (HTTP 500, caída de red, etc.).
 * - **¿Cuál es su importancia?**: Permite aplicar el principio de tipado fuerte en el manejo de excepciones de negocio.
 *   Evita capturar errores genéricos sin discriminar su origen, previene fugas de información interna hacia la UI
 *   y asegura que los mensajes dirigidos al usuario final correspondan exclusivamente a violaciones de invariantes de dominio.
 */
export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}
