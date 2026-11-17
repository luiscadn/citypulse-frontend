import { Container, RouteLoading } from "@/shared/presentation/components";

export default function AdminUsersLoading() {
  return (
    <Container className="flex flex-1 flex-col">
      <RouteLoading label="Cargando usuarios" />
    </Container>
  );
}