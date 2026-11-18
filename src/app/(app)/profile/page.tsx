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

/** Metadata para la vista del perfil */
export const metadata: Metadata = { title: "Mi perfil" };

/**
 * Componente Server Component ProfilePage: Vista de gestión de perfil y seguridad.
 *
 * - **¿Qué hace?**: Obtiene la sesión activa con `getCurrentUser()`, consulta los datos completos del usuario
 *   mediante `usersContainer.getUser(session.id)`, y renderiza dos paneles interactivos:
 *   1. Datos personales (`ProfileForm`) para actualizar nombre y ver nombre de usuario y correo.
 *   2. Seguridad (`TwoFactorPanel`) para activar o desactivar la autenticación en dos pasos (2FA con TOTP y QR).
 * - **¿Cómo interactúa con el sistema en general?**: Orquesta los bounded contexts de Users y Auth.
 *   Si el usuario no está logueado redirige a `/login?from=/profile`; si el usuario fue eliminado del backend,
 *   captura `UserNotFoundError` y dispara `notFound()`.
 * - **¿Cuál es su importancia?**: Centraliza la auto-administración de la cuenta del usuario, garantizando que
 *   la información se valide y actualice en el servidor con persistencia inmediata y soporte para doble factor de autenticación.
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
