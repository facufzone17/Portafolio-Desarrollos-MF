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
 * Deja la pagina donde va, y lo sigue haciendo hasta que la inercia se apaga.
 *
 * No alcanza con hacerlo una vez: despues de nuestro efecto todavia corren el
 * scroll-a-cero propio de Next y el cuadro siguiente de Lenis, que escribe SU
 * numero. Y no alcanza con un par de cuadros: si el visitante clickea la
 * tarjeta todavia con la rueda planeando, la animacion de Lenis dura hasta
 * 1,2 s y en cada uno de esos cuadros vuelve a mandar el scroll al numero de la
 * home, recortado al alto de la ficha — o sea, al final. Por eso pasaba
 * "aleatoriamente": dependia de si llegabas frenado o en movimiento.
 *
 * Asi que se insiste durante toda esa ventana, cuadro a cuadro, y se corta
 * apenas el visitante scrollea EL: una rueda, un dedo o una tecla de navegacion
 * cancelan todo. Nadie queda peleandole a la pagina.
 */
const VENTANA_INERCIA = 1300;

function insistir(hacer: (primera: boolean) => void): () => void {
  let cancelado = false;
  let cuadro = 0;
  const desde = performance.now();

  const cancelar = () => {
    cancelado = true;
    cancelAnimationFrame(cuadro);
    quitarEscuchas();
  };

  const opciones = { passive: true } as const;
  const teclas = new Set([
    "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ",
  ]);
  const alTeclado = (e: KeyboardEvent) => {
    if (teclas.has(e.key)) cancelar();
  };

  function quitarEscuchas() {
    window.removeEventListener("wheel", cancelar);
    window.removeEventListener("touchstart", cancelar);
    window.removeEventListener("keydown", alTeclado);
  }

  window.addEventListener("wheel", cancelar, opciones);
  window.addEventListener("touchstart", cancelar, opciones);
  window.addEventListener("keydown", alTeclado, opciones);

  let primera = true;

  function paso() {
    if (cancelado) return;
    hacer(primera);
    primera = false;
    if (performance.now() - desde >= VENTANA_INERCIA) {
      quitarEscuchas();
      return;
    }
    cuadro = requestAnimationFrame(paso);
  }

  cuadro = requestAnimationFrame(paso);
  return cancelar;
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

    let cortar = () => {};

    const soltar = alTerminarLaEntrada(() => {
      cortar = insistir((primera) => {
        // `irASeccion` devuelve false si el ancla no esta en esta pagina; ahi
        // vale lo mismo que si no hubiera ancla: arriba de todo.
        if (ancla && irASeccion(ancla, true)) return;
        irArriba(primera);
      });
    });

    return () => {
      soltar();
      cortar();
    };
  }, [pathname]);

  return null;
}
