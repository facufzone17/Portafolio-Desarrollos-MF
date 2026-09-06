import { Revelar } from "@/components/ui/Revelar";
import type { Servicio, VistaConCaptura } from "@/lib/servicios";
import { Ventana } from "./Ventana";

/**
 * Un rubro: el panel oscuro con la captura grande y, al lado, el texto.
 *
 * El panel lleva el nombre del rubro escrito adentro, arriba a la izquierda, y
 * la captura pegada al borde de abajo. Es la anatomia de la referencia, y no
 * es decorativa: el nombre adentro del panel es lo que hace que la captura se
 * lea como "esto es una tienda" y no como una foto suelta.
 *
 * A la derecha NO se repite ese nombre: va la promesa, que es una frase de
 * beneficio. El nombre ya aparece dos veces en la misma franja (en el indice
 * pegajoso y en el rotulo del panel); escribirlo una tercera vez como titulo
 * dejaba "Tiendas / Tiendas / Tiendas" en tres columnas seguidas, que es
 * justamente la sensacion de plantilla rellenada a maquina.
 *
 * El rubro que todavia no tiene captura NO dibuja una ventana vacia: pasa a
 * una variante de una sola columna, con los hechos en dos columnas de texto.
 * Un recuadro punteado grande en el lugar donde todos los demas muestran
 * producto no se lee como "falta el material", se lee como que la seccion
 * esta rota.
 *
 * Lo que se saco respecto de la version anterior: el numero de orden (01 a
 * 04), las viñetas con puntito y el fondo azul por bloque. El azul ahora es
 * del hero y de nadie mas.
 */
export function BloqueServicio({
  servicio,
  prioridad = false,
}: {
  servicio: Servicio;
  /** Solo el primer bloque de la seccion precarga su imagen. */
  prioridad?: boolean;
}) {
  const [principal, ...otras] = servicio.vistas;
  // Solo las que tienen captura de verdad.
  const resto = otras.filter((v): v is VistaConCaptura => Boolean(v.imagen));

  const texto = (
    <>
      <h3 id={`titulo-${servicio.id}`} className="text-[clamp(1.5rem,2.4vw,2rem)]">
        {servicio.promesa}
      </h3>
      <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-text-muted">
        {servicio.bajada}
      </p>

      <ul
        className={`mt-7 border-t border-line ${
          principal.imagen ? "" : "sm:columns-2 sm:gap-x-10"
        }`}
      >
        {servicio.puntos.map((punto) => (
          <li
            key={punto}
            className="border-b border-line py-3 text-sm leading-relaxed text-text-muted"
          >
            {punto}
          </li>
        ))}
      </ul>
    </>
  );

  // Sin captura: una sola columna, con el nombre del rubro haciendo de rotulo
  // arriba (el mismo lugar que ocupa dentro del panel en los demas bloques).
  if (!principal.imagen) {
    return (
      <article
        id={`servicio-${servicio.id}`}
        data-servicio={servicio.id}
        aria-labelledby={`titulo-${servicio.id}`}
        className="scroll-mt-28"
      >
        <Revelar>
          <div className="rounded-card bg-bg-elev p-6 sm:p-9">
            <p className="text-lg font-medium tracking-[-0.02em] text-text">
              {servicio.titulo}
            </p>
            <div className="mt-7">{texto}</div>
          </div>
        </Revelar>
      </article>
    );
  }

  // TypeScript estrecha `principal.imagen` despues del return de arriba, pero
  // no estrecha `principal` entero: por eso la portada se rearma explicitamente
  // en vez de pasar el objeto tal cual.
  const portada: VistaConCaptura = { ...principal, imagen: principal.imagen };

  return (
    <article
      id={`servicio-${servicio.id}`}
      data-servicio={servicio.id}
      aria-labelledby={`titulo-${servicio.id}`}
      className="scroll-mt-28 lg:grid lg:grid-cols-10 lg:items-start lg:gap-x-10"
    >
      {/* El panel. */}
      <Revelar className="lg:col-span-6">
        <div className="overflow-hidden rounded-card bg-bg-elev p-5 pb-0 sm:p-7 sm:pb-0">
          <p className="text-lg font-medium tracking-[-0.02em] text-text">
            {servicio.titulo}
          </p>
          <div className="mt-6 sm:mt-8">
            <Ventana
              vista={portada}
              prioridad={prioridad}
              sizes="(min-width: 1024px) 700px, 92vw"
              recortado
            />
          </div>
        </div>
      </Revelar>

      {/* El texto, a la derecha del panel. */}
      <Revelar demora={80} className="mt-8 lg:col-span-4 lg:mt-0">
        {texto}

        {/* Las capturas que sobran del rubro, chicas, debajo del texto. */}
        {resto.length > 0 && (
          <ul className="mt-8 grid grid-cols-2 gap-3">
            {resto.map((vista) => (
              <li key={vista.numero}>
                <Ventana
                  vista={vista}
                  sizes="(min-width: 1024px) 220px, 44vw"
                  compacta
                />
              </li>
            ))}
          </ul>
        )}
      </Revelar>
    </article>
  );
}
