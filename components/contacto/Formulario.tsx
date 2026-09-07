"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { CtaWhatsApp } from "@/components/ui/CtaWhatsApp";
import { TextoDeslizante } from "@/components/ui/TextoDeslizante";
import { mensajes } from "@/lib/site";

type Campo = "nombre" | "negocio" | "necesita" | "contacto";

const CAMPOS: {
  id: Campo;
  label: string;
  placeholder: string;
  multilinea?: boolean;
  autoComplete?: string;
}[] = [
  { id: "nombre", label: "Nombre", placeholder: "Cómo te llamás", autoComplete: "name" },
  { id: "negocio", label: "Tu negocio", placeholder: "Nombre o rubro", autoComplete: "organization" },
  {
    id: "necesita",
    label: "Qué necesitás",
    placeholder: "Contanos en dos líneas qué querés resolver",
    multilinea: true,
  },
  { id: "contacto", label: "WhatsApp o mail", placeholder: "Por dónde te contactamos" },
];

const VACIO: Record<Campo, string> = {
  nombre: "",
  negocio: "",
  necesita: "",
  contacto: "",
};

/** Devuelve el error del campo, o null si esta bien. */
function validar(campo: Campo, valor: string): string | null {
  const v = valor.trim();
  if (!v) return "Este campo es obligatorio.";
  if (campo === "nombre" && v.length < 2) return "Escribí tu nombre.";
  if (campo === "necesita" && v.length < 10)
    return "Contanos un poco más para poder ayudarte.";
  if (campo === "contacto") {
    const esMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    const esTel = /^[+\d][\d\s()-]{6,}$/.test(v);
    if (!esMail && !esTel)
      return "Dejanos un WhatsApp o un mail para poder responderte.";
  }
  return null;
}

