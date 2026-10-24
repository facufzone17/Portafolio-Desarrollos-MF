import type { Metadata } from "next";
import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/ui/Logo";
import { Revelar } from "@/components/ui/Revelar";
import { Seccion } from "@/components/ui/Seccion";
import { Formulario } from "@/components/turnos/Formulario";
import { IrA } from "@/components/turnos/IrA";
import { HeroTurnos } from "@/components/turnos/HeroTurnos";
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
        <Problema />
        <Recorrido />
        <Panel />
        <Planes />
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
  { id: "planes", nombre: "Precios" },
  { id: "preguntas", nombre: "Preguntas" },
];

/**
 * Barra propia de la landing: logo, secciones y la accion. Sin los links de la
 * home — desde un anuncio, cada salida que no es el formulario es una fuga. Las
 * secciones son anclas de esta misma pagina, asi que no sacan a nadie; en
 * mobile no entran y queda solo el boton.
 */
function Barra() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-6">
      <div className="pointer-events-auto flex h-[60px] w-full max-w-[1220px] items-center justify-between gap-4 rounded-[22px] border border-line bg-bg-elev/85 px-3 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-[5px] sm:h-[67px] sm:px-4">
        <Link href="/" className="flex shrink-0 items-center pl-2 text-white" aria-label="Trevoo, ir al inicio">
          <Logo className="text-[17px] sm:text-[18px]" />
        </Link>
        <nav aria-label="Secciones" className="flex items-center gap-1">
          {SECCIONES.map((s) => (
            <IrA
              key={s.id}
              id={s.id}
              className="hidden rounded-card px-3 py-2 text-[15px] text-white/75 transition-colors hover:text-white md:inline-flex"
            >
              {s.nombre}
            </IrA>
          ))}
          <IrA id="formulario" data-boton="claro" data-analytics="turnos-barra" className="group">
            <TextoDeslizante>Pedir demo gratis</TextoDeslizante>
          </IrA>
        </nav>
      </div>
    </header>
  );
}

const DOLORES = [
  {
    titulo: "Te escriben a las 11 de la noche",
    texto: "Contestás al otro día y para entonces ya sacaron turno en otro lado.",
  },
  {
    titulo: "«¿Tenés lugar el jueves?»",
    texto: "Una pregunta que se convierte en diez mensajes de ida y vuelta hasta cerrar un horario.",
  },
  {
    titulo: "Reservan y no vienen",
    texto: "Nadie les recordó el turno, y ese hueco ya no lo llenás.",
  },
];

function Problema() {
  return (
    <Seccion
      titulo="Cada turno que coordinás a mano es tiempo que no estás atendiendo"
      anchoTitulo="max-w-[860px]"
    >
      <ul className="mx-auto mt-14 grid max-w-[1100px] gap-4 md:grid-cols-3">
        {DOLORES.map((d, i) => (
          <Revelar as="li" key={d.titulo} demora={i * 90} className="rounded-card border border-line bg-bg-elev p-6 sm:p-7">
            <h3 className="text-xl text-text sm:text-2xl">{d.titulo}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-text-muted">{d.texto}</p>
          </Revelar>
        ))}
      </ul>
    </Seccion>
  );
}

/**
 * El video completo de la demo (el mismo que se le manda a un lead, sobre el
 * negocio de ejemplo). Con controles y sin autoplay: es un minuto, lo arranca
 * el que quiere verlo.
 */
