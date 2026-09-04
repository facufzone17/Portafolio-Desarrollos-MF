import { Seccion } from "@/components/ui/Seccion";
import { VitrinaQueHacemos } from "./VitrinaQueHacemos";

export function QueHacemos() {
  return (
    // Sin titulo a la vista, por pedido: los cuatro objetos dicen que se hace
    // mejor que el rotulo, y el fondo de piedra ya marca que esto es otra cosa.
    // El nombre sigue existiendo para lectores de pantalla.
    <Seccion
      id="que-hacemos"
      etiqueta="Qué hacemos"
      // Apoya sobre la piedra de ZonaPiedra: sobre el marron oscuro la paleta
      // se da vuelta y el texto pasa a ser claro (ver globals.css).
      className="sobre-piedra"
    >
      <VitrinaQueHacemos />
    </Seccion>
  );
}
