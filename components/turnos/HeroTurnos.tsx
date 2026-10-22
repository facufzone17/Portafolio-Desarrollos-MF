"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { TextoDeslizante } from "@/components/ui/TextoDeslizante";
import { IrA } from "@/components/turnos/IrA";
import { Telefono } from "@/components/turnos/Telefono";
import { planes, pesos } from "@/lib/planes";

/**
 * Hero de /turnos. Misma gramatica que el de la home (components/hero/Hero.tsx):
 * placa azul con margen de 12px, entrada escalonada con `data-hero-entra` y
 * dos capas que se rezagan distinto al scrollear — el texto se queda atras y
 * los celulares suben mas rapido y lo terminan tapando.
 *
 * Los celulares son las tres caras de lo que se vende: el bot, la web y el
 * panel. Solo el del medio tiene video; los costados son posters quietos y en
 * mobile no estan.
 */
const REZAGO_TEXTO = 0.35;
const REZAGO_TELEFONOS = 0.1;

const RETARDO = { titulo: 0, bajada: 130, botones: 260, dispositivos: 420 } as const;

const retardo = (ms: number) => ({ "--hero-retardo": `${ms}ms` }) as React.CSSProperties;

export function HeroTurnos() {
  const { scrollY } = useScroll();
  const yTexto = useTransform(scrollY, (v) => v * REZAGO_TEXTO);
  const yTelefonos = useTransform(scrollY, (v) => v * REZAGO_TELEFONOS);

  return (
    <section className="relative">
      <div className="p-3">
        <div className="relative h-[calc(100svh+170px)] min-h-[810px] overflow-clip rounded-[10px] sm:h-[calc(100svh+340px)] sm:min-h-[1040px]">
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
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,6,16,0.8)_0%,rgba(4,6,16,0.58)_36%,rgba(4,6,16,0.3)_62%,rgba(4,6,16,0.7)_100%)]"
          />

          <motion.div
            style={{ y: yTexto }}
            className="relative flex flex-col items-center px-5 pt-[clamp(124px,19svh,200px)] text-center sm:px-8"
          >
            <h1
              data-hero-entra
              style={retardo(RETARDO.titulo)}
              className="max-w-[15ch] text-[clamp(2.3rem,7.4vw,5.6rem)] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]"
            >
              Tus clientes sacan turno solos. <span className="text-white/55">Vos atendés.</span>
            </h1>
            <p
              data-hero-entra
              style={retardo(RETARDO.bajada)}
              className="mt-6 max-w-[46ch] text-base leading-relaxed text-white/80 sm:text-lg"
            >
              Sistema de reservas, página web y bot de WhatsApp para negocios que
              trabajan con turnos. Lo armamos con tu marca y queda andando las 24
              horas.
            </p>
            <div
              data-hero-entra
              style={retardo(RETARDO.botones)}
              className="mt-8 flex flex-col items-center"
            >
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <IrA id="planes" data-boton="oscuro" className="group min-h-[52px] px-6 text-base">
                  <TextoDeslizante>Ver los planes</TextoDeslizante>
                </IrA>
                <IrA
                  id="formulario"
                  data-boton="claro"
                  data-analytics="turnos-hero"
                  className="group min-h-[52px] px-6 text-base"
                >
                  <TextoDeslizante>Pedir mi demo gratis</TextoDeslizante>
                </IrA>
              </div>
              <p className="mt-5 text-sm text-white/70">
                Desde {pesos(planes[0].precio)}, pago único · Precios a la vista
              </p>
            </div>
          </motion.div>

          <motion.div
            style={{ y: yTelefonos }}
            className="pointer-events-none absolute inset-x-0 top-[calc(19svh+460px)] sm:top-[max(72svh,calc(19svh+540px))]"
          >
            <div data-hero-entra style={retardo(RETARDO.dispositivos)}>
              <div className="relative mx-auto w-full max-w-[1000px] px-5">
                <Telefono
                  poster={planes[2].poster}
                  etiqueta="Bot de WhatsApp de ejemplo respondiendo una consulta"
                  className="absolute left-[6%] top-[70px] hidden w-[27%] rotate-[-6deg] md:block"
                />
                <Telefono
                  poster="/turnos/panel.webp"
                  etiqueta="Panel del negocio con la agenda del día"
                  className="absolute right-[6%] top-[70px] hidden w-[27%] rotate-[6deg] md:block"
                />
                <Telefono
                  video={planes[1].video}
                  poster={planes[1].poster}
                  etiqueta="Web de ejemplo de un centro de estética con reserva de turnos"
                  prioridad
                  className="relative mx-auto w-[min(70vw,300px)] md:w-[31%]"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
