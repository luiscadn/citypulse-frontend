import { cn } from "../cn";

/**
 * Símbolo de CityPulse: un pin de mapa (la ciudad) con una línea de pulso.
 * `inverse` lo pinta en blanco para usarlo sobre fondos de color primario.
 */
function LogoSymbol({ className, inverse = false }: { className?: string; inverse?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8 shrink-0", className)} aria-hidden>
      <defs>
        <linearGradient id="citypulse-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--primary)" />
          <stop offset="1" stopColor="var(--accent)" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" className={inverse ? "fill-white" : undefined} fill={inverse ? undefined : "url(#citypulse-logo)"} />
      <path
        d="M16 5.5c-4.7 0-8.5 3.6-8.5 8.2 0 6 8.5 12.8 8.5 12.8s8.5-6.8 8.5-12.8c0-4.6-3.8-8.2-8.5-8.2z"
        className={inverse ? "fill-brand" : "fill-white"}
      />
      <path
        d="M10.6 14h2.6l1.5-3.2 2.6 6.4 1.5-3.2h2.6"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="24"
        className={cn("animate-draw", inverse ? "stroke-white" : "stroke-primary")}
      />
    </svg>
  );
}

/** Logo completo: símbolo + "CityPulse" (con "Pulse" en el color primario). */
export function BrandMark({
  className,
  withText = true,
  inverse = false,
}: {
  className?: string;
  withText?: boolean;
  /** Versión para fondos de color primario */
  inverse?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoSymbol inverse={inverse} />
      {withText && (
        <span className={cn("text-xl font-extrabold tracking-tight", inverse ? "text-white" : "text-ink")}>
          City<span className={inverse ? "text-white/75" : "text-primary"}>Pulse</span>
        </span>
      )}
    </span>
  );
}
