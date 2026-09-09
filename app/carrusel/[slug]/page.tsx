import type { Metadata } from "next";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Isotipo } from "@/components/ui/Isotipo";
import { carruseles, carruselPorSlug, type Placa } from "@/lib/carruseles";
import { site } from "@/lib/site";

/**
 * Ruta de produccion de los carruseles de Instagram (Parte 6d del plan).
 *
 * No es una pagina del sitio: sin Header ni Footer, no anima nada y no entra en
 * el sitemap. Cada placa es un <article data-placa> de 1080×1350 px exactos —el
 * tamaño de una imagen de carrusel de Instagram— apiladas en una columna.
 * scripts/carrusel.mjs abre esta ruta en Chrome headless, mide cada placa y la
 * recorta a PNG a escala 2.
 *
 * UN margen (PAD) para TODO lo que lleva la placa, la captura incluida: nada
 * sangra hasta el borde. Es la correccion sobre la primera version del 06,
 * donde la captura iba de lado a lado y rompia la caja que el resto respetaba.
 * La captura va enmarcada —radio y filo del sistema— y centrada en el aire que
 * sobra, asi el encuadre no salta de una placa a la otra.
 *
 * Los tamaños de tipografia son literales (px) a proposito: es un lienzo fijo
 * de 1080 px, no una pagina responsive, asi que la escala clamp() de DESIGN.md
 * no aplica. La familia (Inter Tight / Inter), la paleta, el radio y el filo si
 * son los del sistema.
 */

export function generateStaticParams() {
  return carruseles.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/carrusel/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const carrusel = carruselPorSlug(slug);
  return {
    title: carrusel ? `Carrusel ${slug} — ${carrusel.nombre}` : "Carrusel",
    robots: { index: false, follow: false },
  };
}

export default async function CarruselPagina({
  params,
}: PageProps<"/carrusel/[slug]">) {
  const { slug } = await params;
  const carrusel = carruselPorSlug(slug);
  if (!carrusel) notFound();

  const total = carrusel.placas.length;

  return (
    <main className="flex flex-col items-center gap-10 bg-bg-alto py-10">
      {carrusel.placas.map((placa, i) => (
        <article
          key={i}
          data-placa
          data-n={i + 1}
          style={{ width: 1080, height: 1350 }}
          className="relative shrink-0 overflow-hidden bg-bg text-text"
        >
          <Contenido placa={placa} n={i + 1} total={total} />
        </article>
      ))}
    </main>
  );
}

/** Un solo margen para toda la placa. La captura tambien vive adentro. */
const PAD = "px-[96px]";