function Recorrido() {
  return (
    <section id="como-funciona" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Revelar className="grid items-center gap-10 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] md:gap-16 lg:gap-24">
          <div>
            <h2 className="text-[clamp(2rem,4.6vw,3.5rem)]">Así funciona, de punta a punta, en un minuto</h2>
            <p className="mt-5 max-w-[50ch] text-[15px] leading-relaxed text-text-muted sm:text-base">
              Un centro de estética de ejemplo con el plan más completo: un
              cliente reserva desde la web, otro saca turno hablando con el bot,
              y los dos aparecen solos en la agenda del negocio.
            </p>
            <div className="mt-8">
              <Lista
                titulo="En el video"
                items={[
                  "La web del negocio, con servicios y precios",
                  "Una reserva completa, sin escribirle a nadie",
                  "El bot ofreciendo horarios y mandando el recordatorio",
                  "El panel del dueño con los turnos del día",
                ]}
              />
            </div>
            <p className="mt-8 text-sm text-text-muted">
              Así es la demo personalizada que te mandamos, pero con tu marca,
              tus servicios y tus precios.
            </p>
          </div>
          <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-card border border-line bg-bg-elev shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
            <video
              src="/turnos/recorrido.mp4"
              poster="/turnos/recorrido.webp"
              controls
              playsInline
              preload="none"
              aria-label="Video de un minuto con la demo completa en un centro de estética de ejemplo"
              className="aspect-[9/16] w-full bg-black object-cover"
            />
          </div>
        </Revelar>
      </div>
    </section>
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

function DetallePlan({ plan, invertido }: { plan: Plan; invertido: boolean }) {
  // El ancla envuelve al plan entero y no solo al texto: en mobile el celular
  // va arriba, y saltar al texto dejaba la demo fuera de pantalla.
  return (
    <div id={`plan-${plan.id}`} className="scroll-mt-24">
      <Revelar
        as="article"
        className="grid items-center gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 lg:gap-24"
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
            {plan.destacado && (
              <span className="whitespace-nowrap rounded-card bg-azul px-2.5 py-1 text-sm font-medium text-[#04121f]">
                {plan.destacado}
              </span>
            )}
          </div>
          <p className="mt-3 text-lg leading-snug text-text sm:text-xl">{plan.resumen}</p>
          <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-text-muted sm:text-base">
            {plan.paraQuien}
          </p>

          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            <Lista titulo="Incluye" items={plan.incluye} />
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
              <p className="mt-1 text-sm text-text-muted">30% para arrancar, 70% cuando está terminado</p>
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

function Panel() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <Revelar className="grid items-center gap-10 rounded-card border border-line bg-bg-elev p-6 sm:p-10 md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:gap-16 lg:p-16">
          <div>
            <h2 className="text-[clamp(2rem,4.2vw,3.25rem)]">En los tres planes, tu agenda entra en el bolsillo</h2>
            <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-text-muted sm:text-base">
              Todo lo que se reserva —por el link, por la web o por el bot— cae
              en el mismo panel. Lo abrís desde el celular, sin instalar nada.
            </p>
            <div className="mt-8">
              <Lista
                titulo="Desde el panel"
                items={[
                  "Ves los turnos del día y de la semana, en lista o en grilla",
                  "Te avisa cuando entra un turno nuevo",
                  "Bloqueás horarios cuando no atendés",
                  "Marcás quién vino y ves las cancelaciones",
                ]}
              />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <Telefono
              video="/turnos/panel.mp4"
              poster="/turnos/panel.webp"
              etiqueta="Panel de ejemplo con la agenda del día y de la semana"
              className="w-full max-w-[290px]"
            />
            <p className="mt-4 text-sm text-text-muted">Datos de ejemplo</p>
          </div>
        </Revelar>
      </div>
    </section>
  );
}

/**
 * Planes y precios en una sola seccion. Antes eran dos: el detalle de cada
 * plan con su demo y, mas abajo, tres tarjetas que repetian nombre, precio y
 * lista. Ahora arriba va una tira con los tres precios para ver el abanico de
 * un vistazo (cada uno lleva a su plan) y debajo el detalle, que ya trae lo
 * que incluye, el precio y el boton.
 */
function Planes() {
  return (
    <Seccion
      id="planes"
      titulo="Tres planes, precio a la vista"
      bajada="Cada uno suma sobre el anterior. Pagás el 30% para arrancar y el 70% cuando te lo entregamos funcionando."
    >
      <Revelar>
        <p className="mb-4 text-center text-[15px] text-text">
          Precio de lanzamiento: <span className="text-azul">{DESCUENTO}% de descuento</span> en los tres planes
        </p>
        <ul className="mx-auto grid max-w-[760px] grid-cols-3 gap-2 sm:gap-3">
          {planes.map((p) => (
            <li key={p.id}>
              <IrA
                id={`plan-${p.id}`}
                className={`flex h-full flex-col items-center rounded-card border px-2 py-3 text-center transition-colors sm:px-4 sm:py-4 ${
                  p.destacado
                    ? "border-azul bg-azul/[0.07] hover:bg-azul/[0.12]"
                    : "border-line bg-bg-elev hover:bg-bg-alto"
                }`}
              >
                <span className="text-sm leading-tight text-text-muted sm:text-[15px]">{p.nombre}</span>
                {/* mt-auto: en mobile "Piloto automático" ocupa dos renglones y
                    sin esto sus precios quedaban mas abajo que los otros dos. */}
                <PrecioLista plan={p} className="mt-auto pt-1 text-xs sm:text-sm" />
                <span className="font-display text-lg font-medium tracking-[-0.03em] text-text sm:text-2xl">
                  {pesos(p.precio)}
                </span>
              </IrA>
            </li>
          ))}
        </ul>
      </Revelar>

      <div className="mt-20 flex flex-col gap-24 sm:mt-24 sm:gap-32">
        {planes.map((p, i) => (
          <DetallePlan key={p.id} plan={p} invertido={i % 2 === 1} />
        ))}
      </div>

      <Revelar className="mx-auto mt-24 flex max-w-[1180px] sm:mt-32 flex-col gap-5 rounded-card border border-line bg-bg-elev p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
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
