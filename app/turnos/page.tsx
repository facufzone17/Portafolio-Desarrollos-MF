import type { Metadata } from "next";
import Link from "next/link";
import { Check, Play } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/ui/Logo";
import { Revelar } from "@/components/ui/Revelar";
import { Seccion } from "@/components/ui/Seccion";
import { AntesDespues } from "@/components/turnos/AntesDespues";
import { Ejemplos } from "@/components/turnos/Ejemplos";
import { Formulario } from "@/components/turnos/Formulario";
import { IrA } from "@/components/turnos/IrA";
import { HeroTurnos } from "@/components/turnos/HeroTurnos";
import { VidaDeUnTurno } from "@/components/turnos/VidaDeUnTurno";
import { Destacado, Precio } from "@/components/turnos/piezas";
import { Preguntas } from "@/components/turnos/Preguntas";
import { TextoDeslizante } from "@/components/ui/TextoDeslizante";
import { ADICIONAL_WHATSAPP, DESCUENTO, DESDE, PROFESIONALES, incluyeMensual, planes, pesos } from "@/lib/planes";
import { preguntasLanding } from "@/lib/preguntasTurnos";

/*
  Landing de turnos (22/10/2026). Destino de la pauta de Meta: vende los tres
  planes (Agenda, Vidriera, Piloto automatico) con precio a la vista y lleva al
  formulario, que abre WhatsApp con las respuestas.

  Mismo sistema que la home (negro neutro, un solo azul, radio 10, Inter Tight
  500) pero sin la entrada ni los links de la home: el que llega desde un
  anuncio no tiene que esperar 3,6 s ni irse al portafolio. Cada plan tiene
  ademas su propia pagina con la demo (app/turnos/[plan]), y se muestra
  funcionando sobre un negocio de ejemplo (Estudio Nacar, del
  generador de demos), nunca sobre la marca de un prospecto real.
*/

const titulo = "Turnos online, web y bot de WhatsApp para tu negocio";
const descripcion =
  "Un bot que contesta tu WhatsApp y agenda por vos, tu web y tus reservas online. Tres planes desde " +
  pesos(DESDE) +
  " por mes. Pedí tu demo personalizada gratis.";

export const metadata: Metadata = {
  title: `${titulo} | Trevoo`,
  description: descripcion,
  alternates: { canonical: "/turnos" },
  openGraph: { title: titulo, description: descripcion, url: "/turnos" },
};

export default function Turnos() {
  return (
    <>
      <Barra />
      <main className="flex-1">
        <HeroTurnos />
        <AntesDespues />
        <Seccion
          id="como-funciona"
          ancho="max-w-[980px]"
          titulo="La vida de un turno"
          bajada="Seguí a una clienta desde que ve tu historia hasta que se sienta en tu silla: lo que hace el sistema, y lo que hacés vos."
        >
          <VidaDeUnTurno />
        </Seccion>
        <Ejemplos />
        <Planes />
        <Proceso />
        <Preguntas id="preguntas" preguntas={preguntasLanding} />
        <Seccion
          id="formulario"
          ancho="max-w-[760px]"
          titulo="Pedí tu demo personalizada"
          bajada="Contanos de tu negocio y te mandamos por WhatsApp un video de cómo quedaría con tu marca, tus servicios y tus precios. Gratis y sin compromiso."
        >
          <Revelar className="mx-auto mt-12 max-w-[760px]">
            <Formulario />
          </Revelar>
        </Seccion>
      </main>
      <Footer />
    </>
  );
}

/* ------------------------------------------------------------------------ */

/** Secciones de la barra, en el orden en que aparecen en la pagina. */
const SECCIONES = [
  { id: "como-funciona", nombre: "Cómo funciona" },
  { id: "ejemplos", nombre: "Ejemplos" },
  { id: "planes", nombre: "Precios" },
  { id: "preguntas", nombre: "Preguntas" },
];

/**
 * Barra propia de la landing: logo, secciones y la accion. Sin los links de la
 * home — desde un anuncio, cada salida que no es el formulario es una fuga. Las
 * secciones son anclas de esta misma pagina, asi que no sacan a nadie.
 *
 * Tres columnas para que las secciones queden centradas en la barra y no
 * pegadas al boton. En mobile no entran y queda solo el boton; por eso el
 * boton va a la tercera columna a mano, si no el grid lo correria al medio.
 */
function Barra() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-6">
      <div className="pointer-events-auto grid h-[60px] w-full max-w-[1220px] grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-[22px] border border-line bg-bg-elev/85 px-3 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-[5px] sm:h-[67px] sm:px-4">
        <Link href="/" className="flex items-center justify-self-start pl-2 text-white" aria-label="Trevoo, ir al inicio">
          <Logo className="text-[17px] sm:text-[18px]" />
        </Link>
        <nav aria-label="Secciones" className="hidden items-center gap-1 md:flex">
          {SECCIONES.map((s) => (
            <IrA
              key={s.id}
              id={s.id}
              className="rounded-card px-3 py-2 text-[15px] text-white/75 transition-colors hover:text-white"
            >
              {s.nombre}
            </IrA>
          ))}
        </nav>
        <IrA
          id="formulario"
          data-boton="claro"
          data-analytics="turnos-barra"
          className="group col-start-3 justify-self-end"
        >
          <TextoDeslizante>Pedir demo gratis</TextoDeslizante>
        </IrA>
      </div>
    </header>
  );
}

