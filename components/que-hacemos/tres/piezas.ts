import * as THREE from "three";
import type { Demo } from "@/lib/queHacemos";

/**
 * Las piezas sueltas con las que se arman los cuatro objetos de la ronda.
 *
 * Todo esta hecho de alambre: capsulas para los tramos rectos, toros para los
 * aros. Es la unica gramatica de la escena, y es la que tiene la referencia
 * que eligio Facundo (el carrito de supermercado de juguete): tubo de seccion
 * redonda, puntas redondeadas, un solo material mate color arena.
 *
 * Nada de esto sabe de React: son funciones que devuelven objetos de three.
 */

const EJE_Y = new THREE.Vector3(0, 1, 0);

/**
 * El alambre es claro, no arena.
 *
 * La ronda dejo de apoyar sobre el crema del sitio: ahora vive sobre la piedra
 * de `ZonaPiedra` (--color-piedra, #6b6763). El arena de antes (0xc9ac83) es
 * un marron claro que sobre ese gris queda sucio y sin cuerpo.
 * Este crema claro es el que los hace leer.
 */
export const COLOR_ALAMBRE = 0xf6ecdc;
export const COLOR_TARJETA = 0xfcfaf6;

/**
 * El fondo detras de la ronda: la piedra. Lo usa la niebla, que es lo que
 * despega el objeto de adelante de los de atras — tiene que ser el color hacia
 * el que se apaga lo lejano, y ese color ahora es marron, no crema.
 */
export const COLOR_FONDO = 0x6b6763;

/**
 * La pantalla maciza del monitor.
 *
 * Antes era exactamente el fondo, para no verse. Sobre la piedra eso ya no se
 * puede: el fondo es un shader con curvas de nivel en movimiento y cualquier
 * plano liso se nota igual. Entonces se asume — un punto mas oscura que la
 * piedra, para que lea como la pantalla apagada del monitor y no como un
 * parche que quiso camuflarse y no pudo.
 */
export const COLOR_PANTALLA = 0x565350;

export type Materiales = {
  alambre: THREE.MeshStandardMaterial;
  tarjeta: THREE.MeshStandardMaterial;
};

export function crearMateriales(): Materiales {
  return {
    alambre: new THREE.MeshStandardMaterial({
      color: COLOR_ALAMBRE,
      roughness: 0.42,
      metalness: 0.08,
    }),
    tarjeta: new THREE.MeshStandardMaterial({
      color: COLOR_TARJETA,
      roughness: 0.86,
      metalness: 0,
    }),
  };
}

type Punto = [number, number, number];

/** Un tramo de alambre entre dos puntos. */
export function barra(m: THREE.Material, a: Punto, b: Punto, radio = 0.05) {
  const va = new THREE.Vector3(...a);
  const dir = new THREE.Vector3(...b).sub(va);
  const largo = dir.length();
  const malla = new THREE.Mesh(
    new THREE.CapsuleGeometry(radio, largo, 3, 10),
    m,
  );
  malla.quaternion.setFromUnitVectors(EJE_Y, dir.clone().normalize());
  malla.position.copy(va).addScaledVector(dir, 0.5);
  return malla;
}

/** Rectangulo de alambre en el plano XY, a una profundidad z. */
export function marco(
  m: THREE.Material,
  ancho: number,
  alto: number,
  z = 0,
  radio = 0.05,
) {
  const x = ancho / 2;
  const y = alto / 2;
  const g = new THREE.Group();
  g.add(barra(m, [-x, y, z], [x, y, z], radio));
  g.add(barra(m, [-x, -y, z], [x, -y, z], radio));
  g.add(barra(m, [-x, -y, z], [-x, y, z], radio));
  g.add(barra(m, [x, -y, z], [x, y, z], radio));
  return g;
}

/** Rectangulo horizontal (plano XZ) a una altura y. Es el aro del canasto. */
export function marcoHorizontal(
  m: THREE.Material,
  ancho: number,
  fondo: number,
  y: number,
  radio = 0.05,
) {
  const x = ancho / 2;
  const z = fondo / 2;
  const g = new THREE.Group();
  g.add(barra(m, [-x, y, z], [x, y, z], radio));
  g.add(barra(m, [-x, y, -z], [x, y, -z], radio));
  g.add(barra(m, [-x, y, -z], [-x, y, z], radio));
  g.add(barra(m, [x, y, -z], [x, y, z], radio));
  return g;
}

