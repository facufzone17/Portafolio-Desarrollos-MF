import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { LOGOTIPO, LOGOTIPO_D } from "@/lib/marca";

export const alt = "Trevoo: sitios, tiendas, paneles y automatizaciones";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * La tarjeta que se ve al compartir el link. Se mira casi siempre en una
 * burbuja de WhatsApp —el canal de contacto del sitio— donde entra a un tercio
 * de su tamaño: de ahi que sean el logotipo grande y una sola bajada, y no una
 * composicion con las cuatro capturas, que a ese tamaño es papilla.
 *
 * La palabra TREVOO es el path de lib/marca.ts, no texto: la misma geometria
 * que el header y el preloader, y sin depender de que cargue una fuente.
 *
 * El azul entra como el `escenario` de globals.css: una sola vez, con el filo
 * a 26 grados de la vertical, que es el unico angulo del sistema (el asta de la
 * T cae de (106,50) a (62,141)). Un radial centrado seria el degradado por
 * defecto de cualquier tarjeta oscura.
 */
export default async function Image() {
  const interTight = await readFile(
    join(process.cwd(), "assets/fuentes/InterTight-Medium.ttf"),
  );

  // El filo baja 630 px y se corre 307 hacia la izquierda: 307/630 = tan(26°).
  const CORRIMIENTO = Math.round(size.height * Math.tan((26 * Math.PI) / 180));
  const FILO_ARRIBA = 900;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#08080a",
        }}
      >
        <svg
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="escenario" x1="0" y1="0.8" x2="1" y2="0.36">
              <stop offset="0%" stopColor="#3fb3ff" />
              <stop offset="42%" stopColor="#0d8ef5" />
              <stop offset="100%" stopColor="#0b4da8" />
            </linearGradient>
          </defs>
          <polygon
            points={`${FILO_ARRIBA},0 ${size.width},0 ${size.width},${size.height} ${FILO_ARRIBA - CORRIMIENTO},${size.height}`}
            fill="url(#escenario)"
          />
        </svg>

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 88,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <svg
            width={470}
            height={Math.round((470 * LOGOTIPO.h) / LOGOTIPO.w)}
            viewBox={`0 0 ${LOGOTIPO.w} ${LOGOTIPO.h}`}
          >
            <path d={LOGOTIPO_D} fill="#f4f4f5" />
          </svg>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 40,
              fontSize: 46,
              letterSpacing: -1.84,
              lineHeight: 1.22,
              color: "#8e8e96",
            }}
          >
            <div>Sitios, tiendas, paneles</div>
            <div>y automatizaciones</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Inter Tight",
          data: interTight,
          weight: 500,
          style: "normal",
        },
      ],
    },
  );
}
