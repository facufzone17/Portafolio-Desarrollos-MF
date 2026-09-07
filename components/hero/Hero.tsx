"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Isotipo } from "@/components/ui/Isotipo";
import { TextoDeslizante } from "@/components/ui/TextoDeslizante";
import { mensajes, whatsappUrl } from "@/lib/site";
import { PalabraRotativa } from "./PalabraRotativa";
import consorcios from "@/assets/dispositivos/consorcios.png";
import tienda from "@/assets/dispositivos/tienda.png";

/**
 * Hero, reconstruido sobre la referencia (applio.framer.website) medida en
 * vivo a 1440x900.
 *
 * EL EFECTO DE SCROLL SON TRES CAPAS A DISTINTA VELOCIDAD, no dos. Medido
 * siguiendo cada elemento cada 200px de scroll:
 *
 *   capa            avanza    velocidad
 *   imagen          200px     1,0x   (normal, sin transform)
 *   texto y botones 140px     0,7x   <- se queda atras
 *   telefonos       180px     0,9x
 *
 * La clave es que el TEXTO se rezaga mas que los telefonos. Los dos suben mas
 * lento que la pagina, pero el texto sube todavia mas lento, asi que los
 * telefonos lo alcanzan y lo tapan. Con el texto a velocidad normal (que es
 * como estaba antes) los telefonos nunca lo alcanzan y el efecto no existe.
 *
 * El momento que cierra el gesto: a 600px de scroll los botones quedan a 92px
 * del borde de arriba, que es exactamente el alto de la barra de navegacion
 * (91px), y para entonces los telefonos ya estan encima.
 *
 * Otras medidas de la referencia:
 *   caja de la imagen   12px de margen en los cuatro lados, radio 10px
 *   superposicion       dos tercios de un telefono
 *
 * Dos cosas se apartan de la referencia por pedido de Facundo: el hero es mas
 * largo (100svh+420 contra 100svh+205) y los telefonos arrancan mas abajo y
 * son mas grandes.
 *
 * CUANTO TAPAN LOS TELEFONOS A LOS BOTONES no se ajusta a ojo, se calcula. El
 * momento critico es cuando los botones llegan al pie de la barra (91px), que
 * pasa a los S = (btnTop0 - 91) / 0,7 pixeles de scroll. Ahi:
 *
 *   hueco = (telTop0 - btnTop0) - 0,2857 x (btnTop0 - 91)
 *
 * Negativo = el telefono esta por encima del boton, o sea lo tapa.
 *
 * Pero el numero que de verdad importa es CUANTO DURA la cobertura, no
 * cuanto tapa al final: la cobertura arranca a los (telTop0 - btnTop0) / 0,2
 * pixeles de scroll y termina cuando los botones se meten atras de la barra.
 * En la referencia esa ventana dura 176px de scroll, que es lo que la hace
 * perceptible.
 *
 * Lo que se probó: al 66% los botones quedaban tapados demasiado tiempo; al
 * 72% la ventana bajaba a 9px y el cruce no se veia nunca; al 70,5% daba 74.
 * Al 69% queda cerca de la referencia: se ve el cruce, y como termina cuando
 * los botones se meten atras de la barra, nunca quedan tapados del todo.
 *
 * La palabra que rota debajo de "Desarrollando" se conserva intacta.
 */

/**
 * Cuanto se queda atras cada capa, en fraccion del scroll.
 *
 * Son 1 menos la velocidad medida: el texto avanza al 0,7 asi que se rezaga
 * 0,3, y los telefonos al 0,9 asi que se rezagan 0,1. La diferencia entre los
 * dos (0,2) es la velocidad con la que los aparatos se comen el texto.
 */
const REZAGO_TEXTO = 0.35;
const REZAGO_TELEFONOS = 0.1;

/** Retardos de la entrada, en ms. Se pisan a proposito: no son una fila. */
const RETARDO = {
  marca: 0,
  titulo: 130,
  botones: 300,
  dispositivos: 440,
} as const;

