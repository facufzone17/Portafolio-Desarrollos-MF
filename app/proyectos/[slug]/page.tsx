import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DemoFrame } from "@/components/ui/DemoFrame";
import { CtaWhatsApp } from "@/components/ui/CtaWhatsApp";
import { TextoDeslizante } from "@/components/ui/TextoDeslizante";
import { proyectos, proyectoPorSlug } from "@/lib/proyectos";
import { mensajes, site } from "@/lib/site";

export function generateStaticParams() {
  return proyectos.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/proyectos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const proyecto = proyectoPorSlug(slug);
  if (!proyecto) return {};

  return {
    title: `${proyecto.nombre} | ${site.name}`,
    description: proyecto.resumen,
  };
}

export default async function FichaProyecto({
  params,
}: PageProps<"/proyectos/[slug]">) {
  const { slug } = await params;
  const proyecto = proyectoPorSlug(slug);
  if (!proyecto) notFound();

  return (
    <>
      {/* El header queda siempre arriba del iframe: es la salida al portafolio. */}
      <Header />

      <main className="flex-1 pt-[91px]">
        <article className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 sm:py-20">
          {/*
            Boton-pildora con relleno que entra desde la izquierda (§3.5:
            misma gramatica de movimiento del sitio — ease-out-soft y
            duration-state, no una curva inventada para este caso). El
            texto cambia de color en el mismo tiempo, asi los dos quedan
            sincronizados y no hay un instante con texto blanco sobre fondo
            blanco.
          */}
          <Link
            href="/#proyectos"
            data-boton="linea"
            className="group text-sm"
          >
            <span aria-hidden>&larr;</span>
            <TextoDeslizante>Volver a los proyectos</TextoDeslizante>
          </Link>

          <header className="mt-8 flex flex-col gap-5">
            <p className="text-base text-azul">{proyecto.rubro}</p>
            <h1 className="text-[clamp(2.25rem,6vw,4.5rem)]">
              {proyecto.nombre}
            </h1>

            <ul className="flex flex-wrap gap-2">
              {proyecto.categorias.map((c) => (
                <li
                  key={c}
                  className="rounded-card border border-line px-3 py-1 text-sm text-azul"
                >
                  {c}
                </li>
              ))}
            </ul>

            {proyecto.esDemo && (
              <p className="text-sm text-text-muted">
                Los datos de esta demo son de ejemplo.
              </p>
            )}
          </header>

          <div className="mt-12">
            <DemoFrame
              url={proyecto.url}
              poster={proyecto.poster}
              nombre={proyecto.nombre}
            />
          </div>

          <div className="mt-16 flex flex-col gap-12 md:flex-row md:gap-20">
            <div className="md:flex-[3]">
              <h2 className="text-[clamp(1.5rem,3vw,2.25rem)]">
                Con qué cuenta
              </h2>
              <ul className="mt-6 flex flex-col gap-4">
                {proyecto.detalle.map((d) => (
                  <li
                    key={d}
                    className="flex gap-3 text-[17px] font-light text-text-muted"
                  >
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-azul" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:flex-[2]">
              <h2 className="text-[clamp(1.5rem,3vw,2.25rem)]">Con qué está hecho</h2>
              <ul className="mt-6 flex flex-wrap gap-2">
                {proyecto.stack.map((s) => (
                  <li
                    key={s}
                    className="rounded-card border border-line px-3 py-1 text-sm text-text-muted"
                  >
                    {s}
                  </li>
                ))}
              </ul>

              <a
                href={proyecto.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm text-text-muted transition-colors hover:text-text"
              >
                {proyecto.url.replace(/^https?:\/\//, "")}
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            </div>
          </div>

          <div className="mt-20 flex flex-col items-start gap-6 rounded-[var(--radius-card)] border border-line bg-bg-elev p-8 sm:p-12">
            <h2 className="text-[clamp(1.75rem,4vw,3rem)]">¿Querés algo así?</h2>
            <p className="max-w-[46ch] text-lg text-text-muted">
              Contanos qué necesita tu negocio y te decimos cómo lo resolvemos.
            </p>
            <CtaWhatsApp mensaje={mensajes.proyecto(proyecto.nombre)}>Contactanos</CtaWhatsApp>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
