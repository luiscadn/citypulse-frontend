import { Alert } from "@/shared/presentation/components";
import { DomainError } from "@/shared/domain/errors/domain-error";
import { friendshipContainer } from "../../di/friendship.container";
import type { FriendCandidateSearch } from "../../domain/entities/friendship";
import { CandidateAction } from "./candidate-action";
import { FriendUserRow } from "./friend-user-row";

/**
 * Componente Server Component FriendSearchResults: Resultados de búsqueda de candidatos a amigos.
 *
 * - **¿Qué hace?**: Ejecuta el caso de uso `searchFriendCandidatesUseCase` con el texto de búsqueda `query`.
 *   - Si falla por validación de dominio (ej. menos de 2 letras), muestra un `Alert` de advertencia.
 *   - Si no hay coincidencias, muestra un mensaje descriptivo.
 *   - Si hay resultados, renderiza la lista de usuarios con `FriendUserRow` y adjunta `CandidateAction`
 *     en cada fila para evaluar la relación social existente.
 *   - Si hay más resultados que el límite (`hidden > 0`), sugiere refinar la búsqueda.
 * - **¿Cómo interactúa con el sistema en general?**: Se renderiza en `FriendSearch` cuando hay un parámetro `query` presente.
 * - **¿Cuál es su importancia?**: Centraliza la visualización de resultados de búsqueda de usuarios con feedback inmediato y claro.
 */
export async function FriendSearchResults({ query }: { query: string }) {
  let search: FriendCandidateSearch;
  try {
    search = await friendshipContainer.searchFriendCandidatesUseCase.execute(query);
  } catch (error) {
    if (error instanceof DomainError) {
      return <Alert tone="warning">{error.message}</Alert>;
    }
    return <Alert tone="danger">No pudimos hacer la búsqueda. Intenta de nuevo más tarde.</Alert>;
  }

  if (search.candidates.length === 0) {
    return <p className="text-sm text-ink-muted">No encontramos a nadie con «{query}».</p>;
  }

  const hidden = search.total - search.candidates.length;

  return (
    <div className="flex flex-col gap-3">
      {hidden > 0 && (
        <p className="text-sm text-ink-muted">
          Hay {hidden} {hidden === 1 ? "resultado más" : "resultados más"}. Escribe algo más específico.
        </p>
      )}
      {/* Márgenes negativos: la lista llega hasta los bordes de la tarjeta, como las demás */}
      <ul className="-mx-5 -mb-4 divide-y divide-line border-t border-line">
        {search.candidates.map((candidate) => (
          <FriendUserRow key={candidate.id} user={candidate}>
            <CandidateAction userId={candidate.id} />
          </FriendUserRow>
        ))}
      </ul>
    </div>
  );
}
