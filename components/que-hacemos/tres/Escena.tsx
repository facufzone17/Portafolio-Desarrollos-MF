"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { items, type Sector } from "@/lib/queHacemos";
import { construirObjeto } from "./objetos";
import { COLOR_FONDO, crearMateriales, liberar, sombra } from "./piezas";

/**
 * La ronda.
 *
 * Los cuatro objetos giran en circulo alrededor del centro, siempre de frente
 * a la camara (giran de posicion, no de cara: un objeto de perfil no se lee).
 * Flotan, cada uno con su propio vaiven, y tiran una sombra blanda al piso:
 * las dos cosas juntas son lo que los despega del fondo ahora que no hay
 * recuadro que los contenga.
 *
 * Se puede arrastrar para girarla y hacer clic en cualquier objeto para abrir
 * sus demos. Las etiquetas son botones de verdad, posicionados sobre el canvas
 * proyectando la posicion 3D: asi la seccion se puede recorrer con el teclado,
 * que dentro de un canvas seria imposible.
 *
 * Todo el movimiento se apaga con prefers-reduced-motion, y el bucle se
 * detiene cuando la seccion sale de pantalla o cuando se abre la ventana de
 * demos: no hay motivo para gastar cuadros en algo que nadie mira.
 */

const AUTO = 0.16; // rad/s

/**
 * El enfoque: lo que pasa entre el clic y la ventana de demos.
 *
 * La ronda gira hasta poner el objeto de frente, la camara se le acerca, y
 * las tarjetas salen de adentro hacia arriba, se separan, se enderezan y dan
 * una vuelta entera sobre si mismas. Recien sobre el final entra la ventana:
 * el UMBRAL es 0.74 y no 1 a proposito, para que el fundido de la ventana
 * monte sobre la cola del movimiento. Si esperara al final se leerian como dos
 * animaciones pegadas en vez de una sola.
 *
 * La vuelta es mas corta que la ida: al cerrar, el sistema responde, no narra.
 */
const IDA = 0.72; // s
const VUELTA = 0.42; // s
const UMBRAL_ABRIR = 0.74;

/** Cuanto sube el mazo entero, y cuanto mas sube cada tarjeta al separarse. */
const SUBIDA = 0.6;
const SUBIDA_TARJETA = 0.14;
/**
 * A que distancia del objeto frena la camara.
 *
 * No es un numero de gusto: con menos, el borde de arriba del cuadro caia
 * justo en el centro de las tarjetas y se veian cortadas al medio. Con 3.2
 * sobra casi medio alto de tarjeta de margen, en escritorio y en telefono.
 */
const CERCANIA = 3.2;

const acotar = (v: number) => Math.min(1, Math.max(0, v));
/** easeInOut: la camara arranca y frena suave, como un travelling. */
const suaveCamara = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
/** easeOut fuerte: la tarjeta sale rapido y frena. */
const suaveTarjeta = (t: number) => 1 - Math.pow(1 - acotar(t), 3);

/**
 * Encuentra el mazo de tarjetas que `objetos.ts` dejo marcado.
 *
 * Va como funcion aparte porque TypeScript no sigue las asignaciones hechas
 * dentro del callback de `traverse`: en linea, daria por seguro que el
 * resultado es siempre null.
 */
function buscarTarjetas(raiz: THREE.Object3D) {
  let hallado: THREE.Object3D | null = null;
  raiz.traverse((o) => {
    if (o.userData.tarjetas) hallado = o;
  });
  return hallado as THREE.Object3D | null;
}

