import { Header } from "@/components/Header";
import { Intro } from "@/components/intro/Intro";
import { Footer } from "@/components/Footer";
import { ZonaPiedra } from "@/components/fondo/ZonaPiedra";
import { Hero } from "@/components/hero/Hero";
import { QueHacemos } from "@/components/que-hacemos/QueHacemos";
import { Proyectos } from "@/components/proyectos/Proyectos";
import { ComoTrabajamos } from "@/components/como-trabajamos/ComoTrabajamos";
import { QuienesSomos } from "@/components/QuienesSomos";
import { Contacto } from "@/components/contacto/Contacto";

export default function Home() {
  return (
    <>
      <Intro />
      <Header />
      <main className="flex-1">
        <Hero />
        {/*
          Proyectos y "Que hacemos" comparten un mismo fondo de piedra, que
          entra en escena cuando el panel de proyectos se retrae al final de su
          recorrido (ver ProyectosPista). Van juntos adentro de la zona para
          que el fondo sea uno solo y continuo, sin junta entre las dos.
        */}
        <ZonaPiedra>
          <Proyectos />
          <QueHacemos />
        </ZonaPiedra>
        <ComoTrabajamos />
        <QuienesSomos />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}
