import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { WhatsAppFlotante } from "@/components/ui/WhatsAppFlotante";
import { site } from "@/lib/site";
import "./globals.css";

/**
 * Las dos familias de la referencia que eligio Facundo
 * (markiqsaas.framer.website, leida en vivo: su CSS declara "Inter Display"
 * para casi todo e "Inter Tight" en los bloques de panel).
 *
 * Inter Tight es la que da la densidad de los titulos y los numeros; Inter, la
 * que se lee comoda en parrafo. next/font las self-hostea: sin request a
 * Google, sin bloqueo de render y sin CLS de fuente.
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-inter-tight",
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    siteName: site.name,
    locale: "es_AR",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-AR"
      className={`${inter.variable} ${interTight.variable} h-full`}
      // El <script> inline del preloader le agrega `js` (y a veces
      // `preloader-visto`) antes de que hidrate React: el server no puede saber
      // si hay JavaScript. Es el patron estandar de los scripts que tocan
      // <html> antes de la hidratacion; solo silencia este nodo, no los hijos.
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-bg">
      {/*
        CONTRATO DE DIRECCION — Trevoo, home (Persuade). Rediseño 04/09/2026.

        THESIS: la pagina es una rejilla de pantallas que ya funcionan, no un
        folleto. Rechaza el molde de landing oscura de SaaS: hero con
        resplandor radial, rotulo arriba de cada seccion, bloques numerados y
        cuatro paneles de color identicos.

        OWN-WORLD: negro neutro #08080a plano, escalones #131316 y #1c1c20,
        filetes blancos al 9%. Un solo color, el electrico #0099ff, que hace
        de escenario UNA vez y de texto de acento el resto. Radio 10px en
        todo, botones incluidos: cero pastillas. Inter Tight peso 500 con
        tracking -0,04em. Los filos diagonales usan los 26 grados del asta
        del isotipo.

        STORY: un dueño de negocio entiende en cinco segundos que esto se
        construye a medida, ve el trabajo andando y escribe por WhatsApp.

        FIRST VIEWPORT: titular centrado con la palabra que rota, bajada gris
        angosta, dos botones chicos y el escenario azul con un panel real
        cortado por el borde de abajo.

        FORM: referencia pineada por el usuario (markiqsaas.framer.website),
        medida en vivo; la direccion la fija el brief, no una tirada.

        FINISH: unreviewed and undocumented is unfinished; this build ends
        with the finish review, the verdict, and DESIGN.md
      */}
        <SmoothScroll />
        {children}
        <WhatsAppFlotante />
      </body>
    </html>
  );
}
