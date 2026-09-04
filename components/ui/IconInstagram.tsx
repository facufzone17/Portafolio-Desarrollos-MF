/**
 * Instagram como SVG inline.
 *
 * lucide-react v1 saco los iconos de marca, asi que este no viene del paquete.
 * Trazo de 2px y viewBox 24 para que combine con el resto de los lucide.
 */
export function IconInstagram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}
