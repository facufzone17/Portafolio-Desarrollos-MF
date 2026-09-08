import { lenisActual } from "@/lib/useLenis";

/**
 * Alto de la barra fija mas aire. Es el mismo valor que el `scroll-mt-24` que
 * cada seccion lleva en su clase: Lenis mueve el scroll a mano y NO respeta
 * `scroll-margin-top`, asi que el descuento hay que hacerlo aca tambien. Si
 * cambia el alto del header, cambian los dos.
 */
export const OFFSET_HEADER = 96;

/**
 * Lleva la pagina a una seccion de la home. Devuelve false si el ancla no
 * existe (por ejemplo, si se llama estando en una pagina legal).
 *
 * Va por Lenis y no por `scrollIntoView` ni por el salto nativo del ancla:
 * con Lenis corriendo hay dos cosas escribiendo el mismo numero cuadro a
 * cuadro, y la que pierde deja el scroll a mitad de camino o temblando.
 *
 * `inmediato` es para cuando se llega desde otra pagina: ahi el visitante
 * navego, no scrolleo, y animar cinco mil pixeles seria una espera sin sentido.
 * Dentro de la misma pagina, en cambio, el viaje suave es la respuesta al click.
 */
export function irASeccion(id: string, inmediato = false): boolean {
  const destino = document.getElementById(id);
  if (!destino) return false;

  // El destino se calcula a mano y se le pasa a Lenis un NUMERO, no el nodo.
  // Pasandole el nodo la seccion quedaba 96px mas abajo de lo pedido: Lenis
  // resuelve el elemento por `offsetTop`, que es relativo al `offsetParent` y
  // no al documento. Sumar rect.top al scroll actual da la posicion absoluta
  // siempre, este la pagina donde este y este Lenis a mitad de animacion.
  const y = Math.max(
    0,
    destino.getBoundingClientRect().top + window.scrollY - OFFSET_HEADER,
  );

  const lenis = lenisActual();

  if (lenis) {
    // Lenis cachea el alto scrolleable y solo lo refresca por ResizeObserver,
    // que es asincrono. Recien navegado todavia tiene el limite de la PAGINA
    // ANTERIOR y recorta a ese numero cualquier destino mas abajo: viniendo de
    // una ficha de proyecto (1705px de scroll) a #contacto de la home (11142),
    // la pagina quedaba clavada en 1705. `resize()` lo recalcula en el acto.
    lenis.resize();
    lenis.scrollTo(y, {
      immediate: inmediato,
      duration: inmediato ? 0 : 1.1,
      // El preloader deja a Lenis frenado hasta que termina; si por lo que sea
      // todavia no arranco, `force` igual mueve la pagina.
      force: true,
    });
  } else {
    // Sin Lenis (movimiento reducido) el scroll es el del navegador.
    window.scrollTo({ top: y, behavior: inmediato ? "auto" : "smooth" });
  }

  return true;
}

/** Vuelve arriba de todo, sin animacion. Para despues de navegar. */
export function irArriba() {
  window.scrollTo(0, 0);
  const lenis = lenisActual();
  // Mismo motivo que arriba: sin `resize()`, Lenis sigue interpolando hacia el
  // numero que traia de la pagina anterior y la nueva abre a mitad de camino
  // (o al final, si es mas corta).
  lenis?.resize();
  lenis?.scrollTo(0, { immediate: true, force: true });
}