export function aro(m: THREE.Material, radio: number, tubo = 0.05, arco?: number) {
  return new THREE.Mesh(
    new THREE.TorusGeometry(radio, tubo, 10, 40, arco ?? Math.PI * 2),
    m,
  );
}

export function esfera(m: THREE.Material, radio: number) {
  return new THREE.Mesh(new THREE.SphereGeometry(radio, 20, 14), m);
}

/**
 * Engranaje: el aro, los dientes y el cubo con sus rayos.
 *
 * Queda marcado con `userData.gira` para que el bucle de animacion lo haga
 * girar. Un engranaje quieto no dice "automatizacion", dice "engranaje".
 */
export function engranaje(
  m: THREE.Material,
  {
    radio,
    tubo,
    dientes,
    velocidad,
  }: { radio: number; tubo: number; dientes: number; velocidad: number },
) {
  const g = new THREE.Group();
  g.add(aro(m, radio, tubo));

  const diente = new THREE.BoxGeometry(tubo * 1.7, tubo * 2.6, tubo * 1.9);
  for (let i = 0; i < dientes; i++) {
    const a = (i / dientes) * Math.PI * 2;
    const malla = new THREE.Mesh(diente, m);
    malla.position.set(Math.cos(a) * radio, Math.sin(a) * radio, 0);
    malla.rotation.z = a - Math.PI / 2;
    g.add(malla);
  }

  const cubo = radio * 0.34;
  g.add(aro(m, cubo, tubo * 0.8));
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    g.add(
      barra(
        m,
        [Math.cos(a) * cubo, Math.sin(a) * cubo, 0],
        [Math.cos(a) * (radio - tubo), Math.sin(a) * (radio - tubo), 0],
        tubo * 0.55,
      ),
    );
  }

  g.userData.gira = velocidad;
  return g;
}

/**
 * La etiqueta impresa en la cara de la tarjeta.
 *
 * Va como textura de canvas y no como geometria de texto: es una linea de
 * texto plano, cargar una fuente 3D para esto seria pagar un tipografo para
 * que escriba un numero.
 */
