"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, Bell, Check, MessageCircle } from "lucide-react";
import { TextoDeslizante } from "@/components/ui/TextoDeslizante";
import { EVENTO_NEGOCIO, type DatosNegocio } from "@/components/turnos/IrA";
import { irASeccion } from "@/lib/irASeccion";
import { useMovimientoReducido } from "@/lib/useMovimientoReducido";

/**
 * El corazon del hero de /turnos: el visitante escribe el nombre de su
 * negocio, elige el rubro y al lado ve SU pagina de reservas, que ademas se
 * puede usar: elegir servicio y horario, dejar los datos y ver el turno
 * confirmado (con el aviso que le llega al dueño). Es la version instantanea
 * de la demo personalizada que ofrece la pagina.
 *
 * Mientras nadie toca nada, el placeholder del campo se tipea solo con
 * negocios de ejemplo y la vista previa los sigue: el hero tiene movimiento y
 * se entiende que ahi se escribe. Va en el placeholder y no en el valor para
 * que el campo siga vacio de verdad. Apenas el visitante toca algo, el
 * ejemplo se frena para no pisarle lo que esta probando. Con movimiento
 * reducido no se tipea nada.
 *
 * El boton baja al formulario y le pasa el nombre y el rubro (EVENTO_NEGOCIO),
 * asi no hay que escribirlos dos veces. Nada sale del navegador hasta que el
 * visitante envia el formulario.
 *
 * La pagina del celular imita la de las demos (crema, marron segun el rubro):
 * los tamaños de letra chicos son los de esa interfaz en miniatura, no los
 * del sitio.
 */

type Rubro = {
  id: string;
  /** Lo que dice la ficha. */
  nombre: string;
  /** La opcion equivalente en el select del formulario. */
  enFormulario: string;
  color: string;
  servicios: [nombre: string, precio: number, duracion: string][];
};

const RUBROS: Rubro[] = [
  {
    id: "peluqueria",
    nombre: "Peluquería",
    enFormulario: "Peluquería o barbería",
    color: "#7a5634",
    servicios: [
      ["Corte", 9000, "30 min"],
      ["Corte y barba", 12000, "45 min"],
      ["Color", 28000, "1 h 30"],
    ],
  },
  {
    id: "unas",
    nombre: "Uñas",
    enFormulario: "Uñas o pestañas",
    color: "#a24a6b",
    servicios: [
      ["Esmaltado semi", 15000, "45 min"],
      ["Kapping", 18000, "1 h"],
      ["Nail art", 22000, "1 h 15"],
    ],
  },
  {
    id: "estetica",
    nombre: "Estética",
    enFormulario: "Estética o cosmetología",
    color: "#5b6f52",
    servicios: [
      ["Limpieza facial", 28000, "1 h"],
      ["Lifting de pestañas", 22000, "50 min"],
      ["Perfilado de cejas", 9000, "20 min"],
    ],
  },
  {
    id: "consultorio",
    nombre: "Consultorio",
    enFormulario: "Consultorio o salud",
    color: "#2f5d7c",
    servicios: [
      ["Primera consulta", 30000, "40 min"],
      ["Control", 20000, "20 min"],
      ["Sesión", 25000, "45 min"],
    ],
  },
];

const EJEMPLOS: [negocio: string, rubro: number][] = [
  ["Barbería Don Pepe", 0],
  ["Uñas by Luz", 1],
  ["Estudio Nácar", 2],
  ["Kinesio Palermo", 3],
];

/** Horarios del jueves; `true` = ya tomado. */
const HORARIOS: [string, boolean][] = [
  ["9:00", true],
  ["10:00", false],
  ["11:00", true],
  ["12:00", false],
  ["15:00", false],
  ["16:00", true],
  ["17:00", false],
  ["18:00", true],
];

const CLIENTE = { nombre: "Martina Gómez", celular: "11 2345 6789" };

const TIPEO_MS = 85;
const BORRADO_MS = 35;
const PAUSA_MS = 1800;

const pesos = (n: number) => `$${n.toLocaleString("es-AR")}`;

