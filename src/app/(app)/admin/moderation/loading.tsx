import { Container, PageSkeleton } from "@/shared/presentation/components";

/** La página lee la sesión antes de pintar: mientras tanto, esqueleto. */
export default function Loading() {
  return (
    <Container>
      <PageSkeleton cards={3} />
    </Container>
  );
}
