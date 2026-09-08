"use client";

import Image, { type StaticImageData } from "next/image";
import { Monitor, Smartphone } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Dispositivo = "escritorio" | "mobile";

/** Ancho y alto reales a los que se renderiza la demo en cada vista. */
const ANCHOS: Record<Dispositivo, { w: number; h: number }> = {
  escritorio: { w: 1440, h: 900 },
  // 800 y no 844: los 44px que faltan son la barra de estado del marco, igual
  // que en un telefono real. Si el sitio arrancara en el borde de arriba, la
  // isla dinamica le taparia el header.
  mobile: { w: 390, h: 800 },
};

/** Alto de la barra de estado del marco de telefono. */
const BARRA_ESTADO = 44;

/**
 * Demo embebida (§4.4).
 *
 * Lo que se mantiene del brief:
 *  - El <iframe> NUNCA se monta al cargar la pagina. Se monta al entrar en
 *    viewport, que es una de las dos opciones que el brief permite.
 *  - Hasta que carga se ve el poster: nunca hay un rectangulo en blanco.
 *  - En celular, iframe a 390px sin escalar dentro de un marco de telefono.
 *
 * COMO SE REPARTE EL SCROLL (reescrito el 08/09/2026, pedido de Facundo).
 *
 * Con mouse la regla es una sola y no tiene pasos: **el cursor adentro del
 * recuadro navega la demo, el cursor afuera scrollea la pagina.** Sin esperar,
 * sin clickear y sin tener que estacionar el cursor.
 *
 * La version anterior activaba la demo recien despues de 200ms con el cursor
 * quieto encima, y eso era justo el problema: dependia de como moviera el
 * mouse cada persona, a veces no enganchaba, y obligaba a leer un cartel para
 * entender por que.
 *
 * El unico riesgo de tener el iframe siempre vivo —venir scrolleando fuerte,
 * pasar por encima y que la rueda quede atrapada— ya lo cubre la regla de
 * Lenis que vive en globals.css: mientras la pagina se esta moviendo, los
 * iframes son inertes. Recien cuando el scroll frena la demo toma el control.
 *
 * EN TACTIL NO SE PUEDE HACER LO MISMO: no hay cursor que sacar del recuadro,
 * asi que un iframe siempre vivo se come el gesto y deja la pagina trabada.
 * Ahi sigue habiendo que tocar una vez (`interactivo`), y cualquier scroll de
 * la pagina lo suelta, que es la unica forma de recuperar el dedo.
 *
 * El reparto en si lo hace el CSS por media query (`[data-demo-capa]` en
 * globals.css), no JavaScript: es una decision por dispositivo, no por estado.
 */
