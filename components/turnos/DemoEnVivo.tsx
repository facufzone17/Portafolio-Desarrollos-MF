"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight } from "lucide-react";
import { Telefono } from "@/components/turnos/Telefono";

/**
 * La demo en vivo de un plan: el sistema real de Trevoo Turnos con el negocio
 * de ejemplo (Estudio Nacar), adentro del celular.
 *
 * CON MOUSE se monta el iframe y se navega ahi mismo (la regla de
 * `[data-demo-capa]` en globals.css reparte la rueda entre la demo y la
 * pagina). Hasta que la demo avisa que cargo bien (postMessage
 * "trevoo-demo-lista" desde la app; al cargar el iframe se le pregunta por si
 * aviso antes de tiempo) se ve el video del plan. El `load` del
 * iframe no sirve para esto: tambien salta con una pagina de error o si el
 * navegador bloquea el embebido. Si el aviso no llega a tiempo, queda el
 * video: nunca un recuadro vacio ni un error.
 *
 * EN TACTIL una web adentro de otra se ve chica y el scroll se mezcla: ahi va
 * el video con un boton que abre la demo a pantalla completa.
 */

/** Ancho y alto reales de la pantalla que se embebe (los de los clips). */
const PANTALLA = { w: 390, h: 844 };
/** Si en este tiempo no cargo, se queda el video. */
const ESPERA_MS = 10000;

const CON_MOUSE = "(hover: hover) and (pointer: fine)";

function suscribir(alCambiar: () => void) {
  const mq = window.matchMedia(CON_MOUSE);
  mq.addEventListener("change", alCambiar);
  return () => mq.removeEventListener("change", alCambiar);
}

export function DemoEnVivo({
  url,
  video,
  poster,
  etiqueta,
}: {
  url: string;
  video: string;
  poster: string;
  etiqueta: string;
}) {
  // Como useMovimientoReducido: en el servidor no se sabe, y se asume tactil.
  const conMouse = useSyncExternalStore(suscribir, () => window.matchMedia(CON_MOUSE).matches, () => false);
  const [estado, setEstado] = useState<"cargando" | "lista" | "fallo">("cargando");
  const [escala, setEscala] = useState(0.8);
  const pantallaRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // La demo avisa cuando cargo; si no avisa a tiempo, se queda el video.
  useEffect(() => {
    if (!conMouse) return;
    const origen = new URL(url).origin;
    const alAvisar = (e: MessageEvent) => {
      if (e.origin === origen && e.data?.type === "trevoo-demo-lista") setEstado("lista");
    };
    window.addEventListener("message", alAvisar);
    const t = setTimeout(() => setEstado((e) => (e === "cargando" ? "fallo" : e)), ESPERA_MS);
    return () => {
      window.removeEventListener("message", alAvisar);
      clearTimeout(t);
    };
  }, [conMouse, url]);

  // La pantalla de 390 px se achica al ancho del celular dibujado.
  useEffect(() => {
    const nodo = pantallaRef.current;
    if (!nodo) return;
    const ro = new ResizeObserver(([e]) => setEscala(e.contentRect.width / PANTALLA.w));
    ro.observe(nodo);
    return () => ro.disconnect();
  }, [conMouse]);

  const enVivo = conMouse && estado !== "fallo";

  return (
    <div className="relative w-full">
      {enVivo ? (
        <div className="aspect-[390/844] rounded-[2.6rem] border border-line-alto bg-[#0c0c0c] p-[0.55rem] shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
          <div ref={pantallaRef} data-demo-capa className="relative h-full w-full overflow-hidden rounded-[2.1rem] bg-bg-alto">
            <iframe
              ref={iframeRef}
              src={url}
              // Al cargar le pregunta a la demo si esta bien (por si aviso antes de que la escucharamos).
              onLoad={() => iframeRef.current?.contentWindow?.postMessage({ type: "trevoo-demo-hola" }, new URL(url).origin)}
              title={etiqueta}
              referrerPolicy="no-referrer"
              className="absolute top-0 left-0 origin-top-left border-0"
              style={{ width: PANTALLA.w, height: PANTALLA.h, transform: `scale(${escala})` }}
            />
            {/* El video tapa la carga del iframe; se va cuando la demo esta lista. */}
            {estado !== "lista" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
            )}
          </div>
        </div>
      ) : (
        <Telefono video={video} poster={poster} etiqueta={etiqueta} prioridad />
      )}

      {!conMouse && (
        <a
          href={url}
          target="_blank"
          rel="noopener"
          data-analytics="turnos-demo-en-vivo"
          className="absolute bottom-6 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-white px-5 py-3 text-[15px] font-medium whitespace-nowrap text-[#0c0c0c] shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
        >
          Probá la demo en vivo
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      )}
    </div>
  );
}
