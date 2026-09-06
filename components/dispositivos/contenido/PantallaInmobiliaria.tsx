import Image from "next/image";
import ciudad from "@/assets/proyectos/duo-miniatura.webp";

/**
 * Contenido de la tablet: la portada de un sitio de inmobiliaria con la marca
 * Trevoo puesta como cliente de ejemplo.
 *
 * Es maqueta propia, no una captura: se dibuja con HTML para que el texto
 * quede nitido a cualquier tamaño y para poder cambiarlo sin volver a sacar un
 * screenshot. Facundo lo pidio asi expresamente, en vez de meter la web de un
 * cliente real adentro del marco.
 *
 * Todas las medidas van en `cqw` (porcentaje del ancho del marco, que declara
 * `container-type: inline-size`). Con `rem` o `px` la maqueta se rompe: el
 * mismo componente se dibuja a 200px de ancho en mobile y a 392px en
 * escritorio, y un cuerpo de 12px se lee gigante en el primero.
 */
export function PantallaInmobiliaria() {
  return (
    <div className="relative size-full overflow-hidden bg-[#1b2733]">
      {/* La foto, muy apagada: es fondo, no protagonista. */}
      <Image
        src={ciudad}
        alt=""
        fill
        sizes="400px"
        className="object-cover opacity-45"
      />
      {/* Velo para que el titulo y la barra se lean sobre cualquier zona. */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,32,44,0.82),rgba(20,32,44,0.35)_45%,rgba(20,32,44,0.9))]" />

      <div className="relative flex size-full flex-col justify-between text-white">
        {/* Barra: marca a la izquierda, accion y menu a la derecha. */}
        <div className="flex items-start justify-between p-[5cqw]">
          <IconoEdificios />

          <div className="flex items-center gap-[2.2cqw]">
            <span className="rounded-full bg-[#2f83b8] px-[2.9cqw] py-[1.2cqw] text-[2.1cqw] font-medium">
              Contactanos
            </span>
            <span
              aria-hidden
              className="flex flex-col items-end gap-[0.7cqw] pt-[0.4cqw]"
            >
              <i className="block h-[0.45cqw] w-[3.6cqw] rounded-full bg-white" />
              <i className="block h-[0.45cqw] w-[2.6cqw] rounded-full bg-white" />
              <i className="block h-[0.45cqw] w-[3.6cqw] rounded-full bg-white" />
            </span>
          </div>
        </div>

        {/*
          El nombre, en serif y grande. La serif es del cliente de la maqueta,
          no de Trevoo: el sitio real usa Inter Tight en todos lados.
        */}
        <p className="text-center font-[Georgia,'Times_New_Roman',serif] text-[17cqw] leading-none tracking-[-0.01em]">
          Trevoo
        </p>

        <div className="flex flex-col items-center gap-[1.4cqw] pb-[5cqw]">
          <span className="text-[2.1cqw] tracking-[0.22em] text-white/85">
            SEGUÍ BAJANDO
          </span>
          <span
            aria-hidden
            className="block h-[1.6cqw] w-[1.6cqw] rotate-45 border-r border-b border-white/85"
          />
        </div>
      </div>
    </div>
  );
}

/** Marca del cliente: tres torres de trazo fino. */
function IconoEdificios() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-[5.6cqw] w-auto"
    >
      <path d="M3 21V10l4-2v13" />
      <path d="M11 21V4l5 2.5V21" />
      <path d="M16 21V12l4 2v7" />
      <path d="M2 21h20" />
      <path d="M5 12.5h.01M5 15.5h.01M13 9h.01M13 12h.01M13 15h.01" />
    </svg>
  );
}