/**
 * Las tres tarjetas de precio: para que es cada plan, el mensual con el
 * armado debajo, lo que incluye y dos botones del mismo tamaño: "Quiero" y
 * "Ver la demo", que lleva a la pagina del plan (/turnos/[plan]). Para el
 * que recien llega, ver la demo es el paso mas facil y no se esconde.
 *
 * El destacado es Piloto ("Recomendado"): el bot es lo unico que no tienen
 * las apps de turnos de $12.000, asi que es el plan que se vende. No dice
 * "el mas elegido" porque todavia no hay clientes que lo respalden.
 */
function Planes() {
  return (
    <Seccion
      id="planes"
      ancho="max-w-[1180px]"
      titulo="Tres planes, precio a la vista"
      bajada={`Cada uno suma sobre el anterior. Vidriera y Piloto tienen el mismo armado: Piloto suma el bot por ${pesos(planes[2].mensual - planes[1].mensual)} más por mes. Los tres incluyen ${PROFESIONALES.toLowerCase()}.`}
    >
      <Revelar>
        <p className="mb-6 text-center text-[15px] text-text">
          Precio de lanzamiento para los primeros negocios:{" "}
          <span className="text-azul">{DESCUENTO}% menos en el armado</span> y el primer mes gratis en Agenda
        </p>
      </Revelar>

      <div className="mx-auto grid max-w-[1180px] gap-4 lg:grid-cols-3">
        {planes.map((p, i) => (
          <Revelar
            key={p.id}
            demora={i * 90}
            className={`flex flex-col rounded-card border p-6 sm:p-8 ${
              p.destacado
                ? "border-azul bg-azul/[0.07] shadow-[0_30px_80px_rgba(0,153,255,0.12)]"
                : "border-line bg-bg-elev"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <h3 className="text-2xl text-text">{p.nombre}</h3>
              {p.destacado && <Destacado texto={p.destacado} />}
            </div>
            <p className="mt-2 text-[15px] leading-snug text-text-muted lg:min-h-[3em]">{p.resumen}</p>

            <Precio plan={p} className="mt-6" />

            <ul className="mt-6 flex flex-1 flex-col gap-3 border-t border-line pt-6">
              {p.incluye.map((t) => (
                <li key={t} className="flex gap-3 text-[15px] leading-snug text-text">
                  <Check className="mt-0.5 size-4 shrink-0 text-azul" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-2.5">
              <IrA
                id="formulario"
                plan={p.id}
                data-boton="claro"
                data-analytics={`turnos-precio-${p.id}`}
                className="group min-h-[52px] w-full text-base"
              >
                <TextoDeslizante>{`Quiero ${p.nombre}`}</TextoDeslizante>
              </IrA>
              <Link
                href={`/turnos/${p.id}`}
                data-boton="linea"
                data-analytics={`turnos-demo-${p.id}`}
                className="group min-h-[52px] w-full text-base"
              >
                <Play className="size-4 shrink-0" aria-hidden />
                <TextoDeslizante>Ver la demo</TextoDeslizante>
              </Link>
            </div>
          </Revelar>
        ))}
      </div>

      <Revelar className="mx-auto mt-4 flex max-w-[1180px] flex-col gap-5 rounded-card border border-line bg-bg-elev p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg text-text">El mensual de cada plan incluye</p>
          <p className="mt-1 text-sm text-text-muted">Para que todo siga andando sin que tengas que ocuparte.</p>
        </div>
        <ul className="flex flex-col gap-2 md:items-end md:text-right">
          {incluyeMensual.map((t) => (
            <li key={t} className="flex gap-2.5 text-[15px] text-text md:flex-row-reverse">
              <Check className="mt-0.5 size-4 shrink-0 text-azul" aria-hidden />
              {t}
            </li>
          ))}
        </ul>
      </Revelar>

      <p className="mx-auto mt-6 max-w-[70ch] text-center text-sm leading-relaxed text-text-muted">
        ¿Querés recordatorios por WhatsApp sin el bot? Para Agenda y Vidriera:{" "}
        +{pesos(ADICIONAL_WHATSAPP.precio)}/mes hasta {ADICIONAL_WHATSAPP.recordatorios} recordatorios. El bot de
        Piloto funciona con la API oficial de WhatsApp Business: los mensajes que cobra Meta van
        aparte y a nombre de tu negocio.
      </p>
    </Seccion>
  );
}

const PASOS = [
  {
    titulo: "Nos contás de tu negocio",
    texto: "Completás el formulario de abajo o nos escribís por WhatsApp.",
  },
  {
    titulo: "Te mandamos tu demo",
    texto: "Un video con tu marca, tus servicios y tus precios funcionando. Gratis.",
  },
  {
    titulo: "Lo armamos con tus datos",
    texto: "Cargamos tus servicios, horarios, fotos y precios, y vos lo revisás antes de publicarlo. En Vidriera y Piloto arrancamos con la seña del 30% del armado.",
  },
  {
    titulo: "Queda andando",
    texto: "Te mostramos cómo usar el panel y empezás a recibir turnos. Desde ahí, el mensual de tu plan (y el 70% del armado, si tiene).",
  },
];

function Proceso() {
  return (
    <Seccion ancho="max-w-[1180px]" titulo="Cómo arrancamos" bajada="Sin reuniones eternas ni nada que instalar.">
      <ol className="mx-auto mt-14 grid max-w-[1180px] gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {PASOS.map((p, i) => (
          <Revelar as="li" key={p.titulo} demora={i * 90} className="bg-bg p-6 sm:p-8">
            <h3 className="text-xl text-text">{p.titulo}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-text-muted">{p.texto}</p>
          </Revelar>
        ))}
      </ol>
    </Seccion>
  );
}
