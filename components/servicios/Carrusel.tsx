"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMovimientoReducido } from "@/lib/useMovimientoReducido";
import type { Vista } from "@/lib/servicios";

/**
 * El carrusel de capturas de un rubro.
 *
 * Es una ventana de navegador (barra oscura con los tres puntos y el nombre de
 * lo que se esta mirando) y una flecha en cada extremo, sobre la captura y a
 * media altura, para pasar de imagen.
 *
 * La barra de puntos estilo iOS que estaba apoyada en el filo de abajo se saco
 * por pedido de Facundo (07/09/2026). Con ella se iba tambien el indicador de
 * posicion: hoy no hay nada que diga "vas por la 2 de 3". El nombre en la barra
 * de la ventana es lo unico que cambia, y en mobile ni eso, porque ahi la barra
 * solo muestra los tres puntos.
 *
 * Tres cosas que el reloj de 4 segundos NO hace, y las tres importan:
 *   - no corre si el carrusel no esta en pantalla (son tres en la pagina),
 *   - no corre mientras el mouse esta encima o el foco esta adentro: si no, la
 *     imagen cambia sola justo cuando la persona la estaba mirando,
 *   - no corre con `prefers-reduced-motion`. Ahi ademas el cambio es un corte
 *     seco, sin el deslizamiento lateral.
 *
 * La imagen NO es un link. Antes lo era, y con el carrusel el destino cambia
 * solo cada 4 segundos: un click que lleva a un lugar distinto del que estaba
 * cuando la persona decidio hacerlo es una trampa. Los proyectos se abren
 * desde "Nuestros proyectos", que esta justo arriba y esta hecho para eso.
 */

/** Lo que tarda en pasar sola a la siguiente. */
const INTERVALO = 4000;

/**
 * Cuanto dura el paso segun quien lo pidio. Son dos movimientos distintos:
 *
 *   AUTO   — el carrusel avanza solo cada 4s. Deliberadamente lento (2s,
 *            pedido asi por Facundo el 07/09/2026): es tres veces la duracion
 *            mas larga del sistema (`--duration-state`, 620ms), no es "un
 *            cambio de estado" sino un planeo. Contra el INTERVALO deja la
 *            captura quieta la mitad del tiempo.
 *   MANUAL — la persona toco una flecha o deslizo con el dedo. Un gesto
 *            deliberado espera respuesta, no dos segundos de planeo: aca el
 *            paso es corto y entra en la ventana para la que si sirve la
 *            ease-out del sistema.
 */
const DESLIZAMIENTO_AUTO = 2000;
const DESLIZAMIENTO_MANUAL = 480;

/**
 * La curva de cada uno.
 *
 * AUTO va con una in-out simetrica (la easeInOutCubic de siempre), la unica de
 * la pagina que no es una de las dos del sistema: a la mitad del tiempo va por
 * la mitad del camino y los 2 segundos se perciben enteros. `--ease-out-soft`
 * (0.16, 1, 0.3, 1) ahi no sirve — esta hecha para 200-600ms y sobre 2s a los
 * 500ms ya recorrio el 82%: seria pedir 2 segundos y ver 500ms.
 *
 * MANUAL, en cambio, dura justo esos ~480ms, asi que va con `--ease-out-soft`:
 * sale disparada y frena, que es lo que hace que un click se sienta resuelto.
 */
const CURVA_AUTO = "cubic-bezier(0.65, 0, 0.35, 1)";
const CURVA_MANUAL = "var(--ease-out-soft)";

/** Pixeles de arrastre que cuentan como "pasar de imagen" en tactil. */
const UMBRAL_DESLIZAMIENTO = 44;

