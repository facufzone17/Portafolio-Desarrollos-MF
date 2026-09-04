import { NextResponse } from "next/server";

/**
 * Recepcion del formulario.
 *
 * Hoy valida y registra. El envio real con Resend se enchufa cuando exista el
 * deploy: sin dominio no se puede verificar que el mail llegue, y la API key
 * no puede vivir en texto plano. Cambiar esto es reemplazar el cuerpo de esta
 * funcion, nada mas.
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

  console.log("[contacto] consulta recibida", datos);

  return NextResponse.json({ ok: true });
}
