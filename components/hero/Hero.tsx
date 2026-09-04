import { Mail, MessageCircle } from "lucide-react";
import { IconInstagram } from "@/components/ui/IconInstagram";
import { instagramUrl, mailtoUrl, whatsappUrl } from "@/lib/site";
import { PalabraRotativa } from "./PalabraRotativa";

/**
 * Hero (§4.2). Lo primero que ve alguien que cae de un anuncio: se tiene que
 * entender en 5 segundos y tener como contactar sin scrollear.
 *
 * Sin fondo: el humo se saco por pedido. Queda el crema del sitio, que es el
 * mismo sobre el que apoyan las piezas de "Nuestros proyectos" justo abajo.
 */
export function Hero() {
  const instagram = instagramUrl();

  const contactos = [
    {
      href: whatsappUrl(),
      label: "Escribinos por WhatsApp",
      icon: <MessageCircle className="size-5" aria-hidden />,
    },
    {
      href: mailtoUrl,
      label: "Mandanos un mail",
      icon: <Mail className="size-5" aria-hidden />,
    },
    // Instagram solo si hay usuario: un icono roto es peor que ninguno.
    ...(instagram
      ? [
          {
            href: instagram,
            label: "Seguinos en Instagram",
            icon: <IconInstagram className="size-5" />,
          },
        ]
      : []),
  ];

  return (
    <section className="relative isolate overflow-hidden">
      {/*
        calc(100svh-4rem) y no 100svh: el header ocupa 4rem en el flujo del
        documento, asi que hero + header suman exactamente una pantalla.
        Poner 100svh haria que el hero solo ya no entre.
      */}
      <div className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-[1400px] flex-col items-center justify-center px-5 py-24 sm:px-8">
        {/*
          Iconos de contacto en la esquina de abajo a la izquierda, fuera del
          flujo: el titulo queda centrado en la pantalla sin que estos lo
          corran. En mobile van en fila — una columna en el borde choca con la
          zona del pulgar.
        */}
        <ul className="absolute bottom-6 left-5 flex gap-2 sm:left-8 lg:flex-col">
          {contactos.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={c.label}
                title={c.label}
                className="flex size-11 items-center justify-center rounded-full text-text-muted transition-colors duration-[var(--duration-micro)] hover:text-text"
              >
                {c.icon}
              </a>
            </li>
          ))}
        </ul>

        <div className="order-1">
          {/*
            El minimo es 1,75rem y no 2,25rem: la palabra que rota mide 9,45em
            y va en una sola linea obligada (whitespace-nowrap, porque la
            mascara supone un renglon). A 2,25rem se pasaba del ancho en
            pantallas de 360px y quedaba cortada.
          */}
          <h1 className="text-center text-[clamp(1.75rem,7vw,6rem)]">
            {/* Texto estable para lectores de pantalla (§4.2). */}
            <span className="sr-only">
              Desarrollando sitios web, tiendas, automatizaciones y sistemas de
              gestión para negocios.
            </span>
            <span aria-hidden className="block">
              <span className="block text-text-muted">Desarrollando</span>
              <PalabraRotativa />
            </span>
          </h1>
        </div>
      </div>
    </section>
  );
}
