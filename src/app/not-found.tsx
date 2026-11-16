import { NotFoundState } from "@/shared/presentation/components";

/** 404 de toda la app: URL que no existe, o notFound() en una ruta sin su propio not-found. */
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-1 flex-col">
      <NotFoundState />
    </main>
  );
}