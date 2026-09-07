"use client";

import { useState } from "react";
import { CtaWhatsApp } from "@/components/ui/CtaWhatsApp";
import { mensajes } from "@/lib/site";

/**
 * Compositor de WhatsApp.
 *
 * El visitante escribe el mensaje ACA, dentro de la pagina, y el boton abre
 * wa.me en otra pestaña con ese texto ya cargado. Lo unico que se delega es el
 * "enviar" final, porque no existe forma de mandar un WhatsApp en nombre de un
 * visitante anonimo: WhatsApp no lo permite y el brief ademas prohibe la API
 * de Meta (§6). El compositor es lo mas cerca que se puede estar de "escribir
 * desde Trevoo" sin mentir sobre quien manda.
 *
 * No importa `useMovimientoReducido`: aca no se anima nada por fuera de
 * `data-boton` y `Revelar`, que ya traen su rama de movimiento reducido en
 * globals.css. Agregar el hook seria ceremonia muerta.
 */
const TOPE = 1000;

/** Desde donde se muestra el contador. Ver el comentario de abajo. */
const AVISO = 800;

export function MensajeWhatsApp() {
  const [texto, setTexto] = useState("");

  const limpio = texto.trim();
  // Vacio manda la frase de siempre: hay gente que solo quiere el chat abierto
  // y un boton primario deshabilitado en una pagina de venta es un callejon.
  const mensaje = limpio ? mensajes.compuesto(limpio) : mensajes.general;

  return (
    <div className="rounded-card border border-line bg-bg-elev p-6 sm:p-8">
      <h3 className="text-2xl">Escribinos por WhatsApp</h3>

      <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-text-muted">
        Escribí acá lo que necesitás. Se abre WhatsApp en otra pestaña con tu
        mensaje ya escrito y lo mandás vos.
      </p>

      <div className="mt-6 flex flex-col gap-2">
        <label htmlFor="mensaje-whatsapp" className="text-sm text-text">
          Tu mensaje
        </label>

        <textarea
          id="mensaje-whatsapp"
          name="mensaje-whatsapp"
          rows={5}
          maxLength={TOPE}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          aria-describedby="mensaje-whatsapp-nota"
          placeholder="Tengo una peluquería y quiero que la gente saque turno sola, sin escribirme."
          // `bg-bg-alto` y no `bg-bg-elev`: es el escalon para lo que apoya
          // SOBRE un panel. Un campo bg-elev dentro de un panel bg-elev es un
          // campo invisible sostenido por un filete. Que este campo tenga otro
          // fondo que los del formulario es correcto (campo sobre el fondo vs.
          // campo sobre panel): no "emparejarlos".
          //
          // `resize-y` y no libre: el resize horizontal puede forzar scroll
          // horizontal, que esta prohibido por nombre.
          className="w-full resize-y rounded-card border border-line bg-bg-alto px-4 py-3
            text-text placeholder:text-text-muted
            transition-colors duration-[var(--duration-micro)] focus:border-azul"
        />

        <div className="flex items-start justify-between gap-4">
          <p id="mensaje-whatsapp-nota" className="text-sm text-text-muted">
            Si lo dejás vacío, igual se abre el chat.
          </p>

          {/*
            El contador aparece recien al 80%. Uno permanente para un tope que
            nadie alcanza es una molestia; a 800 esta para el unico caso que
            importa, que es alguien pegando un texto largo y que se le corte en
            silencio. `aria-hidden` porque un contador vivo le spamea el lector
            de pantalla: el aviso accesible es la nota de al lado, que es fija.
          */}
          {texto.length > AVISO && (
            <p
              aria-hidden
              className="shrink-0 text-sm tabular-nums text-text-muted"
            >
              {texto.length}/{TOPE}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6">
        {/*
          `CtaWhatsApp` ya es un <a> con target y rel, y calcula el href en el
          render: con el textarea controlado se recalcula en cada tecla y
          siempre esta al dia al hacer click. Un <button> + window.open
          rompería el click del medio, el ctrl+click y el "copiar enlace", y
          lo unico que compraria es poder deshabilitarlo, que es justo lo que
          no queremos.

          Dice "Abrir WhatsApp" y no "Contactanos": es OTRA intencion que la
          del header y el hero (esos mandan la frase enlatada, este lleva lo
          que escribiste), y el verbo es literalmente lo que pasa.
        */}
        <CtaWhatsApp
          mensaje={mensaje}
          analytics="cta-compositor"
          className="w-full sm:w-auto"
        >
          Abrir WhatsApp
        </CtaWhatsApp>
      </div>
    </div>
  );
}
