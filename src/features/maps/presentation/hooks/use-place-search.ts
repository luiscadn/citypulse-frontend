"use client";

import { useState, useTransition } from "react";
import type { Place } from "../../domain/entities/place";
import { searchPlacesAction } from "../actions/maps.actions";

/**
 * Hook fachada de la búsqueda en Google Maps: guarda el texto, los resultados
 * y el error, y llama a la acción del servidor.
 */
export function usePlaceSearch() {
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<Place[] | null>(null);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  function search() {
    startTransition(async () => {
      const result = await searchPlacesAction(query);
      setPlaces(result.places);
      setError(result.error);
    });
  }

  /** Limpia la búsqueda tras elegir un resultado. */
  function reset() {
    setPlaces(null);
    setQuery("");
  }

  return { query, setQuery, places, error, pending, search, reset };
}
