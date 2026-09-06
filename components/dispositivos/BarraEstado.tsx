/**
 * Barra de estado sintetica: la hora a la izquierda y señal, wifi y bateria a
 * la derecha.
 *
 * Va como capa aparte de la captura, no dibujada dentro de ella: asi el mismo
 * marco sirve para cualquier pantalla y la hora no depende de a que hora se
 * saco el screenshot. 9:41 es la hora que Apple usa en todo su material.
 *
 * Los tres iconos son formas, no una fuente de iconos. A este tamaño (unos 7px
 * de alto en el hero) un icono de trazo de una libreria se empasta y se lee
 * como una mancha; tres barritas, tres arcos y un rectangulo se leen bien
 * porque son exactamente lo que el ojo espera ver ahi.
 */
export function BarraEstado({
  hora = "9:41",
  conIsla = false,
}: {
  hora?: string;
  /** Con isla, los dos lados se separan para dejarle el centro libre. */
  conIsla?: boolean;
}) {
  return (
    <div data-marco-barra style={conIsla ? undefined : { paddingInline: "5%" }}>
      <span>{hora}</span>

      <span
        aria-hidden
        style={{ display: "flex", alignItems: "center", gap: "0.35em" }}
      >
        {/* Señal: cuatro barras crecientes. */}
        <span style={{ display: "flex", alignItems: "flex-end", gap: "0.12em" }}>
          {[0.4, 0.6, 0.8, 1].map((alto) => (
            <span
              key={alto}
              style={{
                width: "0.22em",
                height: `${alto * 0.8}em`,
                borderRadius: "0.06em",
                backgroundColor: "currentColor",
              }}
            />
          ))}
        </span>

        {/*
          Wifi: tres arcos concentricos y el punto. Se dibuja con bordes
          redondeados rotados 45 grados, que es la forma mas barata de tener
          un arco sin SVG.
        */}
        <span
          style={{
            position: "relative",
            width: "0.95em",
            height: "0.8em",
            display: "inline-block",
          }}
        >
          {[
            { s: 0.95, o: 1 },
            { s: 0.62, o: 1 },
            { s: 0.3, o: 1 },
          ].map(({ s, o }) => (
            <span
              key={s}
              style={{
                position: "absolute",
                left: "50%",
                bottom: 0,
                width: `${s}em`,
                height: `${s}em`,
                marginLeft: `${-s / 2}em`,
                marginBottom: `${-s / 2}em`,
                border: "0.13em solid currentColor",
                borderRadius: "50%",
                borderRightColor: "transparent",
                borderBottomColor: "transparent",
                transform: "rotate(45deg)",
                opacity: o,
              }}
            />
          ))}
        </span>

        {/* Bateria: cuerpo, carga y el pinche del contacto. */}
        <span
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            width: "1.5em",
            height: "0.72em",
            border: "0.1em solid currentColor",
            borderRadius: "0.22em",
            padding: "0.08em",
            opacity: 0.9,
          }}
        >
          <span
            style={{
              width: "72%",
              height: "100%",
              borderRadius: "0.1em",
              backgroundColor: "currentColor",
            }}
          />
          <span
            style={{
              position: "absolute",
              right: "-0.2em",
              width: "0.1em",
              height: "0.3em",
              borderRadius: "0 0.1em 0.1em 0",
              backgroundColor: "currentColor",
              opacity: 0.7,
            }}
          />
        </span>
      </span>
    </div>
  );
}
