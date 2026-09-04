import { proyectos } from "@/lib/proyectos";
import { TarjetaProyecto } from "./TarjetaProyecto";

/**
 * Vitrina de proyectos, version apilada.
 *
 * Es el scroll nativo del navegador: piezas de proporciones distintas sueltas
 * en una grilla de 12 columnas (formastudio.framer.ai), cada una en su lugar y
 * sin alinearse con las demas. En mobile todo se apila a ancho completo.
 *
 * Se usa en mobile/tablet y con prefers-reduced-motion. En escritorio con
 * movimiento permitido, `Proyectos` monta `ProyectosPista` (scroll horizontal)
 * en su lugar.
 *
 * items-start es obligatorio: sin el, cada item se estira al alto de su fila
 * y la proporcion de la pieza deja de valer.
 */
export function ProyectosApilado({ className = "" }: { className?: string }) {
  return (
    // El crema es explicito: esta version vive dentro de la zona de piedra y,
    // sin transicion que la justifique, la piedra no tiene que asomar detras.
    <div
      data-tapa-piedra
      className={`relative bg-bg py-20 sm:py-28 ${className}`}
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <ul className="flex flex-col gap-16 sm:gap-20 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-10 lg:gap-y-0">
          {proyectos.map((p) => (
            <li key={p.slug} className={p.ubicacion}>
              <TarjetaProyecto proyecto={p} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
