import { LETRAS, LOGOTIPO, LOGOTIPO_D } from "@/lib/marca";

/**
 * El logotipo: la palabra TREVOO.
 *
 * `desde` y `hasta` recortan el viewBox a un rango de letras sin tocar el
 * path: el mismo dibujo sirve entero para el header y partido en seis para la
 * maquina de escribir del preloader. Recortar el viewBox y no el path es lo
 * que garantiza que las letras sueltas caigan exactamente donde caerian
 * dentro de la palabra completa.
 */
export function Logotipo({
  className,
  titulo,
  desde = 0,
  hasta = LETRAS.length - 1,
  ...resto
}: React.SVGProps<SVGSVGElement> & {
  titulo?: string;
  desde?: number;
  hasta?: number;
}) {
  const x0 = LETRAS[desde][0];
  const x1 = LETRAS[hasta][1];

  return (
    <svg
      viewBox={`${x0} 0 ${x1 - x0 + 1} ${LOGOTIPO.h}`}
      fill="currentColor"
      className={className}
      {...(titulo
        ? { role: "img", "aria-label": titulo }
        : { "aria-hidden": true })}
      {...resto}
    >
      <path d={LOGOTIPO_D} />
    </svg>
  );
}
