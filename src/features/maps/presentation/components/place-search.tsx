"use client";

import { useState, useTransition, type KeyboardEvent } from "react";
import { Alert, Button, Input } from "@/shared/presentation/components";
import type { Place } from "../../domain/entities/place";
import { searchPlacesAction } from "../actions/maps.actions";

/**
 * Busca el lugar en Google Maps para llenar el formulario con su nombre y dirección reales.
 * Va dentro de otro <form> (el del lugar): por eso no es un form, y Enter busca en vez de enviar.
 */
export function PlaceSearch({ onPick }: { onPick: (place: Place) => void }) {
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

  function searchOnEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      search();
    }
  }

  function pick(place: Place) {
    onPick(place);
    setPlaces(null);
    setQuery("");
  }

  return (
    <div className="flex flex-col gap-3 rounded-md border border-dashed border-line-strong p-4">
      <p className="text-sm font-semibold text-ink">Buscar en Google Maps</p>
      <div className="flex gap-2">
        {/* Sin name: no viaja con el formulario del lugar */}
        <Input
          type="search"
          aria-label="Buscar el lugar en Google Maps"
          placeholder="Teatro Municipal Cali"
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

      {error && <Alert tone="warning">{error}</Alert>}
      {places && !error && places.length === 0 && (
        <p className="text-sm text-ink-muted">No encontramos lugares con ese nombre.</p>
      )}
      {places && places.length > 0 && (
        <ul className="flex flex-col divide-y divide-line rounded-md border border-line">
          {places.map((place) => (
            <li key={place.placeId}>
              <button
                type="button"
                onClick={() => pick(place)}
                className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left hover:bg-primary-soft/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-ring"
              >
                <span className="text-sm font-semibold text-ink">{place.name}</span>
                <span className="text-xs text-ink-muted">{place.address}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
