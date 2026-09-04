import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Aviso legal — ${site.name}`,
  robots: { index: false },
};

/**
 * Placeholder MARCADO, no texto legal inventado.
 * El brief pide redactarlo con contenido real antes de publicar anuncios.
 */
export default function AvisoLegal() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-[70ch] px-5 py-20 sm:px-8 sm:py-28">
          <h1 className="text-[clamp(2rem,5vw,3.5rem)]">Aviso legal</h1>
          <p className="mt-8 rounded-[var(--radius-card)] border border-line bg-bg-elev p-6 text-text-muted">
            <strong className="text-text">Pendiente de redacción.</strong> Este
            texto se escribe con contenido real antes de publicar los anuncios.
            No se completa con texto genérico porque un aviso legal inventado no
            protege a nadie.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