/** Sin WebGL no hay ronda: queda el respaldo en texto. */
function soportaWebgl() {
  try {
    const lienzo = document.createElement("canvas");
    return Boolean(lienzo.getContext("webgl2") ?? lienzo.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Escena({
  quieto,
  pausa,
  onAbrir,
}: {
  quieto: boolean;
  pausa: boolean;
  onAbrir: (sector: Sector) => void;
}) {
  const contenedorRef = useRef<HTMLDivElement>(null);
  const etiquetasRef = useRef<(HTMLButtonElement | null)[]>([]);
  const pausaRef = useRef(pausa);
  const quietoRef = useRef(quieto);
  const abrirRef = useRef(onAbrir);
  // La escena publica aca su disparador: las etiquetas (que son HTML, fuera
  // del canvas) tienen que poder arrancar el mismo viaje que el clic en 3D.
  const enfocarRef = useRef<(i: number) => void>(() => {});
  // Se mide una sola vez, en el cliente: este componente entra por `dynamic`
  // con ssr:false, asi que aca ya hay navegador.
  const [hayWebgl] = useState(soportaWebgl);

  // Las props que el bucle lee van por ref y se actualizan despues del render:
  // la escena se arma una sola vez, si dependiera de `onAbrir` se
  // reconstruiria entera cada vez que el padre vuelve a renderizar.
  useEffect(() => {
    pausaRef.current = pausa;
    quietoRef.current = quieto;
    abrirRef.current = onAbrir;
  });

  useEffect(() => {
    if (!hayWebgl) return;
    const contenedor = contenedorRef.current;
    if (!contenedor) return;
    // Copia ya estrechada: TypeScript pierde el estrechamiento de `contenedor`
    // dentro de las funciones declaradas mas abajo.
    const nodo: HTMLDivElement = contenedor;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    contenedor.appendChild(renderer.domElement);

    const escena = new THREE.Scene();
    const camara = new THREE.PerspectiveCamera(28, 1, 0.1, 100);

    escena.add(new THREE.HemisphereLight(0xffffff, 0xd8c3a5, 1.1));
    const clave = new THREE.DirectionalLight(0xfff6ea, 2.1);
    clave.position.set(3.4, 5, 4.6);
    escena.add(clave);
    const relleno = new THREE.DirectionalLight(0xffe9cf, 0.7);
    relleno.position.set(-4.5, 1.2, 2.5);
    escena.add(relleno);

    const materiales = crearMateriales();
    const anillo = new THREE.Group();
    escena.add(anillo);

    // pivote: lleva la posicion en el circulo y mira a la camara.
    // flote: el vaiven y la escala del hover. Separados para que una cosa no
    // pise a la otra.
    const pivotes: THREE.Group[] = [];
    const flotes: THREE.Group[] = [];

    /**
     * El mazo de cada objeto y la pose original de cada tarjeta.
     *
     * Se guarda al construir y no se vuelve a leer del objeto: la animacion de
     * enfoque escribe encima, y necesita saber a donde tiene que volver.
     */
    type Mazo = {
      grupo: THREE.Object3D;
      alturaBase: number;
      /**
       * Altura (ya en unidades de la escena) del centro de las tarjetas cuando
       * terminan de salir. Es a donde tiene que mirar la camara al enfocar:
       * los cuatro objetos tienen el mazo a distinta altura, y con un valor
       * fijo alguno quedaba cortado por el borde de arriba.
       */
      alturaMirada: number;
      tarjetas: THREE.Object3D[];
      poses: { x: number; y: number; rz: number; rx: number }[];
    };
    const mazos: (Mazo | null)[] = [];

    items.forEach((item, i) => {
      const pivote = new THREE.Group();
      const flote = new THREE.Group();
      const objeto = construirObjeto(materiales, item);
      objeto.scale.setScalar(0.58);
      flote.add(objeto);
      flote.userData.indice = i;
      pivote.add(flote);

      const mazo = buscarTarjetas(objeto);
      mazos.push(
        mazo
          ? {
              grupo: mazo,
              alturaBase: mazo.position.y,
              alturaMirada:
                (mazo.position.y + SUBIDA + SUBIDA_TARJETA) * objeto.scale.y,
              tarjetas: mazo.children.slice(),
              poses: mazo.children.map((t) => ({
                x: t.position.x,
                y: t.position.y,
                rz: t.rotation.z,
                rx: t.rotation.x,
              })),
            }
          : null,
      );

      /**
       * Zona de clic.
       *
       * Los objetos son de alambre: acertarle a un tubo de 3px con el mouse es
       * una loteria, y en los de los costados, que se ven mas chicos, la
       * loteria se pierde casi siempre. Este plano invisible cubre toda la
       * silueta (tarjetas incluidas), asi vale tocar en cualquier parte.
       *
       * Va con material transparente y no con `visible = false` porque el
       * raycaster de three no siempre respeta lo segundo: se dibuja, pero no
       * pinta nada.
       */
      const caja = new THREE.Box3().setFromObject(objeto);
      const tamano = caja.getSize(new THREE.Vector3());
      const centro = caja.getCenter(new THREE.Vector3());
      const zona = new THREE.Mesh(
        new THREE.PlaneGeometry(tamano.x * 1.12, tamano.y * 1.06),
        new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: 0,
          depthWrite: false,
        }),
      );
      zona.position.set(centro.x, centro.y, centro.z + tamano.z / 2 + 0.05);
      flote.add(zona);

      const mancha = sombra();
      if (mancha) {
        mancha.position.y = -1.12;
        pivote.add(mancha);
        pivote.userData.mancha = mancha;
      }

      anillo.add(pivote);
      pivotes.push(pivote);
      flotes.push(flote);
    });

    let radio = 3.05;
    let distanciaCamara = 8.6;

    function ubicar() {
      const { clientWidth: w, clientHeight: h } = nodo;
      if (!w || !h) return;

      radio = w < 640 ? 1.75 : w < 1024 ? 2.6 : 3.05;
      pivotes.forEach((p, i) => {
        const a = (i / pivotes.length) * Math.PI * 2;
        p.position.set(Math.sin(a) * radio, 0, Math.cos(a) * radio);
      });

      const aspecto = w / h;
      camara.aspect = aspecto;
      // Cuanto de la ronda hay que ver entero. En telefono se pide menos y los
      // objetos de los costados salen de cuadro: es preferible a que el de
      // adelante quede del tamaño de una estampilla.
      const medio = radio * (w < 640 ? 0.85 : 0.95) + 1;
      const distancia = Math.max(
        8.6,
        medio / (Math.tan((camara.fov * Math.PI) / 360) * aspecto) + 1.1,
      );
      // Se mira por debajo de los objetos para que suban en el cuadro: con el
      // punto de mira a su altura quedaba medio lienzo vacio arriba.
      distanciaCamara = distancia;
      camara.position.set(0, 1.1, distancia);
      camara.lookAt(0, -0.62, 0);
      camara.updateProjectionMatrix();

      // La niebla es lo que despega el objeto de adelante de los de atras
      // ahora que los cuatro son del mismo color.
      escena.fog = new THREE.Fog(COLOR_FONDO, distancia + 0.5, distancia + radio * 2.6);
      renderer.setSize(w, h, false);
    }

    ubicar();
    const ro = new ResizeObserver(ubicar);
    ro.observe(contenedor);

    // --- Puntero ---------------------------------------------------------
    const puntero = new THREE.Vector2();
    const rayo = new THREE.Raycaster();
    let hayQueBuscar = false;
    let sobre: number | null = null;
    let arrastrando = false;
    let xInicial = 0;
    let xUltimo = 0;
    let recorrido = 0;
    let velocidad = 0;

    const lienzo = renderer.domElement;

    // --- Enfoque ---------------------------------------------------------
    let enfocado: number | null = null; // que objeto se esta mirando
    let avance = 0; // 0 = ronda, 1 = enfocado del todo
    let hacia = 0; // a donde va `avance`
    let anguloDestino: number | null = null;
    let yaAbrio = false;
    let vioPausa = false;

    /**
     * Arranca la secuencia hacia un objeto.
     *
     * La misma puerta para el clic en el objeto y para el clic en la etiqueta:
     * si no, el teclado abriria la ventana sin el viaje y serian dos
     * experiencias distintas para la misma accion.
     */
    function enfocar(i: number) {
      if (enfocado !== null) return;
      if (quietoRef.current) {
        // Sin movimiento: la ventana se abre y listo, no hay viaje que contar.
        abrirRef.current(items[i].id);
        return;
      }
      enfocado = i;
      hacia = 1;
      avance = 0;
      yaAbrio = false;
      sobre = null;
      velocidad = 0;
      arrastrando = false;
      lienzo.style.cursor = "default";

      // Girar la ronda para poner el objeto de frente, por el camino corto.
      const a = (i / pivotes.length) * Math.PI * 2;
      const crudo = -a;
      const vueltas = Math.round((anillo.rotation.y - crudo) / (Math.PI * 2));
      anguloDestino = crudo + vueltas * Math.PI * 2;
    }

    enfocarRef.current = enfocar;

    function aNdc(e: PointerEvent) {
      const r = lienzo.getBoundingClientRect();
      puntero.set(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -((e.clientY - r.top) / r.height) * 2 + 1,
      );
    }

    /** Que objeto hay bajo el puntero, o null. */
    function bajoElPuntero(): number | null {
      rayo.setFromCamera(puntero, camara);
      for (const choque of rayo.intersectObjects(flotes, true)) {
        let o: THREE.Object3D | null = choque.object;
        while (o && o.userData.indice === undefined) o = o.parent;
        if (o) return o.userData.indice as number;
      }
      return null;
    }

    function alBajar(e: PointerEvent) {
      // Durante el viaje la ronda no se toca: el visitante ya eligio.
      if (enfocado !== null) return;
      arrastrando = true;
      recorrido = 0;
      xInicial = e.clientX;
      xUltimo = e.clientX;
      lienzo.setPointerCapture(e.pointerId);
    }

    function alMover(e: PointerEvent) {
      aNdc(e);
      hayQueBuscar = true;
      if (!arrastrando) return;
      const dx = e.clientX - xUltimo;
      xUltimo = e.clientX;
      recorrido += Math.abs(dx);
      anillo.rotation.y += dx * 0.006;
      velocidad = dx * 0.06;
    }

    function alSubir(e: PointerEvent) {
      if (!arrastrando) return;
      arrastrando = false;
      lienzo.releasePointerCapture?.(e.pointerId);

      // Un arrastre corto es un clic. 10px de tolerancia: menos que eso y el
      // temblor del dedo cancelaria la apertura en pantalla tactil.
      if (Math.abs(e.clientX - xInicial) > 10 || recorrido > 10) return;

      // El rayo se tira aca y no se usa el `sobre` del hover: en pantalla
      // tactil no hay hover, y con mouse tampoco lo hay si el visitante clickea
      // sin mover antes (por ejemplo despues de scrollear). Esa era la mitad de
      // los clics que "no agarraban".
      aNdc(e);
      const destino = bajoElPuntero();
      if (destino !== null) enfocar(destino);
    }

    lienzo.addEventListener("pointerdown", alBajar);
    lienzo.addEventListener("pointermove", alMover);
    lienzo.addEventListener("pointerup", alSubir);

    function alSalir() {
      sobre = null;
      lienzo.style.cursor = "grab";
    }
    lienzo.addEventListener("pointerleave", alSalir);
    lienzo.style.cursor = "grab";

    // --- Bucle -----------------------------------------------------------
    const reloj = new THREE.Clock();
    const posicion = new THREE.Vector3();
    const escalaObjetivo = new THREE.Vector3();
    let visible = false;
    let cuadro = 0;

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
      },
      { rootMargin: "120px" },
    );
    io.observe(contenedor);

    function animar() {
      cuadro = requestAnimationFrame(animar);
      const dt = Math.min(reloj.getDelta(), 0.05);

      // Con la ventana abierta el bucle se detiene, salvo que quede cola de
      // movimiento por terminar: la ventana entra montada sobre el final del
      // viaje, y ese final tiene que seguir dibujandose abajo.
      const pausado = pausaRef.current;
      if (pausado) vioPausa = true;
      const cola = enfocado !== null && hacia === 1 && avance < 1;
      if (!visible || (pausado && !cola)) return;

      // Se cerro la ventana: el viaje vuelve.
      if (!pausado && vioPausa) {
        vioPausa = false;
        hacia = 0;
        anguloDestino = null;
      }

      const parado = quietoRef.current;

      // --- Avance del enfoque --------------------------------------------
      if (enfocado !== null) {
        avance = acotar(avance + (hacia === 1 ? dt / IDA : -dt / VUELTA));

        if (hacia === 1 && !yaAbrio && avance >= UMBRAL_ABRIR) {
          yaAbrio = true;
          abrirRef.current(items[enfocado].id);
        }

        if (hacia === 0 && avance === 0) {
          enfocado = null;
          yaAbrio = false;
          lienzo.style.cursor = "grab";
        }
      }

      // La camara se acerca al objeto de adelante y sube la mirada hasta la
      // altura donde van a quedar sus tarjetas.
      const eCamara = suaveCamara(avance);
      const alturaMirada =
        enfocado !== null ? (mazos[enfocado]?.alturaMirada ?? 1) : 0;
      camara.position.set(
        0,
        1.1 + 0.2 * eCamara,
        distanciaCamara - (distanciaCamara - radio - CERCANIA) * eCamara,
      );
      camara.lookAt(
        0,
        -0.62 + (alturaMirada + 0.62) * eCamara,
        radio * 0.9 * eCamara,
      );

      if (anguloDestino !== null) {
        anillo.rotation.y +=
          (anguloDestino - anillo.rotation.y) * Math.min(1, dt * 7);
      }

      if (hayQueBuscar && enfocado === null) {
        hayQueBuscar = false;
        const indice = bajoElPuntero();
        sobre = indice;
        lienzo.style.cursor = arrastrando
          ? "grabbing"
          : indice !== null
            ? "pointer"
            : "grab";
      }

      if (!parado && !arrastrando && enfocado === null) {
        // La ronda frena cuando el visitante apunta a un objeto: se quedo a
        // mirar ese, no a que se le escape. Y despues de arrastrar, la
        // velocidad que traia decae sola hasta el giro de fondo: eso es la
        // inercia del envion.
        const objetivo = sobre !== null ? 0 : AUTO;
        velocidad += (objetivo - velocidad) * Math.min(1, dt * 3);
        anillo.rotation.y += velocidad * dt;
      }

      const t = reloj.getElapsedTime();
      pivotes.forEach((p, i) => {
        // Billboard: los objetos giran de lugar, nunca de cara.
        p.rotation.y = -anillo.rotation.y;

        const flote = flotes[i];
        const vaiven = parado ? 0 : Math.sin(t * 0.7 + i * 1.7) * 0.075;
        flote.position.y = vaiven;
        escalaObjetivo.setScalar(sobre === i ? 1.07 : 1);
        flote.scale.lerp(escalaObjetivo, 0.16);

        const mancha = p.userData.mancha as THREE.Sprite | undefined;
        if (mancha) {
          const k = 1 - vaiven * 1.6;
          mancha.scale.set(1.9 * k, 0.8 * k, 1);
          mancha.material.opacity = 0.85 * k;
        }

        if (!parado) {
          flote.traverse((o) => {
            const v = o.userData.gira as number | undefined;
            if (v) o.rotation.z += v * dt;
          });
        }

        // Las tarjetas del objeto enfocado salen hacia arriba, se separan, se
        // enderezan y dan una vuelta entera. Escalonadas de a una: llegar
        // todas juntas se lee como un bloque, no como tres papeles.
        const mazo = mazos[i];
        if (mazo) {
          const activo = enfocado === i ? avance : 0;
          mazo.grupo.position.y =
            mazo.alturaBase + SUBIDA * suaveTarjeta(activo);

          mazo.tarjetas.forEach((tarjeta, j) => {
            const pose = mazo.poses[j];
            const s = suaveTarjeta((activo - j * 0.07) / 0.79);
            tarjeta.position.x = pose.x * (1 + 1.35 * s);
            tarjeta.position.y = pose.y + SUBIDA_TARJETA * s;
            tarjeta.rotation.z = pose.rz * (1 - s);
            tarjeta.rotation.x = pose.rx * (1 - s);
            tarjeta.rotation.y = s * Math.PI * 2;
          });
        }

        // Etiquetas: se proyectan a pixeles y se escriben directo en el DOM.
        // Con estado de React serian 240 renders por segundo.
        const boton = etiquetasRef.current[i];
        if (boton) {
          p.getWorldPosition(posicion);
          const profundidad = posicion.z;
          posicion.y -= 0.95;
          posicion.project(camara);
          // La etiqueta se mantiene dentro del lienzo: la del objeto de la
          // izquierda se cortaba contra el borde en telefono.
          const x = Math.min(
            Math.max((posicion.x * 0.5 + 0.5) * nodo.clientWidth, 62),
            nodo.clientWidth - 62,
          );
          const y = Math.min(
            (-posicion.y * 0.5 + 0.5) * nodo.clientHeight,
            nodo.clientHeight - 28,
          );
          boton.style.transform = `translate(-50%, 0) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
          // La etiqueta del objeto que esta atras cae justo encima del que
          // esta adelante. Se apaga: con el foco del teclado vuelve, por la
          // regla !opacity-100 de la clase. Durante el viaje se apagan todas:
          // texto volando mientras la camara entra es ruido.
          const frente = (profundidad + radio) / (radio * 2);
          const apagado = frente < 0.42 || avance > 0.05;
          boton.style.opacity = apagado
            ? "0"
            : (frente * 1.05).toFixed(2);
          boton.style.pointerEvents = apagado ? "none" : "auto";
          boton.style.zIndex = String(10 + Math.round(frente * 10));
        }
      });

      renderer.render(escena, camara);
    }

    animar();

    return () => {
      cancelAnimationFrame(cuadro);
      io.disconnect();
      ro.disconnect();
      lienzo.removeEventListener("pointerdown", alBajar);
      lienzo.removeEventListener("pointermove", alMover);
      lienzo.removeEventListener("pointerup", alSubir);
      lienzo.removeEventListener("pointerleave", alSalir);
      liberar(escena);
      materiales.alambre.dispose();
      materiales.tarjeta.dispose();
      renderer.dispose();
      lienzo.remove();
    };
  }, [hayWebgl]);

  if (!hayWebgl) return <Respaldo onAbrir={onAbrir} />;

  return (
    <div className="relative h-[360px] select-none sm:h-[520px] lg:h-[560px]">
      <div ref={contenedorRef} className="absolute inset-0" />

      {items.map((item, i) => (
        <button
          key={item.id}
          type="button"
          ref={(el) => {
            etiquetasRef.current[i] = el;
          }}
          onClick={() => enfocarRef.current(i)}
          className="absolute left-0 top-0 cursor-pointer whitespace-nowrap rounded-btn
            px-2 py-1 text-sm text-text-muted transition-colors duration-200
            hover:text-text focus-visible:!pointer-events-auto
            focus-visible:!opacity-100 sm:text-base"
        >
          {item.etiqueta}
        </button>
      ))}
    </div>
  );
}

/** Sin WebGL: los cuatro sectores siguen estando, en fila y en texto. */
function Respaldo({ onAbrir }: { onAbrir: (sector: Sector) => void }) {
  return (
    <ul className="grid grid-cols-2 gap-4 py-8 lg:grid-cols-4">
      {items.map((item) => (
        <li key={item.id}>
          <button
            type="button"
            onClick={() => onAbrir(item.id)}
            className="w-full cursor-pointer rounded-card border border-line
              bg-bg-elev px-4 py-6 text-left text-base text-text
              transition-colors duration-200 hover:border-brand"
          >
            {item.etiqueta}
          </button>
        </li>
      ))}
    </ul>
  );
}
