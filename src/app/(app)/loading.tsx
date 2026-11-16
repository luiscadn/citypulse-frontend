import { Container, Spinner } from "@/shared/presentation/components";

/** Mientras carga una sección de la app: Next envuelve la página en <Suspense> con esto. */
export default function Loading() {
  return (
    <Container className="grid h-48 place-items-center text-primary">
      <Spinner size="lg" />
    </Container>
  );
}
