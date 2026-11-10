import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { TwoFactorPanel } from "@/features/auth/presentation/components/two-factor-panel";
import { getCurrentUser } from "@/features/auth/infrastructure/session/get-current-user";
import { usersContainer } from "@/features/users/di/users.container";
import { ProfileForm } from "@/features/users/presentation/components/profile-form";
import { RoleBadges } from "@/features/users/presentation/components/role-badges";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  PageHeader,
  Spinner,
} from "@/shared/presentation/components";

export const metadata: Metadata = { title: "Mi perfil" };

export default function ProfilePage() {
  return (
    <Container className="pb-12">
      {/* Lee la cookie de sesión y llama al backend: dato de la petición → Suspense */}
      <Suspense
        fallback={
          <div className="grid h-64 place-items-center text-primary">
            <Spinner />
          </div>
        }
      >
        <ProfileContent />
      </Suspense>
    </Container>
  );
}

async function ProfileContent() {
  const session = await getCurrentUser();
  if (!session) redirect("/login?from=/profile");

  const user = await usersContainer.getUser(session.id);
  const memberSince = user.createdAt.toLocaleDateString("es-CO", { dateStyle: "long" });

  return (
    <>
      <PageHeader
        eyebrow="Mi cuenta"
        title={user.fullName}
        description={`@${user.username} · Miembro desde ${memberSince}`}
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
    </>
  );
}