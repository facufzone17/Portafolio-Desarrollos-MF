import { Isotipo } from "@/components/ui/Isotipo";
import { Revelar } from "@/components/ui/Revelar";

/**
 * Quienes somos.
 *
 * Va sin encabezado de seccion y sin tarjeta: es un bloque de texto grande,
 * centrado, sobre el negro, con el isotipo arriba haciendo de firma.
 *
 * La version anterior era una tarjeta gris con un circulo azul desenfocado en
 * la esquina. Ese circulo es "glass y blur como decorado": un halo de color
 * sin offset ni sombra real, puesto para que la caja no se viera vacia. Si la
 * caja se ve vacia, lo que sobra es la caja.
 *
 * Es ademas la unica seccion de la pagina con medida de lectura larga: despues
 * de tres bloques de pantallas y capturas, un pasaje de texto corrido es el
 * cambio de ritmo que hace que lo que sigue (el contacto) no llegue cansado.
 */
export function QuienesSomos() {
  return (
    <section
      id="quienes-somos"
      aria-labelledby="titulo-quienes-somos"
      className="scroll-mt-24 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Revelar>
          <div className="mx-auto max-w-[62ch] text-center">
            <Isotipo className="mx-auto h-8 w-auto text-azul" />

            <h2
              id="titulo-quienes-somos"
              className="mt-9 text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.25] tracking-[-0.03em]"
            >
              Somos Facundo y Mateo. Con quien hablás es con quien construye:
              no hay intermediarios ni proyectos que pasen de mano en mano.
            </h2>

            <p className="mx-auto mt-8 max-w-[58ch] text-[15px] leading-relaxed text-text-muted sm:text-base">
              Primero entendemos cómo funciona tu negocio: cómo trabajás hoy,
              qué te hace perder tiempo y qué te preguntan tus clientes todo el
              día. Después lo desarrollamos a medida y no lo damos por
              terminado hasta verlo funcionando con tus datos reales.
            </p>
          </div>
        </Revelar>
      </div>
    </section>
  );
}
