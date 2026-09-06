import Image from "next/image";
import Link from "next/link";
import type { VistaConCaptura } from "@/lib/servicios";

/**
 * Una captura dentro de un marco de ventana.
 *
 * Es la pieza que se repite en toda la seccion de servicios: barra de titulo
 * oscura con los tres puntos y, debajo, la captura pegada al borde de arriba.
 *
 * `object-top` no es un detalle: las capturas son pantallas completas de
 * 1900px de alto y lo que identifica al producto esta arriba. Centrar el
 * recorte deja a la vista el medio de una tabla.
 *
 * `recortado` corta el pie de la ventana contra el borde del panel. Eso es lo
 * que hace que se lea como una pantalla que sigue hacia abajo y no como una
 * foto pegada adentro de un cuadro.
 *
 * El tipo exige la captura. La version anterior tenia una rama que dibujaba
 * un recuadro punteado cuando faltaba la imagen, y esa rama quedo muerta
 * cuando BloqueServicio empezo a cambiar de layout para el rubro sin
 * material. Se saco: dejar dibujado el patron que el resto del sistema
 * rechaza es una invitacion a que vuelva.
 */
export function Ventana({
  vista,
  prioridad = false,
  sizes,
  recortado = false,
  compacta = false,
}: {
  vista: VistaConCaptura;
  prioridad?: boolean;
  sizes: string;
  /** Deja el pie de la ventana fuera del panel que la contiene. */
  recortado?: boolean;
  /** Version chica: sin barra de titulo, para las capturas secundarias. */
  compacta?: boolean;
}) {
  const cuerpo = (
    <div
      className={`overflow-hidden rounded-card border border-line-alto bg-bg-alto
        ${recortado ? "-mb-px" : ""}`}
    >
      {!compacta && (
        // Barra de la ventana. Los puntos son decorativos: no son botones.
        <div
          aria-hidden
          className="flex h-8 items-center gap-1.5 border-b border-line bg-[#0a0a0c] px-3.5 sm:h-9"
        >
          <span className="size-2 rounded-full bg-white/25" />
          <span className="size-2 rounded-full bg-white/18" />
          <span className="size-2 rounded-full bg-white/12" />
          <span className="ml-3 hidden truncate text-[11px] text-text-muted sm:block">
            {vista.titulo}
          </span>
        </div>
      )}

      <div className={`relative ${recortado ? "aspect-[16/8]" : "aspect-[16/10]"}`}>
        <Image
          src={vista.imagen}
          alt={vista.titulo}
          fill
          sizes={sizes}
          priority={prioridad}
          className="object-cover object-top"
        />
      </div>
    </div>
  );

  // La captura que tiene ficha propia lleva a ella. La que no, no es un link:
  // un cursor de mano sobre algo que no lleva a ningun lado miente.
  if (!vista.proyecto) return cuerpo;

  return (
    <Link
      href={`/proyectos/${vista.proyecto}`}
      className="group block transition-transform duration-[var(--duration-state)] ease-[var(--ease-out-soft)] hover:-translate-y-0.5"
      aria-label={`Ver el proyecto ${vista.titulo}`}
    >
      {cuerpo}
    </Link>
  );
}
