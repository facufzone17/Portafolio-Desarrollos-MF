import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { legal } from "@/lib/legal";

/**
 * Contenedor de las páginas legales (términos, privacidad).
 *
 * Una columna angosta de lectura, encabezado, fecha de actualización y el
 * cuerpo estilado con selectores de descendiente: los `<h2>` heredan la Inter
 * Tight del sistema pero con tracking menos apretado, y el resto es Inter en
 * gris. No hay tipografía nueva ni layout propio — es la misma paleta del
 * sitio aplicada a texto corrido.
 */
export function PaginaLegal({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 pt-[91px]">
        <div className="mx-auto max-w-[68ch] px-5 py-16 sm:px-8 sm:py-24">
          <h1 className="text-[clamp(1.9rem,5vw,3.25rem)]">{titulo}</h1>
          <p className="mt-4 text-sm text-text-muted">
            Última actualización: {legal.actualizado}
          </p>

          <div
            className="mt-10 text-[15px] leading-relaxed text-text-muted
              [&>p]:mt-4 [&>ul]:mt-4 [&>*:first-child]:mt-0
              [&_a]:text-azul [&_a]:underline [&_a]:underline-offset-2
              [&_strong]:font-medium [&_strong]:text-text
              [&_em]:not-italic [&_em]:text-text-muted/85
              [&_h2]:mt-11 [&_h2]:text-[clamp(1.15rem,2.4vw,1.45rem)] [&_h2]:font-medium
              [&_h2]:leading-snug [&_h2]:tracking-[-0.02em] [&_h2]:text-text
              [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mt-2"
          >
            {children}
          </div>

          <div className="mt-14 border-t border-line pt-8 text-sm">
            <Link
              href="/"
              className="text-text-muted underline underline-offset-2 transition-colors hover:text-text"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
