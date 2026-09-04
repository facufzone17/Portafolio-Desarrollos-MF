"use client";

import { useEffect, useRef } from "react";
import { useMovimientoReducido } from "@/lib/useMovimientoReducido";
import { FRAGMENT, VERTEX } from "./shaderPiedra";

/**
 * El fondo de piedra con curvas de nivel (ver `shaderPiedra.ts`).
 *
 * Ocupa todo su contenedor. El color sale de las custom properties del sitio
 * (`--color-piedra` y `--color-piedra-linea`), leidas una vez al montar: asi
 * la paleta sigue viviendo en globals.css y no queda un hexadecimal suelto
 * escondido dentro de un shader.
 *
 * Sin WebGL, o con prefers-reduced-motion, no hay canvas: queda el marron
 * plano que ya pinta el contenedor, que es lo mismo pero quieto.
 *
 * El bucle se detiene cuando el fondo sale de pantalla. Es un fragment shader
 * a pantalla completa: no hay motivo para pagarlo mientras nadie lo mira.
 */

const DPR_MAX = 1.5;

function leerColor(nombre: string, respaldo: [number, number, number]) {
  if (typeof window === "undefined") return respaldo;
  const valor = getComputedStyle(document.documentElement)
    .getPropertyValue(nombre)
    .trim();
  const m = /^#?([0-9a-f]{6})$/i.exec(valor);
  if (!m) return respaldo;
  const n = parseInt(m[1], 16);
  return [
    ((n >> 16) & 255) / 255,
    ((n >> 8) & 255) / 255,
    (n & 255) / 255,
  ] as [number, number, number];
}

function compilar(gl: WebGLRenderingContext, tipo: number, fuente: string) {
  const s = gl.createShader(tipo);
  if (!s) return null;
  gl.shaderSource(s, fuente);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s);
    return null;
  }
  return s;
}

export function FondoPiedra({ className = "" }: { className?: string }) {
  const lienzoRef = useRef<HTMLCanvasElement>(null);
  // El servidor renderiza el canvas igual: es un elemento vacio, no hay nada
  // que dibujar hasta que el efecto agarre el contexto. `quieto` ya viene de
  // un store sincronizado (useMovimientoReducido), que en el servidor dice que
  // no y se corrige al hidratar.
  const quieto = useMovimientoReducido();

  useEffect(() => {
    if (quieto) return;
    const lienzo = lienzoRef.current;
    if (!lienzo) return;

    const gl =
      lienzo.getContext("webgl", { antialias: false, alpha: false }) ??
      (lienzo.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;

    const vs = compilar(gl, gl.VERTEX_SHADER, VERTEX);
    const fs = compilar(gl, gl.FRAGMENT_SHADER, FRAGMENT);
    const programa = vs && fs ? gl.createProgram() : null;
    if (!vs || !fs || !programa) return;

    gl.attachShader(programa, vs);
    gl.attachShader(programa, fs);
    gl.linkProgram(programa);
    if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) return;
    gl.useProgram(programa);

    // Dos triangulos que tapan la pantalla entera.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const posicion = gl.getAttribLocation(programa, "posicion");
    gl.enableVertexAttribArray(posicion);
    gl.vertexAttribPointer(posicion, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(programa, "u_res");
    const uT = gl.getUniformLocation(programa, "u_t");
    gl.uniform3fv(
      gl.getUniformLocation(programa, "u_piedra"),
      leerColor("--color-piedra", [0.42, 0.404, 0.388]),
    );
    gl.uniform3fv(
      gl.getUniformLocation(programa, "u_linea"),
      leerColor("--color-piedra-linea", [0.925, 0.918, 0.902]),
    );

    const medir = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_MAX);
      const w = Math.max(1, Math.round(lienzo.clientWidth * dpr));
      const h = Math.max(1, Math.round(lienzo.clientHeight * dpr));
      if (lienzo.width === w && lienzo.height === h) return;
      lienzo.width = w;
      lienzo.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
    };
    medir();

    const ro = new ResizeObserver(medir);
    ro.observe(lienzo);

    // Visible: mientras el fondo esta fuera de pantalla el bucle no corre.
    let visible = true;
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible && cuadro === 0) {
          inicio = performance.now();
          cuadro = requestAnimationFrame(dibujar);
        }
      },
      { rootMargin: "10%" },
    );
    io.observe(lienzo);

    let cuadro = 0;
    let inicio = performance.now();
    // Tiempo propio: al pausar y volver, el dibujo sigue donde quedo en vez de
    // pegar un salto proporcional a lo que estuvo fuera de pantalla.
    let reloj = 0;

    const dibujar = (ahora: number) => {
      if (!visible) {
        cuadro = 0;
        return;
      }
      reloj += Math.min(0.05, (ahora - inicio) / 1000);
      inicio = ahora;
      gl.uniform1f(uT, reloj);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      cuadro = requestAnimationFrame(dibujar);
    };
    cuadro = requestAnimationFrame(dibujar);

    return () => {
      if (cuadro) cancelAnimationFrame(cuadro);
      ro.disconnect();
      io.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(programa);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [quieto]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none bg-piedra ${className}`}
    >
      {!quieto && <canvas ref={lienzoRef} className="block h-full w-full" />}
    </div>
  );
}
