import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, Check, ChevronDown } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/ui/Logo";
import { Revelar } from "@/components/ui/Revelar";
import { Seccion } from "@/components/ui/Seccion";
import { AntesDespues } from "@/components/turnos/AntesDespues";
import { Ejemplos } from "@/components/turnos/Ejemplos";
import { Formulario } from "@/components/turnos/Formulario";
import { IrA } from "@/components/turnos/IrA";
import { HeroTurnos } from "@/components/turnos/HeroTurnos";
import { PasosHistoria } from "@/components/turnos/PasosHistoria";
import { Telefono } from "@/components/turnos/Telefono";
import { TextoDeslizante } from "@/components/ui/TextoDeslizante";
import { DESCUENTO, MENSUAL, descuento, incluyeMensual, planes, pesos, type Plan } from "@/lib/planes";

/*
  Landing de turnos (22/10/2026). Destino de la pauta de Meta: vende los tres
  planes (Agenda, Vidriera, Piloto automatico) con precio a la vista y lleva al
  formulario, que abre WhatsApp con las respuestas.

  Mismo sistema que la home (negro neutro, un solo azul, radio 10, Inter Tight
  500) pero sin la entrada ni los links de la home: el que llega desde un
  anuncio no tiene que esperar 3,6 s ni irse al portafolio. Cada plan se
  muestra funcionando sobre un negocio de ejemplo (Estudio Nacar, del
  generador de demos), nunca sobre la marca de un prospecto real.
*/

const titulo = "Turnos online, web y bot de WhatsApp para tu negocio";
const descripcion =
  "Tus clientes sacan turno solos, a cualquier hora. Tres planes con precio a la vista, desde " +
  pesos(planes[0].precio) +
  ". Pedí tu demo personalizada gratis.";

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
          titulo="Así funciona, en tres pasos"
          bajada="Un centro de estética de ejemplo con el plan más completo: un cliente reserva desde la web, otro saca turno hablando con el bot, y los dos aparecen solos en la agenda del negocio."
        >
          <PasosHistoria />
        </Seccion>
        <Ejemplos />
        <Planes />
        <Seccion
          id="demos"
          titulo="Mirá cada plan funcionando"
          bajada="Cada demo está armada sobre un centro de estética de ejemplo."
        >
          <div className="flex flex-col gap-24 sm:gap-32">
            {planes.map((p, i) => (
              <DetallePlan key={p.id} plan={p} invertido={i % 2 === 1} />
            ))}
          </div>
        </Seccion>
        <Proceso />
        <Preguntas />
        <Seccion
          id="formulario"
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

