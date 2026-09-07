import { NextResponse } from "next/server";
import { enviarConsulta } from "@/lib/correo";

/**
 * Recepcion del formulario.
 *
 * Valida los cuatro campos y entrega por mail con Resend (ver lib/correo.ts).
 *
 * Nunca se loguea el payload completo: los logs de la funcion se quedan con el
 * telefono y el mail de un lead para siempre y no le sirven a nadie.
 */
export async function POST(request: Request) {
  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = await request.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const campos = ["nombre", "negocio", "necesita", "contacto"] as const;
  const datos: Record<string, string> = {};

  for (const c of campos) {
    const v = cuerpo[c];
    if (typeof v !== "string" || !v.trim()) {
      return NextResponse.json(
        { error: `Falta el campo ${c}` },
        { status: 400 },
      );
    }
    // Tope de longitud: sin esto el endpoint acepta cualquier cosa.
    datos[c] = v.trim().slice(0, 2000);
  }

  const r = await enviarConsulta(datos as Parameters<typeof enviarConsulta>[0]);

  if (r.estado === "enviado") {
    console.log("[contacto] entregada", { id: r.id });
    return NextResponse.json({ ok: true });
  }

  /*
   * La entrega es obligatoria SOLO en produccion.
   *
   * En dev y en preview no hay clave y el visitante no tiene por que ver un
   * error rojo por eso. En produccion, en cambio, un lead que se pierde en
   * silencio mientras le decimos "Listo" es el peor final posible de esta
   * pantalla: ahi el fallo es 502 y el formulario cae a su CTA de WhatsApp
   * con lo que el visitante ya escribio.
   *
   * VERCEL_ENV y no NODE_ENV: en Vercel NODE_ENV tambien es "production" en
   * los preview deploys, asi que gatear por ahi le mostraria el error a
   * cualquiera que entre a un preview.
   */
  const obligatorio = process.env.VERCEL_ENV === "production";

  if (r.estado === "sin-configurar" && !obligatorio) {
    console.log("[contacto] sin RESEND_API_KEY: no se entrego");
    return NextResponse.json({ ok: true, entregado: false });
  }

  console.error(
    "[contacto] no se pudo entregar",
    r.estado === "fallo" ? r.detalle : "sin configurar",
  );
  return NextResponse.json({ error: "No se pudo entregar" }, { status: 502 });
}
