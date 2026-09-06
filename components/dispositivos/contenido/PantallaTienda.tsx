/**
 * Contenido del telefono: la tienda de una distribuidora con la marca Trevoo
 * puesta como cliente de ejemplo.
 *
 * Igual que la maqueta de la tablet, es HTML y no una captura: queda nitido a
 * cualquier tamaño y se edita sin volver a sacar un screenshot.
 *
 * Los productos van con nombre generico ("Gaseosa cola 600 ml") y una silueta
 * dibujada, no con la marca ni el logotipo de ningun fabricante. En el catalogo
 * de la demo real los productos si tienen su nombre comercial, porque un
 * comercio lista lo que vende; pero poner el logotipo de una marca ajena en el
 * hero de NUESTRO portafolio insinua un acuerdo que no existe. La maqueta
 * muestra la interfaz, que es lo que estamos vendiendo.
 *
 * Todas las medidas en `cqw`: el marco declara `container-type: inline-size` y
 * este contenido se dibuja a 112px de ancho en mobile y a 214px en escritorio.
 */

/** Los precios son de ejemplo, como todo el catalogo de la demo. */
const PRODUCTOS = [
  { nombre: "Gaseosa cola 1.75 L", precio: "$2.400", oferta: true, forma: "botella" },
  { nombre: "Gaseosa cola 600 ml", precio: "$1.600", oferta: false, forma: "botella" },
  { nombre: "Gaseosa cola 354 ml", precio: "$950", oferta: false, forma: "lata" },
  { nombre: "Agua mineral 500 ml", precio: "$780", oferta: false, forma: "botella" },
] as const;

export function PantallaTienda() {
  return (
    <div className="size-full overflow-hidden bg-[#faf7f0] text-[#2a231c]">
      <div className="flex items-start justify-between px-[5cqw] pt-[3cqw]">
        <div>
          <p className="text-[5.4cqw] leading-none font-extrabold tracking-[-0.02em]">
            TREVOO
          </p>
          <p className="mt-[0.8cqw] text-[1.9cqw] tracking-[0.16em] text-[#6b5f52]">
            DISTRIBUCIÓN Y VENTA
          </p>
        </div>

        {/* Carrito. */}
        <span className="grid size-[7.5cqw] place-items-center rounded-full bg-[#efe6d3]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="size-[4cqw]"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        </span>
      </div>

      {/* Buscador. */}
      <div className="mx-[5cqw] mt-[3.2cqw] flex items-center justify-between rounded-full bg-[#f2ece1] px-[4cqw] py-[2.4cqw]">
        <span className="text-[2.7cqw] text-[#9a8d7d]">
          Buscar fernet, cerveza, vino…
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          aria-hidden
          className="size-[3.4cqw] text-[#6b5f52]"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </div>

      {/* Navegacion. La categoria activa va en pastilla oscura. */}
      <div className="mt-[3.4cqw] flex items-center gap-[3.2cqw] px-[5cqw] text-[2.7cqw]">
        <span>Inicio</span>
        <span className="flex items-center gap-[1.2cqw] rounded-full bg-[#2a231c] px-[3.2cqw] py-[1.6cqw] text-white">
          Productos
          <i
            aria-hidden
            className="block size-[1.3cqw] rotate-45 border-r border-b border-white"
          />
        </span>
        <span>Ofertas</span>
      </div>

      {/* Grilla de productos. */}
      <div className="mt-[3.4cqw] grid grid-cols-2 gap-[3cqw] px-[5cqw]">
        {PRODUCTOS.map((p) => (
          <div key={p.nombre}>
            <div className="relative grid aspect-square place-items-center rounded-[3cqw] border border-[#e3d9c6] bg-white">
              {p.oferta && (
                <span className="absolute top-[1.6cqw] left-[1.6cqw] rounded-full bg-[#e0b64a] px-[2cqw] py-[0.6cqw] text-[1.7cqw] font-semibold">
                  Oferta
                </span>
              )}
              {p.forma === "botella" ? <Botella /> : <Lata />}
            </div>
            <p className="mt-[1.8cqw] text-[2.3cqw] leading-tight text-[#4a4038]">
              {p.nombre}
            </p>
            <p className="mt-[0.6cqw] text-[3.4cqw] font-bold">{p.precio}</p>
            <p className="mt-[1.6cqw] rounded-full bg-[#2a231c] py-[1.7cqw] text-center text-[2.3cqw] text-white">
              Agregar
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Silueta de botella, dibujada. No es la marca de nadie. */
function Botella() {
  return (
    <span aria-hidden className="flex flex-col items-center">
      <i className="block h-[2cqw] w-[2.2cqw] rounded-t-[0.6cqw] bg-[#7b1f1f]" />
      <i className="block h-[1.2cqw] w-[3.4cqw] bg-[#a32b2b]" />
      <i className="block h-[11cqw] w-[6.2cqw] rounded-[1.6cqw] bg-gradient-to-b from-[#c33a3a] to-[#8f2020]" />
    </span>
  );
}

/** Silueta de lata. */
function Lata() {
  return (
    <span
      aria-hidden
      className="block h-[11cqw] w-[6.8cqw] rounded-[1.4cqw] bg-gradient-to-b from-[#c33a3a] to-[#8f2020]"
    />
  );
}
