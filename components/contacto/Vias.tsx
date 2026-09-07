"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Mail, MessageCircle, Phone } from "lucide-react";
import { IconInstagram } from "@/components/ui/IconInstagram";
import { instagramUrl, mailtoUrl, site, telUrl } from "@/lib/site";

/**
 * Las vias de contacto, una por bloque.
 *
 * Reemplazan al formulario, que se fue de la pagina entera junto con su
 * backend (Resend, honeypot y limite por IP) el 07/09/2026.
 *
 * DOS COSAS QUE NO SON LAS OBVIAS:
 *
 * 1. El bloque de WhatsApp NO abre WhatsApp: lleva el foco al campo del
 *    compositor de al lado. Si abriera el chat con la frase enlatada, la
 *    seccion tendria dos salidas a WhatsApp a un palmo —una que se lleva lo
 *    que escribiste y otra que no— y la peor de las dos seria la que se toca
 *    primero por estar arriba de todo.
 *
 * 2. El rotulo de cada bloque NO va arriba en versalitas. La referencia que
 *    paso Facundo lo hace asi, pero el sistema prohibe por nombre el rotulo
 *    chico arriba de un titulo: es una de las marcas mas delatoras de pagina
 *    generada. Aca el nombre del canal es la linea de arriba en texto normal
 *    y el dato (el mail, el numero, el arroba) va debajo en gris.
 *
 * Los recuadros del icono son cuadrados de radio 10, no circulos: el sistema
 * reserva `rounded-full` para lo que es literalmente un circulo.
 */

/** Alto minimo de cada bloque. Los cuatro miden igual aunque digan distinto. */
const BLOQUE =
  "flex min-h-[92px] w-full items-center gap-4 rounded-card border border-line bg-bg-elev px-5 text-left transition-colors duration-[var(--duration-micro)] hover:border-line-alto hover:bg-bg-alto";

const RECUADRO =
  "grid size-11 shrink-0 place-items-center rounded-card bg-bg-alto text-text";

function Cuerpo({ nombre, dato }: { nombre: string; dato: string }) {
  return (
    <span className="min-w-0 flex-1">
      <span className="block text-[15px] text-text">{nombre}</span>
      <span className="mt-0.5 block truncate text-sm text-text-muted">
        {dato}
      </span>
    </span>
  );
}

export function Vias() {
  const [copiado, setCopiado] = useState(false);
  const reloj = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sin esto, si el componente se desmonta durante los 2s el setState corre
  // sobre algo que ya no existe.
  useEffect(() => () => {
    if (reloj.current) clearTimeout(reloj.current);
  }, []);

  async function copiarMail() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopiado(true);
      if (reloj.current) clearTimeout(reloj.current);
      reloj.current = setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Portapapeles denegado o contexto no seguro: el link mailto de al lado
      // sigue siendo el camino, asi que no hay nada que avisar.
    }
  }

  function irAlCompositor() {
    const campo = document.getElementById("mensaje-whatsapp");
    if (!campo) return;
    // `focus` ya lo trae a pantalla; `preventScroll` seria justo lo contrario
    // de lo que hace falta en mobile, donde el compositor esta mas arriba.
    campo.focus();
  }

  const instagram = instagramUrl();

  return (
    <ul className="flex flex-col gap-3">
      {/* WhatsApp: no abre el chat, lleva al campo de al lado. Ver cabecera. */}
      <li>
        <button type="button" onClick={irAlCompositor} className={`group ${BLOQUE}`}>
          <span className={RECUADRO}>
            <MessageCircle className="size-5" aria-hidden />
          </span>
          <Cuerpo nombre="WhatsApp" dato="Escribinos y te contestamos hoy" />
          <ArrowUpRight
            className="size-4 shrink-0 text-text-muted transition-colors duration-[var(--duration-micro)] group-hover:text-text"
            aria-hidden
          />
        </button>
      </li>

      {/*
        Mail. El bloque es un <a mailto:> y el boton de copiar va AL LADO, no
        adentro: un <button> dentro de un <a> es HTML invalido y el navegador
        lo desarma como quiere.

        Lo de copiar no es adorno. Si la maquina del visitante no tiene cliente
        de mail configurado, un mailto no hace absolutamente nada y no hay
        forma de detectarlo desde la web: sin el boton, ese visitante se queda
        sin la direccion.
      */}
      <li className={`group ${BLOQUE} pr-2`}>
        <a
          href={mailtoUrl}
          data-analytics="via-mail"
          className="flex min-w-0 flex-1 items-center gap-4 py-4"
        >
          <span className={RECUADRO}>
            <Mail className="size-5" aria-hidden />
          </span>
          <Cuerpo nombre="Mail" dato={site.email} />
        </a>

        <button
          type="button"
          onClick={copiarMail}
          aria-label={copiado ? "Dirección copiada" : "Copiar la dirección de mail"}
          className="grid size-11 shrink-0 place-items-center rounded-card text-text-muted transition-colors duration-[var(--duration-micro)] hover:bg-bg-elev hover:text-text"
        >
          {copiado ? (
            <Check className="size-4 text-azul" aria-hidden />
          ) : (
            <Copy className="size-4" aria-hidden />
          )}
        </button>
        {/* El aviso va aparte y en vivo: el icono solo no lo anuncia nadie. */}
        <span role="status" className="sr-only">
          {copiado ? "Dirección copiada" : ""}
        </span>
      </li>

      {/*
        Instagram solo se dibuja cuando exista el usuario (hoy `site.instagram`
        es null y Facundo lo tiene que traer). Un icono que lleva a ningun lado
        es peor que no tenerlo: §9.1.
      */}
      {instagram && (
        <li>
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics="via-instagram"
            className={`group ${BLOQUE} py-4`}
          >
            <span className={RECUADRO}>
              <IconInstagram className="size-5" />
            </span>
            <Cuerpo nombre="Instagram" dato={`@${site.instagram}`} />
            <ArrowUpRight
              className="size-4 shrink-0 text-text-muted transition-colors duration-[var(--duration-micro)] group-hover:text-text"
              aria-hidden
            />
          </a>
        </li>
      )}

      <li>
        <a
          href={telUrl}
          data-analytics="via-telefono"
          className={`group ${BLOQUE} py-4`}
        >
          <span className={RECUADRO}>
            <Phone className="size-5" aria-hidden />
          </span>
          <Cuerpo nombre="Llamanos" dato={site.whatsappDisplay} />
          <ArrowUpRight
            className="size-4 shrink-0 text-text-muted transition-colors duration-[var(--duration-micro)] group-hover:text-text"
            aria-hidden
          />
        </a>
      </li>
    </ul>
  );
}