function Lista({ titulo, items }: { titulo: string; items: string[] }) {
  return (
    <div>
      <p className="text-sm text-text-muted">{titulo}</p>
      <ul className="mt-3 flex flex-col gap-2.5">
        {items.map((t) => (
          <li key={t} className="flex gap-3 text-[15px] leading-snug text-text sm:text-base">
            <Check className="mt-0.5 size-4 shrink-0 text-azul" aria-hidden />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Un plan funcionando: su demo, para quien es y lo que gana el dueño. Lo que
 * incluye ya esta en la tarjeta de precios, asi que aca no se repite.
 *
 * Los planes alternan de lado. Al invertir no alcanza con mover el celular:
 * tambien se invierten los anchos de las columnas, si no el celular cae en la
 * columna ancha y el texto queda apretado contra la izquierda.
 */
function DetallePlan({ plan, invertido }: { plan: Plan; invertido: boolean }) {
  // El ancla envuelve al plan entero y no solo al texto: en mobile el celular
  // va arriba, y saltar al texto dejaba la demo fuera de pantalla.
  return (
    <div id={`plan-${plan.id}`} className="scroll-mt-24">
      <Revelar
        as="article"
        className={`mx-auto grid max-w-[1100px] items-center gap-10 md:gap-16 lg:gap-24 ${
          invertido
            ? "md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
            : "md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
        }`}
      >
        <div className={`flex flex-col items-center ${invertido ? "md:order-2" : ""}`}>
          <div className="relative w-full max-w-[300px] rounded-[22px] bg-[linear-gradient(160deg,rgba(0,153,255,0.16),rgba(0,153,255,0)_60%)] px-6 pt-8 sm:max-w-[340px]">
            <Telefono video={plan.video} poster={plan.poster} etiqueta={`Demo del plan ${plan.nombre}`} />
          </div>
          <p className="mt-4 text-sm text-text-muted">Demo con un negocio de ejemplo</p>
        </div>

        <div>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <h3 className="text-[clamp(2rem,4vw,3rem)] text-text">{plan.nombre}</h3>
            {plan.destacado && <Destacado texto={plan.destacado} />}
          </div>
          <p className="mt-3 text-lg leading-snug text-text sm:text-xl">{plan.resumen}</p>
          <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-text-muted sm:text-base">
            {plan.paraQuien}
          </p>

          <div className="mt-8">
            <Lista titulo="Lo que ganás vos" items={plan.vos} />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-line pt-8">
            <div>
              <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <PrecioLista plan={plan} className="text-lg" />
                <span className="font-display text-3xl font-medium tracking-[-0.04em] text-text">
                  {pesos(plan.precio)}
                </span>
                <EtiquetaDescuento plan={plan} />
              </p>
              <p className="mt-1.5 text-sm text-text-muted">
                Precio de lanzamiento · pago único + {pesos(MENSUAL)}/mes
              </p>
            </div>
            <IrA
              id="formulario"
              plan={plan.id}
              data-boton="claro"
              data-analytics={`turnos-plan-${plan.id}`}
              className="group"
            >
              <TextoDeslizante>{`Quiero ${plan.nombre}`}</TextoDeslizante>
            </IrA>
          </div>
        </div>
      </Revelar>
    </div>
  );
}

function Destacado({ texto }: { texto: string }) {
  return (
    <span className="whitespace-nowrap rounded-card bg-azul px-2.5 py-1 text-sm font-medium text-[#04121f]">
      {texto}
    </span>
  );
}

/**
 * Precio de lista tachado. El `<s>` solo no lo anuncia ningun lector de
 * pantalla, asi que lleva el rotulo escondido.
 */
function PrecioLista({ plan, className = "" }: { plan: Plan; className?: string }) {
  return (
    <span className={`text-text-muted ${className}`}>
      <span className="sr-only">Precio de lista: </span>
      <s>{pesos(plan.precioLista)}</s>
      <span className="sr-only">. Precio de lanzamiento:</span>
    </span>
  );
}

function EtiquetaDescuento({ plan }: { plan: Plan }) {
  return (
    <span className="self-center whitespace-nowrap rounded-card border border-azul/50 px-2 py-0.5 text-sm text-azul">
      −{descuento(plan)}%
    </span>
  );
}

/**
 * Las tres tarjetas de precio: para que es cada plan, el precio con su
 * descuento, lo que incluye y el boton. La primera version era una tira con
 * nombre y precio, y no le daba a nadie un motivo para elegir.
 *
 * El destacado es el del medio ("Recomendado"): el caro hace de ancla y el
 * medio queda como la eleccion razonable. No dice "el mas elegido" porque
 * todavia no hay clientes que lo respalden.
 */
function Planes() {
  return (
    <Seccion
      id="planes"
      titulo="Tres planes, precio a la vista"
      bajada="Cada uno suma sobre el anterior. Pagás el 30% para arrancar y el 70% cuando te lo entregamos funcionando."
    >
      <Revelar>
        <p className="mb-6 text-center text-[15px] text-text">
          Precio de lanzamiento: <span className="text-azul">{DESCUENTO}% de descuento</span> en los tres planes
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
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-2xl text-text">{p.nombre}</h3>
              {p.destacado && <Destacado texto={p.destacado} />}
            </div>
            <p className="mt-2 text-[15px] leading-snug text-text-muted lg:min-h-[3em]">{p.resumen}</p>

            <div className="mt-6">
              <p className="flex items-center gap-2.5">
                <PrecioLista plan={p} />
                <EtiquetaDescuento plan={p} />
              </p>
              <p className="mt-1 font-display text-4xl font-medium leading-none tracking-[-0.04em] text-text">
                {pesos(p.precio)}
              </p>
              <p className="mt-2.5 text-sm text-text-muted">pago único + {pesos(MENSUAL)}/mes</p>
            </div>

            <ul className="mt-6 flex flex-1 flex-col gap-3 border-t border-line pt-6">
              {p.incluye.map((t) => (
                <li key={t} className="flex gap-3 text-[15px] leading-snug text-text">
                  <Check className="mt-0.5 size-4 shrink-0 text-azul" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>

            <IrA
              id="formulario"
              plan={p.id}
              data-boton={p.destacado ? "claro" : "linea"}
              data-analytics={`turnos-precio-${p.id}`}
              className="group mt-8 min-h-[52px] w-full text-base"
            >
              <TextoDeslizante>{`Quiero ${p.nombre}`}</TextoDeslizante>
            </IrA>
            <IrA
              id={`plan-${p.id}`}
              className="mt-3 inline-flex items-center justify-center gap-1.5 self-center rounded-card px-3 py-2 text-sm text-text-muted transition-colors hover:text-text"
            >
              Ver la demo
              <ArrowDown className="size-3.5" aria-hidden />
            </IrA>
          </Revelar>
        ))}
      </div>

      <Revelar className="mx-auto mt-4 flex max-w-[1180px] flex-col gap-5 rounded-card border border-line bg-bg-elev p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg text-text">
            Mantenimiento: {pesos(MENSUAL)} por mes, igual en los tres planes
          </p>
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
        El bot de Piloto automático funciona con la API oficial de WhatsApp Business.
        Los mensajes que cobra Meta van aparte y a nombre de tu negocio.
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
    texto: "Con la seña del 30% arrancamos: servicios, horarios, fotos y precios. Vos lo revisás antes de publicarlo.",
  },
  {
    titulo: "Queda andando",
    texto: "Con todo terminado pagás el 70% restante, te mostramos cómo usar el panel y empezás a recibir turnos.",
  },
];

function Proceso() {
  return (
    <Seccion titulo="Cómo arrancamos" bajada="Sin reuniones eternas ni nada que instalar.">
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

const PREGUNTAS = [
  {
    p: "¿Me sirve para mi rubro?",
    r: "Si trabajás con turnos, sí: peluquerías y barberías, uñas y pestañas, estética, masajes, consultorios, entrenadores, canchas. Los servicios, las duraciones y los horarios se arman a la medida de tu negocio.",
  },
  {
    p: "¿Mis clientes tienen que bajarse una app?",
    r: "No. Reservan desde un link que se abre en el navegador del celular: eligen servicio, día y horario, y dejan su nombre y celular. No instalan nada ni se crean una cuenta.",
  },
  {
    p: "Ya uso otra app de turnos, ¿me conviene cambiar?",
    r: "Si la que tenés te resuelve, capaz que no. Lo que cambia con Trevoo es que la página de reservas tiene tu marca y no la de una app, la armamos nosotros con tus servicios y horarios, y sobre la misma agenda podés sumar tu web y el bot de WhatsApp.",
  },
  {
    p: "¿En cuánto tiempo está listo?",
    r: "Depende del plan y de que tengamos tus servicios, precios y fotos. Antes de arrancar te damos una fecha de entrega concreta.",
  },
  {
    p: "¿Qué es la demo personalizada?",
    r: "Nos contás de tu negocio y te mandamos por WhatsApp un video de cómo quedaría el sistema con tu marca, tus servicios y tus precios. Es gratis y no te compromete a nada.",
  },
  {
    p: "¿Cómo pago?",
    r: "En dos partes: una seña del 30% para arrancar y el 70% restante cuando te entregamos el proyecto terminado. Podés pagar por el medio que te quede más cómodo.",
  },
  {
    p: "¿Qué incluye el mensual?",
    r: `${pesos(MENSUAL)} por mes, igual en los tres planes: hosting y dominio, mantenimiento y actualizaciones, y rondas de cambios para tus servicios, precios, textos y fotos.`,
  },
  {
    p: "¿Qué pasa si dejo de pagar el mensual?",
    r: "La web y el sistema de turnos se dan de baja, porque el mensual es lo que los mantiene andando. El dominio sigue siendo tuyo.",
  },
  {
    p: "¿Puedo empezar con un plan y pasarme a otro después?",
    r: "Sí. Pagás la diferencia entre los dos planes y sumamos lo que falta sobre lo que ya tenés.",
  },
  {
    p: "¿Puedo cambiar servicios, precios u horarios después?",
    r: "Sí. Los horarios en los que no atendés los bloqueás vos desde el panel. Los cambios de servicios, precios, textos y fotos entran en el mensual: nos los pedís y los cargamos.",
  },
  {
    p: "¿Qué pasa si un cliente cancela?",
    r: "Cancela o reprograma solo, sin escribirte. El horario vuelve a quedar libre para otro cliente y vos lo ves en el panel.",
  },
  {
    p: "¿Tengo que saber de tecnología?",
    r: "No. Lo dejamos funcionando y te mostramos cómo usar el panel. Si sabés usar WhatsApp, sabés usar esto.",
  },
  {
    p: "¿El bot contesta desde mi WhatsApp?",
    r: "Funciona con la API oficial de WhatsApp Business. Antes de arrancar vemos juntos con qué número conviene hacerlo. Cuando una consulta necesita a una persona, el bot te pasa la conversación.",
  },
];

function Preguntas() {
  return (
    <Seccion id="preguntas" titulo="Preguntas frecuentes">
      <div className="mx-auto mt-12 max-w-[820px] divide-y divide-line border-y border-line">
        {PREGUNTAS.map((q) => (
          <details key={q.p} className="group">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg text-text [&::-webkit-details-marker]:hidden">
              {q.p}
              <ChevronDown
                className="size-5 shrink-0 text-text-muted transition-transform duration-[var(--duration-micro)] group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <p className="max-w-[64ch] pb-6 text-[15px] leading-relaxed text-text-muted sm:text-base">{q.r}</p>
          </details>
        ))}
      </div>
    </Seccion>
  );
}
