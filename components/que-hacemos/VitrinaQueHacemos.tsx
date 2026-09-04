"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { items, type Sector } from "@/lib/queHacemos";
import { useMovimientoReducido } from "@/lib/useMovimientoReducido";
import { VentanaDemos } from "./VentanaDemos";

/**
 * "Que hacemos": la ronda de objetos y la ventana de demos.
 *
 * Este componente no dibuja nada en 3D. Solo mantiene que sector esta abierto
 * y le pasa a la escena si tiene que quedarse quieta. three.js entra por
 * `dynamic` con `ssr: false`: es peso que no tiene por que estar en el arranque
 * de la pagina ni correr en el servidor, donde no hay canvas.
 *
 * `ultimo` existe para la animacion de cierre: la ventana necesita seguir
 * mostrando el sector mientras se va, y `abierto` ya volvio a null.
 */

const ALTO = "h-[360px] sm:h-[520px] lg:h-[560px]";

const Escena = dynamic(() => import("./tres/Escena").then((m) => m.Escena), {
  ssr: false,
  loading: () => <div className={ALTO} aria-hidden />,
});

export function VitrinaQueHacemos() {
  const quieto = useMovimientoReducido();
  const [abierto, setAbierto] = useState<Sector | null>(null);
  const [ultimo, setUltimo] = useState<Sector>(items[0].id);

  // useCallback para que la escena no se rearme cuando cambia `abierto`.
  const abrir = useCallback((sector: Sector) => {
    setUltimo(sector);
    setAbierto(sector);
  }, []);
  const cerrar = useCallback(() => setAbierto(null), []);

  return (
    <>
      <Escena quieto={quieto} pausa={abierto !== null} onAbrir={abrir} />

      <VentanaDemos
        item={items.find((i) => i.id === ultimo) ?? items[0]}
        abierto={abierto !== null}
        onCerrar={cerrar}
      />
    </>
  );
}