export function Hero() {
  // El scroll de la pagina entera: el efecto arranca desde el primer pixel,
  // no cuando la seccion entra en cuadro (ya esta en cuadro al cargar).
  const { scrollY } = useScroll();
  const yTexto = useTransform(scrollY, (v) => v * REZAGO_TEXTO);
  const yTelefonos = useTransform(scrollY, (v) => v * REZAGO_TELEFONOS);

  return (
    <section className="relative">
      {/*
        El margen de 12px. Es lo que hace que la imagen se lea como una placa
        apoyada sobre la pagina y no como un fondo pegado al borde del
        navegador. `overflow-clip` recorta los telefonos por abajo y el texto
        cuando termina de irse por arriba.
      */}
      <div className="p-3">
        <div className="relative h-[calc(100svh+420px)] overflow-clip rounded-[10px]">
          <Image
            src="/images/hero-bg.jpg"
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          {/*
            El velo. El fondo es muy claro en el centro, justo donde cae el
            titular: sin esto, texto blanco sobre esa zona da menos de 2:1.
          */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,6,16,0.78)_0%,rgba(4,6,16,0.55)_34%,rgba(4,6,16,0.3)_58%,rgba(4,6,16,0.68)_100%)]"
          />

          {/* Capa del texto: se rezaga 0,3 del scroll. */}
          <motion.div
            style={{ y: yTexto }}
            className="relative flex flex-col items-center px-5 pt-[clamp(132px,23svh,232px)] text-center sm:px-8"
          >
            <div
              data-hero-entra
              style={{ "--hero-retardo": `${RETARDO.marca}ms` } as React.CSSProperties}
              className="grid size-12 place-items-center rounded-card bg-white text-bg shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]"
            >
              <Isotipo className="h-5 w-auto" />
            </div>

            <h1
              data-hero-entra
              style={{ "--hero-retardo": `${RETARDO.titulo}ms` } as React.CSSProperties}
              className="mt-8 text-[clamp(2.05rem,8.2vw,6rem)] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]"
            >
              {/* Texto estable para lectores de pantalla. */}
              <span className="sr-only">
                Desarrollando sitios web, tiendas, automatizaciones y paneles
                de gestión para negocios.
              </span>
              <span aria-hidden className="block">
                <span className="block text-white/55">Desarrollando</span>
                <PalabraRotativa />
              </span>
            </h1>

            {/*
              Los botones van en el lugar que ocupaba la bajada, que se saco
              por pedido de Facundo. El hero queda con tres elementos: marca,
              titular y accion.
            */}
            <div
              data-hero-entra
              style={{ "--hero-retardo": `${RETARDO.botones}ms` } as React.CSSProperties}
              className="mt-8 flex flex-wrap items-center justify-center gap-2.5"
            >
              <Link href="#proyectos" data-boton="oscuro" className="group">
                <TextoDeslizante>Proyectos</TextoDeslizante>
              </Link>
              <a
                href={whatsappUrl(mensajes.general)}
                target="_blank"
                rel="noopener noreferrer"
                data-boton="claro"
                className="group"
              >
                <TextoDeslizante>Contactanos</TextoDeslizante>
              </a>
            </div>
          </motion.div>

          {/*
            Capa de los telefonos: se rezaga 0,1, o sea que sube MAS RAPIDO que
            el texto y termina tapandolo.

            Anchos distintos a proposito: los dos mockups vienen con encuadres
            distintos (0,687 y 0,594 de proporcion), asi que a igual ancho un
            telefono se veria mas largo que el otro. Con 43% y 37,2% los dos
            terminan con la misma altura y con el ancho de la referencia:
            600px sobre un contenedor de 1401.

            Las posiciones salen de resolver dos condiciones a la vez: que el
            conjunto quede centrado y que se superpongan como en la referencia.
          */}
          {/*
            El parallax y la entrada van en DOS elementos y no en uno.

            Los dos quieren escribir `transform`, y una animacion CSS con
            `fill-mode: both` (que es lo que hace `hero-entrada`) le gana al
            estilo inline que escribe framer-motion. Con las dos cosas en el
            mismo nodo, la animacion de entrada deja `transform: none` fijo al
            terminar y el parallax deja de existir en silencio: los telefonos
            se mueven a la velocidad de la pagina y el efecto no se ve.

            Afuera el parallax (inline), adentro la entrada (CSS).
          */}
          <motion.div
            style={{ y: yTelefonos }}
            className="pointer-events-none absolute inset-x-0 top-[72svh]"
            aria-hidden
          >
            <div
              data-hero-entra
              style={
                { "--hero-retardo": `${RETARDO.dispositivos}ms` } as React.CSSProperties
              }
            >
              {/*
                Sin `drop-shadow`: los dos PNG traen el fondo recortado al ras
                del contenido (la sombra propia del mockup llega hasta el borde
                del archivo), asi que un `filter: drop-shadow` dibujaba la sombra
                de ese rectangulo y se veia un recuadro alrededor de cada
                telefono. Los mockups ya traen su sombra pintada; alcanza.
              */}
              <div className="relative mx-auto h-0 w-full max-w-[1400px]">
                <Image
                  src={consorcios}
                  alt=""
                  sizes="(min-width: 1024px) 602px, 48vw"
                  className="absolute left-[21.45%] w-[43%] rotate-[-5deg]"
                />
                <Image
                  src={tienda}
                  alt=""
                  sizes="(min-width: 1024px) 521px, 42vw"
                  className="absolute left-[41.35%] w-[37.2%] rotate-[5deg]"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
