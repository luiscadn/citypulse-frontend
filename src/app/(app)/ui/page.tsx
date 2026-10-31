import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  Alert,
  Badge,
  Button,
  ButtonLink,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
  EmptyState,
  PageHeader,
  SelectField,
  Spinner,
  TextareaField,
  TextField,
  type Tone,
} from "@/shared/presentation/components";

export const metadata: Metadata = { title: "Guía de UI" };

/*
 * Catálogo del sistema de diseño. Sirve de referencia para el equipo:
 * si necesitas algo que no está aquí, agrégalo a shared/presentation/components
 * en un PR aparte y muéstralo en esta página.
 */

const palette: Array<{ name: string; token: string; className: string; note: string }> = [
  { name: "Primario", token: "primary", className: "bg-primary", note: "#5454E9 · acciones principales, enlaces, foco" },
  { name: "Primario hover", token: "primary-hover", className: "bg-primary-hover", note: "#4141C9" },
  { name: "Tinta", token: "ink", className: "bg-ink", note: "#1E1F26 · texto principal" },
  { name: "Tinta secundaria", token: "ink-muted", className: "bg-ink-muted", note: "Texto de apoyo" },
  { name: "Lienzo", token: "canvas", className: "bg-canvas", note: "Fondo de la página" },
  { name: "Superficie", token: "surface", className: "bg-surface", note: "Tarjetas, header, inputs" },
  { name: "Éxito", token: "success", className: "bg-success", note: "#3FB618" },
  { name: "Peligro", token: "danger", className: "bg-danger", note: "#FF0039" },
  { name: "Advertencia", token: "warning", className: "bg-warning", note: "#FF7518" },
  { name: "Info", token: "info", className: "bg-info", note: "#9954BB" },
];

/** Tono recomendado para cada estado del backend (EventStatus, InvitationStatus...) */
const statusTones: Array<{ group: string; items: Array<[string, Tone]> }> = [
  {
    group: "Eventos",
    items: [
      ["REPORTADO", "warning"],
      ["CONFIRMADO", "success"],
      ["RECHAZADO", "danger"],
      ["CANCELADO", "neutral"],
    ],
  },
  {
    group: "Invitaciones y amistades",
    items: [
      ["PENDIENTE", "warning"],
      ["ACEPTADA", "success"],
      ["RECHAZADA", "danger"],
    ],
  },
  {
    group: "Asistencia",
    items: [
      ["ASISTIRE", "success"],
      ["QUIZAS", "info"],
      ["NO_ASISTIRE", "neutral"],
    ],
  },
  {
    group: "Origen y visibilidad",
    items: [
      ["OFICIAL", "primary"],
      ["REPORTE_USUARIO", "info"],
      ["PUBLICO", "neutral"],
      ["PRIVADO", "neutral"],
    ],
  },
];

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-t border-line py-10">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-bold tracking-tight text-ink">{title}</h2>
        {description && <p className="max-w-2xl text-sm text-ink-muted">{description}</p>}
      </div>
      {children}
    </section>
  );
}

const plusIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden>
    <path d="M10 4a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V5a1 1 0 011-1z" />
  </svg>
);

