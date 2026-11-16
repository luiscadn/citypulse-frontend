import { Container, RouteLoading } from "@/shared/presentation/components";

export default function ProfileLoading() {
  return (
    <Container className="flex flex-1 flex-col">
      <RouteLoading label="Cargando tu perfil" />
    </Container>
  );
}