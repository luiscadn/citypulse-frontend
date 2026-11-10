import { Alert, Badge } from "@/shared/presentation/components";
import { DomainError } from "@/shared/domain/errors/domain-error";
import { friendshipContainer } from "../../di/friendship.container";
import type {
  FriendCandidateSearch,
  FriendRelation,
  FriendshipOverview,
} from "../../domain/entities/friendship";
import { friendRelation } from "../../domain/rules/friend-relation";
import { FriendUserRow } from "./friend-user-row";
import { SendFriendRequestButton } from "./send-friend-request-button";

function RelationBadge({ relation }: { relation: Exclude<FriendRelation, "none"> }) {
  if (relation === "friend") return <Badge tone="success">Ya son amigos</Badge>;
  if (relation === "request-sent") return <Badge tone="warning" dot>Solicitud enviada</Badge>;
  return <Badge tone="info">Te envió una solicitud</Badge>;
}

/** Personas que coinciden con la búsqueda y qué relación tengo con cada una. */
export async function FriendSearchResults({ query }: { query: string }) {
  let search: FriendCandidateSearch;
  let overview: FriendshipOverview;
  try {
    [search, overview] = await Promise.all([
      friendshipContainer.searchFriendCandidatesUseCase.execute(query),
      friendshipContainer.getFriendshipOverviewUseCase.execute(),
    ]);
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
        {search.candidates.map((candidate) => {
          const relation = friendRelation(candidate.id, overview);
          return (
            <FriendUserRow key={candidate.id} user={candidate}>
              {relation === "none" ? (
                <SendFriendRequestButton targetUserId={candidate.id} />
              ) : (
                <RelationBadge relation={relation} />
              )}
            </FriendUserRow>
          );
        })}
      </ul>
    </div>
  );
}
