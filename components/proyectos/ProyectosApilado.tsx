import { Revelar } from "@/components/ui/Revelar";
import { proyectos } from "@/lib/proyectos";
import { TarjetaProyecto } from "./TarjetaProyecto";

/**
 * Vitrina de proyectos, version apilada.
 *
 * Es el scroll nativo del navegador: piezas de proporciones distintas sueltas
 * en una grilla de 12 columnas, cada una en su lugar y sin alinearse con las
 * demas. En mobile todo se apila a ancho completo.
 *
 * Se usa en mobile/tablet y con prefers-reduced-motion. En escritorio con
 * movimiento permitido, `Proyectos` monta `ProyectosPista` (scroll horizontal)
 * en su lugar — por eso el encabezado esta duplicado en los dos: en la pista
 * vive dentro del pin, aca en el flujo normal.
 *
 * items-start es obligatorio: sin el, cada item se estira al alto de su fila y
 * la proporcion de la pieza deja de valer.
 */
export function ProyectosApilado({ className = "" }: { className?: string }) {
  return (
    <div className={`py-20 sm:py-28 ${className}`}>
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Revelar>
          <div className="mx-auto max-w-[46ch] text-center">
            <h2 className="text-[clamp(2rem,4.6vw,3.5rem)]">
              Cosas que ya están funcionando
            </h2>
            <p className="mx-auto mt-5 max-w-[44ch] text-[15px] leading-relaxed text-text-muted sm:text-base">
              Entrá a cualquiera. Son sitios y tiendas reales, andando.
            </p>
          </div>
        </Revelar>

        <ul className="mt-16 flex flex-col gap-16 sm:gap-20 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-10 lg:gap-y-0">
          {proyectos.map((p) => (
            <Revelar as="li" key={p.slug} className={p.ubicacion}>
              <TarjetaProyecto proyecto={p} />
            </Revelar>
          ))}
        </ul>
      </div>
    </div>
  );
}
