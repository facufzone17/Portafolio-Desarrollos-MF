import { ICONOS } from "@/components/intro/Iconos";

/**
 * Una de las cuatro filas de iconos que cruzan la pantalla durante la
 * transicion a "Que hacemos".
 *
 * Van horizontales y de lado a lado, dos arriba y dos abajo, y pasan POR
 * DETRAS de la ventana retraida: se las ve entrar por un costado, desaparecer
 * atras del panel y salir por el otro. Van de a pares y cada par corre en
 * sentidos opuestos; el contramovimiento es lo que las hace leer como un
 * mecanismo y no como una unica tira deslizando.
 *
 * Son los mismos cuatro iconos de la pantalla de entrada
 * (`components/intro/Iconos.tsx`): sitios, tiendas, paneles y automatizaciones.
 * Reusarlos es a proposito — la entrada y esta transicion tienen que sonar al
 * mismo sitio.
 *
 * Cada fila lleva la lista DOS veces y se desplaza medio ancho: al llegar al
 * final, la segunda copia esta exactamente donde arrancaba la primera y el
 * salto no se ve. Por eso los casilleros tienen ancho fijo y no `gap`: con gap,
 * la junta entre las dos copias mide un espacio de mas y el medio ancho deja de
 * caer en el lugar exacto.
 */

/**
 * Cuantas veces se repite la tanda de cuatro iconos dentro de una copia.
 *
 * 4 tandas = 16 casilleros de 9vw = 144vw: una copia sola ya sobra para tapar
 * la pantalla mas ancha. Con menos, en un monitor panoramico se veria el vacio
 * entre las dos copias.
 */
const TANDAS = 4;

export function CintasTransicion({
  lado,
  desde,
  segundos,
}: {
  /** Hacia donde corre la fila. */
  lado: "izquierda" | "derecha";
  /** Desde que icono arranca, para que las cuatro no queden sincronizadas. */
  desde: number;
  /** Cuanto tarda en dar la vuelta entera. */
  segundos: number;
}) {
  const lista = Array.from({ length: TANDAS * ICONOS.length }, (_, i) => {
    const Icono = ICONOS[(i + desde) % ICONOS.length];
    return (
      <div
        key={i}
        className="flex w-[clamp(84px,9vw,160px)] shrink-0 items-center justify-center"
      >
        <Icono className="h-[clamp(28px,3.2vw,56px)] w-auto" />
      </div>
    );
  });

  return (
    <div
      data-cinta={lado}
      className="flex w-max text-white/85"
      style={{ animationDuration: `${segundos}s` }}
    >
      {/* Dos copias identicas: el bucle es el desplazamiento de media tira. */}
      {[0, 1].map((copia) => (
        <div key={copia} className="flex">
          {lista}
        </div>
      ))}
    </div>
  );
}
