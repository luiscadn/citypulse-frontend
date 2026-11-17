import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/shared/presentation/components";
import { AdminSectionCard } from "./_components/admin-section-card";
import { CityMapSection } from "./_components/city-map-section";
import { SectionCard } from "./_components/section-card";

export const metadata: Metadata = { title: "Inicio" };

/** Secciones de la app (las mismas del encabezado) con una línea de qué hay en cada una. */
const SECTIONS = [
  { href: "/events", title: "Eventos", description: "Mira lo que pasa en Cali, reporta un evento o publica el tuyo." },
  { href: "/zones", title: "Zonas", description: "Barrios y sectores de la ciudad donde ocurren los eventos." },
  { href: "/venues", title: "Lugares", description: "Explora lugares verificados y ubícalos en el mapa." },
  { href: "/friends", title: "Amigos", description: "Busca personas, responde solicitudes y mira a tus amigos." },
  { href: "/invitations", title: "Invitaciones", description: "Revisa las invitaciones que recibiste a eventos." },
  { href: "/profile", title: "Mi perfil", description: "Edita tus datos y activa la verificación en dos pasos." },
] as const;

export default function HomePage() {
  return (
    <Container className="flex flex-col gap-10 pb-12">
      <section className="stagger relative flex flex-col gap-3 py-10 sm:py-14">
        {/* Halo de color detrás del título */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 -left-20 -z-10 size-80 animate-float rounded-full bg-accent/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-10 left-60 -z-10 size-72 animate-float rounded-full bg-primary/15 blur-3xl [animation-delay:-6s]"
        />
        <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-accent-strong uppercase">
          <span className="pulse-dot" aria-hidden />
          CityPulse · En vivo en Cali
        </p>
        <h1 className="max-w-2xl text-3xl leading-tight font-bold tracking-tight text-balance text-ink sm:text-5xl">
          El pulso de tu ciudad, <span className="text-gradient">verificado por su gente.</span>
        </h1>
        <p className="max-w-xl text-base text-ink-muted sm:text-lg">
          Descubre zonas y lugares verificados, conecta con tus amigos y confirma tu asistencia a los eventos.
        </p>
      </section>

      <CityMapSection />

      <section aria-label="Secciones" className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
