import { Isotipo } from "@/components/ui/Isotipo";
import { Ola } from "@/components/ui/Ola";
import { Revelar } from "@/components/ui/Revelar";

/**
 * Quienes somos.
 *
 * Sin encabezado de seccion y sin tarjeta: el isotipo arriba haciendo de
 * firma, el nombre de la marca como titulo y dos parrafos centrados sobre el
 * negro.
 *
 * (07/09/2026) El titulo "Trevoo" se escribe con una ola (`Ola`) al entrar en
 * pantalla — reemplaza al typewriter plano que antes escribia "Somos Facundo y
 * Mateo", frase que ahora abre el primer parrafo. Los dos parrafos van
 * justificados y con guionado, por pedido.
 *
 * Con movimiento reducido / sin JS se ve todo el texto quieto y completo.
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

          <Ola
            as="h2"
            id="titulo-quienes-somos"
            texto="Trevoo"
            className="mt-8 text-[clamp(2rem,4.6vw,3.5rem)] text-text"
          />

          <Revelar demora={60}>
            <p className="mx-auto mt-6 max-w-[48ch] font-display text-[clamp(1.1rem,1.8vw,1.4rem)] font-medium leading-[1.5] tracking-[-0.03em] text-text text-justify hyphens-auto [text-align-last:center]">
              Somos Facundo y Mateo. Nos dedicamos a detectar qué necesita tu
              negocio en lo digital y a construir la solución que lo resuelve: un
              sitio que te traiga clientes, una tienda online que venda sin que
              estés encima, un sistema que ordene tu operación o una
              automatización que se ocupe de lo repetitivo.
            </p>
          </Revelar>

          <Revelar demora={120}>
            <p className="mx-auto mt-8 max-w-[54ch] text-[15px] leading-relaxed text-text-muted sm:text-base text-justify hyphens-auto [text-align-last:center]">
              Primero entendemos cómo funciona tu negocio, después lo
              desarrollamos a medida y no lo damos por terminado hasta verlo
              funcionando con tus datos reales.
            </p>
          </Revelar>
        </div>
      </div>
    </section>
  );
}
