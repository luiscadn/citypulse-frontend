import Form from "next/form";
import { Button, Card, CardBody, CardHeader, TextField } from "@/shared/presentation/components";
import { FriendSearchResults } from "./friend-search-results";

/**
 * Componente Server Component FriendSearch: Buscador de personas por nombre o username.
 *
 * - **¿Qué hace?**: Extrae el término de búsqueda `q` desde `searchParams` y renderiza un formulario de búsqueda
 *   con el nuevo componente `<Form>` de Next.js (que realiza navegación cliente a `/friends?q=...` sin recarga de página).
 *   Si hay un término de búsqueda activo, renderiza el componente `FriendSearchResults`.
 * - **¿Cómo interactúa con el sistema en general?**: Se ubica en `src/app/(app)/friends/page.tsx` dentro de `<Suspense>`.
 * - **¿Cuál es su importancia?**: Ofrece una búsqueda sincronizada con la URL ("URL-driven state"), lo que permite
 *   compartir enlaces de búsqueda, usar el botón de retroceso del navegador y persistir el estado de búsqueda de forma natural.
 */
export async function FriendSearch({ searchParams }: { searchParams: PageProps<"/friends">["searchParams"] }) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.trim() : "";

  return (
    <Card>
      <CardHeader title="Buscar personas" description="Encuentra a alguien por su usuario o su nombre." />
      <CardBody className="flex flex-col gap-4">
        <Form action="/friends" className="flex items-end gap-3">
          {/* key: al navegar a otra búsqueda el campo debe mostrar el texto de la URL */}
          <TextField
            key={query}
            label="Usuario o nombre"
            name="q"
            type="search"
            defaultValue={query}
            maxLength={60}
            className="flex-1"
          />
          <Button type="submit" variant="secondary">
            Buscar
          </Button>
        </Form>
        {query && <FriendSearchResults query={query} />}
      </CardBody>
    </Card>
  );
}