function texturaTarjeta(etiqueta: string) {
  const lienzo = document.createElement("canvas");
  lienzo.width = 256;
  lienzo.height = 360;
  const ctx = lienzo.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#fcfaf6";
  ctx.fillRect(0, 0, 256, 360);

  ctx.save();
  ctx.translate(210, 300);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = "#17130f";
  ctx.font = "600 26px system-ui, sans-serif";
  ctx.letterSpacing = "2px";
  ctx.fillText(etiqueta.toUpperCase(), 0, 0);
  ctx.restore();

  const t = new THREE.CanvasTexture(lienzo);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/**
 * Recorta una textura como `object-fit: cover`.
 *
 * La cara de la tarjeta tiene su propia relacion de ancho/alto (`aspectoCaja`)
 * y la imagen real casi nunca la tiene igual. Sin esto, la imagen entraria
 * estirada. `repeat`/`offset` hacen en el UV lo mismo que hace `object-cover`
 * en CSS: agrandan la textura hasta tapar la cara entera y centran el
 * sobrante recortado afuera.
 */
function recortarComoCover(textura: THREE.Texture, aspectoCaja: number) {
  const img = textura.image as { width: number; height: number };
  const aspectoImagen = img.width / img.height;

  if (aspectoImagen > aspectoCaja) {
    textura.repeat.set(aspectoCaja / aspectoImagen, 1);
    textura.offset.set((1 - textura.repeat.x) / 2, 0);
  } else {
    textura.repeat.set(1, aspectoImagen / aspectoCaja);
    textura.offset.set(0, (1 - textura.repeat.y) / 2);
  }
}

const cargador = new THREE.TextureLoader();

/**
 * Carga una foto real para la cara de una tarjeta.
 *
 * La tarjeta sigue parada y vertical (3:4), pero las capturas que trae
 * Facundo son de escritorio: anchas. En vez de meterlas encogidas con
 * franjas en blanco a los costados, la imagen se rota 90° para que ocupe
 * todo el largo de la tarjeta, como una foto acostada dentro de un marco
 * parado.
 *
 * El recorte tipo cover se calcula ANTES de rotar, usando el aspecto de la
 * caja invertido (`alto/ancho`, "acostado"): eso deja elegida una ventana de
 * la imagen con la proporcion justa para que, una vez rotada 90°, tape la
 * cara entera sin estirarse ni dejar bordes.
 */
function texturaFoto(
  mat: THREE.MeshStandardMaterial,
  src: string,
  ancho: number,
  alto: number,
) {
  cargador.load(
    src,
    (textura) => {
      textura.colorSpace = THREE.SRGBColorSpace;
      textura.anisotropy = 8;
      recortarComoCover(textura, alto / ancho);
      textura.center.set(0.5, 0.5);
      textura.rotation = Math.PI / 2;
      mat.map?.dispose();
      mat.map = textura;
      mat.roughness = 0.7;
      mat.needsUpdate = true;
    },
    undefined,
    () => {
      // Se queda con la etiqueta de respaldo que ya esta puesta.
    },
  );
}

/**
 * El abanico de tarjetas que asoma de adentro del objeto.
 *
 * Son las mismas que en la ventana grande se abren como demos. La tarjeta en
 * si sigue parada y vertical (3:4), como cartas fanadas: si el demo tiene
 * `src`, la cara carga esa foto acostada por dentro (ver `texturaFoto`, que
 * la rota 90° para aprovechar todo el ancho de una captura de escritorio); si
 * no, se queda con la etiqueta "Imagen N". Aca solo se ven asomando, que es
 * lo que hace que el objeto se lea como un contenedor y no como un adorno.
 */
export function abanicoTarjetas(
  m: THREE.MeshStandardMaterial,
  demos: Demo[],
  { ancho = 0.86, alto = 1.2 } = {},
) {
  const g = new THREE.Group();
  const geo = new THREE.BoxGeometry(ancho, alto, 0.03);
  const desvios = [-0.3, 0.02, 0.32];
  const giros = [0.16, 0.02, -0.14];

  demos.forEach((demo, i) => {
    const etiqueta = demo.titulo ?? `Imagen ${demo.numero}`;
    const textura = texturaTarjeta(etiqueta);
    // La cara +Z (indice 4) es la unica impresa: el resto de la tarjeta es
    // carton blanco.
    const materialCara = textura
      ? new THREE.MeshStandardMaterial({ map: textura, roughness: 0.86 })
      : null;
    const caras = materialCara
      ? Array.from({ length: 6 }, (_, cara) => (cara === 4 ? materialCara : m))
      : m;

    if (materialCara && demo.src) {
      texturaFoto(materialCara, demo.src, ancho, alto);
    }

    const malla = new THREE.Mesh(geo, caras);
    malla.position.set(desvios[i] ?? 0, 0, -i * 0.045);
    malla.rotation.z = giros[i] ?? 0;
    malla.rotation.x = -0.14;
    g.add(malla);
  });

  return g;
}

/**
 * La sombra de contacto: un degradado radial pegado al piso.
 *
 * Es un sprite y no un shadow map porque la escena tiene cuatro objetos de
 * ~60 mallas cada uno; una pasada de sombras reales duplicaria el costo del
 * cuadro para una mancha que el visitante no mira.
 */
export function sombra() {
  const lienzo = document.createElement("canvas");
  lienzo.width = 128;
  lienzo.height = 128;
  const ctx = lienzo.getContext("2d");
  if (!ctx) return null;

  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(38,36,34,0.5)");
  grad.addColorStop(0.5, "rgba(38,36,34,0.16)");
  grad.addColorStop(1, "rgba(38,36,34,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  const textura = new THREE.CanvasTexture(lienzo);
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: textura, transparent: true, depthWrite: false }),
  );
  sprite.scale.set(2.6, 1.1, 1);
  return sprite;
}

/** Libera geometrias, materiales y texturas de todo lo que cuelgue del nodo. */
export function liberar(raiz: THREE.Object3D) {
  raiz.traverse((o) => {
    const malla = o as THREE.Mesh & { material?: THREE.Material | THREE.Material[] };
    malla.geometry?.dispose?.();
    const mats = Array.isArray(malla.material) ? malla.material : [malla.material];
    mats.forEach((mat) => {
      if (!mat) return;
      const conMapa = mat as THREE.MeshStandardMaterial;
      conMapa.map?.dispose();
      mat.dispose();
    });
  });
}
