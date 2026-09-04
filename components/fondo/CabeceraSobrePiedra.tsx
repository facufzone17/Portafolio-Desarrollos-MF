"use client";

import { useEffect } from "react";

/**
 * Esconde la barra del sitio mientras arriba de todo hay piedra.
 *
 * La barra es crema con desenfoque: sobre el crema de la pagina no se nota,
 * pero apoyada sobre la piedra se convierte en una banda mas clara con una
 * linea abajo, justo en el momento en que la ventana se retrae y hay que mirar
 * otra cosa. Se va, y vuelve sola cuando abajo del borde de arriba de la
 * pantalla vuelve a haber pagina.
 *
 * Como se decide: la zona de piedra se busca por `data-zona-piedra`, y todo lo que la tapa
 * (`data-tapa-piedra`: el panel de la pista, la version apilada) dice si el
 * borde de arriba sigue cubierto. Si la zona llega al borde y no hay nada
 * tapandolo, lo que hay ahi es piedra.
 *
 * No hay estado de React: se escribe un atributo en `<html>` y el fundido lo
 * hace CSS. Un setState por cuadro de scroll seria repintar toda la pagina
 * para cambiar una opacidad.
 */

/**
 * A que altura se pregunta "que hay aca". Unos pocos px debajo del borde de
 * arriba: es el pixel que la barra estaria tapando.
 */
const LINEA = 6;

export function CabeceraSobrePiedra() {
  useEffect(() => {
    const raiz = document.documentElement;
    let pedido = 0;

    const revisar = () => {
      pedido = 0;
      const nodo = document.querySelector("[data-zona-piedra]");
      if (!nodo) return;

      const caja = nodo.getBoundingClientRect();
      const enZona = caja.top <= LINEA && caja.bottom > LINEA;

      const medio = window.innerWidth / 2;
      const tapado = [...document.querySelectorAll("[data-tapa-piedra]")].some(
        (n) => {
          const r = n.getBoundingClientRect();
          return (
            r.top <= LINEA && r.bottom >= LINEA && r.left <= medio && r.right >= medio
          );
        },
      );

      const oculta = enZona && !tapado;
      if ((raiz.dataset.cabecera === "oculta") !== oculta) {
        raiz.dataset.cabecera = oculta ? "oculta" : "visible";
      }
    };

    // Una sola revision por cuadro: el scroll dispara mucho mas seguido que
    // eso y medir cajas obliga al navegador a recalcular layout.
    const alScroll = () => {
      if (!pedido) pedido = requestAnimationFrame(revisar);
    };

    revisar();
    window.addEventListener("scroll", alScroll, { passive: true });
    window.addEventListener("resize", alScroll);
    return () => {
      if (pedido) cancelAnimationFrame(pedido);
      window.removeEventListener("scroll", alScroll);
      window.removeEventListener("resize", alScroll);
      delete raiz.dataset.cabecera;
    };
  }, []);

  return null;
}
