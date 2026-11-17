"use client";

import type { FriendUser } from "@/features/friendship/domain/entities/friendship";
import { Alert, Button, SelectField, TextField } from "@/shared/presentation/components";
import { INVITATION_MESSAGE_MAX_LENGTH } from "../../domain/rules/new-invitation";
import { useSendInvitation } from "../hooks/use-send-invitation";

/** Elige a un amigo y envíale una invitación al evento. */
export function InviteFriendForm({ eventId, friends }: { eventId: string; friends: readonly FriendUser[] }) {
  const { error, success, send, pending } = useSendInvitation();

  return (
    <form action={send} className="flex flex-col gap-4" noValidate>
      <input type="hidden" name="eventId" value={eventId} />
      {error && <Alert tone="danger">{error}</Alert>}
      {success && <Alert tone="success">{success}</Alert>}
      <SelectField label="Amigo" name="toUserId" required defaultValue="">
        <option value="" disabled>
          Elige a quién invitar
        </option>
        {friends.map((friend) => (
          <option key={friend.id} value={friend.id}>
            {friend.fullName} (@{friend.username})
          </option>
        ))}
      </SelectField>
      <TextField
        label="Mensaje"
        name="message"
        maxLength={INVITATION_MESSAGE_MAX_LENGTH}
        placeholder="¿Vamos juntos?"
        hint="Opcional."
        autoComplete="off"
      />
      <div className="flex justify-end">
        <Button type="submit" loading={pending}>
          {pending ? "Enviando…" : "Enviar invitación"}
        </Button>
      </div>
    </form>
  );
}
