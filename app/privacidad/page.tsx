import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Privacidad | ${site.name}`,
  robots: { index: false },
};

/** Placeholder MARCADO. Mismo criterio que el aviso legal. */
export default function Privacidad() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-[91px]">
        <div className="mx-auto max-w-[70ch] px-5 py-20 sm:px-8 sm:py-28">
          <h1 className="text-[clamp(2rem,5vw,3.5rem)]">Privacidad</h1>
          <p className="mt-8 rounded-[var(--radius-card)] border border-line bg-bg-elev p-6 text-text-muted">
            <strong className="text-text">Pendiente de redacción.</strong> Esta
            política se escribe con contenido real antes de publicar los
            anuncios: tiene que decir qué datos se guardan de verdad y por
            cuánto tiempo.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
