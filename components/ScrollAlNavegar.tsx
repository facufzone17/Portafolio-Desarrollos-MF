"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { irASeccion, irArriba } from "@/lib/irASeccion";

/**
 * Deja la pagina en el lugar correcto despues de cada navegacion de cliente.
 *
 * Arregla dos cosas que se veian como bugs distintos y son la misma causa:
 * **Lenis se queda con la posicion de scroll de la pagina anterior.**
 *
 * 1. ABRIR UN PROYECTO Y CAER AL FINAL. Next hace su `scrollTo(0, 0)` al
 *    navegar, pero Lenis interpola el scroll a mano cuadro a cuadro y en el
 *    frame siguiente vuelve a escribir SU numero, que sigue siendo el de la
 *    home (la grilla de proyectos esta a varios miles de px). La ficha del
 *    proyecto es mucho mas corta, asi que ese numero se recorta al maximo
 *    posible: el final de la pagina. Por eso pasaba con "Inmobiliaria", que es
 *    de las que se tocan estando mas abajo.
 *
 * 2. LOS LINKS DE LA BARRA DESDE UNA PAGINA LEGAL. Ahi el ancla ni siquiera
 *    existe en el documento, asi que ahora el link navega a `/#seccion` y el
 *    scroll lo hace este componente cuando la home ya monto.
 *
 * NO toca la primera carga: ahi manda el navegador —si la URL trae ancla, la
 * resuelve el— y ademas esta el preloader, que hace su propio `scrollTo(0)` al
 * cerrar. Tironear en ese momento seria pelearle.
 */

/**
 * El preloader termina con un `scrollTo(0)` propio y recien ahi marca
 * `preloader-visto` en <html>. Si scrolleamos antes, nos lo pisa; hay que
 * esperar esa marca. Cuando la pagina no tiene preloader (legales, fichas de
 * proyecto, o movimiento reducido) el nodo no existe y se puede ir de una.
 */
function alTerminarLaEntrada(hacer: () => void): () => void {
  const html = document.documentElement;

  const listo = () =>
    html.classList.contains("preloader-visto") ||
    !document.querySelector("[data-preloader]");

  if (listo()) {
    hacer();
    return () => {};
  }

  const observador = new MutationObserver(() => {
    if (!listo()) return;
    observador.disconnect();
    // Un cuadro de aire: el `scrollTo(0)` del preloader corre en el mismo
    // tick en el que pone la clase.
    requestAnimationFrame(hacer);
  });

  observador.observe(html, { attributes: true, attributeFilter: ["class"] });
  return () => observador.disconnect();
}

/**
 * Deja la pagina donde va, y lo vuelve a hacer un par de veces.
 *
 * No alcanza con hacerlo una vez: despues de nuestro efecto todavia corren el
 * scroll-a-cero propio de Next y el cuadro siguiente de Lenis, que escribe SU
 * numero. Cuando el preloader corre esto no se nota (llegamos 3,6s tarde, solos
 * en la cancha), pero al volver a la home sin entrada —desde una ficha, por
 * ejemplo— el scroll se perdia entero. Insistir es mas barato y mas robusto
 * que adivinar el orden exacto de esos tres.
 */
function insistir(hacer: () => void) {
  requestAnimationFrame(() => {
    hacer();
    requestAnimationFrame(hacer);
    setTimeout(hacer, 140);
  });
}

export function ScrollAlNavegar() {
  const pathname = usePathname();
  const primeraCarga = useRef(true);

  useEffect(() => {
    if (primeraCarga.current) {
      primeraCarga.current = false;
      return;
    }

    const ancla = window.location.hash.slice(1);

    return alTerminarLaEntrada(() =>
      insistir(() => {
        // `irASeccion` devuelve false si el ancla no esta en esta pagina; ahi
        // vale lo mismo que si no hubiera ancla: arriba de todo.
        if (ancla && irASeccion(ancla, true)) return;
        irArriba();
      }),
    );
  }, [pathname]);

  return null;
}
