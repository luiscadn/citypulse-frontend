import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { TwoFactorPanel } from "@/features/auth/presentation/components/two-factor-panel";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { usersContainer } from "@/features/users/di/users.container";
import { UserNotFoundError } from "@/features/users/domain/errors/user-errors";
import { ProfileForm } from "@/features/users/presentation/components/profile-form";
import { RoleBadges } from "@/features/users/presentation/components/role-badges";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  PageHeader,
} from "@/shared/presentation/components";
import { formatDate } from "@/shared/presentation/formatters/date";

export const metadata: Metadata = { title: "Mi perfil" };

/**
 * Lee la cookie de sesión y llama al backend: mientras carga se muestra loading.tsx,
 * si el backend falla, error.tsx, y si la cuenta ya no existe, not-found.
 */
export default async function ProfilePage() {
  const session = await getCurrentUser();
  if (!session) redirect("/login?from=/profile");

  const user = await usersContainer.getUser(session.id).catch((error: unknown) => {
    if (error instanceof UserNotFoundError) notFound();
    throw error;
  });

  return (
    <Container className="pb-12">
      <PageHeader
        eyebrow="Mi cuenta"
        title={user.fullName}
        description={`@${user.username} · Miembro desde ${formatDate(user.createdAt)}`}
        actions={<RoleBadges roles={user.roles} />}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Datos personales" description="Así te ven los demás en CityPulse." />
          <CardBody>
            <ProfileForm
              initial={{ fullName: user.fullName, username: user.username }}
              email={user.email}
            />
          </CardBody>
        </Card>

        <Card className="self-start">
          <CardHeader title="Seguridad" description="Verificación en dos pasos (2FA)." />
          <CardBody>
            <TwoFactorPanel enabled={user.twoFactorEnabled} />
          </CardBody>
        </Card>
      </div>
    </Container>
  );
}