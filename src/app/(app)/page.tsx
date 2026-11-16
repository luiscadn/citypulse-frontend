import { redirect } from "next/navigation";

/** La portada de la app es el listado de eventos. */
export default function Home() {
  redirect("/events");
}
