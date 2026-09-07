import { Isotipo } from "@/components/ui/Isotipo";
import { Revelar } from "@/components/ui/Revelar";
import { Tipeo } from "@/components/ui/Tipeo";

/**
 * Quienes somos.
 *
 * Va sin encabezado de seccion y sin tarjeta: es un bloque de texto grande,
 * centrado, sobre el negro, con el isotipo arriba haciendo de firma.
 *
 * Por pedido (05/09/2026) "Somos Facundo y Mateo" se escribe a maquina cuando
 * entra en pantalla —es lo unico de la pagina con ese gesto— pero en la
 * tipografia del sistema (Inter Tight) y en un solo renglon. La frase larga de
 * abajo tambien va en Inter Tight y aparece con el `Revelar` de siempre, sin
 * tipeo. El parrafo, igual.
 *
 * Con movimiento reducido / sin JS no se tipea nada: se ve el texto entero.
 */
export function QuienesSomos() {
  return (
    <section
      id="quienes-somos"
      aria-labelledby="titulo-quienes-somos"
      className="scroll-mt-24 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="mx-auto max-w-[64ch] text-center">
          <Isotipo className="mx-auto h-8 w-auto text-azul" />

          <Tipeo
            as="h2"
            id="titulo-quienes-somos"
            texto="Somos Facundo y Mateo"
            velocidad={90}
            className="mt-8 block whitespace-nowrap text-[clamp(1.6rem,5vw,3.25rem)] text-text"
          />

          <Revelar>
            <p className="mx-auto mt-6 max-w-[26ch] font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.25] font-medium tracking-[-0.03em] text-text sm:max-w-[34ch]">
              El que te responde el WhatsApp es el que desarrolla tu proyecto.
              Somos dos y hacemos todo, de principio a fin.
            </p>
          </Revelar>

          <Revelar demora={80}>
            <p className="mx-auto mt-8 max-w-[58ch] text-[15px] leading-relaxed text-text-muted sm:text-base">
              Primero entendemos cómo funciona tu negocio: cómo trabajás hoy, qué
              te hace perder tiempo y qué te preguntan tus clientes todo el día.
              Después lo desarrollamos a medida y no lo damos por terminado hasta
              verlo funcionando con tus datos reales.
            </p>
          </Revelar>
        </div>
      </div>
    </section>
  );
}
