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
 * Cuanto tiene que quedarse quieto el cursor encima antes de que la demo tome
 * el control. Corto para que se sienta inmediato, pero suficiente para que
 * pasar el mouse de largo no active nada.
 */
const RETARDO_HOVER_MS = 200;

/**
 * Demo embebida (§4.4).
 *
 * Lo que se mantiene del brief:
 *  - El <iframe> NUNCA se monta al cargar la pagina. Se monta al entrar en
 *    viewport, que es una de las dos opciones que el brief permite.
 *  - Hasta que carga se ve el poster: nunca hay un rectangulo en blanco.
 *  - En celular, iframe a 390px sin escalar dentro de un marco de telefono.
 *
 * Como se resuelve el scroll sin pedir un click:
 *  - Mientras la demo no esta activa, el iframe tiene pointer-events: none, y
 *    la rueda del mouse lo atraviesa: la pagina scrollea normal.
 *  - Se activa cuando el cursor se queda quieto encima. Cualquier scroll de la
 *    pagina cancela y desactiva, asi que pasar scrolleando por arriba nunca
 *    deja la rueda atrapada.
 *  - Al sacar el cursor se desactiva sola. Esa es la salida, y no hace falta
 *    explicarla.
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
  const reloj = useRef<number | null>(null);

  const cancelar = () => {
    if (reloj.current !== null) {
      window.clearTimeout(reloj.current);
      reloj.current = null;
    }
  };

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

  // Si la pagina se mueve, la demo suelta el control.
  useEffect(() => {
    const alScrollear = () => {
      cancelar();
      // Devolver el mismo valor evita el re-render: el listener sale barato.
      setInteractivo((v) => (v ? false : v));
    };
    window.addEventListener("scroll", alScrollear, { passive: true });
    return () => {
      window.removeEventListener("scroll", alScrollear);
      cancelar();
    };
  }, []);

  /**
   * Programa la activacion. Va tanto en pointerenter como en pointermove:
   * pointerenter solo no alcanza, porque si el cursor ya estaba encima cuando
   * el iframe monto (o al cambiar de vista) ese evento no vuelve a dispararse
   * y la demo se quedaria muerta.
   *
   * No reprograma si ya hay una cuenta en marcha: mover el mouse dentro del
   * marco no tiene que reiniciar la espera una y otra vez.
   */
  function programarActivacion(e: React.PointerEvent) {
    // En tactil no hay hover: ahi se activa al tocar.
    if (e.pointerType !== "mouse") return;
    if (interactivo || reloj.current !== null) return;

    reloj.current = window.setTimeout(() => {
      reloj.current = null;
      setInteractivo(true);
    }, RETARDO_HOVER_MS);
  }

  function alSalir() {
    cancelar();
    setInteractivo(false);
  }

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
        className="flex gap-1 self-start rounded-[var(--radius-btn)] border border-line p-1"
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
        onPointerEnter={programarActivacion}
        onPointerMove={programarActivacion}
        onPointerLeave={alSalir}
        onClick={() => setInteractivo(true)}
        className="relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-bg-elev"
      >
        {dispositivo === "escritorio" ? (
          <div className="relative aspect-[16/10] w-full [container-type:inline-size]">
            <div
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

/** Aviso de que la demo se puede navegar. Nunca intercepta el puntero. */
function Cartel({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-0 flex justify-center p-5 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="rounded-full border border-line bg-bg/85 px-4 py-2 text-sm text-text-muted backdrop-blur-sm">
        <span className="hidden [@media(hover:hover)]:inline">
          Pasá el cursor para navegar la demo
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
