import Image from "next/image";
import Link from "next/link";
import { Isotipo } from "@/components/ui/Isotipo";
import { DefinicionesMarcos } from "@/components/dispositivos/DefinicionesMarcos";
import { MarcoIPad } from "@/components/dispositivos/MarcoIPad";
import { MarcoIPhone } from "@/components/dispositivos/MarcoIPhone";
import { PantallaInmobiliaria } from "@/components/dispositivos/contenido/PantallaInmobiliaria";
import { PantallaTienda } from "@/components/dispositivos/contenido/PantallaTienda";
import { mensajes, whatsappUrl } from "@/lib/site";
import { PalabraRotativa } from "./PalabraRotativa";

/**
 * Hero.
 *
 * Estructura tomada de la referencia que eligio Facundo
 * (applio.framer.website): fondo de imagen a sangre, marca chica arriba,
 * titular grande, bajada angosta, dos botones y, apoyados sobre el borde de
 * abajo, dos dispositivos girados y superpuestos que se cortan con la pantalla.
 *
 * Tres cosas que no son obvias:
 *
 * 1. Los dispositivos son CSS, no fotos (ver components/dispositivos/). Pesan
 *    cero, la captura de adentro queda nitida a cualquier tamaño y se pueden
 *    cambiar sin volver a montar un PNG.
 *
 * 2. El velo sobre la imagen no es decorativo. El fondo es muy claro en el
 *    centro, justo donde cae el titular: sin velo, texto blanco sobre esa zona
 *    da menos de 2:1. El degradado oscurece arriba y en el medio y deja el
 *    resto de la foto a la vista.
 *
 * 3. La entrada de las piezas se pisa en el tiempo (ver `hero-entrada` en
 *    globals.css) y espera a que termine la pantalla de carga. Si corriera al
 *    montar, se consumiria detras del overlay negro del preloader.
 *
 * La palabra que rota debajo de "Desarrollando" se conserva intacta: es la
 * pieza que Facundo pidio mantener desde el sitio anterior.
 */

/** Retardos de la entrada, en ms. Se pisan a proposito: no son una fila. */
const RETARDO = {
  marca: 0,
  titulo: 130,
  bajada: 300,
  botones: 420,
  dispositivos: 540,
} as const;

export function Hero() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden">
      {/* Los recortes de esquina de los dos marcos, definidos una sola vez. */}
      <DefinicionesMarcos />

      <Image
        src="/images/hero-bg.jpg"
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />

      {/*
        El velo. Mas cerrado arriba (donde va la barra del sitio y el titular)
        y otra vez abajo, para que los dispositivos se despeguen del fondo.
      */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(4,6,16,0.82)_0%,rgba(4,6,16,0.62)_38%,rgba(4,6,16,0.35)_62%,rgba(4,6,16,0.72)_100%)]"
      />

      <div className="relative mx-auto flex min-h-[100svh] max-w-[1400px] flex-col items-center px-5 pt-24 text-center sm:px-8 sm:pt-28">
        <div
          data-hero-entra
          style={{ "--hero-retardo": `${RETARDO.marca}ms` } as React.CSSProperties}
          className="grid size-12 place-items-center rounded-card bg-white text-bg shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]"
        >
          <Isotipo className="h-5 w-auto" />
        </div>

        <h1
          data-hero-entra
          style={{ "--hero-retardo": `${RETARDO.titulo}ms` } as React.CSSProperties}
          className="mt-8 text-[clamp(2.05rem,8.2vw,6rem)] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]"
        >
          {/* Texto estable para lectores de pantalla. */}
          <span className="sr-only">
            Desarrollando sitios web, tiendas, automatizaciones y paneles de
            gestión para negocios.
          </span>
          <span aria-hidden className="block">
            <span className="block text-white/55">Desarrollando</span>
            <PalabraRotativa />
          </span>
        </h1>

        <p
          data-hero-entra
          style={{ "--hero-retardo": `${RETARDO.bajada}ms` } as React.CSSProperties}
          className="mt-6 max-w-[40ch] text-[15px] leading-relaxed text-white/70 sm:text-base"
        >
          Somos dos. Construimos la herramienta que tu negocio necesita y no la
          entregamos hasta verla funcionando con tus datos.
        </p>

        <div
          data-hero-entra
          style={{ "--hero-retardo": `${RETARDO.botones}ms` } as React.CSSProperties}
          className="mt-9 flex flex-wrap items-center justify-center gap-2.5"
        >
          <Link
            href="#proyectos"
            className="inline-flex min-h-11 items-center rounded-card bg-[#0c0c0c] px-5 text-sm font-medium text-white transition-colors duration-[var(--duration-micro)] hover:bg-black"
          >
            Proyectos
          </Link>
          <a
            href={whatsappUrl(mensajes.general)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-card bg-white px-5 text-sm font-medium text-[#0c0c0c] transition-colors duration-[var(--duration-micro)] hover:bg-white/90"
          >
            Contactanos
          </a>
        </div>

        {/*
          Los dispositivos.

          La caja que los contiene tiene un alto propio y los dos van anclados
          por ARRIBA (`top`), no por abajo: asi lo que se ve de cada aparato es
          exactamente el alto de la caja, y no un resto que cambia con la
          proporcion de la pantalla. El resto del dispositivo sigue hacia abajo
          y lo corta el `overflow-hidden` de la seccion, que es lo que los hace
          ver apoyados sobre el fondo y no metidos adentro de un recuadro.

          Anclarlos por abajo (que es lo intuitivo) hace lo contrario: el alto
          visible pasa a depender del alto del aparato, y en una pantalla baja
          los dos se van de cuadro casi enteros.
        */}
        <div
          data-hero-entra
          style={{ "--hero-retardo": `${RETARDO.dispositivos}ms` } as React.CSSProperties}
          className="relative mt-auto h-[clamp(148px,26svh,270px)] w-full max-w-[880px]"
        >
          <MarcoIPad
            etiqueta="Portada de un sitio de inmobiliaria, vista en una tablet"
            className="absolute top-0 left-1/2 w-[clamp(196px,32vw,392px)] -translate-x-[62%] rotate-[-7deg] drop-shadow-[0_36px_60px_rgba(0,0,0,0.5)]"
          >
            <PantallaInmobiliaria />
          </MarcoIPad>

          <MarcoIPhone
            etiqueta="Tienda online de una distribuidora, vista en un teléfono"
            // La tienda es clara, asi que la zona segura toma su crema y la
            // hora pasa a oscura: blanco sobre crema no se ve.
            fondo="#faf7f0"
            barraColor="#2a231c"
            className="absolute top-[13%] left-1/2 w-[clamp(112px,18vw,214px)] translate-x-[14%] rotate-[9deg] drop-shadow-[0_36px_60px_rgba(0,0,0,0.55)]"
          >
            <PantallaTienda />
          </MarcoIPhone>
        </div>
      </div>
    </section>
  );
}
