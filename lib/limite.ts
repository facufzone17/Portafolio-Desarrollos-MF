/**
 * Limite de envios por IP, en memoria.
 *
 * ES A PROPOSITO QUE NO HAYA REDIS NI KV. El brief dice "sin base de datos" y
 * la lista de dependencias es corta y justificada paquete por paquete. Contra
 * lo que este formulario va a recibir de verdad —un bot que encuentra el
 * endpoint y lo golpea en rafaga— un contador en memoria alcanza y sale gratis.
 *
 * LO QUE ESTO NO ES: un limite distribuido. Cada instancia serverless tiene su
 * propio Map, asi que con varias instancias vivas el tope real es mas alto que
 * TOPE, y una instancia fria arranca en cero. Tampoco frena a alguien con
 * muchas IP. Es una de tres capas —las otras dos son el honeypot y el timeout
 * de 8s hacia Resend— y no la ultima palabra. El dia que el abuso sea real, la
 * respuesta es el firewall de Vercel o un limite sobre KV, no estirar esto.
 */

/** Diez minutos: largo para tapar una rafaga, corto para no castigar a nadie. */
const VENTANA_MS = 10 * 60 * 1000;

/**
 * Cinco por ventana. Una persona manda una consulta, o dos si se equivoco en
 * el numero. Cinco es holgado para un humano y angosto para un bot.
 */
const TOPE = 5;

/**
 * Techo de claves. Sin esto, una lluvia desde miles de IP distintas hace
 * crecer el Map hasta quedarse sin memoria: el limitador seria el agujero.
 */
const MAX_CLAVES = 5000;

/** IP -> timestamps de los envios que siguen dentro de la ventana. */
const golpes = new Map<string, number[]>();

/**
 * De donde sale la IP.
 *
 * En Vercel la cabecera la pone la plataforma y el cliente real es el primero
 * de la lista. En local no hay proxy adelante, asi que lo que llegue es lo que
 * el cliente mando — comodo para probar el limitador, e irrelevante en
 * produccion.
 */
export function ipDe(request: Request): string {
  const reenviada = request.headers.get("x-forwarded-for");
  if (reenviada) {
    const primera = reenviada.split(",")[0]?.trim();
    if (primera) return primera;
  }
  return request.headers.get("x-real-ip") ?? "local";
}

export type Veredicto = { ok: true } | { ok: false; esperar: number };

/** Saca del Map lo que ya vencio. Solo corre cuando el Map crecio de mas. */
function limpiar(desde: number) {
  for (const [ip, marcas] of golpes) {
    const vivas = marcas.filter((t) => t > desde);
    if (vivas.length === 0) golpes.delete(ip);
    else golpes.set(ip, vivas);
  }
  // Si despues de limpiar sigue desbordado, es una lluvia real: se tira todo.
  // Perder el conteo es mejor que perder la funcion por memoria.
  if (golpes.size > MAX_CLAVES) golpes.clear();
}

/**
 * Cuenta un intento y dice si se permite. Cuenta TODOS los POST, incluso los
 * que despues fallan la validacion: si no, alguien puede golpear gratis
 * mandando basura.
 */
export function permitir(ip: string, ahora: number = Date.now()): Veredicto {
  const desde = ahora - VENTANA_MS;

  if (golpes.size > MAX_CLAVES) limpiar(desde);

  const previos = (golpes.get(ip) ?? []).filter((t) => t > desde);

  if (previos.length >= TOPE) {
    golpes.set(ip, previos);
    // Cuando se libera lugar: cuando venza el mas viejo de los que cuentan.
    const esperar = Math.ceil((previos[0] + VENTANA_MS - ahora) / 1000);
    return { ok: false, esperar: Math.max(esperar, 1) };
  }

  previos.push(ahora);
  golpes.set(ip, previos);
  return { ok: true };
}
