// src/features/users/presentation/hooks/use-users.ts
'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { DomainError } from '@/shared/domain/errors/domain-error';
import type { User } from '../../domain/entities/user';
import type { UserRepository } from '../../application/repositories/user-repository';
import { makeListUsers } from '../../application/use-cases/list-users';
import { makeCreateUser } from '../../application/use-cases/create-user';
import { makeUpdateUser } from '../../application/use-cases/update-user';
import { makeDeleteUser } from '../../application/use-cases/delete-user';
import { makeAssignRoles } from '../../application/use-cases/assign-roles';
import type { AuthUser } from '@/shared/domain/auth-user';

export function useUsers(users: UserRepository, requester: AuthUser) {
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useMemo: sin esto los casos de uso se recrean en cada render,
  // `reload` cambia y el useEffect entra en un bucle infinito.
  const { list, create, update, remove, assign } = useMemo(() => ({
    list: makeListUsers({ users }),
    create: makeCreateUser({ users }),
    update: makeUpdateUser({ users }),
    remove: makeDeleteUser({ users }),
    assign: makeAssignRoles({ users }),
  }), [users]);

  const reload = useCallback(async () => {
    try {
      setLoading(true);
      setItems(await list());
      setError(null);
    } catch (e) {
      setError(toMessage(e));
    } finally {
      setLoading(false);
    }
  }, [list]);

  // Carga inicial: `loading` ya arranca en true, así que no hay setState síncrono
  // en el efecto; solo se actualiza el estado cuando la promesa resuelve.
  useEffect(() => {
    let cancelled = false;
    list()
      .then((data) => { if (!cancelled) { setItems(data); setError(null); } })
      .catch((e) => { if (!cancelled) setError(toMessage(e)); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [list]);

  return {
    items, loading, error,
    reload,
    createUser: async (params: Parameters<typeof create>[0]) => {
      const user = await create(params);
      await reload();
      return user;
    },
    updateUser: async (id: number, params: Parameters<typeof update>[1]) => {
      const user = await update(id, params, requester);
      await reload();
      return user;
    },
    deleteUser: async (id: number) => {
      await remove(id, requester);
      await reload();
    },
    assignRoles: async (id: number, roles: Parameters<typeof assign>[1]) => {
      const user = await assign(id, roles, requester);
      await reload();
      return user;
    },
  };
}

function toMessage(e: unknown): string {
  return e instanceof DomainError ? e.message : 'No pudimos conectar con el servidor.';
}