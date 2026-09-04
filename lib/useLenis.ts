"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useMovimientoReducido } from "@/lib/useMovimientoReducido";

/**
 * La instancia viva, tambien a nivel de modulo.
 *
 * El ref que devuelve el hook solo sirve adentro del arbol de React, y quien
 * necesita frenar el scroll no siempre esta ahi: la pantalla de entrada
 * (components/intro/Intro.tsx) tiene que llamar a stop() sin ser hija de
 * SmoothScroll ni recibirlo por props. Es un unico Lenis en toda la app, asi
 * que una variable de modulo alcanza y evita un contexto para dos llamadas.
 */
let instancia: Lenis | null = null;

/** El Lenis que esta corriendo, o null si no monto (o hay movimiento reducido). */
export function lenisActual(): Lenis | null {
  return instancia;
}

/**
 * Scroll con inercia tipo iOS: la rueda ya no avanza en pasos, frena
 * "a la deriva" en vez de cortar en seco. Lenis reemplaza el scroll nativo
 * por uno interpolado cuadro a cuadro.
 *
 * OJO: esto es exactamente lo que el §3.5 del brief prohibe ("el scroll
 * siempre es el del navegador, nada de scroll-jacking" — ver globals.css).
 * Se implementa igual por pedido explicito, pero la regla del brief quedo
 * contradicha y alguien tiene que decidir conscientemente cual gana.
 *
 * Se apaga entero con prefers-reduced-motion: el drift es movimiento, y quien
 * pidio menos movimiento tiene que seguir con scroll nativo instantaneo, no
 * una version mas lenta de lo mismo (misma logica que useMovimientoReducido
 * en el humo del hero y en PalabraRotativa).
 *
 * El RAF es manual, no gsap.ticker: el proyecto no tiene GSAP instalado, y
 * sumarlo solo para esto seria una dependencia nueva sin necesidad.
 */
export function useLenis() {
  const reducirMovimiento = useMovimientoReducido();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reducirMovimiento) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    instancia = lenis;

    let raf = 0;
    function frame(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
      instancia = null;
    };
  }, [reducirMovimiento]);

  return lenisRef;
}
