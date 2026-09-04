import { CabeceraSobrePiedra } from "./CabeceraSobrePiedra";
import { FondoPiedra } from "./FondoPiedra";

/**
 * El tramo de la pagina que apoya sobre piedra: la transicion que sale de
 * "Nuestros proyectos" y toda la seccion "Que hacemos".
 *
 * El fondo es un solo canvas `sticky` del alto de la pantalla, no uno por
 * seccion: asi las curvas de nivel son continuas de punta a punta y no se ve
 * la junta entre la transicion y lo que viene despues.
 *
 * Va detras de todo (`-z-10`). Lo que lo tapa mientras todavia no tiene que
 * verse es el panel crema de la vitrina de proyectos, que ocupa la pantalla
 * entera hasta que se retrae.
 */
export function ZonaPiedra({ children }: { children: React.ReactNode }) {
  return (
    <div data-zona-piedra className="relative isolate">
      <div className="absolute inset-0 -z-10">
        <FondoPiedra className="sticky top-0 h-screen w-full" />
        {/*
          La salida. Abajo de la zona vuelve el crema ("Como trabajamos"), y el
          corte a filo entre piedra y crema se lee como un error de maquetado.
          Este degradado apaga la piedra en los ultimos 200px de la zona.
        */}
        <div className="absolute inset-x-0 bottom-0 h-[200px] bg-gradient-to-b from-transparent to-bg" />
      </div>

      {/* Sin marcado propio: solo apaga la barra del sitio mientras hay piedra. */}
      <CabeceraSobrePiedra />

      {children}
    </div>
  );
}
