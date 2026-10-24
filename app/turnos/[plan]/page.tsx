import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/ui/Logo";
import { Revelar } from "@/components/ui/Revelar";
import { Seccion } from "@/components/ui/Seccion";
import { TextoDeslizante } from "@/components/ui/TextoDeslizante";
import { Formulario } from "@/components/turnos/Formulario";
import { IrA } from "@/components/turnos/IrA";
import { Preguntas } from "@/components/turnos/Preguntas";
import { Telefono } from "@/components/turnos/Telefono";
import { Destacado, Etiqueta, EtiquetaDescuento, Lista, PrecioLista } from "@/components/turnos/piezas";
import { MENSUAL, planPorId, planes, pesos, type Plan } from "@/lib/planes";
import { preguntasPorPlan } from "@/lib/preguntasTurnos";

/*
  Pagina de un plan (/turnos/agenda, /turnos/vidriera, /turnos/piloto).

  Reemplaza a la seccion "Mira cada plan funcionando" de /turnos, que en
  mobile quedaba de relleno. Tiene dos usos: el boton "Ver la demo" de cada
  tarjeta de precios, y el link que se manda por WhatsApp cuando alguien
  pregunta por un plan (la campaña de mensajes lleva a WhatsApp).

  Cierra sola: demo, precio, preguntas de ese plan y su propio formulario con
  el plan ya elegido. La unica salida es volver a comparar planes.
*/

