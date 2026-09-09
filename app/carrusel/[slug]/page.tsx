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
