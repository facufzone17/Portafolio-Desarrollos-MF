import { Seccion } from "@/components/ui/Seccion";
import { servicios } from "@/lib/servicios";
import { BloqueServicio } from "./BloqueServicio";

/**
 * Servicios.
 *
 * Tercera forma de esta seccion, y las dos anteriores se sacaron enteras: la
 * ronda de objetos 3D de "Que hacemos" (borrada el 04/09/2026) y los cuatro
 * paneles azules identicos con rotulo, numero de orden y viñetas, que no eran
 * un sistema sino una plantilla rellenada cuatro veces.
 *
 * Ahora son cuatro franjas anchas que alternan el lado de la imagen —el
 * formato de applio.framer.website, la misma referencia que rige el hero— y la
 * ultima rompe el patron con dos telefonos flanqueando al texto.
 *
 * El indice pegajoso de la izquierda tambien se fue. Marcaba en cual de los
 * cuatro bloques estabas cuando todos ocupaban la misma columna; con las
 * franjas alternadas ya no hay una columna libre a la izquierda, y una lista
 * de cuatro items para una seccion de cuatro items que se ven enteros al
 * scrollear no le ahorra nada a nadie.
 *
 * Al no quedar estado ni observer propio, la seccion vuelve a ser un
 * componente de servidor: lo unico que corre en el navegador es cada carrusel.
 *
 * El encabezado es el nombre de la seccion pelado y sin bajada, por pedido de
 * Facundo (07/09/2026). Antes decia "Cuatro cosas, hechas a medida" con una
 * linea gris debajo. La barra de navegacion sigue diciendo "Servicios" y el
 * ancla sigue siendo `#servicios`: si algun dia hay que unificarlos, se toca
 * `secciones` en `lib/site.ts`.
 */
export function Servicios() {
  return (
    <Seccion id="servicios" titulo="Qué hacemos">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-24 sm:gap-32">
        {servicios.map((servicio, i) => (
          <BloqueServicio
            key={servicio.id}
            servicio={servicio}
            prioridad={i === 0}
          />
        ))}
      </div>
    </Seccion>
  );
}