export function generateStaticParams() {
  return planes.map((p) => ({ plan: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/turnos/[plan]">): Promise<Metadata> {
  const { plan: id } = await params;
  const plan = planPorId(id);
  if (!plan) return {};

  const titulo = `Plan ${plan.nombre}: ${plan.resumen}`;
  const descripcion = `${plan.paraQuien} Desde ${pesos(plan.precio)}, precio de lanzamiento. Mirá la demo y pedí la tuya gratis.`;
  return {
    title: `Plan ${plan.nombre} | Trevoo`,
    description: descripcion,
    alternates: { canonical: `/turnos/${plan.id}` },
    openGraph: { title: titulo, description: descripcion, url: `/turnos/${plan.id}` },
  };
}

export default async function PaginaPlan({ params }: PageProps<"/turnos/[plan]">) {
  const { plan: id } = await params;
  const plan = planPorId(id);
  if (!plan) notFound();

  const otros = planes.filter((p) => p.id !== plan.id);

  return (
    <>
      <BarraPlan />
      <main className="flex-1 pt-[104px] sm:pt-[124px]">
        <section className="mx-auto max-w-[1100px] px-5 sm:px-8">
          <Link
            href="/turnos#planes"
            className="inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-text"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Ver los tres planes
          </Link>

          <div className="mt-10 grid items-center gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 lg:gap-24">
            <div className="flex flex-col items-center">
              <div className="relative w-full max-w-[300px] rounded-[22px] bg-[linear-gradient(160deg,rgba(0,153,255,0.16),rgba(0,153,255,0)_60%)] px-6 pt-8 sm:max-w-[340px]">
                <Telefono
                  video={plan.video}
                  poster={plan.poster}
                  etiqueta={`Demo del plan ${plan.nombre}`}
                  prioridad
                />
              </div>
              <p className="mt-4 text-sm text-text-muted">
                Demo con un negocio de ejemplo ·{" "}
                <a
                  href="/turnos/recorrido.mp4"
                  target="_blank"
                  rel="noopener"
                  className="text-text underline decoration-line-alto underline-offset-4 transition-colors hover:decoration-text"
                >
                  Ver el recorrido completo (1 min)
                </a>
              </p>
            </div>

            {/* En mobile el texto va arriba del celular: primero que es, despues verlo. */}
            <div className="max-md:-order-1">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <h1 className="text-[clamp(2.5rem,6vw,4.25rem)] text-text">{plan.nombre}</h1>
                {plan.destacado && <Destacado texto={plan.destacado} />}
                {plan.etiqueta && <Etiqueta texto={plan.etiqueta} />}
              </div>
              <p className="mt-4 text-xl leading-snug text-text">{plan.resumen}</p>
              <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-text-muted sm:text-base">
                {plan.paraQuien}
              </p>
              <PrecioYBoton plan={plan} className="mt-8" />
            </div>
          </div>
        </section>

        <Seccion ancho="max-w-[900px]" titulo={`Qué incluye ${plan.nombre}`}>
          <Revelar className="mx-auto grid max-w-[900px] gap-10 rounded-card border border-line bg-bg-elev p-6 sm:grid-cols-2 sm:p-10">
            <Lista titulo="Incluye" items={plan.incluye} />
            <Lista titulo="Lo que ganás vos" items={plan.vos} />
          </Revelar>
          <p className="mx-auto mt-6 max-w-[64ch] text-center text-sm leading-relaxed text-text-muted">
            Mantenimiento: {pesos(MENSUAL)} por mes, con hosting, dominio, actualizaciones y cambios de
            servicios, precios, textos y fotos.
            {plan.id === "piloto" &&
              " Los mensajes de WhatsApp que cobra Meta van aparte y a nombre de tu negocio."}
          </p>
        </Seccion>

        <Preguntas titulo={`Preguntas sobre ${plan.nombre}`} preguntas={preguntasPorPlan[plan.id]} />

        <Seccion ancho="max-w-[900px]" titulo="¿Otro plan?" bajada="Los tres planes suman uno sobre otro. Si arrancás con uno, después podés pasarte pagando la diferencia.">
          <div className="mx-auto grid max-w-[900px] gap-4 sm:grid-cols-2">
            {otros.map((p, i) => (
              <Revelar key={p.id} demora={i * 90}>
                <Link
                  href={`/turnos/${p.id}`}
                  className="group flex h-full flex-col rounded-card border border-line bg-bg-elev p-6 transition-colors hover:bg-bg-alto sm:p-7"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-2xl text-text">{p.nombre}</span>
                    <ArrowRight
                      className="size-5 text-text-muted transition-transform duration-[var(--duration-micro)] group-hover:translate-x-1"
                      aria-hidden
                    />
                  </span>
                  <span className="mt-2 text-[15px] leading-snug text-text-muted">{p.resumen}</span>
                  <span className="mt-5 flex items-baseline gap-2.5">
                    <PrecioLista plan={p} className="text-sm" />
                    <span className="font-display text-2xl font-medium tracking-[-0.03em] text-text">
                      {pesos(p.precio)}
                    </span>
                  </span>
                </Link>
              </Revelar>
            ))}
          </div>
        </Seccion>

        <Seccion
          id="formulario"
          ancho="max-w-[760px]"
          titulo={`Pedí tu demo de ${plan.nombre}`}
          bajada="Contanos de tu negocio y te mandamos por WhatsApp un video de cómo quedaría con tu marca, tus servicios y tus precios. Gratis y sin compromiso."
        >
          <Revelar className="mx-auto mt-12 max-w-[760px]">
            <Formulario planInicial={plan.id} />
          </Revelar>
        </Seccion>
      </main>
      <Footer />
    </>
  );
}

/** Barra de la pagina de un plan: el logo, volver a los planes y la accion. */
function BarraPlan() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 sm:pt-6">
      <div className="pointer-events-auto grid h-[60px] w-full max-w-[1220px] grid-cols-[1fr_auto_1fr] items-center gap-4 rounded-[22px] border border-line bg-bg-elev/85 px-3 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-[5px] sm:h-[67px] sm:px-4">
        <Link href="/turnos" className="flex items-center justify-self-start pl-2 text-white" aria-label="Trevoo, ver los planes de turnos">
          <Logo className="text-[17px] sm:text-[18px]" />
        </Link>
        <Link
          href="/turnos#planes"
          className="hidden rounded-card px-3 py-2 text-[15px] text-white/75 transition-colors hover:text-white md:inline-flex"
        >
          Comparar planes
        </Link>
        <IrA
          id="formulario"
          data-boton="claro"
          data-analytics="turnos-plan-barra"
          className="group col-start-3 justify-self-end"
        >
          <TextoDeslizante>Pedir demo gratis</TextoDeslizante>
        </IrA>
      </div>
    </header>
  );
}

function PrecioYBoton({ plan, className = "" }: { plan: Plan; className?: string }) {
  return (
    <div className={`border-t border-line pt-8 ${className}`}>
      <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <PrecioLista plan={plan} className="text-lg" />
        <span className="font-display text-4xl font-medium tracking-[-0.04em] text-text">{pesos(plan.precio)}</span>
        <EtiquetaDescuento plan={plan} />
      </p>
      <p className="mt-2 text-sm text-text-muted">Precio de lanzamiento · pago único + {pesos(MENSUAL)}/mes</p>
      <p className="mt-1 text-sm text-text-muted">30% para arrancar, 70% cuando está terminado</p>
      <IrA
        id="formulario"
        plan={plan.id}
        data-boton="claro"
        data-analytics={`turnos-pagina-${plan.id}`}
        className="group mt-6 min-h-[52px] px-6 text-base"
      >
        <TextoDeslizante>{`Quiero ${plan.nombre}`}</TextoDeslizante>
      </IrA>
    </div>
  );
}
