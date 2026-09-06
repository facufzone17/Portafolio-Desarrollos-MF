import { Header } from "@/components/Header";
import { Preloader } from "@/components/preloader/Preloader";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/hero/Hero";
import { Proyectos } from "@/components/proyectos/Proyectos";
import { Servicios } from "@/components/servicios/Servicios";
import { ComoTrabajamos } from "@/components/como-trabajamos/ComoTrabajamos";
import { QuienesSomos } from "@/components/QuienesSomos";
import { Contacto } from "@/components/contacto/Contacto";

export default function Home() {
  return (
    <>
      <Preloader />
      <Header />
      <main className="flex-1">
        <Hero />
        {/*
          Proyectos primero y despues los servicios: se muestra el trabajo y
          recien despues se explica. Entre las dos ya no hay transicion
          fabricada — la piedra, la retraccion del panel y las filas de iconos
          se sacaron enteras (04/09/2026): es scroll normal.
        */}
        <Proyectos />
        <div className="mt-24 sm:mt-32">
          <Servicios />
        </div>
        <ComoTrabajamos />
        <QuienesSomos />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}
