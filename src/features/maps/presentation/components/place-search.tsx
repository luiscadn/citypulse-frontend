"use client";

import { useState, useTransition, type KeyboardEvent } from "react";
import { Alert, Button, Input } from "@/shared/presentation/components";
import { MapPinIcon } from "@/shared/presentation/components/icons";
import type { Place } from "../../domain/entities/place";
import { searchPlacesAction } from "../actions/maps.actions";

/**
 * Componente PlaceSearch: Buscador interactivo de lugares conectado a Google Maps.
 *
 * - **¿Qué hace?**: Permite escribir un texto de búsqueda para localizar un lugar real en Cali.
 *   Al presionar Enter o hacer clic en "Buscar", ejecuta la Server Action `searchPlacesAction` dentro de `startTransition`.
 *   Muestra las opciones coincidentes con su dirección y, al hacer clic sobre una, invoca el callback `onPick(place)`,
 *   limpiando la lista y el texto de búsqueda.
 * - **¿Cómo interactúa con el sistema en general?**: Se integra dentro de `VenueForm` para autocompletar nombre y dirección
 *   oficiales de establecimientos. No utiliza un elemento `<form>` propio para evitar el error de validación HTML por anidamiento de formularios.
 * - **¿Cuál es su importancia?**: Mejora enormemente la precisión de las direcciones y ubicaciones de los lugares registrados,
 *   evitando errores tipográficos manuales y asegurando que las coordenadas correspondan a ubicaciones reales en Google Maps.
 */
export function PlaceSearch({ onPick }: { onPick: (place: Place) => void }) {
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<Place[] | null>(null);
  const [error, setError] = useState<string>();
  const [pending, startTransition] = useTransition();

  /** Dispara la búsqueda asíncrona dentro de una transición de React */
  function search() {
    startTransition(async () => {
      const result = await searchPlacesAction(query);
      setPlaces(result.places);
      setError(result.error);
    });
  }

  /** Captura la tecla Enter para ejecutar la búsqueda sin enviar el formulario contenedor */
  function searchOnEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      search();
    }
  }

  /** Selecciona el lugar y notifica al componente padre */
  function pick(place: Place) {
    onPick(place);
    setPlaces(null);
    setQuery("");
  }

  return (
    <div className="flex flex-col gap-3 rounded-md border border-dashed border-line-strong p-4">
      <div>
        <p className="text-sm font-semibold text-ink">Buscar en Google Maps</p>
        <p className="text-sm text-ink-muted">Elige el lugar y se llenan el nombre y la dirección.</p>
      </div>
      <div className="flex gap-2">
        {/* Sin name: no viaja con el formulario del lugar */}
        <Input
          type="search"
          aria-label="Buscar el lugar en Google Maps"
          placeholder="Ej.: Teatro Municipal Cali…"
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={searchOnEnter}
          maxLength={100}
          className="flex-1"
        />
        <Button type="button" variant="secondary" loading={pending} onClick={search}>
          Buscar
        </Button>
      </div>

      {/* aria-live: un lector de pantalla anuncia los resultados al llegar */}
      <div aria-live="polite" className="flex flex-col gap-3 empty:hidden">
        {error && <Alert tone="warning">{error}</Alert>}
        {places && !error && places.length === 0 && (
          <p className="text-sm text-ink-muted">No encontramos lugares con ese nombre. Prueba con otro.</p>
        )}
        {places && places.length > 0 && (
          <ul className="flex flex-col divide-y divide-line rounded-md border border-line">
            {places.map((place) => (
              <li key={place.placeId}>
                <button
                  type="button"
                  onClick={() => pick(place)}
                  className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left transition-colors hover:bg-neutral-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-ring"
                >
                  <span className="text-sm font-semibold text-ink">{place.name}</span>
                  <span className="flex items-start gap-1 text-xs text-ink-muted">
                    <MapPinIcon className="mt-px size-3" />
                    {place.address}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
