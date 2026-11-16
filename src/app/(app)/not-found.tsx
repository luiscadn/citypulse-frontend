import { ButtonLink, Container, EmptyState } from "@/shared/presentation/components";

/** Se muestra cuando una página llama a notFound() (por ejemplo, /zones/999). */
export default function NotFound() {
  return (
    <Container className="py-12">
      <EmptyState
        title="No encontramos lo que buscas"
        description="Puede que se haya eliminado o que el enlace esté mal escrito."
        action={<ButtonLink href="/">Ir al inicio</ButtonLink>}
      />
    </Container>
  );
}
