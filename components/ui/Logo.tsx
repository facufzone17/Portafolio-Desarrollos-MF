/**
 * Monograma MF.
 *
 * Va inline (no <img>) para que fill="currentColor" funcione: el mismo
 * componente sirve blanco en el header o navy sobre claro, sin variantes.
 * Geometria tomada de Marca/logo-mono.svg — vector real, 20 vertices.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 917 964"
      fill="currentColor"
      role="img"
      aria-label="Desarrollos MF"
      className={className}
    >
      <path d="M 0 11 L 398 292 L 282 374 L 139 273 L 139 937 L 0 937 Z" />
      <path d="M 916 0 L 916 166 L 420 517 L 420 650 L 650 488 L 650 654 L 420 818 L 420 961 L 281 961 L 281 449 Z" />
      <path d="M 778 400 L 916 302 L 916 938 L 778 938 Z" />
    </svg>
  );
}
