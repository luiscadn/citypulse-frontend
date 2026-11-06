import Form from "next/form";
import { Button, Card, CardBody, CardHeader, TextField } from "@/shared/presentation/components";
import { FriendSearchResults } from "./friend-search-results";

/**
 * Buscador de personas. El texto vive en la URL (/friends?q=ana).
 * searchParams es un dato de la petición: con Cache Components debe ir dentro de <Suspense>.
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