export default function UiGuidePage() {
  return (
    <Container className="pb-20">
      <PageHeader
        eyebrow="Sistema de diseño"
        title="Guía de UI de CityPulse"
        description="Colores y tipografía de la identidad Icesi. Importa los componentes desde @/shared/presentation/components y usa solo los tokens de color de esta página."
      />

      <Section title="Colores" description="Usa los nombres de token en las clases de Tailwind: bg-primary, text-ink-muted, border-line, text-danger-strong…">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {palette.map((c) => (
            <div key={c.token} className="overflow-hidden rounded-lg border border-line bg-surface">
              <div className={`h-16 ${c.className} border-b border-line`} />
              <div className="flex flex-col gap-0.5 p-3">
                <p className="text-sm font-semibold text-ink">{c.name}</p>
                <code className="font-mono text-xs text-primary-strong">{c.token}</code>
                <p className="text-xs text-ink-muted">{c.note}</p>
              </div>
            </div>
          ))}
        </div>
        <Alert tone="info" title="Texto de color">
          Para texto de color sobre fondo claro usa la variante <code className="font-mono">-strong</code>{" "}
          (text-danger-strong, text-success-strong…). Los colores base no tienen contraste suficiente para texto.
        </Alert>
      </Section>

      <Section title="Tipografía" description="Plus Jakarta Sans, la fuente institucional de Icesi.">
        <Card>
          <CardBody className="flex flex-col gap-4">
            <p className="text-3xl font-bold tracking-tight text-ink">Título de página · 3xl bold</p>
            <p className="text-xl font-bold tracking-tight text-ink">Título de sección · xl bold</p>
            <p className="text-base font-semibold text-ink">Título de tarjeta · base semibold</p>
            <p className="text-base text-ink">Cuerpo de texto · base regular. El pulso de tu ciudad, verificado por su gente.</p>
            <p className="text-sm text-ink-muted">Texto secundario · sm ink-muted</p>
            <p className="text-xs font-semibold tracking-wider text-primary-strong uppercase">Etiqueta superior · xs uppercase</p>
          </CardBody>
        </Card>
      </Section>

      <Section title="Botones" description="Un solo botón primary por vista. secondary para acciones alternativas, ghost para acciones discretas, danger para acciones destructivas.">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primario</Button>
          <Button variant="secondary">Secundario</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Eliminar</Button>
          <Button icon={plusIcon}>Reportar evento</Button>
          <Button loading>Guardando…</Button>
          <Button disabled>Deshabilitado</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Pequeño</Button>
          <Button size="md">Mediano</Button>
          <Button size="lg">Grande</Button>
          <ButtonLink href="/ui" variant="secondary">
            ButtonLink (navegación)
          </ButtonLink>
        </div>
      </Section>

      <Section title="Formularios" description="Controles nativos: funcionan directo con Server Actions usando name. TextField, SelectField y TextareaField ya conectan etiqueta, ayuda y error.">
        <Card className="max-w-2xl">
          <CardHeader title="Reportar un evento" description="Ejemplo de formulario con los componentes base." />
          <CardBody className="grid gap-5 sm:grid-cols-2">
            <TextField label="Título" name="title" placeholder="Feria del libro en el parque" required className="sm:col-span-2" />
            <SelectField label="Zona" name="zoneId" required defaultValue="">
              <option value="" disabled>
                Elige una zona
              </option>
              <option value="1">Norte</option>
              <option value="2">Sur</option>
            </SelectField>
            <TextField label="Fecha de inicio" name="startDate" type="datetime-local" required />
            <TextField
              label="Correo de contacto"
              name="email"
              type="email"
              defaultValue="correo-invalido"
              error="Escribe un correo válido"
            />
            <TextField label="Lugar" name="place" value="Teatro Municipal" readOnly hint="Se completa al elegir en el mapa" />
            <TextareaField label="Descripción" name="description" hint="Máximo 500 caracteres" className="sm:col-span-2" />
          </CardBody>
          <CardFooter>
            <Button variant="ghost">Cancelar</Button>
            <Button>Publicar reporte</Button>
          </CardFooter>
        </Card>
      </Section>

      <Section title="Badges de estado" description="Tono recomendado para cada estado del backend. Úsalo igual en toda la app.">
        <div className="grid gap-4 sm:grid-cols-2">
          {statusTones.map(({ group, items }) => (
            <Card key={group}>
              <CardBody className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-ink">{group}</p>
                <div className="flex flex-wrap gap-2">
                  {items.map(([label, tone]) => (
                    <Badge key={label} tone={tone} dot>
                      {label}
                    </Badge>
                  ))}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Alertas" description="Resultados de acciones y avisos. danger se anuncia a lectores de pantalla como alerta.">
        <div className="grid gap-3 sm:grid-cols-2">
          <Alert tone="success" title="Reporte enviado">Un moderador lo revisará pronto.</Alert>
          <Alert tone="danger" title="No se pudo guardar">El backend no respondió. Intenta de nuevo.</Alert>
          <Alert tone="warning" title="Evento pendiente">Aún no ha sido verificado por un moderador.</Alert>
          <Alert tone="info">Las evidencias solo se pueden agregar mientras el evento esté activo.</Alert>
        </div>
      </Section>

      <Section title="Tarjetas, estados vacíos y carga">
        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardBody className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <Badge tone="success" dot>
                  CONFIRMADO
                </Badge>
                <span className="text-xs text-ink-muted">Sáb 15 nov · 7:00 p. m.</span>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-base font-semibold text-ink">Concierto en el Teatro Municipal</p>
                <p className="text-sm text-ink-muted">Centro · Teatro Municipal Enrique Buenaventura</p>
              </div>
            </CardBody>
            <CardFooter className="justify-between">
              <span className="text-xs text-ink-muted">24 asistentes</span>
              <Button size="sm" variant="secondary">
                Ver detalle
              </Button>
            </CardFooter>
          </Card>
          <EmptyState
            title="No hay eventos en esta zona"
            description="Prueba con otra zona o sé el primero en reportar algo."
            action={<Button size="sm" icon={plusIcon}>Reportar evento</Button>}
          />
          <Card className="grid min-h-48 place-items-center">
            <div className="flex flex-col items-center gap-3 text-primary">
              <Spinner size="lg" />
              <span className="text-sm text-ink-muted">Cargando eventos…</span>
            </div>
          </Card>
        </div>
      </Section>
    </Container>
  );
}
