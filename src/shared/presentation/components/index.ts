/**
 * Barril de exportación (Barrel File) de Componentes Compartidos de Presentación
 *
 * - **¿Qué hace?**: Reexporta de forma centralizada todos los componentes base del sistema de diseño de CityPulse:
 *   botones, controles de formulario, insignias, tarjetas, contenedores, indicadores de carga y estados de ruta.
 * - **¿Cómo interactúa con el sistema en general?**: Permite importar cualquier componente base desde un único módulo
 *   (ej. `import { Button, Card, TextField } from "@/shared/presentation/components"`), evitando rutas de importación relativas largas.
 * - **¿Cuál es su importancia?**: Simplifica las importaciones en toda la aplicación, desacopla la ubicación física interna
 *   de los componentes individuales y ofrece una API pública limpia para el sistema de diseño.
 */
export { Button, ButtonLink, buttonClasses } from "./button";
export { Spinner } from "./spinner";
export {
  Field,
  Input,
  Select,
  Textarea,
  TextField,
  SelectField,
  TextareaField,
} from "./form-controls";
export { Badge, Alert, EmptyState, type Tone } from "./feedback";
export { Container, PageHeader, Card, CardHeader, CardBody, CardFooter } from "./layout";
export { BrandMark } from "./brand-mark";
export { ThemeToggle } from "../theme/theme-toggle";
export { RouteLoading, NotFoundState, PageSkeleton } from "./route-states";
export { RouteError } from "./route-error";
