"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Item } from "@/lib/queHacemos";

/**
 * La ventana grande: las tarjetas que el objeto lleva adentro, abiertas.
 *
 * Va sobre `<dialog>` nativo y no sobre un div con `position: fixed`: el
 * elemento del navegador ya trae la capa superior, el foco atrapado, el cierre
 * con Escape y el fondo inerte. Reescribir eso a mano es como se rompen los
 * modales.
 *
 * El componente no guarda estado propio. `item` es siempre el ultimo sector
 * abierto (nunca vuelve a null) y `abierto` dice si se muestra: asi el
 * contenido sigue dibujado mientras la ventana se va, sin temporizadores. La
 * animacion de entrada y de salida vive en `.ventana-demos`, en globals.css.
 */
export function VentanaDemos({
  item,
  abierto,
  onCerrar,
}: {
  item: Item;
  abierto: boolean;
  onCerrar: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="titulo-demos"
      onClose={onCerrar}
      onClick={(e) => {
        // Clic en el fondo: el `dialog` ocupa toda la pantalla, y solo el
        // fondo es el propio elemento. Lo de adentro es el panel.
        if (e.target === ref.current) onCerrar();
      }}
      className="ventana-demos m-auto max-h-[86vh] w-[min(1100px,92vw)]
        overflow-hidden rounded-card bg-bg p-0 text-text
        shadow-[0_40px_120px_rgba(23,19,15,0.28)]"
    >
      <div className="flex max-h-[86vh] flex-col">
        <header className="flex items-center justify-between gap-6 border-b border-line px-6 py-5 sm:px-8">
          <h2 id="titulo-demos" className="text-2xl sm:text-3xl">
            {item.etiqueta}
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            className="cursor-pointer rounded-btn border border-line px-4 py-2
              text-sm text-text-muted transition-colors duration-200
              hover:border-brand-soft hover:text-text active:scale-[0.98]"
          >
            Cerrar
          </button>
        </header>

        {/*
          Dos columnas y no tres: las capturas son apaisadas (8:5, la version
          de escritorio, que es la que mejor se ve) y a tres por fila
          quedarian del tamaño de una estampilla. Con dos se puede leer el
          sitio.
        */}
        <div className="sin-scrollbar grid gap-5 overflow-y-auto px-6 py-6 sm:grid-cols-2 sm:px-8 sm:py-8">
          {item.demos.map((demo) => (
            <figure key={demo.numero} className="m-0">
              <div
                // El tope de alto es lo que hace que las tres entren sin
                // scrollear en una pantalla baja: la proporcion manda mientras
                // haya lugar, y cuando no lo hay recorta un poco mas en vez de
                // empujar la tercera fuera de la ventana.
                className={`relative grid aspect-[8/5] max-h-[30vh]
                  place-items-center overflow-hidden rounded-card border
                  border-line bg-bg-elev ${demo.src ? "" : "border-dashed"}`}
              >
                {demo.src ? (
                  <Image
                    src={demo.src}
                    alt={demo.titulo ?? `Demo ${demo.numero}`}
                    fill
                    sizes="(min-width: 640px) 50vw, 92vw"
                    className="object-cover"
                  />
                ) : (
                  <span className="text-sm text-text-muted">
                    Imagen {demo.numero}
                  </span>
                )}
              </div>

              {/* Sin titulo no va epigrafe: repetiria el "Imagen N" que ya
                  esta dibujado dentro del hueco. */}
              {(demo.titulo || demo.url) && (
                <figcaption className="mt-3 text-sm text-text-muted">
                  {demo.titulo}
                  {demo.url && (
                    <>
                      {" "}
                      <a
                        href={demo.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-soft underline underline-offset-4"
                      >
                        Ver demo
                      </a>
                    </>
                  )}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </dialog>
  );
}
