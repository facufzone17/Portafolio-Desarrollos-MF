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
import { MENSUAL, incluyeMensual, planes, pesos, type Plan } from "@/lib/planes";

/*
  Landing de turnos (22/10/2026). Destino de la pauta de Meta: vende los tres
  planes (Agenda, Vidriera, Piloto automatico) con precio a la vista y lleva al
  formulario, que abre WhatsApp con las respuestas.

  Mismo sistema que la home (negro neutro, un solo azul, radio 10, Inter Tight
  500) pero sin la entrada ni la barra de secciones: el que llega desde un
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
        <Seccion
          id="planes"
          titulo="Tres planes. Elegí hasta dónde querés automatizar."
          bajada="Cada uno suma sobre el anterior. Mirá cómo funciona en un centro de estética de ejemplo."
        >
          <div className="mt-16 flex flex-col gap-24 sm:mt-20 sm:gap-32">
            {planes.map((p, i) => (
              <DetallePlan key={p.id} plan={p} invertido={i % 2 === 1} />
            ))}
          </div>
        </Seccion>
        <Panel />
        <Precios />
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

/**
 * Barra propia de la landing: logo, planes y la accion. Sin los links de la
 * home — desde un anuncio, cada salida que no es el formulario es una fuga.
 */
function Barra() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-6">
      <div className="pointer-events-auto flex h-[60px] w-full max-w-[1220px] items-center justify-between gap-4 rounded-[22px] border border-line bg-bg-elev/85 px-3 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-[5px] sm:h-[67px] sm:px-4">
        <Link href="/" className="flex shrink-0 items-center pl-2 text-white" aria-label="Trevoo, ir al inicio">
          <Logo className="text-[17px] sm:text-[18px]" />
        </Link>
        <nav aria-label="Secciones" className="flex items-center gap-1">
          <IrA
            id="precios"
            className="hidden rounded-card px-3 py-2 text-[15px] text-white/75 transition-colors hover:text-white sm:inline-flex"
          >
            Precios
          </IrA>
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
    <section className="py-20 sm:py-28">
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
  return (
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

      <div id={`plan-${plan.id}`} className="scroll-mt-24">
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
          <Lista titulo="Lo que hace tu cliente" items={plan.tuCliente} />
          <Lista titulo="Lo que ganás vos" items={plan.vos} />
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-line pt-8">
          <p>
            <span className="font-display text-3xl font-medium tracking-[-0.04em] text-text">
              {pesos(plan.precio)}
            </span>
            <span className="ml-2 text-sm text-text-muted">pago único + {pesos(MENSUAL)}/mes</span>
          </p>
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

function Precios() {
  return (
    <Seccion
      id="precios"
      titulo="Precios claros, pago único"
      bajada="Lo armamos una vez y es tuyo. Después, un mensual chico para que siga andando."
    >
      <div className="mx-auto mt-14 grid max-w-[1180px] gap-4 lg:grid-cols-3">
        {planes.map((p, i) => (
          <Revelar
            key={p.id}
            demora={i * 90}
            className={`flex flex-col rounded-card border p-6 sm:p-8 ${
              p.destacado ? "border-azul bg-azul/[0.07]" : "border-line bg-bg-elev"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-2xl text-text">{p.nombre}</h3>
              {p.destacado && (
                <span className="whitespace-nowrap rounded-card bg-azul px-2.5 py-1 text-sm font-medium text-[#04121f]">
                  {p.destacado}
                </span>
              )}
            </div>
            <p className="mt-2 min-h-[3em] text-[15px] leading-snug text-text-muted">{p.resumen}</p>
            <p className="mt-6">
              <span className="font-display text-[2.6rem] font-medium leading-none tracking-[-0.04em] text-text">
                {pesos(p.precio)}
              </span>
            </p>
            <p className="mt-2 text-sm text-text-muted">pago único + {pesos(MENSUAL)}/mes</p>
            <ul className="mt-7 flex flex-1 flex-col gap-3 border-t border-line pt-7">
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
    texto: "Servicios, horarios, fotos y precios. Vos lo revisás antes de publicarlo.",
  },
  {
    titulo: "Queda andando",
    texto: "Te mostramos cómo usar el panel y empezás a recibir turnos.",
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
    p: "¿En cuánto tiempo está listo?",
    r: "Depende del plan y de que tengamos tus servicios, precios y fotos. Antes de arrancar te damos una fecha de entrega concreta.",
  },
  {
    p: "¿Qué es la demo personalizada?",
    r: "Nos contás de tu negocio y te mandamos por WhatsApp un video de cómo quedaría el sistema con tu marca, tus servicios y tus precios. Es gratis y no te compromete a nada.",
  },
  {
    p: "¿Qué incluye el mensual?",
    r: `${pesos(MENSUAL)} por mes, igual en los tres planes: hosting y dominio, mantenimiento y actualizaciones, y rondas de cambios para tus servicios, precios, textos y fotos.`,
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
    <Seccion titulo="Preguntas frecuentes">
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
