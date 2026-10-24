"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { registrarLead } from "@/components/PixelMeta";
import { EVENTO_NEGOCIO, EVENTO_PLAN, type DatosNegocio } from "@/components/turnos/IrA";
import { planes, pesos, type IdPlan } from "@/lib/planes";
import { whatsappUrl } from "@/lib/site";

/**
 * Formulario de la landing de turnos.
 *
 * No hay backend, igual que en el resto del sitio: al enviar arma un mensaje
 * con las respuestas y abre WhatsApp con ese texto. La conversacion sigue
 * donde Trevoo ya contesta, y llega con todo lo que hoy se pregunta a mano
 * (rubro, redes, como toma turnos, que plan le interesa).
 */

const RUBROS = [
  "Peluquería o barbería",
  "Uñas o pestañas",
  "Estética o cosmetología",
  "Masajes o spa",
  "Consultorio o salud",
  "Entrenamiento o deporte",
  "Otro",
];

const COMO_HOY = [
  "Por WhatsApp o Instagram, mensaje por mensaje",
  "Por teléfono",
  "En una agenda de papel",
  "Con otra app o sistema",
  "Todavía no tomo turnos",
];

const OBJETIVOS = {
  demo: "Quiero ver mi demo personalizada gratis",
  arrancar: "Ya sé que lo quiero, quiero arrancar",
} as const;

type Objetivo = keyof typeof OBJETIVOS;

const campo =
  "mt-2 block w-full rounded-card border border-line-alto bg-bg-elev px-4 py-3 text-base text-text placeholder:text-text-muted/70 transition-colors focus:border-azul focus:outline-none";

export function Formulario({ planInicial = "no-se" }: { planInicial?: IdPlan | "no-se" }) {
  // En la pagina de un plan llega ya elegido.
  const [plan, setPlan] = useState<IdPlan | "no-se">(planInicial);
  const [objetivo, setObjetivo] = useState<Objetivo>("demo");
  // Controlados para que el hero pueda dejarlos cargados (EVENTO_NEGOCIO).
  const [negocio, setNegocio] = useState("");
  const [rubro, setRubro] = useState("");

  useEffect(() => {
    const alElegir = (e: Event) => setPlan((e as CustomEvent<IdPlan>).detail);
    const alCargar = (e: Event) => {
      const d = (e as CustomEvent<DatosNegocio>).detail;
      if (d.negocio) setNegocio(d.negocio);
      if (RUBROS.includes(d.rubro)) setRubro(d.rubro);
    };
    window.addEventListener(EVENTO_PLAN, alElegir);
    window.addEventListener(EVENTO_NEGOCIO, alCargar);
    return () => {
      window.removeEventListener(EVENTO_PLAN, alElegir);
      window.removeEventListener(EVENTO_NEGOCIO, alCargar);
    };
  }, []);

  const enviar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const texto = (k: string) => String(d.get(k) ?? "").trim();
    const elegido = planes.find((p) => p.id === plan);

    const lineas = [
      "Hola! Vengo de la página de planes de Trevoo.",
      OBJETIVOS[objetivo] + ".",
      "",
      `• Nombre: ${texto("nombre")}`,
      `• Negocio: ${texto("negocio")} (${texto("rubro")})`,
      ...(texto("redes") ? [`• Instagram o web: ${texto("redes")}`] : []),
      `• Hoy tomo turnos: ${texto("como")}`,
      `• Plan: ${elegido ? `${elegido.nombre} (${pesos(elegido.precio)})` : "todavía no sé"}`,
    ];

    registrarLead({ content_name: elegido?.id ?? "no-se", objetivo });
    window.open(whatsappUrl(lineas.join("\n")), "_blank", "noopener,noreferrer");
  };

  return (
    <form
      onSubmit={enviar}
      className="rounded-card border border-line bg-bg-elev/60 p-5 sm:p-8"
    >
      <fieldset>
        <legend className="text-sm text-text-muted">¿Qué querés?</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {(Object.keys(OBJETIVOS) as Objetivo[]).map((k) => (
            <label
              key={k}
              className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-card border px-4 py-3 text-[15px] transition-colors ${
                objetivo === k
                  ? "border-azul bg-azul/10 text-text"
                  : "border-line-alto text-text-muted hover:text-text"
              }`}
            >
              <input
                type="radio"
                name="objetivo"
                value={k}
                checked={objetivo === k}
                onChange={() => setObjetivo(k)}
                className="size-4 accent-[var(--color-azul)]"
              />
              {OBJETIVOS[k]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block text-sm text-text-muted">
          Tu nombre
          <input name="nombre" required autoComplete="given-name" className={campo} />
        </label>
        <label className="block text-sm text-text-muted">
          Nombre del negocio
          <input
            name="negocio"
            required
            autoComplete="organization"
            value={negocio}
            onChange={(e) => setNegocio(e.target.value)}
            className={campo}
          />
        </label>
        <label className="block text-sm text-text-muted">
          Rubro
          <select name="rubro" required value={rubro} onChange={(e) => setRubro(e.target.value)} className={campo}>
            <option value="" disabled>
              Elegí uno
            </option>
            {RUBROS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm text-text-muted">
          Instagram o web <span className="text-text-muted/70">(opcional)</span>
          <input name="redes" placeholder="@tunegocio" className={campo} />
        </label>
        <label className="block text-sm text-text-muted sm:col-span-2">
          ¿Cómo tomás los turnos hoy?
          <select name="como" required defaultValue="" className={campo}>
            <option value="" disabled>
              Elegí una opción
            </option>
            {COMO_HOY.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm text-text-muted">¿Qué plan te interesa?</legend>
        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[...planes.map((p) => ({ id: p.id, nombre: p.nombre, precio: pesos(p.precio) })), { id: "no-se" as const, nombre: "Todavía no sé", precio: "Te ayudamos" }].map(
            (p) => (
              <label
                key={p.id}
                className={`flex cursor-pointer flex-col rounded-card border px-4 py-3 transition-colors has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-azul ${
                  plan === p.id
                    ? "border-azul bg-azul/10"
                    : "border-line-alto hover:bg-bg-alto"
                }`}
              >
                <input
                  type="radio"
                  name="plan"
                  value={p.id}
                  checked={plan === p.id}
                  onChange={() => setPlan(p.id)}
                  className="sr-only"
                />
                <span className="text-[15px] text-text">{p.nombre}</span>
                <span className="mt-0.5 text-sm text-text-muted">{p.precio}</span>
              </label>
            ),
          )}
        </div>
      </fieldset>

      <button
        type="submit"
        data-boton="claro"
        data-analytics="turnos-formulario"
        className="mt-8 min-h-[52px] w-full px-6 text-base"
      >
        <MessageCircle className="size-[1.15em] shrink-0" aria-hidden />
        {objetivo === "demo" ? "Pedir mi demo por WhatsApp" : "Quiero arrancar, hablemos por WhatsApp"}
      </button>
      <p className="mt-3 text-center text-sm text-text-muted">
        Se abre WhatsApp con tus respuestas ya escritas. Sólo tenés que enviar.
      </p>
    </form>
  );
}
