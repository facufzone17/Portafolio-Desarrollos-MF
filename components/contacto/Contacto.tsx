import { Seccion } from "@/components/ui/Seccion";
import { Revelar } from "@/components/ui/Revelar";
import { MensajeWhatsApp } from "./MensajeWhatsApp";
import { Vias } from "./Vias";

/**
 * Contacto: el compositor a un lado, las vias al otro.
 *
 * Antes la seccion era un boton que disparaba wa.me con una frase enlatada y
 * te sacaba del sitio — en escritorio, derecho al QR de WhatsApp Web. Ahora:
 *
 *  - El compositor: escribis el mensaje ACA y recien el boton abre WhatsApp
 *    con tu texto puesto.
 *  - Las vias: WhatsApp (que lleva al compositor, no al chat), mail, Instagram
 *    y telefono, un bloque cada una.
 *
 * EL FORMULARIO SE FUE, y con el su backend entero (Resend, honeypot y limite
 * por IP), por pedido de Facundo el 07/09/2026. Consecuencia que conviene
 * tener presente antes de "mejorar" esta seccion: ya no queda ninguna via que
 * no saque al visitante del sitio. Si alguna vez hace falta, el formulario y
 * su ruta estan enteros en el historial.
 *
 * ACA NO VAN EL NUMERO NI EL MAIL. Estuvieron una version, como una tira
 * debajo de las dos columnas, y en la captura se veia el problema: el pie de
 * pagina dibuja esas dos mismas filas —mismo texto, mismos iconos— 200px mas
 * abajo y en la misma pantalla. Dos veces lo mismo a un palmo de distancia no
 * es redundancia util, es ruido; el pie ya es el lugar de los datos crudos y
 * esta seccion es la de los dos caminos.
 */
export function Contacto() {
  return (
    <Seccion
      id="contacto"
      anchoTitulo="max-w-[40rem]"
      titulo={
        // El salto es a mano: dos renglones, "Contanos qué necesitás" /
        // "y lo armamos". `text-wrap: pretty` saca el `balance` del h2, que si
        // no vuelve a partir el primer renglon para emparejarlo con el segundo.
        <span className="[text-wrap:pretty]">
          Contanos qué necesitás
          <br />
          y lo armamos
        </span>
      }
      // La bajada ya no puede arrancar con "Escribinos por WhatsApp": son dos
      // canales y cada columna anuncia el suyo. Queda la mitad persuasiva.
      bajada="Contestamos el mismo día. Sin compromiso: entendemos tu negocio y te pasamos una propuesta a medida, con precio y plazo."
    >
      {/*
        El corte es en `lg` y no en `md`: a 768px, 2/3 menos el gap deja el
        panel del compositor en unos 380px con 32px de padding adentro, que al
        lado de un formulario de cuatro campos queda apretado. De 768 a 1023
        apila, que a ese ancho se lee mejor. Mismo criterio que
        components/servicios/BloqueServicio.tsx.
      */}
      <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
        {/*
          El compositor va PRIMERO en el DOM y recien se corre a la derecha en
          `lg`. En telefono el traspaso a wa.me es lo mejor que tiene la pagina
          (abre la app con el texto ya puesto), asi que ahi tiene que ser lo
          primero que se ve; el orden visual de escritorio lo pidio Facundo y
          lo resuelve `order`, no una segunda copia del markup.

          Si: dar vuelta el `order` desincroniza el foco del orden visual en
          escritorio, y con teclado se entra primero a la columna derecha. Pasa
          igual porque las dos columnas son alternativas independientes y
          equivalentes, no una secuencia: caer en cualquiera de las dos es un
          lugar coherente. No valdria si una dependiera de la otra.
        */}
        <Revelar className="lg:order-2 lg:flex-[3]">
          <MensajeWhatsApp />
        </Revelar>

        {/*
          La `demora` va en el segundo del DOM y no en la columna izquierda: en
          escritorio las dos cruzan el observer en el mismo cuadro y 100ms de
          una aparicion de 820ms no se ven, pero en mobile cruzan con segundos
          de diferencia y el escalonado tiene que seguir el orden real de
          lectura.

          El encabezado NO puede ser "O por donde prefieras": en escritorio
          esta columna se lee primero, y un "o" que aparece antes de aquello de
          lo que es alternativa esta roto.
        */}
        <Revelar demora={100} className="lg:order-1 lg:flex-[2]">
          <h3 className="text-2xl">Por donde prefieras</h3>

          <p className="mt-3 max-w-[38ch] text-[15px] leading-relaxed text-text-muted">
            Todas llegan al mismo lado. Elegí la que te quede más cómoda.
          </p>

          <div className="mt-6">
            <Vias />
          </div>
        </Revelar>
      </div>
    </Seccion>
  );
}
