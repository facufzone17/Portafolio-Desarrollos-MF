import { Revelar } from "@/components/ui/Revelar";

/**
 * Encabezado de seccion.
 *
 * Titulo centrado en dos lineas y bajada gris angosta debajo, que es el ritmo
 * exacto de la referencia (markiqsaas.framer.website, medido en vivo).
 *
 * NO hay rotulo arriba del titulo. La version anterior ponia uno en cada
 * seccion ("Nuestros proyectos", "Qué construimos", "El proceso", "Contacto")
 * y ademas numeraba los bloques 01, 02, 03: son las dos marcas mas delatoras
 * de una pagina generada. El titulo se sostiene solo; si necesita un rotulo
 * que lo explique, el titulo esta mal escrito.
 *
 * La variedad de la pagina no vive aca: vive en los cuerpos de cada seccion
 * (la pista horizontal, el indice pegajoso, el camino, el formulario). El
 * encabezado es lo que se repite igual para que el resto pueda ser distinto.
 */
export function Seccion({
  id,
  titulo,
  etiqueta,
  bajada,
  children,
  className = "",
}: {
  id?: string;
  titulo?: string;
  /** Solo nombre accesible cuando no hay titulo a la vista. Nunca se dibuja. */
  etiqueta?: string;
  bajada?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-label={titulo ? undefined : etiqueta}
      // scroll-mt compensa el header sticky: sin esto el ancla deja el titulo
      // tapado detras de la barra.
      className={`scroll-mt-24 py-20 sm:py-28 ${className}`}
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        {titulo && (
          <Revelar>
            <div className="mx-auto max-w-[46ch] text-center">
              <h2 className="text-[clamp(2rem,4.6vw,3.5rem)]">{titulo}</h2>
              {bajada && (
                <p className="mx-auto mt-5 max-w-[44ch] text-[15px] leading-relaxed text-text-muted sm:text-base">
                  {bajada}
                </p>
              )}
            </div>
          </Revelar>
        )}

        <div className={titulo ? "mt-14 sm:mt-20" : ""}>{children}</div>
      </div>
    </section>
  );
}
