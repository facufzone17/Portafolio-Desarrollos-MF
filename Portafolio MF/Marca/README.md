# Marca — Trevoo

> **04/09/2026 — cambió la marca.** Desarrollos MF pasó a llamarse **Trevoo**.
> Los archivos `Logo Desarrollos MF*`, `logo-mono*` y `favicon*` (sin prefijo)
> son de la marca vieja y **no los usa nadie**: quedan como historial.

## Logo ✅

Dos piezas: un **isotipo** (la T con el corte triangular, tipo play) y un
**logotipo** (la palabra TREVOO). Juntos forman el lockup del header.

### Archivos que usa el sitio

El sitio **no lee ninguno de estos archivos**: la geometría vive en
[`lib/marca.ts`](../../lib/marca.ts), como dos strings de `path`, y los
componentes `Isotipo` / `Logotipo` la dibujan inline. Eso es lo que permite que
el preloader recorte la palabra letra por letra y que el isotipo que vuela
aterrice **exactamente** encima del logo del header.

Estos SVG son la copia exportada, para lo que vive fuera del sitio (firmas de
mail, redes, un PDF de propuesta):

| Archivo | Qué es | Peso |
|---|---|---|
| **`trevoo-isotipo.svg`** | La T sola, `fill="currentColor"` | 253 B |
| **`trevoo-logotipo.svg`** | La palabra TREVOO, `currentColor` | 1,3 KB |
| **`trevoo-lockup.svg`** | Isotipo + palabra, con la separación exacta del header | 1,5 KB |
| `trevoo-favicon.svg` | Cuadrado negro con esquinas redondeadas y la T blanca | 370 B |
| `trevoo-favicon-32/180/512.png` | Rasters del favicon (pestaña, iOS, PWA) | 0,3–4 KB |

Al ser `currentColor`, el mismo archivo sirve de cualquier color:

```jsx
<span className="text-white"><Isotipo /></span>
<span className="text-[#050612]"><Isotipo /></span>
```

### De dónde salió el vector

Los archivos que llegaron de diseño **estaban vacíos**:

| Archivo entregado | Qué tenía adentro |
|---|---|
| `Logo Trevoo.svg` | Un solo `<rect>` de 606×603 relleno de `#050612`. Cero `<path>`. |
| `Isotipo Trevoo.png` | 1044×603 px de un único color, `#050612`. Nada dibujado. |

Los que sí servían eran `trevoo_isotipo_concepto3.png` (197×141) y
`trevoo_logotipo_concepto3.png` (504×75): blanco sobre transparente.

De ahí se **vectorizaron** los dos paths (contorno por marching squares sobre
la máscara de alfa, más Douglas-Peucker para sacar la escalera de píxeles). El
resultado se verificó rasterizándolo de nuevo y comparándolo contra el píxel
original: **1,3 % de diferencia en el isotipo y 2,7 % en el logotipo**, todo
sobre el filo de las diagonales.

**Si aparece el vector real de diseño, reemplazar los dos `path` de
`lib/marca.ts` y regenerar estos archivos.** Los números de `LETRAS` (dónde
empieza y termina cada letra dentro del viewBox) también salen de ahí y son los
que usa el preloader: si cambia el logotipo, hay que recalcularlos.

## Color

| Token | Valor | Para qué |
|---|---|---|
| `--color-bg` | `#050612` | El negro de la marca. Sale del propio archivo de logo. |
| `--color-azul` | `#2563ff` | **Superficie**, no texto: sobre el negro da 2,9:1. |
| `--color-acento` | `#8ab0ff` | El azul que **sí** se puede leer: 9,3:1 sobre el fondo. |
| `--color-text` | `#f4f6fb` | 18,6:1 |
| `--color-text-muted` | `#9096ab` | 6,9:1 |

## Tipografía

**Inter Tight** para títulos, números y la voz de panel; **Inter** para el
texto. Las dos salen de la referencia que eligió Facundo
(markiqsaas.framer.website), leída en vivo: su CSS declara `Inter Display` para
casi todo e `Inter Tight` en los bloques de panel.

Las carga `next/font` y quedan self-hosteadas: sin request a Google, sin
bloqueo de render y sin CLS de fuente.
