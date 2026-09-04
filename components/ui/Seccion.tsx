/**
 * Encabezado de seccion.
 *
 * Patron tomado de nyro (verificado en vivo): titulo grande a la izquierda y
 * bajada en la columna derecha, no centrado. Se usa en todas las secciones
 * para que el ritmo de la pagina sea el mismo.
 *
 * El titulo es opcional: "Nuestros proyectos" va sin encabezado, directo a las
 * piezas. Sin titulo tampoco va el margen que lo separaba del contenido, si no
 * queda un hueco arriba sin nada que lo justifique.
 *
 * `etiqueta` es para esos casos: la seccion sin titulo visible igual tiene que
 * tener nombre para quien la recorre con lector de pantalla, y ese nombre no
 * puede ser un <h2> escondido en el aire.
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
  etiqueta?: string;
  bajada?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-label={etiqueta}
      // scroll-mt compensa el header sticky: sin esto el ancla deja el titulo
      // tapado detras de la barra.
      className={`scroll-mt-20 py-20 sm:py-28 ${className}`}
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        {titulo && (
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-16">
            <h2 className="text-[clamp(2rem,5vw,3.5rem)]">{titulo}</h2>
            {bajada && (
              <p className="max-w-[46ch] text-base text-text-muted sm:text-lg">
                {bajada}
              </p>
            )}
          </div>
        )}

        <div className={titulo ? "mt-12 sm:mt-16" : ""}>{children}</div>
      </div>
    </section>
  );
}