export function Carrusel({
  vistas,
  etiqueta,
  prioridad = false,
  sizes,
}: {
  vistas: Vista[];
  /** Nombre del rubro. Solo para lectores de pantalla. */
  etiqueta: string;
  /** Solo el primer carrusel de la pagina precarga su primera captura. */
  prioridad?: boolean;
  sizes: string;
}) {
  const [indice, setIndice] = useState(0);
  // Que movimiento usar en el proximo paso. Lo fija quien llama a `ir`: el
  // reloj de 4s pide "auto" (planeo de 2s), una flecha o un dedo pide "manual"
  // (paso corto). Sin esto, tocar la flecha arrastraba los mismos 2 segundos
  // y el carrusel se sentia trabado.
  const [modo, setModo] = useState<"auto" | "manual">("auto");
  const [detenido, setDetenido] = useState(false);
  const [enPantalla, setEnPantalla] = useState(false);
  const reducido = useMovimientoReducido();
  const marcoRef = useRef<HTMLDivElement>(null);
  const inicioX = useRef<number | null>(null);

  const total = vistas.length;
  const ir = useCallback(
    (n: number, origen: "auto" | "manual" = "manual") => {
      setModo(origen);
      setIndice(((n % total) + total) % total);
    },
    [total],
  );

  // Un observer por carrusel: mientras la franja no esta a la vista el reloj
  // no arranca. Con tres corriendo a la vez en una pestaña de fondo, el
  // navegador los estrangula y al volver saltan varios de golpe.
  useEffect(() => {
    const nodo = marcoRef.current;
    if (!nodo) return;
    const io = new IntersectionObserver(
      ([e]) => setEnPantalla(e.isIntersecting),
      { threshold: 0.35 },
    );
    io.observe(nodo);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reducido || detenido || !enPantalla || total < 2) return;
    const reloj = window.setInterval(() => ir(indice + 1, "auto"), INTERVALO);
    return () => window.clearInterval(reloj);
    // `indice` va en las dependencias a proposito: asi, si alguien toca una
    // flecha, los 4 segundos vuelven a contarse desde ahi y no salta a la
    // siguiente 200ms despues.
  }, [indice, ir, reducido, detenido, enPantalla, total]);

  function alSoltar(x: number) {
    const desde = inicioX.current;
    inicioX.current = null;
    if (desde === null) return;
    const dx = x - desde;
    if (Math.abs(dx) < UMBRAL_DESLIZAMIENTO) return;
    ir(indice + (dx < 0 ? 1 : -1));
  }

  return (
    <div
      ref={marcoRef}
      role="group"
      aria-roledescription="carrusel"
      aria-label={etiqueta}
      // `touch-pan-y` (touch-action: pan-y) es lo que hace posible el
      // deslizamiento con el dedo: sin eso el navegador se queda con el gesto
      // horizontal para hacer scroll, dispara `pointercancel` y el arrastre
      // nunca llega a soltarse. Deja el scroll vertical intacto, que es lo
      // unico que la persona necesita del carrusel para seguir bajando.
      className="relative touch-pan-y overflow-hidden rounded-card border border-line-alto bg-bg-alto"
      onMouseEnter={() => setDetenido(true)}
      onMouseLeave={() => setDetenido(false)}
      onFocus={() => setDetenido(true)}
      onBlur={() => setDetenido(false)}
      onPointerDown={(e) => {
        if (e.pointerType === "mouse") return;
        inicioX.current = e.clientX;
      }}
      onPointerUp={(e) => alSoltar(e.clientX)}
      onPointerCancel={() => {
        inicioX.current = null;
      }}
    >
      {/* Barra de la ventana. Los puntos son decorativos: no son botones. */}
      <div
        aria-hidden
        className="flex h-8 items-center gap-1.5 border-b border-line bg-[#0a0a0c] px-3.5 sm:h-9"
      >
        <span className="size-2 rounded-full bg-white/25" />
        <span className="size-2 rounded-full bg-white/18" />
        <span className="size-2 rounded-full bg-white/12" />
        <span className="ml-3 hidden truncate text-[11px] text-text-muted sm:block">
          {vistas[indice].titulo}
        </span>
      </div>

      {/*
        La pista. Todas las capturas viven en una fila y lo que se mueve es la
        fila entera: es lo que hace que el gesto se lea como "ir para el
        costado" y no como un fundido entre dos fotos.
      */}
      <div className="relative overflow-hidden">
        <div
          className={reducido ? "flex" : "flex transition-transform"}
          style={{
            transform: `translate3d(-${indice * 100}%, 0, 0)`,
            transitionDuration: reducido
              ? undefined
              : `${modo === "auto" ? DESLIZAMIENTO_AUTO : DESLIZAMIENTO_MANUAL}ms`,
            transitionTimingFunction: reducido
              ? undefined
              : modo === "auto"
                ? CURVA_AUTO
                : CURVA_MANUAL,
          }}
        >
          {vistas.map((vista, n) => (
            <div
              key={vista.titulo}
              // Fuera de pantalla no se lee.
              aria-hidden={n !== indice}
              className="relative aspect-[16/9] w-full shrink-0"
            >
              <Image
                src={vista.imagen}
                alt={vista.titulo}
                fill
                sizes={sizes}
                priority={prioridad && n === 0}
                draggable={false}
                className="select-none object-cover object-top"
              />
            </div>
          ))}
        </div>

        {/*
          Las flechas: una en cada extremo, sobre la captura y a media altura
          de la imagen (no del marco entero, que incluye la barra de la
          ventana). Van adentro de la pista para que el centrado sea el de la
          captura y no quede un par de pixeles corrido hacia abajo.
        */}
        {total > 1 && (
          <>
            <BotonFlecha
              hacia="anterior"
              onClick={() => ir(indice - 1)}
              etiqueta={etiqueta}
            />
            <BotonFlecha
              hacia="siguiente"
              onClick={() => ir(indice + 1)}
              etiqueta={etiqueta}
            />
          </>
        )}
      </div>

    </div>
  );
}

/**
 * Una flecha, pegada a su extremo de la captura.
 *
 * Fondo oscuro translucido con desenfoque y no un icono suelto: las capturas
 * son de sitios claros y de paneles oscuros, y una flecha sin chapa atras
 * desaparece encima de la mitad de ellas.
 *
 * El nombre accesible dice de que carrusel es: hay tres en la pagina y
 * "Siguiente" repetido seis veces no le sirve a nadie que navegue por lista
 * de botones.
 */
function BotonFlecha({
  hacia,
  onClick,
  etiqueta,
}: {
  hacia: "anterior" | "siguiente";
  onClick: () => void;
  etiqueta: string;
}) {
  const anterior = hacia === "anterior";
  const Icono = anterior ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${anterior ? "Imagen anterior" : "Imagen siguiente"} de ${etiqueta}`}
      className={`absolute top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-card border border-line-alto bg-[rgba(10,10,12,0.72)] text-text backdrop-blur-md transition-colors duration-[var(--duration-micro)] hover:bg-[rgba(10,10,12,0.92)] sm:size-10 ${
        anterior ? "left-3 sm:left-4" : "right-3 sm:right-4"
      }`}
    >
      <Icono size={18} strokeWidth={1.8} aria-hidden />
    </button>
  );
}
