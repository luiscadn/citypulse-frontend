"use server";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { actionErrorMessage } from "@/shared/presentation/action-error";
import { mapsContainer } from "../../di/maps.container";
import type { PlaceSearchResult } from "./place-search-result";

/**
 * Server Action: searchPlacesAction
 *
 * - **¿Qué hace?**: Busca lugares en Google Maps mediante texto libre. Verifica que el usuario cuente con sesión
 *   activa (de lo contrario redirige a `/login`), ejecuta `searchPlacesUseCase` y captura posibles errores
 *   degradando la respuesta con un mensaje explicativo sin lanzar excepciones hacia el cliente.
 * - **¿Cómo interactúa con el sistema en general?**: Es llamada directamente dentro de un `startTransition`
 *   en el componente cliente `PlaceSearch` cuando el usuario hace clic en "Buscar" o presiona Enter.
 * - **¿Cuál es su importancia?**: Permite invocar el buscador de lugares de forma interactiva e independiente
 *   de cualquier formulario padre, evitando anidamientos inválidos de `<form>` en HTML y protegiendo la sesión del usuario.
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
