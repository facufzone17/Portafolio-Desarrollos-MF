"use client";

import { useSyncExternalStore } from "react";
import { gmailUrl, mailtoUrl } from "@/lib/site";

/**
 * El link de mail, que no es el mismo en escritorio que en el celular.
 *
 * EL PROBLEMA: `mailto:` depende de que el sistema tenga un cliente de correo
 * registrado. En el celular siempre lo hay (Gmail, Mail) y abre el compositor
 * al toque. En una PC con Chrome, casi nunca: el link no hace nada visible o
 * abre una pestaña en blanco de Google, y el visitante se queda sin escribir.
 * Facundo lo reporto asi, y desde la web NO hay forma de preguntar si hay
 * cliente configurado ni de saber si el mailto hizo algo.
 *
 * LA DECISION: con mouse fino se manda al compositor de Gmail en el navegador
 * (pestaña nueva); con dedo, al `mailto:` de siempre. `(hover: hover) and
 * (pointer: fine)` es la consulta que separa "tiene mouse" de "toca la
 * pantalla", y una notebook con pantalla tactil cae del lado del mouse, que es
 * lo correcto: ahi tampoco hay cliente de correo.
 *
 * Va con `useSyncExternalStore` y no con `useState` + `useEffect` —el mismo
 * patron que `useMovimientoReducido`— porque matchMedia es exactamente eso: un
 * estado que vive afuera de React. El snapshot del servidor es `false`, asi que
 * el HTML sale siempre con el `mailto:`: sin JavaScript el link sigue siendo el
 * que funciona en todos lados.
 */
const CON_MOUSE = "(hover: hover) and (pointer: fine)";

function suscribir(alCambiar: () => void) {
  const mq = window.matchMedia(CON_MOUSE);
  mq.addEventListener("change", alCambiar);
  return () => mq.removeEventListener("change", alCambiar);
}

export function LinkMail({
  children,
  ...resto
}: Omit<React.ComponentProps<"a">, "href" | "target" | "rel">) {
  const conMouse = useSyncExternalStore(
    suscribir,
    () => window.matchMedia(CON_MOUSE).matches,
    () => false,
  );

  return (
    <a
      href={conMouse ? gmailUrl : mailtoUrl}
      {...(conMouse
        ? { target: "_blank", rel: "noopener noreferrer" as const }
        : {})}
      {...resto}
    >
      {children}
    </a>
  );
}
