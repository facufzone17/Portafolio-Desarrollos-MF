import { site } from "@/lib/site";

/**
 * Entrega de una consulta del formulario por mail, con Resend.
 *
 * Se habla con la API por `fetch` pelado y NO con el SDK (`npm i resend`): el
 * cliente son doce lineas, las route handlers corren en Node con `fetch`
 * global, y la lista de dependencias del proyecto es corta a proposito. Si
 * alguna vez hacen falta adjuntos, lotes o claves de idempotencia, ahi si vale
 * la pena el paquete.
 *
 * SOBRE EL DOMINIO: Resend pide dominio verificado solo para un remitente
 * propio. `onboarding@resend.dev` no pide nada, con una restriccion — solo
 * entrega al mail dueño de la cuenta. Como el destino es justamente
 * `site.email`, alcanza con que la cuenta de Resend se haya creado con ese
 * gmail y esto funciona sin dominio. El dia que exista el dominio es cambiar
 * CONTACTO_REMITENTE en Vercel; aca no se toca nada.
 *
 * Variables (ver README):
 *   RESEND_API_KEY       obligatoria para que entregue; sin ella no rompe.
 *   CONTACTO_REMITENTE   default "Trevoo <onboarding@resend.dev>".
 *   CONTACTO_DESTINO     default site.email.
 */

export type Consulta = {
  nombre: string;
  negocio: string;
  necesita: string;
  contacto: string;
};

export type ResultadoEnvio =
  | { estado: "enviado"; id: string }
  | { estado: "sin-configurar" }
  | { estado: "fallo"; detalle: string };

/** Un mail, para decidir si se puede contestar apretando "responder". */
const FORMA_MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Aplasta los espacios. Lo que va a un asunto no puede llevar saltos de linea:
 * contenido de usuario dentro de una cabecera es como se inyectan cabeceras.
 */
function unaLinea(v: string): string {
  return v.replace(/\s+/g, " ").trim();
}

export async function enviarConsulta(c: Consulta): Promise<ResultadoEnvio> {
  const clave = process.env.RESEND_API_KEY;
  if (!clave) return { estado: "sin-configurar" };

  const remitente =
    process.env.CONTACTO_REMITENTE ?? "Trevoo <onboarding@resend.dev>";
  const destino = process.env.CONTACTO_DESTINO ?? site.email;

  const contacto = c.contacto.trim();

  const cuerpo = [
    `Nombre:  ${unaLinea(c.nombre)}`,
    `Negocio: ${unaLinea(c.negocio)}`,
    `Contacto: ${contacto}`,
    "",
    "Qué necesita:",
    c.necesita,
  ].join("\n");

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${clave}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: remitente,
        to: [destino],
        subject: `Consulta desde el sitio — ${unaLinea(c.nombre)} (${unaLinea(c.negocio)})`,
        // Texto plano: nada que escapar, nada que inyectar.
        text: cuerpo,
        // Solo si es un mail. Si dejo un telefono, "responder" tiene que
        // seguir yendo a donde no moleste; el numero esta en el cuerpo.
        ...(FORMA_MAIL.test(contacto) ? { reply_to: contacto } : {}),
      }),
      // Sin esto, un Resend colgado retiene la funcion hasta el limite de la
      // plataforma y el visitante se queda mirando "Enviando...".
      signal: AbortSignal.timeout(8000),
    });

    if (!r.ok) {
      const detalle = await r.text().catch(() => "");
      return { estado: "fallo", detalle: `${r.status} ${detalle.slice(0, 300)}` };
    }

    const datos = (await r.json()) as { id?: string };
    return { estado: "enviado", id: datos.id ?? "" };
  } catch (e) {
    return { estado: "fallo", detalle: e instanceof Error ? e.message : "desconocido" };
  }
}
