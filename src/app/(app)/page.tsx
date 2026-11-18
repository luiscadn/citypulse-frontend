import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/shared/presentation/components";
import { AdminSectionCard } from "./_components/admin-section-card";
import { SectionCard } from "./_components/section-card";

/** Metadata para la pantalla de inicio del dashboard */
export const metadata: Metadata = { title: "Inicio" };

/**
 * Arreglo inmutable SECTIONS
 *
 * - **¿Qué hace?**: Define las secciones públicas/estándar de la aplicación con su ruta de navegación (`href`),
 *   título (`title`) y descripción sintética (`description`).
 * - **¿Cómo interactúa con el sistema en general?**: Es iterado en `HomePage` para generar las tarjetas de acceso rápido.
 * - **¿Cuál es su importancia?**: Centraliza la configuración de módulos principales, facilitando la adición o edición de secciones desde un único punto.
 */
const SECTIONS = [
  { href: "/events", title: "Eventos", description: "Mira lo que pasa en Cali, reporta un evento o publica el tuyo." },
  { href: "/zones", title: "Zonas", description: "Barrios y sectores de la ciudad donde ocurren los eventos." },
  { href: "/venues", title: "Lugares", description: "Explora lugares verificados y ubícalos en el mapa." },
  { href: "/friends", title: "Amigos", description: "Busca personas, responde solicitudes y mira a tus amigos." },
  { href: "/invitations", title: "Invitaciones", description: "Revisa las invitaciones que recibiste a eventos." },
  { href: "/profile", title: "Mi perfil", description: "Edita tus datos y activa la verificación en dos pasos." },
] as const;

/**
 * Componente HomePage: Página de inicio del panel de CityPulse.
 *
 * - **¿Qué hace?**: Renderiza el banner hero de bienvenida a la plataforma ("El pulso de tu ciudad, verificado por su gente"),
 *   la cuadrícula de tarjetas de navegación por sección (`SectionCard`), y la tarjeta condicional de administración (`AdminSectionCard`)
 *   aislada en un límite de `<Suspense>`.
 * - **¿Cómo interactúa con el sistema en general?**: Es el punto de llegada tras autenticarse con éxito.
 *   Utiliza streaming para que las secciones generales se muestren instantáneamente mientras que la tarjeta de administración
 *   determina si se muestra o se oculta consultando de forma asíncrona la sesión del usuario.
 * - **¿Cuál es su importancia?**: Proporciona el centro de mandos (dashboard) de la experiencia de usuario.
 *   Aplica el principio de autorización basada en roles (RBAC) en la presentación mediante Server Components sin comprometer el tiempo de carga general.
 */
export default function HomePage() {
  return (
    <Container className="flex flex-col gap-10 pb-12">
      <section className="flex flex-col gap-3 py-10 sm:py-14">
        <p className="text-xs font-semibold tracking-wider text-primary-strong uppercase">CityPulse</p>
        <h1 className="max-w-2xl text-3xl leading-tight font-bold tracking-tight text-balance text-ink sm:text-5xl">
          El pulso de tu ciudad, verificado por su gente.
        </h1>
        <p className="max-w-xl text-base text-ink-muted sm:text-lg">
          Descubre zonas y lugares verificados, conecta con tus amigos y confirma tu asistencia a los eventos.
        </p>
      </section>

      <section aria-label="Secciones" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => (
          <SectionCard key={section.href} {...section} />
        ))}
        {/* Lee la cookie de sesión para saber el rol: va en Suspense y no frena el resto de la página */}
        <Suspense>
          <AdminSectionCard />
        </Suspense>
      </section>
    </Container>
  );
}