export function ReservaEnVivo({ encabezado, pie }: { encabezado: React.ReactNode; pie: React.ReactNode }) {
  const quieto = useMovimientoReducido();
  const [negocio, setNegocio] = useState("");
  const [rubro, setRubro] = useState(0);
  const [tocado, setTocado] = useState(false);
  const [ejemplo, setEjemplo] = useState("");
  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [servicio, setServicio] = useState(0);
  const [hora, setHora] = useState("10:00");
  const caja = useRef<HTMLDivElement>(null);

  // Placeholder que se tipea solo, mientras el hero se ve y nadie toco nada.
  useEffect(() => {
    if (tocado || quieto) return;
    const el = caja.current;
    let visible = true;
    const io = el
      ? new IntersectionObserver(([e]) => {
          visible = e.isIntersecting;
        })
      : null;
    if (el && io) io.observe(el);

    let i = 0;
    let letras = 0;
    let borrando = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!visible) {
        timer = setTimeout(tick, 400);
        return;
      }
      const [nombre, r] = EJEMPLOS[i];
      if (!borrando) {
        letras++;
        if (letras === 1) {
          setRubro(r);
          setServicio(0);
        }
        setEjemplo(nombre.slice(0, letras));
        if (letras === nombre.length) {
          borrando = true;
          timer = setTimeout(tick, PAUSA_MS);
          return;
        }
      } else {
        letras--;
        setEjemplo(nombre.slice(0, letras));
        if (letras === 0) {
          borrando = false;
          i = (i + 1) % EJEMPLOS.length;
        }
      }
      timer = setTimeout(tick, borrando ? BORRADO_MS : TIPEO_MS);
    };
    timer = setTimeout(tick, 700);

    return () => {
      clearTimeout(timer);
      io?.disconnect();
    };
  }, [tocado, quieto]);

  const tocar = () => {
    if (!tocado) {
      setTocado(true);
      setEjemplo("");
    }
  };

  const r = RUBROS[rubro];
  const nombre = negocio.trim() || (tocado || quieto ? "Tu negocio" : ejemplo || " ");
  const [srvNombre, srvPrecio] = r.servicios[servicio];

  const quiero = () => {
    window.dispatchEvent(
      new CustomEvent<DatosNegocio>(EVENTO_NEGOCIO, {
        detail: { negocio: negocio.trim(), rubro: r.enFormulario },
      }),
    );
    irASeccion("formulario");
  };

  const textoBoton = negocio.trim() ? `Quiero esto para ${negocio.trim()}` : "Quiero mi página de reservas";

  return (
    <div
      ref={caja}
      className="grid items-center gap-x-12 gap-y-8 [grid-template-areas:'enc'_'tel'_'ctl'] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-y-6 lg:[grid-template-areas:'enc_tel'_'ctl_tel']"
    >
      <div className="[grid-area:enc] lg:self-end">{encabezado}</div>

      {/* Controles: nombre, rubro y boton. */}
      <div data-hero-entra style={{ "--hero-retardo": "260ms" } as React.CSSProperties} className="[grid-area:ctl] lg:self-start">
        <label htmlFor="hero-negocio" className="text-sm text-white/75">
          ¿Cómo se llama tu negocio?
        </label>
        <input
          id="hero-negocio"
          value={negocio}
          onChange={(e) => {
            tocar();
            setNegocio(e.target.value);
          }}
          onFocus={tocar}
          placeholder={tocado || quieto ? "Barbería Don Pepe" : ejemplo}
          autoComplete="organization"
          maxLength={40}
          className="mt-2 block h-14 w-full rounded-card border-0 bg-white px-4 text-lg text-[#0b0b0f] placeholder:text-[#0b0b0f]/45 focus:outline-2 focus:outline-offset-2 focus:outline-azul"
        />

        <fieldset className="mt-4">
          <legend className="sr-only">Rubro</legend>
          <div className="flex flex-wrap gap-2">
            {RUBROS.map((x, i) => (
              <label
                key={x.id}
                className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-[var(--duration-micro)] has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-azul ${
                  i === rubro ? "border-white bg-white text-[#0b0b0f]" : "border-white/30 text-white hover:border-white/60"
                }`}
              >
                <input
                  type="radio"
                  name="hero-rubro"
                  checked={i === rubro}
                  onChange={() => {
                    tocar();
                    setRubro(i);
                    setServicio(0);
                    setPaso(1);
                  }}
                  className="sr-only"
                />
                {x.nombre}
              </label>
            ))}
          </div>
        </fieldset>

        <button
          type="button"
          onClick={quiero}
          data-boton="claro"
          data-analytics="turnos-hero"
          className="group mt-6 min-h-[56px] w-full px-6 text-base"
        >
          <TextoDeslizante>{textoBoton}</TextoDeslizante>
        </button>
        <p className="mt-3 text-center text-sm text-white/65">
          Gratis. Te mandamos la demo con tus datos por WhatsApp.
        </p>
        {pie}
      </div>

      {/* El celular con la pagina de reservas. */}
      <div
        data-hero-entra
        style={{ "--hero-retardo": "420ms" } as React.CSSProperties}
        className="flex flex-col items-center [grid-area:tel]"
      >
        <div className="w-[min(78vw,300px)] rounded-[2.6rem] border border-line-alto bg-[#0c0c0c] p-[0.55rem] shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
          <div
            className="flex aspect-[390/780] flex-col overflow-hidden rounded-[2.1rem] bg-[#f6f2ec] px-4 pb-4 pt-5 text-[#2b2520]"
            aria-live="polite"
          >
            <div className="flex items-center gap-2.5">
              <span
                className="grid size-9 shrink-0 place-items-center rounded-[9px] text-sm font-medium text-[#f6f2ec] transition-colors duration-[var(--duration-state)]"
                style={{ background: r.color }}
              >
                {nombre.trim().charAt(0).toUpperCase() || "·"}
              </span>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-[15px] font-medium">{nombre}</p>
                <p className="text-[11px] text-[#8a7f72]">
                  {paso === 3 ? "Turno confirmado" : `Reservá tu turno · paso ${paso} de 2`}
                </p>
              </div>
            </div>

            <div key={paso} className="flex min-h-0 flex-1 flex-col [animation:hero-entrada_420ms_var(--ease-out-soft)_both]">
              {paso === 1 && (
                <>
                  <p className="mt-4 text-lg font-medium">Elegí el servicio</p>
                  <div className="mt-1.5 flex flex-col gap-1.5">
                    {r.servicios.map(([n, precio, dura], i) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => {
                          tocar();
                          setServicio(i);
                        }}
                        aria-pressed={i === servicio}
                        className="flex items-center justify-between rounded-[10px] border bg-white px-3 py-2 text-left text-[13px]"
                        style={{ borderColor: i === servicio ? r.color : "#e7dfd3", boxShadow: i === servicio ? `inset 0 0 0 1px ${r.color}` : undefined }}
                      >
                        <span>
                          {n}
                          <span className="block text-[11px] text-[#8a7f72]">{dura}</span>
                        </span>
                        <span className="text-[#8a7f72]">{pesos(precio)}</span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-[11px] text-[#8a7f72]">Jueves 29 · sólo horarios libres</p>
                  <div className="mt-1.5 grid grid-cols-4 gap-1.5">
                    {HORARIOS.map(([h, tomado]) =>
                      tomado ? (
                        <span key={h} className="py-1.5 text-center text-[12px] text-[#b9ad9c] line-through">
                          {h}
                        </span>
                      ) : (
                        <button
                          key={h}
                          type="button"
                          onClick={() => {
                            tocar();
                            setHora(h);
                          }}
                          aria-pressed={h === hora}
                          className="rounded-[8px] border py-1.5 text-center text-[12px]"
                          style={
                            h === hora
                              ? { background: r.color, borderColor: r.color, color: "#f6f2ec" }
                              : { background: "#fff", borderColor: "#e1d8cb" }
                          }
                        >
                          {h}
                        </button>
                      ),
                    )}
                  </div>
                  <BotonCelular color={r.color} onClick={() => (tocar(), setPaso(2))}>
                    Reservar turno
                  </BotonCelular>
                </>
              )}

              {paso === 2 && (
                <>
                  <p className="mt-4 text-lg font-medium">Tus datos</p>
                  <p className="mt-2 text-[11px] text-[#8a7f72]">Nombre y apellido</p>
                  <p className="mt-1 rounded-[8px] border border-[#e1d8cb] bg-white px-3 py-2 text-[13px]">{CLIENTE.nombre}</p>
                  <p className="mt-2 text-[11px] text-[#8a7f72]">Celular</p>
                  <p className="mt-1 rounded-[8px] border border-[#e1d8cb] bg-white px-3 py-2 text-[13px]">{CLIENTE.celular}</p>
                  <p className="mt-2 text-[11px] leading-snug text-[#8a7f72]">
                    Le llega la confirmación del turno, con el día y la hora.
                  </p>
                  <dl className="mt-3 rounded-[10px] border border-[#e7dfd3] bg-white px-3 text-[12px]">
                    <Fila t="Servicio" v={srvNombre} />
                    <Fila t="Día" v={`Jueves 29, ${hora}`} />
                    <Fila t="Total" v={pesos(srvPrecio)} ultima />
                  </dl>
                  <div className="mt-auto flex gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setPaso(1)}
                      className="w-2/5 rounded-[10px] border border-[#d9cfc1] py-2.5 text-[13px]"
                    >
                      Volver
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaso(3)}
                      className="flex-1 rounded-[10px] py-2.5 text-[13px] text-[#f6f2ec]"
                      style={{ background: r.color }}
                    >
                      Confirmar turno
                    </button>
                  </div>
                </>
              )}

              {paso === 3 && (
                <>
                  <div className="mt-6 text-center">
                    <span
                      className="mx-auto grid size-12 place-items-center rounded-full border-2"
                      style={{ borderColor: r.color, color: r.color }}
                    >
                      <Check className="size-6" aria-hidden />
                    </span>
                    <p className="mt-3 text-lg font-medium">Turno reservado</p>
                    <p className="mt-1 text-[12px] text-[#8a7f72]">
                      {srvNombre} · Jueves 29, {hora}
                    </p>
                  </div>
                  <p className="mt-5 flex items-start gap-2 rounded-[10px] border border-[#e7dfd3] bg-white px-3 py-2.5 text-[12px] leading-snug">
                    <MessageCircle className="mt-px size-4 shrink-0 text-[#2f9a4f]" aria-hidden />
                    Le llega la confirmación por mail, o por WhatsApp en Piloto automático.
                  </p>
                  <p className="mt-2 flex items-start gap-2 rounded-[10px] bg-[#2b2520] px-3 py-2.5 text-[12px] leading-snug text-[#f6f2ec]">
                    <Bell className="mt-px size-4 shrink-0" aria-hidden />
                    Y a {nombre.trim() || "tu negocio"} le aparece en la agenda: Martina G., {hora}.
                  </p>
                  <button
                    type="button"
                    onClick={() => setPaso(1)}
                    className="mt-auto rounded-[10px] border border-[#d9cfc1] py-2.5 text-[13px]"
                  >
                    Reservar otro turno
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <p className="mt-4 flex items-center gap-1.5 text-sm text-white/65">
          {paso === 1 && (
            <>
              <ArrowDown className="size-3.5 rotate-[-90deg] max-lg:rotate-0" aria-hidden />
              Tocá un servicio, un horario y reservá
            </>
          )}
          {paso === 2 && "Así deja sus datos tu cliente"}
          {paso === 3 && "Listo, sin escribirte un solo mensaje"}
        </p>
      </div>
    </div>
  );
}

function BotonCelular({ color, onClick, children }: { color: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-auto rounded-[10px] py-2.5 text-[13px] text-[#f6f2ec]"
      style={{ background: color }}
    >
      {children}
    </button>
  );
}

function Fila({ t, v, ultima = false }: { t: string; v: string; ultima?: boolean }) {
  return (
    <div className={`flex justify-between py-1.5 ${ultima ? "" : "border-b border-[#e7dfd3]"}`}>
      <dt className="text-[#8a7f72]">{t}</dt>
      <dd>{v}</dd>
    </div>
  );
}
