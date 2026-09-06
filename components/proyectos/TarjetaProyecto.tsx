import Image from "next/image";
import Link from "next/link";
import type { Proyecto } from "@/lib/proyectos";

/**
 * Tarjeta de la vitrina.
 *
 *  - En reposo se ve **solo la imagen**, limpia y a foco: sin velo, sin texto.
 *  - Al pasar el cursor entra un velo oscuro, aparece el nombre con los chips
 *    y "Ver proyecto", y la imagen hace un leve zoom.
 *  - En pantallas sin hover todo se muestra siempre: el estado de reposo tiene
 *    que poder leerse igual.
 *
 * Con el sitio en negro el velo cambio de sentido: antes aclaraba (crema al
 * 80%) para poder escribir en negro encima; ahora oscurece, y el texto es el
 * claro del sitio. Las capturas son claras, asi que sin velo el nombre no se
 * leeria.
 *
 * La proporcion no es fija: cada proyecto trae la suya (vertical, apaisada o
 * panoramica) para armar la vitrina asimetrica. En mobile todas van 4/3, que
 * es la proporcion de las capturas: apilar una panoramica de 3/1 en 390px la
 * dejaria en una tira ilegible.
 *
 * El `scale` del hover tambien tapa el halo que deja el recorte al mover la
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
        className={`relative ${forma} overflow-hidden rounded-[var(--radius-card)] border border-line bg-bg-elev transition-colors duration-[var(--duration-micro)] group-hover:border-azul/45`}
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
          className="absolute inset-0 bg-bg/0 transition-colors duration-[var(--duration-state)] ease-[var(--ease-out-soft)] group-hover:bg-bg/85 group-focus-visible:bg-bg/85 [@media(hover:none)]:bg-bg/80"
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
                className="rounded-card border border-line-alto px-3 py-1 text-sm text-text"
              >
                {c}
              </li>
            ))}
          </ul>

          <span className="mt-1 inline-flex min-h-10 items-center rounded-card bg-text px-4 text-sm font-medium whitespace-nowrap text-bg">
            Ver proyecto
          </span>
        </div>
      </div>
    </Link>
  );
}
