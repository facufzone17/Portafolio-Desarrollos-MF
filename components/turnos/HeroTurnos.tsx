"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { TextoDeslizante } from "@/components/ui/TextoDeslizante";
import { IrA } from "@/components/turnos/IrA";
import { AgendaViva } from "@/components/turnos/AgendaViva";
import { DESCUENTO, planes, pesos } from "@/lib/planes";

/**
 * Hero de /turnos. Misma gramatica que el de la home (components/hero/Hero.tsx):
 * placa azul con margen de 12px, entrada escalonada con `data-hero-entra` y
 * dos capas que se rezagan distinto al scrollear — el texto se queda atras y
 * la agenda sube mas rapido y lo termina tapando.
 *
 * Debajo del texto, la agenda de la semana de un negocio de ejemplo
 * llenandose sola (components/turnos/AgendaViva.tsx). Reemplaza a los tres
 * celulares, que mostraban pantallas sueltas sin contar que pasaba entre ellas.
 *
 * El alto de la placa sale de donde arranca la agenda (19svh + 500 en mobile,
 * 19svh + 540 desde sm) mas lo que mide (~500 y ~600): atado solo al alto de
 * pantalla, en pantallas bajas la agenda quedaba cortada al pie.
 */
const REZAGO_TEXTO = 0.35;
const REZAGO_AGENDA = 0.1;

const RETARDO = { titulo: 0, bajada: 130, botones: 260, dispositivos: 420 } as const;

const retardo = (ms: number) => ({ "--hero-retardo": `${ms}ms` }) as React.CSSProperties;

export function HeroTurnos() {
  const { scrollY } = useScroll();
  const yTexto = useTransform(scrollY, (v) => v * REZAGO_TEXTO);
  const yAgenda = useTransform(scrollY, (v) => v * REZAGO_AGENDA);

  return (
    <section className="relative">
      <div className="p-3">
        <div className="relative h-[calc(19svh+1060px)] overflow-clip rounded-[10px] sm:h-[max(calc(100svh+340px),calc(19svh+1180px))] sm:min-h-[1040px]">
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
                Precio de lanzamiento, {DESCUENTO}% de descuento · Desde {pesos(planes[0].precio)}, pago único
              </p>
            </div>
          </motion.div>

          <motion.div
            style={{ y: yAgenda }}
            className="pointer-events-none absolute inset-x-0 top-[calc(19svh+500px)] sm:top-[max(72svh,calc(19svh+540px))]"
          >
            <div data-hero-entra style={retardo(RETARDO.dispositivos)}>
              <div className="mx-auto w-full max-w-[1040px] px-4 sm:px-8">
                <AgendaViva />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
