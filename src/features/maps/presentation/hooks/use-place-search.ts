"use client";

import { useState, useTransition } from "react";
import type { Place } from "../../domain/entities/place";
import { searchPlacesAction } from "../actions/maps.actions";

/**
 * Hook fachada para la búsqueda de lugares mediante Google Maps / Places API.
 *
 * - **¿Qué hace?**: Administra el texto de búsqueda (`query`), la lista de resultados coincidentes (`places`),
 *   el mensaje de error y el estado de transición asíncrona (`pending`), encapsulando la invocación a `searchPlacesAction`.
 * - **¿Cómo interactúa con el sistema en general?**: Consumido por el componente cliente `PlaceSearch` dentro de los formularios
 *   de lugares (`VenueForm`) para autocompletar coordenadas geográficas.
 * - **¿Cuál es su importancia?**: Separa el estado y las transiciones asíncronas de la capa de renderizado (Separation of Concerns),
 *   ofreciendo una interfaz limpia a los componentes de presentación.
 */
export function usePlaceSearch() {
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<Place[] | null>(null);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  /**
   * Dispara la búsqueda asíncrona dentro de una transición no bloqueante de React.
   *
   * - **¿Qué hace?**: Envuelve la llamada a `searchPlacesAction(query)` en `startTransition`, actualizando los resultados o errores.
   * - **¿Cómo interactúa con el sistema en general?**: Invoca la Server Action de Google Places sin congelar el hilo principal de la interfaz.
   * - **¿Cuál es su importancia?**: Mantiene la interfaz de usuario responsiva durante la geocodificación de red.
   */
  function search() {
    startTransition(async () => {
      const result = await searchPlacesAction(query);
      setPlaces(result.places);
      setError(result.error);
    });
  }

  /**
   * Limpia los resultados de búsqueda tras elegir un lugar.
   *
   * - **¿Qué hace?**: Restablece los resultados `places` a `null` y el texto `query` a una cadena vacía.
   * - **¿Cómo interactúa con el sistema en general?**: Ejecutada al seleccionar un punto en el desplegable de opciones.
   * - **¿Cuál es su importancia?**: Oculta el menú desplegable y evita búsquedas repetidas innecesarias.
   */
  function reset() {
    setPlaces(null);
    setQuery("");
  }

  return { query, setQuery, places, error, pending, search, reset };
}
