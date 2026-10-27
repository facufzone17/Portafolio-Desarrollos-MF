import Image from "next/image";
import { DemoEnVivo } from "@/components/turnos/DemoEnVivo";
import { IrA } from "@/components/turnos/IrA";
import { TextoDeslizante } from "@/components/ui/TextoDeslizante";
import { DESDE, pesos, planes } from "@/lib/planes";

/**
 * Hero de /turnos. Misma placa azul que el de la home (components/hero/Hero.tsx),
 * con margen de 12px y entrada escalonada con `data-hero-entra`.
 *
 * Adentro, el sistema de reservas real (el de la demo del plan Agenda, con el
 * negocio de ejemplo Estudio Nacar): el visitante elige servicio, dia y
 * horario y reserva como lo haria su cliente, sin salir del hero. Es la misma
 * demo que se ve en la pagina de cada plan (components/turnos/DemoEnVivo.tsx).
 * Reemplaza a la vista previa simulada que se personalizaba con el nombre del
 * negocio: la demo real no se puede personalizar al vuelo, y a cambio lo que se
 * prueba es el producto de verdad. La personalizacion queda para la demo
 * gratis que se pide con el boton.
 *
 * En escritorio, texto y boton a la izquierda y el celular a la derecha. En
 * mobile el celular va entre el titulo y el boton, y ahi la demo es el video
 * con un boton que abre la de verdad a pantalla completa.
 */

const retardo = (ms: number) => ({ "--hero-retardo": `${ms}ms` }) as React.CSSProperties;

const AGENDA = planes.find((p) => p.id === "agenda")!;

export function HeroTurnos() {
  return (
    <section className="relative">
      <div className="p-3">
        <div className="relative overflow-clip rounded-[10px]">
          <Image
            src="/images/hero-bg.jpg"
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,6,16,0.82)_0%,rgba(4,6,16,0.62)_45%,rgba(4,6,16,0.78)_100%)]"
          />

          <div className="relative mx-auto max-w-[1180px] px-5 pb-16 pt-[112px] sm:px-8 sm:pb-20 sm:pt-[136px] lg:min-h-[min(100svh,900px)] lg:pb-24">
            <div className="grid items-center gap-x-12 gap-y-8 [grid-template-areas:'enc'_'tel'_'ctl'] lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-y-6 lg:[grid-template-areas:'enc_tel'_'ctl_tel']">
              <div className="[grid-area:enc] lg:self-end">
                <h1
                  data-hero-entra
                  style={retardo(0)}
                  className="max-w-[16ch] text-[clamp(2.2rem,4.8vw,4rem)] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]"
                >
                  Contestamos tu WhatsApp y te llenamos la agenda.{" "}
                  <span className="text-white/55">Vos atendés.</span>
                </h1>
                <p
                  data-hero-entra
                  style={retardo(130)}
                  className="mt-5 max-w-[46ch] text-base leading-relaxed text-white/80 sm:text-lg"
                >
                  Un bot que responde y agenda por vos, tu web y tus reservas online, para negocios
                  que trabajan con turnos. Probá reservar acá, como lo haría tu cliente.
                </p>
              </div>

              <div data-hero-entra style={retardo(260)} className="[grid-area:ctl] lg:self-start">
                <IrA
                  id="formulario"
                  data-boton="claro"
                  data-analytics="turnos-hero"
                  className="group min-h-[56px] w-full px-6 text-base sm:w-auto"
                >
                  <TextoDeslizante>Quiero mi página de reservas</TextoDeslizante>
                </IrA>
                <p className="mt-3 text-sm text-white/65">
                  Gratis. Te mandamos la demo con tus datos por WhatsApp.
                </p>
                <p className="mt-5 text-sm text-white/65">
                  Desde {pesos(DESDE)} por mes · Precio de lanzamiento para los primeros negocios.{" "}
                  <IrA id="planes" className="text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
                    Ver planes y precios
                  </IrA>
                </p>
              </div>

              {/* El celular con la demo. El ancho tambien lo limita el alto de la
                  ventana, para que en una notebook se vea entera sin scrollear. */}
              <div
                data-hero-entra
                style={retardo(420)}
                className="flex flex-col items-center [grid-area:tel]"
              >
                <div className="w-[min(78vw,300px)] lg:w-[clamp(236px,calc((100svh-260px)*0.462),320px)]">
                  <DemoEnVivo
                    url={AGENDA.demo!}
                    video={AGENDA.video}
                    poster={AGENDA.poster}
                    etiqueta="Demo en vivo del sistema de reservas"
                    analytics="turnos-hero-demo"
                  />
                </div>
                <p className="mt-4 max-w-[34ch] text-center text-sm text-white/65">
                  Es el sistema real con un negocio de ejemplo: probá reservar.
                  {/* En tactil ya esta el boton sobre el celular. */}
                  <span className="[@media(hover:none)]:hidden">
                    {" "}
                    <a
                      href={AGENDA.demo}
                      target="_blank"
                      rel="noopener"
                      className="text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
                    >
                      Abrir en pantalla completa
                    </a>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
