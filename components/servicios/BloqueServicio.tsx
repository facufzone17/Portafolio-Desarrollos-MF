import Image from "next/image";
import { Revelar } from "@/components/ui/Revelar";
import type { Servicio } from "@/lib/servicios";
import { Carrusel } from "./Carrusel";

/**
 * Una franja de la seccion de servicios.
 *
 * Anatomia pedida por Facundo sobre applio.framer.website, medida en vivo:
 *
 *   fila         imagen 66% / texto 34%, separadas por 42px
 *   texto        titulo y una frase, nada mas
 *   alternancia  el lado de la imagen se da vuelta en cada franja
 *
 * El 66/34 se dibuja con 8 y 4 de doce columnas (66,7% y 33,3%), que es la
 * misma proporcion con la rejilla que ya usa el resto de la pagina.
 *
 * Lo que se saco respecto de la version anterior: las viñetas de "lo que
 * incluye", el indice pegajoso de la izquierda, el panel gris alrededor de la
 * captura y el rotulo con el nombre del rubro adentro del panel. El nombre
 * ahora es el titulo —una sola vez, en un solo lugar— y lo que muestra el
 * rubro es la captura, no una lista de lo que la captura ya deja ver.
 *
 * En mobile no hay alternancia posible: siempre texto arriba, imagen abajo.
 * El orden se da vuelta recien en `lg`.
 */
export function BloqueServicio({
  servicio,
  prioridad = false,
}: {
  servicio: Servicio;
  /** Solo la primera franja precarga su imagen. */
  prioridad?: boolean;
}) {
  if (servicio.forma === "telefonos") {
    return <FranjaTelefonos servicio={servicio} />;
  }

  const imagenALaIzquierda = servicio.lado === "izquierda";

  return (
    <article
      id={`servicio-${servicio.id}`}
      aria-labelledby={`titulo-${servicio.id}`}
      className="scroll-mt-28 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-[42px]"
    >
      <Revelar
        className={`lg:col-span-4 ${imagenALaIzquierda ? "lg:order-2" : ""}`}
      >
        <Texto servicio={servicio} />
      </Revelar>

      <Revelar
        demora={80}
        className={`mt-8 lg:col-span-8 lg:mt-0 ${
          imagenALaIzquierda ? "lg:order-1" : ""
        }`}
      >
        <Carrusel
          vistas={servicio.vistas}
          etiqueta={servicio.titulo}
          prioridad={prioridad}
          sizes="(min-width: 1024px) 780px, 92vw"
        />
      </Revelar>
    </article>
  );
}

/**
 * Automatizaciones: los dos telefonos a los costados y el texto en el medio.
 *
 * Rompe el patron a proposito, porque el rubro tambien lo rompe: es el unico
 * que no vive en una pantalla de escritorio. Mostrarlo con la misma ventana de
 * navegador que los otros tres seria mentir sobre donde pasa.
 *
 * Los dos PNG vienen recortados a su contenido (sharp `trim`) y exportados a
 * la misma altura. Sin eso los margenes transparentes de cada archivo eran
 * distintos —88% de ancho util en uno, 76% en el otro— y a igual caja los dos
 * telefonos se veian de tamaños distintos.
 *
 * `flex-wrap` con `order` en vez de dos copias del `<Image>`: en escritorio
 * queda telefono, texto, telefono; en mobile el texto se lleva la fila entera
 * y los dos telefonos caen abajo, uno al lado del otro. Duplicar el markup y
 * esconder una copia con `hidden` hace que el navegador descargue las dos.
 */
function FranjaTelefonos({
  servicio,
}: {
  servicio: Extract<Servicio, { forma: "telefonos" }>;
}) {
  const [izquierdo, derecho] = servicio.telefonos;

  return (
    <article
      id={`servicio-${servicio.id}`}
      aria-labelledby={`titulo-${servicio.id}`}
      className="scroll-mt-28"
    >
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-12 lg:flex-nowrap lg:gap-x-10">
        <Revelar
          demora={120}
          className="order-2 w-[calc(50%-12px)] max-w-[240px] lg:order-1 lg:w-auto lg:max-w-none lg:flex-1"
        >
          <Image
            src={izquierdo.imagen}
            alt={izquierdo.alt}
            sizes="(min-width: 1024px) 320px, 44vw"
            className="ml-auto h-auto w-full lg:max-w-[320px]"
          />
        </Revelar>

        <Revelar className="order-1 w-full text-center lg:order-2 lg:w-auto lg:max-w-[30rem] lg:shrink-0">
          <Texto servicio={servicio} centrado />
        </Revelar>

        <Revelar
          demora={120}
          className="order-3 w-[calc(50%-12px)] max-w-[240px] lg:w-auto lg:max-w-none lg:flex-1"
        >
          <Image
            src={derecho.imagen}
            alt={derecho.alt}
            sizes="(min-width: 1024px) 320px, 44vw"
            className="mr-auto h-auto w-full lg:max-w-[320px]"
          />
        </Revelar>
      </div>
    </article>
  );
}

/** El titulo y la frase. Lo unico que se lee en la franja. */
function Texto({
  servicio,
  centrado = false,
}: {
  servicio: Servicio;
  centrado?: boolean;
}) {
  return (
    <>
      <h3
        id={`titulo-${servicio.id}`}
        className="text-[clamp(1.75rem,3.2vw,2.5rem)]"
      >
        {servicio.titulo}
      </h3>
      <p
        className={`mt-4 text-[15px] leading-relaxed text-text-muted sm:text-base ${
          centrado ? "mx-auto max-w-[52ch]" : "max-w-[40ch]"
        }`}
      >
        {servicio.bajada}
      </p>
    </>
  );
}
