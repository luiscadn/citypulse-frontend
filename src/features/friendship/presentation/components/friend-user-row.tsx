import type { ReactNode } from "react";
import type { FriendUser } from "../../domain/entities/friendship";

/** Fila de un listado de personas: inicial, nombre, usuario y acciones a la derecha. */
export function FriendUserRow({ user, children }: { user: FriendUser; children?: ReactNode }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span
          aria-hidden
          className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary-strong uppercase"
        >
          {user.fullName.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{user.fullName}</p>
          <p className="truncate text-sm text-ink-muted">@{user.username}</p>
        </div>
      </div>
      {children}
    </li>
  );
}
