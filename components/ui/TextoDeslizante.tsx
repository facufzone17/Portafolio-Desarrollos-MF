/**
 * Text roll con efecto de ola: al pasar el cursor, las letras suben una
 * despues de otra y en su lugar aparece una copia identica.
 *
 * Copiado de la referencia (applio.framer.website), leyendo su CSS y midiendo
 * la trayectoria letra por letra. Dos cosas que no se adivinan mirando:
 *
 * 1. LA COPIA DE ABAJO NO EXISTE EN EL DOM. Es una `text-shadow` solida
 *    desplazada exactamente una altura de renglon:
 *    `text-shadow: 0 1.2em 0 currentColor`. La referencia dibuja 12 spans para
 *    "Testimonials", uno por letra, no 24. Cuando la letra sube un renglon,
 *    su propia sombra queda justo donde estaba la letra. Sale gratis, no se
 *    puede desincronizar y no le agrega texto duplicado al lector de pantalla.
 *
 * 2. LA CURVA ARRANCA LENTA. Medido sobre la referencia, la primera letra va
 *    por el 5,7% del recorrido a los 50ms y recien por el 41% a los 100ms. Ese
 *    arranque contenido es lo que deja ver el escalonado: con una curva
 *    front-loaded (la `ease-out-soft` del resto del sitio) todas las letras
 *    salen disparadas juntas y la ola no se ve, que es exactamente como quedo
 *    el primer intento.
 *
 * Las letras van dentro de un contenedor `aria-hidden` y el nombre accesible
 * lo pone un texto invisible aparte: cada letra en su propio elemento puede
 * hacer que un lector de pantalla deletree la palabra.
 */

/**
 * Retardo entre letra y letra.
 *
 * Medido en la referencia: a los 100ms la letra 1 va por -7,9px y la letra 9
 * recien por -1,1px, que es donde estaba la letra 1 a los 50ms. Cincuenta
 * milisegundos de diferencia repartidos en ocho letras.
 */
const PASO_MS = 6.5;

export function TextoDeslizante({ children }: { children: string }) {
  return (
    <span data-roll>
      <span aria-hidden data-roll-letras>
        {[...children].map((letra, i) => (
          <span key={i} style={{ transitionDelay: `${(i * PASO_MS).toFixed(1)}ms` }}>
            {/* `white-space: pre` en el CSS mantiene los espacios: sin eso,
                una etiqueta de dos palabras queda pegada. */}
            {letra}
          </span>
        ))}
      </span>
      <span className="sr-only">{children}</span>
    </span>
  );
}
