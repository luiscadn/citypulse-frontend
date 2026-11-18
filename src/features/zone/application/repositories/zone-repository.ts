import type { Zone, ZoneInput } from "../../domain/entities/zone";

/**
 * Puerto ZoneRepository (Arquitectura Hexagonal / Limpia)
 *
 * - **¿Qué hace?**: Declara los contratos de persistencia y consulta para las zonas urbanas:
 *   listar todas las zonas (`list`), buscar por ID (`findById`), crear nueva zona (`create`),
 *   actualizar una existente (`update`) y eliminar (`remove`).
 * - **¿Cómo interactúa con el sistema en general?**: Pertenece a la capa de Aplicación. Los casos de uso dependen exclusivamente
 *   de esta abstracción. Su implementación concreta para comunicación con el backend es `HttpZoneRepository` en la capa de Infraestructura.
 * - **¿Cuál es su importancia?**: Cumple con el Principio de Inversión de Dependencias (DIP). Permite aislar la lógica de aplicación
 *   de los detalles de red y transporte HTTP, facilitando la creación de mocks para pruebas automatizadas (`zone.use-cases.test.ts`).
 */
export interface ZoneRepository {
  list(): Promise<Zone[]>;
  findById(id: number): Promise<Zone>;
  create(input: ZoneInput): Promise<Zone>;
  update(id: number, input: ZoneInput): Promise<Zone>;
  remove(id: number): Promise<void>;
}
