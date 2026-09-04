import { Seccion } from "@/components/ui/Seccion";
import { Camino } from "./Camino";

export function ComoTrabajamos() {
  return (
    <Seccion
      id="como-trabajamos"
      titulo="Cómo trabajamos"
      bajada="Cinco pasos, siempre los mismos. Sabés en qué punto está tu proyecto en todo momento."
    >
      <Camino />
    </Seccion>
  );
}