function Contenido({
  placa,
  n,
  total,
}: {
  placa: Placa;
  n: number;
  total: number;
}) {
  if (placa.tipo === "portada") {
    return (
      <div className={`flex h-full flex-col ${PAD} pt-[100px] pb-[84px]`}>
        <Isotipo className="h-[46px] w-[64px] shrink-0 text-text" />

        <div className="flex flex-1 flex-col justify-center gap-8">
          <h1 className="font-display text-[86px] font-medium leading-[0.97] tracking-[-0.04em]">
            {placa.titulo.map((linea) => (
              <span key={linea} className="block">
                {linea}
              </span>
            ))}
          </h1>
          <p className="max-w-[760px] text-[29px] leading-[1.4] text-text-muted">
            {placa.bajada}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-line pt-7 text-[21px] text-text-muted">
          <span>{placa.pie}</span>
          <span className="text-azul">Deslizá →</span>
        </div>
      </div>
    );
  }

  if (placa.tipo === "cierre") {
    const [antes, despues] = placa.bajada.includes(placa.resalte)
      ? (placa.bajada.split(placa.resalte) as [string, string])
      : [placa.bajada, ""];

    return (
      <div className={`flex h-full flex-col ${PAD} pt-[96px] pb-[76px]`}>
        <div className="flex flex-1 flex-col items-center justify-center gap-10 text-center">
          <Isotipo className="h-[104px] w-[146px] text-text" />
          <h2 className="font-display text-[58px] font-medium leading-[1.05] tracking-[-0.04em] text-balance">
            {placa.titulo}
          </h2>
          <p className="max-w-[720px] text-[28px] leading-[1.45] text-text-muted text-pretty">
            {antes}
            <span className="font-medium text-azul">{placa.resalte}</span>
            {despues}
          </p>
        </div>
        <PieDePlaca n={n} total={total} />
      </div>
    );
  }

  if (placa.tipo === "punto") {
    return (
      <div className={`flex h-full flex-col ${PAD} pt-[104px] pb-[76px]`}>
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          {/* Rótulo chico: el error es el que manda, esto solo lo ubica. */}
          <span className="flex items-center gap-3 text-[20px] uppercase tracking-[0.16em] text-text-muted">
            <IconoWhatsApp className="h-[23px] w-[23px]" />
            <span className="font-medium tabular-nums text-azul">
              0{placa.paso}
            </span>
            <span aria-hidden>·</span>
            Catálogo por WhatsApp
          </span>

          {/* El error, como gancho: es lo más grande de la placa. */}
          <h2 className="mt-7 max-w-[920px] font-display text-[74px] font-medium leading-[1.03] tracking-[-0.04em] text-balance">
            {placa.titulo}
          </h2>

          <p className="mt-10 max-w-[680px] text-[26px] leading-[1.5] text-text-muted text-pretty">
            {placa.cuerpo}
          </p>
        </div>

        <PieDePlaca n={n} total={total} />
      </div>
    );
  }

  if (placa.tipo === "servicio") {
    return (
      <div className={`flex h-full flex-col ${PAD} pt-[104px] pb-[76px]`}>
        <div className="flex flex-col items-center gap-[26px] text-center">
          <p className="max-w-[780px] font-display text-[30px] font-medium italic leading-[1.32] tracking-[-0.02em] text-text-muted text-balance">
            «{placa.sintoma}»
          </p>
          <h2 className="font-display text-[66px] font-medium leading-none tracking-[-0.04em] text-azul">
            {placa.nombre}
          </h2>
          <p className="max-w-[840px] text-[27px] leading-[1.45] text-pretty">
            {placa.promesa}
          </p>
        </div>

        <div className="my-auto w-full">
          <Captura
            src={placa.poster}
            alt={placa.alt}
            retrato={placa.retrato}
            marca={placa.marca}
          />
        </div>

        <PieDePlaca n={n} total={total} />
      </div>
    );
  }

  const esReal = placa.marca === "Cliente real";

  return (
    <div className={`flex h-full flex-col ${PAD} pt-[100px] pb-[76px]`}>
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-4">
          <span
            className={`rounded-card border px-3 py-[5px] text-[18px] font-medium ${
              esReal ? "border-azul/40 text-azul" : "border-line text-text-muted"
            }`}
          >
            {placa.marca}
          </span>
          <span className="text-[21px] text-text-muted">
            {placa.rubro}
            {placa.lugar !== "demo" && ` · ${placa.lugar}`}
          </span>
        </div>

        <p className="max-w-[860px] font-display text-[42px] font-medium leading-[1.16] tracking-[-0.03em] text-balance">
          “{placa.cita}”
        </p>
      </div>

      <div className="my-auto w-full">
        <Captura src={placa.poster} alt={placa.alt} />
        <p className="mt-6 text-center text-[22px] leading-[1.45] text-text-muted text-pretty">
          {placa.tiene}
        </p>
      </div>

      <PieDePlaca n={n} total={total} />
    </div>
  );
}

/**
 * La captura, enmarcada y adentro del margen. Radio y filo del sistema.
 *
 * `retrato` es para las capturas de telefono (assets/automatizaciones/*): ya
 * vienen con el aparato dibujado sobre fondo transparente, asi que no llevan
 * marco —flotan sobre el negro de la placa— y se limitan por alto.
 */
function Captura({
  src,
  alt,
  retrato,
  marca,
}: {
  src: StaticImageData;
  alt: string;
  retrato?: boolean;
  marca?: "Demo";
}) {
  return (
    <figure className="m-0 flex flex-col items-center gap-4">
      {retrato ? (
        <Image
          src={src}
          alt={alt}
          sizes="1080px"
          priority
          unoptimized
          className="h-[548px] w-auto"
        />
      ) : (
        <div className="w-full overflow-hidden rounded-card border border-line bg-bg-elev">
          <Image
            src={src}
            alt={alt}
            sizes="1080px"
            priority
            unoptimized
            className="w-full"
          />
        </div>
      )}
      {marca && (
        <figcaption className="text-[17px] tracking-[0.02em] text-text-muted">
          {marca}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Glifo de WhatsApp, monocromo (`currentColor`) para que entre en la paleta —
 * el sistema tiene un solo color y no es el verde de WhatsApp. Es uso
 * descriptivo: el C1 habla de "vender por catálogo de WhatsApp".
 */
function IconoWhatsApp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.09.55 4.03 1.6 5.75L2 22l4.46-1.7a9.9 9.9 0 0 0 4.58 1.13h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.14a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-2.63.99.99-2.56-.19-.31a8.24 8.24 0 0 1-1.27-4.4c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.98-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.75.59.25 1.05.4 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}

function PieDePlaca({ n, total }: { n: number; total: number }) {
  return (
    <div className="flex items-center justify-between text-[19px] text-text-muted">
      <span className="flex items-center gap-2.5">
        <Isotipo className="h-[20px] w-auto" />@{site.instagram}
      </span>
      <span className="tabular-nums">
        {n} / {total}
      </span>
    </div>
  );
}
