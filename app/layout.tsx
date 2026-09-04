import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import { site } from "@/lib/site";
import "./globals.css";

/**
 * Mona Sans, la tipografia de la referencia (formastudio.framer.ai, leida en
 * vivo: su font-family es "Mona Sans" en 400/500/600).
 *
 * Es variable, asi que se pide el rango 400-600 en un solo archivo en vez de
 * tres cortes. Los titulos van en 600 y el texto en 400.
 *
 * next/font la self-hostea: sin request a Google, sin bloqueo de render y
 * sin CLS de fuente (§6.1).
 */
const monaSans = Mona_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-mona",
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
    <html lang="es-AR" className={`${monaSans.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
