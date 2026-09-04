import Image from "next/image";
import Link from "next/link";
import type { Proyecto } from "@/lib/proyectos";

/**
 * Tarjeta de la vitrina (§4.4).
 *
 * Patrón tomado de la referencia (bungee.framer.website, "Latest Projects"):
 *
 *  - En reposo se ve **solo la imagen**, limpia y a foco: sin velo, sin texto.
 *  - Al pasar el cursor entra un velo, aparece el nombre con los chips y
 *    "Ver proyecto", y la imagen hace un leve zoom.
 *  - En pantallas sin hover todo se muestra siempre: el estado de reposo tiene
 *    que poder leerse igual (§2, B1).
 *
 * El nombre va centrado sobre la miniatura — decisión de Facundo: la tarjeta
 * se lee de un vistazo, sin bajada de texto.
 *
 * La proporción no es fija: cada proyecto trae la suya (vertical, apaisada o
 * panorámica) para armar la vitrina asimétrica de formastudio.framer.ai. En
 * mobile todas van 4/3, que es la proporción de las capturas: apilar una
 * panorámica de 3/1 en 390px la dejaría en una tira ilegible.
 *
 * `forma` y `sizes` los pone quien la usa: la versión apilada pasa la
 * proporción propia del proyecto; la pista horizontal pasa `h-full w-full`
 * porque ahí el alto y el ancho los fija el `<li>` de la tira.
 *
 * El `scale` del hover también tapa el halo que deja el recorte al mover la
 * imagen: agrandarla un 4% empuja el borde fuera del `overflow-hidden`.
 */
export function TarjetaProyecto({
  proyecto,
  forma = `aspect-[4/3] ${proyecto.proporcion}`,
  sizes = proyecto.sizes,
}: {
  proyecto: Proyecto;
  forma?: string;
  sizes?: string;
}) {
  return (
    <Link href={`/proyectos/${proyecto.slug}`} className="group block h-full">
      <div
        className={`relative ${forma} overflow-hidden rounded-[var(--radius-card)] border border-line transition-colors duration-[var(--duration-micro)] group-hover:border-text/25`}
      >
        <Image
          src={proyecto.imagen}
          alt={proyecto.nombre}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-[var(--duration-state)] ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
        />

        {/*
          Velo. Oculto en reposo (imagen limpia); entra en hover para que el
          nombre se lea sobre cualquier captura. Siempre visible sin hover.
        */}
        <div
          aria-hidden
          className="absolute inset-0 bg-bg/0 transition-colors duration-[var(--duration-state)] ease-[var(--ease-out-soft)] group-hover:bg-bg/80 group-focus-visible:bg-bg/80 [@media(hover:none)]:bg-bg/75"
        />

        {/* Nombre + chips + "Ver proyecto". Aparece con el velo. */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center translate-y-2 opacity-0 transition-all duration-[var(--duration-state)] ease-[var(--ease-out-soft)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
          <h3 className="text-[clamp(1.5rem,2.6vw,2.25rem)] text-text">
            {proyecto.nombre}
          </h3>

          <ul className="flex flex-wrap justify-center gap-2">
            {proyecto.categorias.map((c) => (
              <li
                key={c}
                className="rounded-full border border-text/25 px-3 py-1 text-sm text-text"
              >
                {c}
              </li>
            ))}
          </ul>

          <span className="mt-1 border-y border-text/35 px-4 py-1.5 text-sm whitespace-nowrap text-text">
            Ver proyecto
          </span>
        </div>
      </div>
    </Link>
  );
}