export function DemoFrame({
  url,
  poster,
  nombre,
}: {
  url: string;
  poster: StaticImageData;
  nombre: string;
}) {
  const [dispositivo, setDispositivo] = useState<Dispositivo>("escritorio");
  const [montado, setMontado] = useState(false);
  const [cargado, setCargado] = useState(false);
  const [interactivo, setInteractivo] = useState(false);

  const marcoRef = useRef<HTMLDivElement>(null);

  // El iframe se monta al acercarse al viewport, no al cargar la pagina.
  useEffect(() => {
    const nodo = marcoRef.current;
    if (!nodo) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMontado(true);
          io.disconnect();
        }
      },
      { rootMargin: "250px" },
    );
    io.observe(nodo);
    return () => io.disconnect();
  }, []);

  /**
   * En tactil, cualquier scroll de la pagina suelta la demo: una vez que se la
   * activo de un toque, es la unica forma de recuperar el dedo para seguir
   * bajando. En escritorio no cambia nada — ahi el control lo decide el CSS
   * segun donde este el cursor, no este estado.
   */
  useEffect(() => {
    // Devolver el mismo valor evita el re-render: el listener sale barato.
    const alScrollear = () => setInteractivo((v) => (v ? false : v));
    window.addEventListener("scroll", alScrollear, { passive: true });
    return () => window.removeEventListener("scroll", alScrollear);
  }, []);

  function cambiarDispositivo(d: Dispositivo) {
    setDispositivo(d);
    // Al cambiar de vista el iframe se vuelve a montar: hasta que cargue,
    // otra vez el poster.
    setCargado(false);
    setInteractivo(false);
  }

  const { w, h } = ANCHOS[dispositivo];

  const iframe = (
    <iframe
      src={url}
      title={`Demo de ${nombre}`}
      onLoad={() => setCargado(true)}
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      referrerPolicy="no-referrer"
      className="border-0"
      style={{ width: w, height: h }}
    />
  );

  return (
    <div className="flex flex-col gap-4">
      <div
        role="group"
        aria-label="Ver la demo en otro tamaño"
        className="flex gap-1 self-start rounded-[var(--radius-card)] border border-line p-1"
      >
        {(
          [
            { id: "escritorio", label: "Escritorio", icono: Monitor },
            { id: "mobile", label: "Celular", icono: Smartphone },
          ] as const
        ).map((o) => {
          const Icono = o.icono;
          const activo = dispositivo === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => cambiarDispositivo(o.id)}
              aria-pressed={activo}
              className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm
                transition-colors duration-[var(--duration-micro)]
                ${activo ? "bg-text text-bg" : "text-text-muted hover:text-text"}`}
            >
              <Icono className="size-4" aria-hidden />
              {o.label}
            </button>
          );
        })}
      </div>

      <div
        ref={marcoRef}
        data-demo-marco
        // El click solo hace falta en tactil; con mouse el iframe ya esta vivo
        // y este handler no llega a dispararse (un click adentro de un iframe
        // de otro origen no burbujea al documento de afuera).
        onClick={() => setInteractivo(true)}
        className="relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-bg-elev"
      >
        {dispositivo === "escritorio" ? (
          <div className="relative aspect-[16/10] w-full [container-type:inline-size]">
            <div
              data-demo-capa
              className={`absolute top-0 left-1/2 origin-top ${
                interactivo ? "" : "pointer-events-none"
              }`}
              style={{
                width: w,
                height: h,
                transform: `translateX(-50%) scale(min(1, calc(100cqw / ${w}px)))`,
              }}
            >
              {montado && iframe}
            </div>

            <PosterEncima
              poster={poster}
              nombre={nombre}
              oculto={montado && cargado}
            />
          </div>
        ) : (
          <div
            className="flex justify-center px-4 py-8 [container-type:inline-size]"
            // La escala del telefono sale del ancho disponible: entra igual en
            // una columna de escritorio que en una pantalla de 390px.
            style={{
              ["--escala" as string]: "min(0.82, calc((100cqw - 2rem) / 412px))",
            }}
          >
            <div
              className="relative w-[412px]"
              style={{ height: "calc(872px * var(--escala))" }}
            >
              <div
                data-demo-capa
                className={`absolute top-0 left-1/2 -ml-[206px] origin-top ${
                  interactivo ? "" : "pointer-events-none"
                }`}
                style={{ transform: "scale(var(--escala))" }}
              >
                <MarcoTelefono>
                  {montado && iframe}
                  <PosterEncima
                    poster={poster}
                    nombre={nombre}
                    oculto={montado && cargado}
                  />
                </MarcoTelefono>
              </div>
            </div>
          </div>
        )}

        <Cartel visible={!interactivo} />
      </div>
    </div>
  );
}

/** El poster que tapa el iframe hasta que termina de cargar. */
function PosterEncima({
  poster,
  nombre,
  oculto,
}: {
  poster: StaticImageData;
  nombre: string;
  oculto: boolean;
}) {
  return (
    <Image
      src={poster}
      alt={`Vista previa del sitio de ${nombre}`}
      fill
      sizes="(max-width: 1400px) 100vw, 1400px"
      priority
      className={`pointer-events-none object-cover object-top transition-opacity duration-700 ${
        oculto ? "opacity-0" : "opacity-100"
      }`}
    />
  );
}

/**
 * Aviso de que la demo se puede navegar. Nunca intercepta el puntero.
 *
 * Con mouse ya no es una instruccion que haya que obedecer para que la demo
 * funcione —funciona sola— sino la respuesta a "esto de aca, ¿se toca?". Por
 * eso se desvanece apenas el cursor entra al recuadro (regla en globals.css):
 * a esa altura ya estas navegando y el cartel sobra.
 */
function Cartel({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden
      data-demo-aviso
      className={`pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-5 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="rounded-card border border-line bg-bg/85 px-4 py-2 text-sm text-text-muted backdrop-blur-sm">
        <span className="hidden [@media(hover:hover)]:inline">
          Scrolleá acá adentro para navegar la demo
        </span>
        <span className="[@media(hover:hover)]:hidden">
          Tocá para navegar la demo
        </span>
      </span>
    </div>
  );
}

/**
 * Marco de telefono.
 *
 * La demo se ve a 390px reales, sin escalar el contenido: el sitio se comporta
 * como en un celular de verdad, con sus media queries, y se puede navegar. Lo
 * que se escala es el marco entero, para que entre donde haya lugar.
 */
function MarcoTelefono({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-[872px] w-[412px]">
      {/* Botones laterales. Van detras de la carcasa. */}
      <span
        aria-hidden
        className="absolute top-[168px] -left-[3px] h-[64px] w-[3px] rounded-l-sm bg-[#2a2d33]"
      />
      <span
        aria-hidden
        className="absolute top-[248px] -left-[3px] h-[64px] w-[3px] rounded-l-sm bg-[#2a2d33]"
      />
      <span
        aria-hidden
        className="absolute top-[210px] -right-[3px] h-[96px] w-[3px] rounded-r-sm bg-[#2a2d33]"
      />

      {/* Carcasa. */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-[56px] bg-[#101216] shadow-[0_40px_90px_-25px_rgba(0,0,0,0.95)] ring-1 ring-white/15"
      />

      {/* Pantalla: 390x844, el viewport que emula. */}
      <div className="absolute top-[14px] left-[11px] h-[844px] w-[390px] overflow-hidden rounded-[44px] bg-black">
        {/*
          Barra de estado. No es adorno: reserva el espacio de la isla para que
          no se coma el header del sitio embebido.
        */}
        <div
          aria-hidden
          className="relative w-full bg-[#0b0c0f]"
          style={{ height: BARRA_ESTADO }}
        >
          <div className="absolute top-[9px] left-1/2 h-[26px] w-[100px] -translate-x-1/2 rounded-full bg-black" />
        </div>

        <div className="w-full overflow-hidden" style={{ height: 800 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
