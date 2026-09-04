/**
 * El shader del fondo de piedra.
 *
 * Es un campo de curvas de nivel —como un mapa topografico— que se deforma
 * despacio sobre un marron piedra claro. La referencia es el fondo de
 * landonorris.com, que hace exactamente esto en verde oscuro: lineas finas,
 * mas claras que el fondo, que nunca se quedan quietas del todo. Sin esto el
 * marron queda seco.
 *
 * Se dibuja con WebGL crudo y no con three: es un solo cuadrilatero a pantalla
 * completa, no hay escena, no hay camara y no hay nada que cargar.
 */

export const VERTEX = `
attribute vec2 posicion;
void main() {
  gl_Position = vec4(posicion, 0.0, 1.0);
}
`;

/**
 * Ruido de valor con fbm de cuatro octavas, deformado por si mismo (domain
 * warping): es lo que hace que las curvas se enrosquen en vez de quedar como
 * ondas paralelas.
 *
 * Las curvas salen de la parte fraccionaria del campo: cada vez que el fbm
 * cruza un multiplo de 1/DENSIDAD se dibuja una linea. El grosor sale de la
 * distancia a ese cruce, asi que las zonas donde el campo cambia rapido dan
 * lineas mas juntas y finas — igual que un mapa de verdad.
 */
export const FRAGMENT = `
precision highp float;

uniform vec2 u_res;
uniform float u_t;
uniform vec3 u_piedra;
uniform vec3 u_linea;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float ruido(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * ruido(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  // Coordenada normalizada por el alto: el dibujo no se estira al cambiar de
  // proporcion, se ve mas ancho.
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;

  float t = u_t * 0.05;

  // Deformacion: dos campos de ruido que corren en sentidos distintos.
  vec2 q = vec2(
    fbm(uv * 1.05 + vec2(0.0, t)),
    fbm(uv * 1.05 + vec2(5.2, 1.3) - t * 0.75)
  );

  float campo = fbm(uv * 1.3 + q * 0.95 + vec2(t * 0.4, -t * 0.25));

  // Curvas de nivel.
  float escalones = fract(campo * 9.0);
  float distancia = min(escalones, 1.0 - escalones);
  float linea = smoothstep(0.055, 0.008, distancia);

  // Variacion de luz muy suave, para que el marron plano respire.
  float luz = (fbm(uv * 0.7 + vec2(t * 0.3, 0.0)) - 0.5) * 0.22;

  vec3 color = u_piedra * (1.0 + luz);
  color = mix(color, u_linea, linea * 0.42);

  gl_FragColor = vec4(color, 1.0);
}
`;
