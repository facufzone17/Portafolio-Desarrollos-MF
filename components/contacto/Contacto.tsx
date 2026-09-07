import { Mail, MessageCircle } from "lucide-react";
import { Seccion } from "@/components/ui/Seccion";
import { CtaWhatsApp } from "@/components/ui/CtaWhatsApp";
import { Revelar } from "@/components/ui/Revelar";
import { mailtoUrl, site, whatsappUrl } from "@/lib/site";
import { Formulario } from "./Formulario";

/**
 * Contacto.
 *
 * La columna izquierda ya no es un boton solo con una linea de texto flotando
 * al lado de un formulario del doble de alto: ahora lleva tambien los datos
 * directos, que es informacion real y no relleno para emparejar columnas.
 *
 * El boton dice "Contactanos", igual que el del header y el del hero. Una sola
 * etiqueta por intencion en toda la pagina: tres formas distintas de decir lo
 * mismo obligan a leer las tres para descubrir que llevan al mismo lado.
 */
export function Contacto() {
  const directos = [
    {
      href: whatsappUrl(),
      icono: <MessageCircle className="size-4 shrink-0" aria-hidden />,
      texto: site.whatsappDisplay,
      externo: true,
    },
    {
      href: mailtoUrl,
      icono: <Mail className="size-4 shrink-0" aria-hidden />,
      texto: site.email,
      externo: false,
    },
  ];

  return (
    <Seccion
      id="contacto"
      anchoTitulo="max-w-[40rem]"
      titulo={
        // El salto es a mano: dos renglones, "Contanos qué necesitás" /
        // "y lo armamos". `text-wrap: pretty` saca el `balance` del h2, que si
        // no vuelve a partir el primer renglon para emparejarlo con el segundo.
        <span className="[text-wrap:pretty]">
          Contanos qué necesitás
          <br />
          y lo armamos
        </span>
      }
      bajada="Escribinos por WhatsApp y te respondemos el mismo día. Sin compromiso: entendemos tu negocio y te pasamos una propuesta a medida, con precio y plazo."
    >
      <div className="flex flex-col gap-12 md:flex-row md:gap-20">
        <Revelar className="md:flex-[2]">
          {/* La accion primaria va primero y sola: es la que queremos. */}
          <CtaWhatsApp>Contactanos</CtaWhatsApp>

          <p className="mt-6 max-w-[38ch] text-[15px] leading-relaxed text-text-muted">
            Es la vía más rápida: nos escribís, entendemos qué querés y te
            respondemos el mismo día.
          </p>

          <ul className="mt-10 border-t border-line">
            {directos.map((d) => (
              <li key={d.texto} className="border-b border-line">
                <a
                  href={d.href}
                  {...(d.externo
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="flex min-h-12 items-center gap-3 text-sm text-text-muted transition-colors duration-[var(--duration-micro)] hover:text-text"
                >
                  {d.icono}
                  {d.texto}
                </a>
              </li>
            ))}
          </ul>
        </Revelar>

        <Revelar demora={100} className="md:flex-[3]">
          <Formulario />
        </Revelar>
      </div>
    </Seccion>
  );
}
