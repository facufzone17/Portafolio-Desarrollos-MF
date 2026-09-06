import { Isotipo } from "./Isotipo";
import { Logotipo } from "./Logotipo";
import { site } from "@/lib/site";

/**
 * El lockup de marca: isotipo + palabra, como en la referencia que eligio
 * Facundo (markiqsaas.framer.website).
 *
 * Las dos piezas se alinean por altura y no por caja: el isotipo es mas alto
 * que las mayusculas del logotipo, asi que va un punto mas grande (1,45x) para
 * que opticamente midan lo mismo. Alinearlos por bounding box deja el isotipo
 * chico al lado de la palabra.
 *
 * El isotipo lleva `data-logo-isotipo`: el preloader lo mide en vivo para
 * aterrizar exactamente encima (components/preloader/Preloader.tsx).
 */
export function Logo({
  className = "",
  soloIsotipo = false,
}: {
  className?: string;
  soloIsotipo?: boolean;
}) {
  if (soloIsotipo) {
    return (
      <span data-logo-isotipo className={`inline-flex ${className}`}>
        <Isotipo className="h-full w-auto" titulo={site.name} />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-[0.42em] ${className}`}>
      <span data-logo-isotipo className="inline-flex">
        <Isotipo className="h-[1.45em] w-auto" />
      </span>
      <Logotipo className="h-[0.72em] w-auto" titulo={site.name} />
    </span>
  );
}
