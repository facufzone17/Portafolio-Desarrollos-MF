# Marca — Desarrollos MF

## Logo ✅

Monograma **MF**, geométrico y angular. Existe como **vector real**.

### Archivos que usa el sitio

| Archivo | Qué es | Peso |
|---|---|---|
| **`logo-mono.svg`** | El monograma con `fill="currentColor"` → toma el color por CSS. **Es el que va en el header.** | 375 B |
| `favicon.svg` | Cuadrado navy con esquinas redondeadas, mark blanco | 455 B |
| `favicon-32.png` · `-180.png` · `-512.png` | Rasters del favicon (pestaña, iOS, PWA) | 1-14 KB |
| `logo-mono-blanco-1024.png` | Mark blanco con transparencia, por si hace falta un raster | 34 KB |

**Cómo se usa:** al ser `currentColor`, el mismo archivo sirve de cualquier color. No hay que mantener variantes:

```jsx
<span className="text-white"><Logo /></span>   {/* blanco en el header */}
<span className="text-[#1A213B]"><Logo /></span> {/* navy sobre fondo claro */}
```

### Archivos originales (no usar en el sitio)

| Archivo | Por qué no se usa |
|---|---|
| `Logo Desarrollos MF (1).png` | Original de referencia. Fondo navy quemado, sin transparencia. |
| `Logo Desarrollos MF.svg` | ⚠️ **No es un vector.** Contiene `0` elementos `<path>`, un **JPEG embebido en base64** y **dos rectángulos de fondo blanco**. Pesa 1,4 MB. Es un raster envuelto en SVG — lo que devuelven los conversores online gratuitos: no vectorizan, envuelven. |

---

## Cómo se hizo el vector

No se calcó a ojo. El procedimiento fue:

1. Umbralizar el PNG original para aislar el trazo blanco.
2. Separar componentes conexos → **3 formas**.
3. Trazar el contorno de cada una (Moore) y simplificar con **Douglas-Peucker** → **20 vértices en total**, sin curvas.
4. Limpiar el ruido de rasterización respetando el sistema de construcción detectado:
   - **grosor de trazo: 139 px**
   - **diagonales con pendiente dx/dy = √2** (consistente en todo el mark)
   - **separaciones uniformes de ~136 px** entre trazos
5. Verificar contra el original: **IoU 99,33 %** (lo que difiere es el antialiasing del borde).

**Resultado:** 375 bytes contra 1,4 MB — **3.600× más liviano**, nítido a cualquier tamaño, con transparencia real.

### Detalle pendiente de decisión

En el original, el trazo central (el pie de la F) **baja 24 px más** que los otros dos (961 vs 937). Son 2,5 % de la altura: invisible a 32 px, apreciable a tamaño grande. **El vector lo respeta tal cual.** Si se prefiere alinear los tres pies a una misma base, es cambiar un número.

---

## Color de marca

Navy del logo: **`#1A213B`** — medido sobre el archivo original, no estimado.

⚠️ Sobre el fondo negro del sitio (`#08090C`) este navy da **1,3:1** de contraste: es prácticamente invisible. Se usa **solo para atmósfera** (humo, glows, degradados). Para texto, íconos, chips y anillos de foco va `--brand-soft` **`#8FA9E0`**, que da **8,5:1**. Ver §3.3 del build brief.

---

## Pendiente

| Archivo | Para qué | Estado |
|---|---|---|
| `og-image.png` (1200×630) | Preview al compartir el link | ⬜ falta — conviene hacerla cuando esté la tipografía Manrope montada, para que lleve el wordmark |
