import { Container, PageSkeleton } from "@/shared/presentation/components";

/** Mientras carga una sección de la app: Next envuelve la página en <Suspense> con esto. */
export default function Loading() {
  return (
    <Container>
      <PageSkeleton />
    </Container>
  );
}
