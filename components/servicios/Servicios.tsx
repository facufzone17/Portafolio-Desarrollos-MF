"use client";

import { useEffect, useRef, useState } from "react";
import { Revelar } from "@/components/ui/Revelar";
import { servicios } from "@/lib/servicios";
import { BloqueServicio } from "./BloqueServicio";

/**
 * Lo que construimos.
 *
 * Reemplaza a "Que hacemos" (la ronda de objetos 3D, borrada) y tambien
 * reemplaza a su primer reemplazo, que era peor de otra forma: cuatro paneles
 * azules identicos, uno abajo del otro, cada uno con rotulo, numero de orden y
 * lista de viñetas. Cuatro veces el mismo bloque no es un sistema, es una
 * plantilla rellenada cuatro veces.
 *
 * Ahora es el recurso de la referencia (markiqsaas.framer.website): un indice
 * pegajoso a la izquierda que marca donde estas mientras los bloques pasan por
 * el centro y la derecha. El indice hace tres cosas de una: dice cuantas cosas
 * hacemos, dice en cual estas, y deja ir directo a la que interesa.
 *
 * El item activo se decide con un solo IntersectionObserver para los cuatro
 * bloques, no con uno por bloque ni con un listener de scroll.
 */
export function Servicios() {
  const [activo, setActivo] = useState(servicios[0].id);
  const contenedorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodo = contenedorRef.current;
    if (!nodo) return;

    const bloques = [...nodo.querySelectorAll("[data-servicio]")];
    if (!bloques.length) return;

    /**
     * La franja de decision es el tercio de arriba de la pantalla, no el
     * centro: con el centro, el bloque se marca activo recien cuando ya paso
     * medio bloque, y el indice queda siempre un paso atras de lo que se esta
     * mirando.
     */
    const io = new IntersectionObserver(
      (entradas) => {
        const visible = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) {
          setActivo((visible.target as HTMLElement).dataset.servicio ?? activo);
        }
      },
      { rootMargin: "-12% 0px -66% 0px", threshold: 0 },
    );

    bloques.forEach((b) => io.observe(b));
    return () => io.disconnect();
    // `activo` solo se lee como respaldo dentro del callback; volver a armar
    // el observer en cada cambio lo haria disparar de nuevo en cadena.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="servicios" aria-labelledby="titulo-servicios" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Revelar>
          <div className="mx-auto max-w-[46ch] text-center">
            <h2 id="titulo-servicios" className="text-[clamp(2rem,4.6vw,3.5rem)]">
              Cuatro cosas, hechas a medida
            </h2>
            <p className="mx-auto mt-5 max-w-[44ch] text-[15px] leading-relaxed text-text-muted sm:text-base">
              No vendemos plantillas con tu logo encima. Cada una de estas está
              andando hoy en el negocio de alguien.
            </p>
          </div>
        </Revelar>

        <div
          ref={contenedorRef}
          className="mt-16 sm:mt-24 lg:grid lg:grid-cols-12 lg:gap-x-10"
        >
          {/*
            El indice. Solo en escritorio: en mobile una columna pegajosa de
            cuatro items se come media pantalla y no marca nada, porque los
            bloques ocupan el ancho entero igual.
          */}
          <nav
            aria-label="Lo que construimos"
            className="hidden lg:col-span-2 lg:block"
          >
            <ul className="sticky top-28 flex flex-col gap-3.5 pl-[18px]">
              {servicios.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#servicio-${s.id}`}
                    data-indice-item
                    data-activo={activo === s.id ? "" : undefined}
                    className={`block text-sm ${
                      activo === s.id ? "text-text" : "text-text-muted hover:text-text"
                    }`}
                  >
                    {s.titulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-24 sm:gap-32 lg:col-span-10">
            {servicios.map((servicio, i) => (
              <BloqueServicio
                key={servicio.id}
                servicio={servicio}
                prioridad={i === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
