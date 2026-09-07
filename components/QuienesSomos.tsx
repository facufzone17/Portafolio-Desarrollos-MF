import { Isotipo } from "@/components/ui/Isotipo";
import { Revelar } from "@/components/ui/Revelar";

/**
 * Quienes somos.
 *
 * Sin encabezado de seccion y sin tarjeta: el isotipo arriba haciendo de
 * firma, el nombre de la marca como titulo y dos parrafos centrados sobre el
 * negro.
 *
 * (07/09/2026) Se saco la maquina de escribir. Escribia "Somos Facundo y
 * Mateo", y esa frase ahora abre el primer parrafo; el titulo pasa a ser
 * "Trevoo". El preloader ya escribe TREVOO letra por letra en cada carga:
 * volver a tipear aca seria contar dos veces lo mismo. El titulo aparece con
 * el `Revelar` de siempre, igual que el resto de la pagina.
 *
 * Con movimiento reducido / sin JS se ve todo el texto de una.
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

          <Revelar>
            <h2
              id="titulo-quienes-somos"
              className="mt-8 text-[clamp(2rem,4.6vw,3.5rem)] text-text"
            >
              Trevoo
            </h2>
          </Revelar>

          <Revelar demora={60}>
            <p className="mx-auto mt-6 max-w-[46ch] font-display text-[clamp(1.1rem,1.8vw,1.4rem)] leading-[1.5] font-medium tracking-[-0.03em] text-text">
              Somos Facundo y Mateo. Nos dedicamos a detectar qué necesita tu
              negocio en lo digital y a construir la solución que lo resuelve: un
              sitio que te traiga clientes, una tienda online que venda sin que
              estés encima, un sistema que ordene tu operación o una
              automatización que se ocupe de lo repetitivo.
            </p>
          </Revelar>

          <Revelar demora={120}>
            <p className="mx-auto mt-8 max-w-[54ch] text-[15px] leading-relaxed text-text-muted sm:text-base">
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
