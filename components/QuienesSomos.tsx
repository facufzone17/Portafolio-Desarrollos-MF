import { Seccion } from "@/components/ui/Seccion";

/**
 * Una sola tarjeta, a nombre de la marca. Reemplaza la version de §4.6 (dos
 * fichas, una por persona, con bio): en vez de eso, una presentacion de
 * Desarrollos MF dirigida al negocio que lee.
 *
 * Va sin encabezado de seccion — sin "Quienes somos" ni bajada aparte. Al no
 * haber titulo, el peso visual lo lleva la tarjeta: tipografia grande, aire y
 * el detalle en azul de marca. El nombre de la marca hace de titulo (h2), asi
 * que la seccion sigue teniendo su ancla y su encabezado para accesibilidad.
 *
 * El copy no describe a cada persona: dice quienes somos, que resolvemos y
 * por que trabajar con dos personas y no con un intermediario.
 */
export function QuienesSomos() {
  return (
    <Seccion id="quienes-somos">
      <div className="mx-auto max-w-[860px] rounded-[var(--radius-card)] border border-line bg-bg-elev p-8 sm:p-12 lg:p-16">
        <span aria-hidden className="block h-1 w-12 rounded-full bg-brand-soft" />

        <h2 className="mt-8 text-[clamp(2rem,5vw,3.25rem)]">Desarrollos MF</h2>

        <div className="mt-6 flex flex-col gap-5 sm:mt-8">
          <p className="text-lg text-text sm:text-xl">
            Somos Facundo y Mateo. Nos dedicamos a detectar qué necesita tu
            negocio en lo digital y a construir la solución que lo resuelve: un
            sitio que te traiga clientes, una tienda online que venda sin que
            estés encima, un sistema que ordene tu operación o una automatización
            que se ocupe de lo repetitivo.
          </p>
          <p className="text-base text-text-muted sm:text-lg">
            Trabajamos de a dos y de principio a fin. No hay intermediarios ni
            proyectos que pasan de mano en mano: con quien hablás es con quien
            construye. Primero entendemos cómo funciona tu negocio, después lo
            desarrollamos a medida y no lo damos por terminado hasta verlo
            funcionando con tus datos reales.
          </p>
        </div>
      </div>
    </Seccion>
  );
}