export function Formulario() {
  const [valores, setValores] = useState(VACIO);
  const [errores, setErrores] = useState<Partial<Record<Campo, string>>>({});
  const [tocados, setTocados] = useState<Partial<Record<Campo, boolean>>>({});
  const [estado, setEstado] = useState<
    "idle" | "enviando" | "ok" | "error" | "limite"
  >("idle");
  // Honeypot: ver el campo escondido abajo y el comentario en la ruta.
  const [apodo, setApodo] = useState("");

  function alEscribir(campo: Campo, valor: string) {
    setValores((v) => ({ ...v, [campo]: valor }));
    // Validacion mientras se escribe, pero solo despues del primer blur: si no,
    // el campo se pone en rojo apenas empezas a tipear.
    if (tocados[campo]) {
      setErrores((e) => ({ ...e, [campo]: validar(campo, valor) ?? undefined }));
    }
  }

  function alSalir(campo: Campo) {
    setTocados((t) => ({ ...t, [campo]: true }));
    setErrores((e) => ({ ...e, [campo]: validar(campo, valores[campo]) ?? undefined }));
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (estado === "enviando") return;

    const nuevos: Partial<Record<Campo, string>> = {};
    for (const c of CAMPOS) {
      const err = validar(c.id, valores[c.id]);
      if (err) nuevos[c.id] = err;
    }
    setErrores(nuevos);
    setTocados({ nombre: true, negocio: true, necesita: true, contacto: true });
    if (Object.keys(nuevos).length > 0) return;

    setEstado("enviando");
    try {
      const r = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...valores, apodo }),
      });
      // 429 tiene su propio estado: decirle "no pudimos enviar" a alguien que
      // en realidad choco contra el tope es mentirle sobre lo que paso.
      if (r.status === 429) {
        setEstado("limite");
        return;
      }
      if (!r.ok) throw new Error(String(r.status));
      setEstado("ok");
      setValores(VACIO);
      setTocados({});
    } catch {
      // No se limpia nada: lo escrito se conserva para poder reintentar.
      setEstado("error");
    }
  }

  if (estado === "ok") {
    return (
      <div
        role="status"
        className="rounded-[var(--radius-card)] border border-azul/40 bg-bg-elev p-8"
      >
        <p className="text-2xl">Listo.</p>
        {/*
          No promete WhatsApp: el ultimo campo acepta un mail y prometerle
          WhatsApp a alguien que dejo un mail es prometer mal.
        */}
        <p className="mt-3 text-text-muted">
          Te contestamos hoy mismo por donde nos dejaste.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-6">
      {/*
        Honeypot. Fuera de pantalla en vez de `display:none` porque hay bots
        que saltean lo que esta oculto con display; `absolute` ademas lo saca
        del flujo, asi que no abre un hueco en el `gap-6` del formulario.

        Las tres defensas para que ninguna persona lo complete sin querer:
        `aria-hidden` (el lector de pantalla no lo anuncia), `tabIndex={-1}`
        (con teclado no se llega) y `autoComplete="off"` mas un nombre anodino
        (el navegador no tiene con que autocompletarlo).
      */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="apodo">No completes este campo</label>
        <input
          id="apodo"
          name="apodo"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={apodo}
          onChange={(e) => setApodo(e.target.value)}
        />
      </div>

      {CAMPOS.map((c) => {
        const error = errores[c.id];
        const idError = `${c.id}-error`;
        const comun = {
          id: c.id,
          name: c.id,
          value: valores[c.id],
          placeholder: c.placeholder,
          autoComplete: c.autoComplete,
          "aria-invalid": Boolean(error),
          "aria-describedby": error ? idError : undefined,
          onBlur: () => alSalir(c.id),
          className: `w-full rounded-[var(--radius-card)] border bg-bg-elev px-4 py-3 text-text
            placeholder:text-text-muted transition-colors duration-[var(--duration-micro)]
            ${error ? "border-red-400/70" : "border-line focus:border-azul"}`,
        };

        return (
          <div key={c.id} className="flex flex-col gap-2">
            {/* Label visible, no placeholder como label (§2, B4). */}
            <label htmlFor={c.id} className="text-sm text-text">
              {c.label}
            </label>

            {c.multilinea ? (
              <textarea
                {...comun}
                rows={4}
                onChange={(e) => alEscribir(c.id, e.target.value)}
              />
            ) : (
              <input
                {...comun}
                type="text"
                onChange={(e) => alEscribir(c.id, e.target.value)}
              />
            )}

            {error && (
              <p id={idError} className="text-sm text-red-300">
                {error}
              </p>
            )}
          </div>
        );
      })}

      <div className="flex flex-col gap-4">
        {/*
          Secundario (`linea`) y no `claro`. La seccion tiene dos columnas con
          una accion cada una, y el brief pide una sola accion primaria
          dominante por pantalla: el unico boton blanco es el de WhatsApp. Asi
          la jerarquia se lee por rango y no solo por tamaño.
        */}
        <button
          type="submit"
          disabled={estado === "enviando"}
          data-boton="linea"
          className="group min-h-[52px] px-6 text-base disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
        >
          {estado === "enviando" && (
            <LoaderCircle className="size-4 animate-spin" aria-hidden />
          )}
          {/* Mientras envia no hay deslizamiento: el boton esta deshabilitado
              y el hover no se dispara, asi que seria maquinaria muerta. */}
          {estado === "enviando" ? (
            "Enviando…"
          ) : (
            <TextoDeslizante>Enviar</TextoDeslizante>
          )}
        </button>

        {(estado === "error" || estado === "limite") && (
          <div
            role="alert"
            className="flex flex-col items-start gap-4 rounded-[var(--radius-card)] border border-line bg-bg-elev p-5"
          >
            <p className="text-text-muted">
              {estado === "limite"
                ? "Ya recibimos varias consultas tuyas y estamos en eso. Si es urgente, escribinos por WhatsApp."
                : "No pudimos enviar el mensaje. Escribinos directo por WhatsApp y lo resolvemos ahora."}
            </p>
            {/*
              El CTA se lleva lo que el visitante ya escribio. Antes mandaba la
              frase enlatada y le tiraba las palabras a la basura justo en el
              peor momento de la pantalla. Los valores se leen sin guardas
              porque a este estado solo se llega despues de validar.
            */}
            <CtaWhatsApp
              size="sm"
              analytics="cta-fallback-formulario"
              mensaje={mensajes.compuesto(
                `${valores.necesita}\n\nSoy ${valores.nombre}, de ${valores.negocio}.`,
              )}
            />
          </div>
        )}
      </div>
    </form>
  );
}
