"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { actionErrorMessage } from "@/shared/presentation/action-error";
import { mapsContainer } from "../../di/maps.container";
import type { PlaceSearchResult } from "./place-search-result";

/**
 * Busca lugares en Google Maps. La llama el formulario de lugar directamente (no con un <form>,
 * porque iría anidado dentro del formulario del lugar).
 */
export async function searchPlacesAction(query: string): Promise<PlaceSearchResult> {
  // GET /maps/search exige token: sin sesión no tiene sentido llamar al backend
  if (!(await getCurrentUser())) redirect("/login");

  try {
    return { places: await mapsContainer.searchPlacesUseCase.execute(query) };
  } catch (error) {
    return { places: [], error: actionErrorMessage(error) };
  }
}
