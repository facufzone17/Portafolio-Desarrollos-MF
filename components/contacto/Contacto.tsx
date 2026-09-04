import { Seccion } from "@/components/ui/Seccion";
import { CtaWhatsApp } from "@/components/ui/CtaWhatsApp";
import { Formulario } from "./Formulario";

export function Contacto() {
  return (
    <Seccion
      id="contacto"
      titulo="Contemos qué necesitás"
      bajada="Escribinos por WhatsApp y te respondemos en el día. Si preferís, dejanos los datos y te escribimos nosotros."
    >
      <div className="flex flex-col gap-12 md:flex-row md:gap-20">
        <div className="md:flex-[2]">
          {/* La accion primaria va primero y sola: es la que queremos. */}
          <CtaWhatsApp />
          <p className="mt-6 max-w-[38ch] text-text-muted">
            Es la vía más rápida. Contanos qué necesitás y te respondemos en el
            día.
          </p>
        </div>

        <div className="md:flex-[3]">
          <Formulario />
        </div>
      </div>
    </Seccion>
  );
}
