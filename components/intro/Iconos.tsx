/**
 * Los cuatro iconos que viajan en las cintas de la intro.
 *
 * Son los mismos cuatro sectores que "Que hacemos": sitios web, tiendas,
 * paneles de gestion y automatizaciones. Trazo abierto, esquinas redondeadas y
 * `currentColor`, para que el color lo decida quien los use.
 *
 * `vectorEffect="non-scaling-stroke"` no va: los iconos no se escalan por
 * transform, cambian de tamaño por CSS, y el trazo tiene que acompañar.
 */

type Props = { className?: string };

const base = {
  viewBox: "0 0 64 64",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Barra superior de ventana: tres puntos y la barra de direccion. */
function BarraVentana({ y }: { y: number }) {
  return (
    <>
      <circle cx="12" cy={y} r="1.5" fill="currentColor" stroke="none" />
      <circle cx="18" cy={y} r="1.5" fill="currentColor" stroke="none" />
      <circle cx="24" cy={y} r="1.5" fill="currentColor" stroke="none" />
      <path d={`M31 ${y} H52`} />
    </>
  );
}

/** Sitios web: ventana de navegador con un globo adentro. */
export function IconoSitio({ className }: Props) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="5" y="10" width="54" height="44" rx="5" />
      <path d="M5 20 H59" />
      <BarraVentana y={15} />
      <circle cx="32" cy="37" r="11" />
      <path d="M21 37 H43" />
      <path d="M32 26c5 5 5 17 0 22-5-5-5-17 0-22Z" />
    </svg>
  );
}

/** Tiendas: el carrito de alambre, la misma referencia que el objeto 3D. */
export function IconoTienda({ className }: Props) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M4 12h6l3 6" />
      <path d="M13 18h45l-6 22H21L13 18Z" />
      <path d="M19 25h37M21 32h34" />
      <path d="M25 18l3 22M36 18v22M47 18l-3 22" />
      <circle cx="25" cy="50" r="4" />
      <circle cx="47" cy="50" r="4" />
    </svg>
  );
}

/** Paneles de gestion: monitor con controles y un grafo de nodos. */
export function IconoPanel({ className }: Props) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="4" y="8" width="56" height="38" rx="4" />
      <path d="M4 17 H60" />
      <BarraVentana y={12.5} />
      <path d="M11 26h12M11 33h12M11 40h12" />
      <path d="M17 23v6M14 30v6M20 37v6" />
      <circle cx="34" cy="26" r="3" />
      <circle cx="34" cy="41" r="3" />
      <circle cx="50" cy="33" r="3" />
      <path d="M37 27.5 47 32M37 39.5 47 34.5" />
      <path d="M26 54h12M32 46v8" />
    </svg>
  );
}

/** Un engranaje: nucleo, corona y los dientes repartidos alrededor. */
function Engranaje({
  cx,
  cy,
  r,
  dientes,
}: {
  cx: number;
  cy: number;
  r: number;
  dientes: number;
}) {
  const largo = r * 0.42;
  const ancho = r * 0.34;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} />
      <circle cx={cx} cy={cy} r={r * 0.42} />
      {Array.from({ length: dientes }, (_, i) => (
        <rect
          key={i}
          x={cx - ancho / 2}
          y={cy - r - largo * 0.72}
          width={ancho}
          height={largo}
          rx={ancho * 0.35}
          transform={`rotate(${(360 / dientes) * i} ${cx} ${cy})`}
        />
      ))}
    </g>
  );
}

/** Automatizaciones: dos engranajes engranados. */
export function IconoAutomatizacion({ className }: Props) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <Engranaje cx={24} cy={25} r={13} dientes={8} />
      <Engranaje cx={44} cy={44} r={9} dientes={7} />
    </svg>
  );
}

/** El orden en que se repiten dentro de una cinta. */
export const ICONOS = [
  IconoSitio,
  IconoTienda,
  IconoPanel,
  IconoAutomatizacion,
] as const;
