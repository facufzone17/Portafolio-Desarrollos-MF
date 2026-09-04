"use client";

import { useEffect, useRef, useState } from "react";
import { etapas } from "@/lib/comoTrabajamos";
import { useMovimientoReducido } from "@/lib/useMovimientoReducido";

/**
 * Camino que avanza con el scroll (§4.5).
 *
 * ⚠️ El scroll es SIEMPRE el del navegador. Esta animacion solo *lee* el
 * progreso de la seccion; no lo secuestra, no pinea nada y no hay scroll
 * jacking. Es una regla dura del brief.
 *
 * El progreso se escribe en una custom property y el trazo se dibuja con
 * stroke-dashoffset. No hay re-render de React por frame: eso mantiene el INP
 * bajo, que es uno de los numeros que el brief exige medir.
 *
 * Mobile: el serpenteo horizontal no entra en 390px. Ahi el camino es vertical
 * y las tarjetas van apiladas. Es otro layout, no el mismo encogido.
 */
export function Camino() {
  const reducirMovimiento = useMovimientoReducido();
  const contenedorRef = useRef<HTMLDivElement>(null);
  const trazoRef = useRef<SVGPathElement>(null);

  const [medida, setMedida] = useState({ w: 0, h: 0 });
  const [esEscritorio, setEsEscritorio] = useState(false);
  /** Cuantas etapas ya alcanzo la linea. */
  const [encendidas, setEncendidas] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const alCambiar = () => setEsEscritorio(mq.matches);
    alCambiar();
    mq.addEventListener("change", alCambiar);
    return () => mq.removeEventListener("change", alCambiar);
  }, []);

  useEffect(() => {
    const nodo = contenedorRef.current;
    if (!nodo) return;
    const ro = new ResizeObserver(([e]) =>
      setMedida({
        w: Math.round(e.contentRect.width),
        h: Math.round(e.contentRect.height),
      }),
    );
    ro.observe(nodo);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const nodo = contenedorRef.current;
    const trazo = trazoRef.current;
    if (!nodo || !trazo) return;

    if (reducirMovimiento) {
      // Camino dibujado entero. Las tarjetas se encienden por render, no por
      // estado: no hace falta tocar setState desde el efecto.
      trazo.style.strokeDashoffset = "0";
      return;
    }

    const largo = trazo.getTotalLength();
    trazo.style.strokeDasharray = `${largo}`;
    trazo.style.strokeDashoffset = `${largo}`;

    let pendiente = false;
    function alScrollear() {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => {
        pendiente = false;
        if (!nodo || !trazo) return;
        const r = nodo.getBoundingClientRect();
        // 0 cuando la seccion asoma por abajo, 1 cuando termina de pasar.
        const total = r.height + window.innerHeight * 0.5;
        const avance = (window.innerHeight * 0.85 - r.top) / total;
        const p = Math.min(1, Math.max(0, avance));
        trazo.style.strokeDashoffset = `${largo * (1 - p)}`;
        setEncendidas(Math.round(p * etapas.length + 0.35));
      });
    }

    alScrollear();
    window.addEventListener("scroll", alScrollear, { passive: true });
    window.addEventListener("resize", alScrollear);
    return () => {
      window.removeEventListener("scroll", alScrollear);
      window.removeEventListener("resize", alScrollear);
    };
  }, [reducirMovimiento, medida]);

  /** El camino: serpentea en escritorio, baja recto en mobile. */
  function construirTrazo(w: number, h: number): string {
    if (!w || !h) return "";
    const paso = h / etapas.length;

    if (!esEscritorio) {
      const x = 20;
      return `M ${x} 0 L ${x} ${h}`;
    }

    const centro = w / 2;
    const vuelo = Math.min(w * 0.2, 190);
    let d = `M ${centro} 0`;
    for (let i = 0; i < etapas.length; i++) {
      const y0 = paso * i;
      const y1 = paso * (i + 1);
      const lado = i % 2 === 0 ? 1 : -1;
      d += ` C ${centro + vuelo * lado} ${y0 + paso * 0.3}, ${centro + vuelo * lado} ${y1 - paso * 0.3}, ${centro} ${y1}`;
    }
    return d;
  }

  return (
    <div ref={contenedorRef} className="relative">
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
        viewBox={`0 0 ${medida.w || 1} ${medida.h || 1}`}
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Camino apagado, siempre visible: da la forma completa de entrada. */}
        <path
          d={construirTrazo(medida.w, medida.h)}
          stroke="var(--color-line)"
          strokeWidth={2}
        />
        {/* Camino encendido, se dibuja con el scroll. */}
        <path
          ref={trazoRef}
          d={construirTrazo(medida.w, medida.h)}
          stroke="var(--color-brand-soft)"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </svg>

      <ol className="relative flex flex-col gap-10 md:gap-16">
        {etapas.map((etapa, i) => {
          const encendida = reducirMovimiento || i < encendidas;
          return (
            <li
              key={etapa.numero}
              className={`flex md:w-[calc(50%-3rem)] ${
                i % 2 === 0 ? "md:self-start" : "md:self-end"
              }`}
            >
              <div
                className={`ml-12 rounded-[var(--radius-card)] border bg-bg-elev p-6 transition-all duration-500 ease-out md:ml-0 sm:p-8
                  ${
                    encendida
                      ? "border-brand-soft/40 opacity-100 shadow-[0_0_60px_-15px] shadow-brand-soft/25"
                      : "border-line opacity-45"
                  }`}
              >
                <span className="text-sm text-brand-soft">{etapa.numero}</span>
                <h3 className="mt-2 text-2xl">{etapa.titulo}</h3>
                <p className="mt-3 text-[17px] font-light text-text-muted">
                  {etapa.texto}
                </p>
                <p className="mt-4 border-t border-line pt-4 text-sm text-text-muted">
                  <span className="text-text">Qué necesitamos de vos: </span>
                  {etapa.necesitamos}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
