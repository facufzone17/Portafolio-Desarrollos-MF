import Image from "next/image";
import { IrA } from "@/components/turnos/IrA";
import { ReservaEnVivo } from "@/components/turnos/ReservaEnVivo";
import { DESDE, pesos } from "@/lib/planes";

/**
 * Hero de /turnos. Misma placa azul que el de la home (components/hero/Hero.tsx),
 * con margen de 12px y entrada escalonada con `data-hero-entra`.
 *
 * Adentro, la reserva en vivo (components/turnos/ReservaEnVivo.tsx): el
 * visitante escribe el nombre de su negocio y prueba su propia pagina de
 * reservas. Reemplaza a la agenda que se llenaba sola, que se leia como
 * "software" y no como "mi negocio".
 *
 * En escritorio, texto y campo a la izquierda y el celular a la derecha. En
 * mobile el celular va entre el titulo y el campo: cuando se abre el teclado,
 * el campo queda abajo y el cambio se sigue viendo arriba.
 */

const retardo = (ms: number) => ({ "--hero-retardo": `${ms}ms` }) as React.CSSProperties;

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
            <ReservaEnVivo
              encabezado={
                <>
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
                    que trabajan con turnos. Escribí el nombre del tuyo y probá reservar como lo haría
                    tu cliente.
                  </p>
                </>
              }
              pie={
                <p className="mt-5 text-center text-sm text-white/65">
                  Desde {pesos(DESDE)} por mes · Precio de lanzamiento para los primeros negocios.{" "}
                  <IrA id="planes" className="text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
                    Ver planes y precios
                  </IrA>
                </p>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
