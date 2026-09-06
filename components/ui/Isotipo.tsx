import { ISOTIPO, ISOTIPO_D } from "@/lib/marca";

/**
 * El isotipo de Trevoo: la T con el corte triangular.
 *
 * Va inline y con fill="currentColor" — el mismo componente sirve blanco sobre
 * el negro del sitio y negro sobre el azul de una tarjeta, sin variantes de
 * archivo. Es la pieza en la que termina el preloader, asi que la geometria
 * sale de lib/marca.ts y no de una copia suelta.
 *
 * El resto de props va derecho al <svg>: el preloader necesita pasarle su
 * `ref` (para medir la caja real al aterrizar) y sus data-atributos.
 */
export function Isotipo({
  className,
  titulo,
  ...resto
}: React.SVGProps<SVGSVGElement> & {
  /** Sin titulo va decorativo: en el lockup el nombre ya lo pone el logotipo. */
  titulo?: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${ISOTIPO.w} ${ISOTIPO.h}`}
      fill="currentColor"
      className={className}
      {...(titulo
        ? { role: "img", "aria-label": titulo }
        : { "aria-hidden": true })}
      {...resto}
    >
      <path d={ISOTIPO_D} />
    </svg>
  );
}
