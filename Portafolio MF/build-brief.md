# BUILD BRIEF — Desarrollos MF · Portafolio
> Tipo: Sitio institucional (home tipo landing + fichas de proyecto) · Documento de ley fija para construir este sitio con Claude Code.

## 1. Objetivo y posicionamiento

**Qué ofrece:** Desarrollos MF diseña y construye sitios web y herramientas con IA para negocios — webs, tiendas, sistemas de gestión, automatizaciones y chatbots de WhatsApp. El portafolio muestra qué hacemos, cómo lo hacemos y cómo trabajamos, con demos propias navegables sin salir del sitio.

**Para quién:** dueños y responsables de negocios que (a) necesitan presencia web o (b) tienen un problema operativo concreto (pierden mensajes fuera de horario, se les superponen turnos, cargan lo mismo dos veces). Sin acotar a un rubro. Dos vías de llegada:
- **Inbound:** gente que ve un anuncio y busca quién le haga la web.
- **Outbound:** prospectos en frío a quienes les pasamos el link para que vean que existimos y cómo trabajamos.

**Acción primaria (una sola):** iniciar una conversación por WhatsApp. Alternativa secundaria: dejar los datos en un formulario corto. Todo lo demás en el sitio existe para llevar a eso.

**Cómo sé que funciona:**
- Conversaciones iniciadas por semana (clicks a WhatsApp + envíos de formulario).
- % de visitantes que llegan de un anuncio y tocan el CTA.
- Se mide desde el día 1 con analítica liviana — si no se mide, no sabemos si los anuncios sirven.

**Contexto de uso:** mobile-first y sin discusión. Tráfico frío de anuncios, mayormente celular, conexión variable, sesiones cortas y con poca paciencia. El sitio tiene que cargar rápido y explicarse en segundos.

> **Nicho — decisión tomada:** por ahora Desarrollos MF se presenta **general** — "herramientas y desarrollos para negocios", sin acotar a un rubro. Es una elección deliberada, no un pendiente. El hero habla de negocios en general; el catálogo entra por el dolor, no por el sector. (El cerebro recomienda cerrar un nicho para acumular referidos — queda anotado como revisión a futuro, no bloquea nada.)

---

## 2. Requisitos de la auditoría

No hay sitio previo. Estos son los no-negociables derivados de las lentes de `Agencia desarrollo IA/01 Workflow/6 Verificación UX.md`, convertidos en requisitos del sitio nuevo. **Están ajustados al hecho de que este sitio es oscuro y con mucha animación** — eso agrega riesgos propios que están marcados con ⚠️.

| Lente | Requisito del portafolio |
|---|---|
| Claridad de conversión (B5) | En los primeros 5 segundos se entiende qué hace Desarrollos MF y a quién le sirve. Hay una forma de contactar visible **sin hacer scroll** y presente en todas las pantallas. |
| Diseño minimalista (8) | Una acción primaria dominante por pantalla: WhatsApp. La animación acompaña, no compite. Sin relleno corporativo. |
| Mobile y toque (B1) | Targets ≥44×44 px, separación entre elementos tocables, acciones principales en la zona del pulgar, **nada depende de hover**, sin scroll horizontal. Probado en celular real. ⚠️ El selector de "Qué hacemos" y el camino de "Cómo trabajamos" son los dos componentes con más riesgo acá: los dos vienen de patrones pensados para escritorio y **necesitan una variante mobile propia**, no un encogido. |
| Rendimiento (B2) | LCP ≤ 2,5 s · INP ≤ 200 ms · CLS ≤ 0,1. ⚠️ Este sitio tiene tres cosas caras juntas: humo animado en el hero, 4 videos en "Qué hacemos", e iframes de demos. **Ninguna de las tres puede cargar de entrada.** Ver "Presupuesto de rendimiento" en la sección 6. |
| Accesibilidad (B3) | Contraste texto ≥ 4,5:1 **sobre negro** — ver la advertencia del azul de marca en la sección 3. El color no es el único indicador de nada. Foco de teclado visible sobre fondo negro (no basta el outline por defecto). Labels visibles en el formulario. HTML semántico. ⚠️ Todo lo animado respeta `prefers-reduced-motion`. |
| Formularios (B4) | Solo campos imprescindibles: nombre, negocio/rubro, qué necesita, WhatsApp o mail. Validación mientras se escribe. Si falla, no se borra lo escrito. Botón que no se puede tocar dos veces. Confirmación clara con **qué pasa ahora** ("te escribimos por WhatsApp en el día"). |
| Confianza (B6) | Cero faltas de ortografía. Nombre real, contacto real, y previews reales de las demos — no mockups de banco de imágenes. Señales de que atrás hay personas (Facundo y Mateo con nombre y apellido). |
| Correspondencia con el mundo real (2) | Se entra por el dolor del cliente, no por la tecnología. Las categorías de proyecto usan palabras que el cliente entiende ("Tienda", "Panel admin"), no internas. |
| Control y libertad (3) | ⚠️ La ficha de proyecto con iframe debe tener una salida obvia y permanente al portafolio (header propio siempre visible). Nada arranca solo con sonido. Los previews se cierran de forma evidente. |
| Ayuda y documentación (10) | Forma visible de hablar con un humano en todo momento: WhatsApp. Las dudas típicas del que contrata ("¿cuánto tarda?", "¿el dominio es mío?") respondidas en "Cómo trabajamos". |

---

## 3. Dirección de diseño

> **Confirmada por Facundo** en base a referencias propias. Lo que sigue es la ley visual del proyecto. Las pocas cosas que quedan abiertas están marcadas como **[A CONFIRMAR]** — sobre esas, Claude Code pregunta antes de decidir; no tira el default genérico.

### 3.1 Referencias

| Referencia | Qué se toma de ahí |
|---|---|
| **https://nyro.framer.website/#hero** | El hero completo: composición, el título grande con **palabra que rota**, y los botones de contacto abajo a la izquierda. **También la tipografía, las formas (radios, chips) y el sistema de animación de todo el sitio.** |
| **https://nyro.framer.website/projects** | La sección "Nuestros proyectos": recuadros con imagen, nombre y descripción, con una etiqueta de categoría donde nyro pone "UX design". Y sus animaciones de entrada y hover. |
| **https://portfolite.framer.website/** (hero) | El **humo animado de fondo**. Se replica en el hero de Desarrollos MF, pero en el azul del logo. |
| Componente `InteractiveSelector` (pasado por Facundo) | La base de "Qué hacemos": paneles horizontales que se expanden al hacer click. Se adapta para reproducir **videos** en vez de imágenes. |

> ⚠️ **CORREGIDO — medido en vivo (28/08/2026).** Se abrió nyro en el navegador y se leyó su valor computado: `background: rgb(10,10,12)` = **`#0A0A0C`**. **nyro ya es un sitio oscuro.** La "divergencia deliberada" que decía este brief partía de una premisa falsa y queda anulada: no hay que invertir nada. El `#08090C` de la §3.3 es prácticamente el fondo propio de nyro, así que la referencia se sigue entera, paleta incluida.

**Qué se toma de nyro:** la tipografía, las formas, el movimiento **y la paleta oscura**.

> **Nota de criterio:** se reimplementan los *patrones* de interacción de estas referencias. No se copia código ni se descargan assets de los templates.

### 3.2 Vibe

Oscuro · técnico · con movimiento · prolijo · directo · sin ínfulas.

### 3.3 Paleta

Base negra, texto blanco, y el azul del logo como color atmosférico (humo, líneas, glows, detalles característicos).

| Token | Valor | Contraste sobre `--bg` | Uso |
|---|---|---|---|
| `--bg` | `#08090C` (casi negro) | — | Fondo de toda la página |
| `--bg-elev` | `#101216` | — | Tarjetas, paneles, superficies elevadas |
| `--text` | `#FFFFFF` | **19,9:1** ✅ | Títulos y texto principal |
| `--text-muted` | `#A7ADB8` | **8,8:1** ✅ | Descripciones, texto secundario |
| `--line` | `#1C2027` | — | Bordes y separadores |
| `--brand` | `#1A213B` *(navy del logo, **medido** del archivo)* | **1,3:1** ❌ | **Solo atmósfera:** humo, glows, fondos de sección, degradados |
| `--brand-soft` | `#8FA9E0` *(navy aclarado)* | **8,5:1** ✅ | Texto de acento, íconos, chips, **anillo de foco** |
| `--cta` | `#FFFFFF` con texto `#08090C` | **19,9:1** ✅ | Botón primario (máximo contraste) |

*Ratios calculados con la fórmula WCAG sobre los valores exactos de la tabla — no estimados.*

⚠️ **Advertencia importante sobre el azul.** El navy del logo `#1A213B` sobre el fondo negro da **1,3:1**: es prácticamente invisible. Sirve para humo y atmósfera (que es exactamente para lo que lo pidió Facundo), pero **no puede usarse para texto, bordes de botón ni anillos de foco** — ahí va `--brand-soft`, que es el mismo azul aclarado y da 8,5:1.

> El navy real del logo es **`#1A213B`**, no `#1E2A4F` como se había propuesto de memoria. Se midió sobre el archivo original (color dominante del fondo).

> **[A CONFIRMAR] Negro puro vs. casi negro.** Se propone `#08090C` en lugar de `#000000`: con degradados de humo encima, el negro puro produce *banding* (escalones visibles en la transición). La diferencia no se nota a simple vista y el resultado es más limpio. Si Facundo prefiere `#000000`, se usa y se compensa con grano.

**Botón primario:** blanco con texto negro. Es lo que más contrasta sobre fondo oscuro y deja el azul libre para la atmósfera. Verde de WhatsApp: solo el ícono, no el botón entero.

### 3.4 Tipografía y formas

**Tipografía: `Manrope`.** ✅ **Confirmada** — es la que usa nyro (verificado en DevTools: `--framer-font-family: "Manrope", sans-serif`). Está en Google Fonts, es gratuita y de licencia abierta.

- **Una sola familia para todo el sitio.** Manrope es un sans geométrico semi-redondeado y va bien con el monograma angular: da modernidad sin que el sitio se vea genérico.
- Pesos a cargar: **400** (cuerpo), **500** (labels), **700/800** (títulos). No cargar el resto — cada peso extra es peso de descarga.
- **Títulos:** grandes, **peso 400**, *tracking* `-0.03em`, interlineado `1.0`.
  > ⚠️ **CORREGIDO — medido en vivo.** El `<h1>` de nyro es `120px / weight 400 / letter-spacing -3.6px / line-height 120px`. Este brief pedía 700-800: es incorrecto. El carácter de la referencia sale del **tamaño y el tracking**, no del grosor; en 800 no se parece. El tracking y el interlineado que decía el brief sí eran correctos.
  > Consecuencia práctica: se cargan **300/400/500** y no 700/800 — los pesos gruesos serían descarga muerta.
- **Cuerpo:** Manrope 400, color `--text-muted`.
- **Mono (JetBrains Mono):** opcional, solo para etiquetas chicas y detalles técnicos. Si no aporta, no se carga.
- Cargar con **`next/font/google`** (Next.js la self-hostea: sin request a Google, sin bloqueo de render, sin CLS de fuente). Fallback: `system-ui, sans-serif`.

> **La propuesta anterior de serif editorial (Instrument Serif) queda descartada.** No va con el logo angular ni con las referencias.

**Formas:**
- Tarjetas y paneles: radio medio-alto, **[A CONFIRMAR]** propuesto `16px`.
- Botones: radio `12px`, o pill si nyro los usa así.
- Chips de categoría: **pill** (radio completo), borde de 1px en `--line`, texto en `--brand-soft`.
- Bordes de 1px muy sutiles en vez de sombras — sobre negro, las sombras no se ven; lo que separa superficies es el borde y el cambio de fondo.

### 3.5 Sistema de movimiento

Una sola gramática de animación para todo el sitio, para que no parezca un rejunte:

| Tipo | Duración | Easing |
|---|---|---|
| Micro-interacción (hover, foco) | 150–200 ms | `ease-out` |
| Transición de estado (panel que se expande) | **700 ms** | `ease-in-out` — el del componente de referencia |
| Entrada al hacer scroll (reveal) | 500–600 ms | `ease-out`, con desplazamiento de 16–24 px |
| Stagger entre hermanos | **180 ms** | — el del componente de referencia |

**Reglas fijas de movimiento:**
- **`prefers-reduced-motion: reduce` desactiva todo:** el humo queda estático, la palabra del hero deja de rotar (queda una fija), el camino aparece dibujado entero, los reveals se convierten en aparición directa. No es opcional.
- **Nada de scroll-jacking.** El scroll de la página siempre es el del navegador. Las animaciones ligadas al scroll solo *leen* el progreso; nunca lo secuestran.
- Todo lo animado usa `transform` y `opacity` (no `width`/`top`/`left`), para no forzar relayout.

### 3.6 Anti-referencias — qué EVITAR

- Carrusel de logos de clientes.
- Hero con foto de stock de gente señalando una pantalla.
- Jerga: "soluciones digitales 360°", "transformación digital", "potenciado por IA".
- **Scroll-jacking** y parallax pesado.
- **Video con sonido o que arranque solo con audio.** (Los videos de "Qué hacemos" son loops mudos y decorativos — eso sí va, y es distinto.)
- Pop-up de newsletter al entrar.
- Dark patterns.
- Animación por decoración: si un movimiento no ayuda a entender o a jerarquizar, sobra.

> **Nota:** las anti-referencias previas "modo oscuro forzado" y "sin gradientes ni sombras" quedan **anuladas** — el sitio ahora es oscuro por decisión, y el humo es un degradado. Se anota para que no vuelva a aparecer como contradicción.

### 3.7 Logo

Monograma **MF**, geométrico/angular. Sobre fondo negro va en **blanco**.

✅ **RESUELTO — vector real disponible.** El archivo que había (`Logo Desarrollos MF.svg`) no era un vector: contenía `0` elementos `<path>`, un **JPEG embebido en base64** y **dos rectángulos de fondo blanco**, pesando **1,4 MB**. Era un raster envuelto en SVG (lo que devuelven los conversores online gratuitos).

**Se redibujó como vector real**, midiendo la geometría del original (umbralizado + trazado de contornos + simplificación Douglas-Peucker) y limpiando el ruido de rasterización:

- **3 trazados, 20 vértices en total.** Sin curvas: el monograma es geometría pura.
- **Fidelidad medida contra el original: IoU 99,33 %** — la diferencia es el antialiasing del borde.
- **375 bytes** (contra 1,4 MB: **3.600× más liviano**).
- Sistema de construcción detectado y respetado: **grosor de trazo 139 px** y **diagonales con pendiente dx/dy = √2** en todo el mark, con separaciones uniformes de ~136 px.

**Archivos generados en `Portafolio MF/Marca/`:**

| Archivo | Qué es |
|---|---|
| `logo-mono.svg` | El monograma, `fill="currentColor"` → toma el color por CSS. **Es el que usa el sitio.** |
| `favicon.svg` | Cuadrado con fondo navy, esquinas redondeadas, mark blanco |
| `favicon-32.png` / `-180.png` / `-512.png` | Rasters del favicon |
| `logo-mono-blanco-1024.png` | Mark blanco con transparencia, por si hace falta un raster |

**Uso en el sitio:** al ser `currentColor`, basta con `<span className="text-white"><Logo/></span>` — el mismo archivo sirve blanco en el header, navy sobre claro, o del color que sea. No hacen falta variantes.

> **Observación menor, decisión de Facundo:** en el original el trazo central (el pie de la F) **baja 24 px más** que los otros dos (961 vs 937). Son 2,5 % de la altura: invisible a 32 px, apreciable a tamaño grande. El vector lo respeta tal cual. Si se prefiere alinear los tres pies a una misma base, es un cambio de un número.

---

## 4. Arquitectura / sitemap

**Páginas:**
- `/` — home, una sola página larga
- `/proyectos/[slug]` — una ficha por demo (plantilla reutilizable, con el iframe)
- `/aviso-legal` y `/privacidad` — pendientes de contenido real

### 4.1 Orden de la home (gancho → valor → prueba → acción)

| # | Sección | Qué va | Por qué en ese lugar |
|---|---|---|---|
| 1 | **Hero** | Título con palabra rotativa + humo azul de fondo + contactos abajo a la izquierda. | Lo primero que ve el que llega de un anuncio; se tiene que entender en 5 segundos. |
| 2 | **Qué hacemos** | Selector interactivo de 4 paneles con video. | El visitante se reconoce en un dolor antes de mirar proyectos. |
| 3 | **Nuestros proyectos** | Grilla de recuadros estilo nyro. Cada uno abre su ficha con iframe. | La prueba concreta. Es el corazón del sitio. |
| 4 | **Cómo trabajamos** | Camino tipo serpiente que avanza con el scroll, 5 etapas. | El diferencial real: muestra método y responde "¿cuánto tarda?". |
| 5 | **Quiénes somos** | Dos tarjetas grandes: Facundo y Mateo. Sin fotos. | El que llega de un anuncio frío necesita ver que hay personas reales atrás. |
| 6 | **Contacto** | WhatsApp directo (primario) + formulario corto. | El cierre. La acción a la que apunta todo el sitio. |

**Footer:** logo · links a Aviso legal y Privacidad · mail · WhatsApp · Instagram · año.

**Acción primaria por página:**
- Home → iniciar conversación por WhatsApp.
- Ficha de proyecto → "Quiero algo así" → WhatsApp con mensaje prellenado que menciona esa demo.
- Legales → ninguna, son informativas.

**Lo que NO se agrega:** blog, sección de precios, página de "servicios" aparte, testimonios. Si más adelante se juntan preguntas repetidas, un FAQ corto va **dentro** de "Cómo trabajamos".

### 4.2 Hero — especificación

**Referencia:** https://nyro.framer.website/#hero

- **Título grande:** la palabra fija **"Desarrollando"** + una palabra que **rota**, en este orden:
  `Landing pages` → `Tiendas` → `Automatizaciones` → `Sistemas de gestión` → `Sitios web` → (vuelve a empezar)
  - Animación: la palabra sale y entra con máscara + desplazamiento vertical (como nyro). ~2,2 s visible, ~0,5 s de transición.
  - **El ancho no puede saltar** al cambiar de palabra: se reserva el ancho de la palabra más larga ("Sistemas de gestión") o se anima el ancho junto con el texto. Si salta, es CLS.
  - Accesibilidad: el bloque rotativo va con `aria-live="off"` y el `<h1>` real contiene un texto estable y legible para lectores de pantalla.
  - Con `prefers-reduced-motion`: no rota, queda **"Sitios web"** fija.
- **Subtítulo:** una línea que diga qué hacemos y para quién. **[FALTA ESCRIBIR]**
- **Contactos abajo a la izquierda:** Instagram · Mail · WhatsApp, como íconos con etiqueta accesible. Targets ≥44 px. **[FALTA: usuario de Instagram]**
- **Fondo: humo animado** en azul de marca (referencia portfolite).
  - ⚠️ **CORREGIDO — medido en vivo.** portfolite resuelve el humo con **2 `<canvas>`**: es un shader, no divs borroneados. Manchas radiales con `blur()` dan nubes redondas, no el humo **filamentoso** de la referencia. **La versión barata no reproduce el efecto** y se descarta como camino principal.
  - **Implementación adoptada:** shader WebGL con **fbm + domain warping** (se distorsiona el espacio con ruido antes de volver a muestrearlo — de ahí salen los filamentos), en el navy de marca, con dithering para matar el banding sobre `#08090C`.
  - Se monta con `next/dynamic` + `ssr: false` **después del primer render**, se pausa fuera del viewport y con la pestaña oculta, y **no se monta** con `prefers-reduced-motion` — ahí queda un degradado estático, que es también el fallback sin WebGL.
  - **Alternativa (más lindo, más caro):** shader en canvas/WebGL. Solo si la versión barata no convence, y **cargado dinámicamente después del primer render**, nunca bloqueando el hero.
  - **Prohibido:** que el humo sea el elemento LCP, o que un video pesado haga de fondo.
  - Con `prefers-reduced-motion`: queda estático.

- **Botón primario del hero:** botón blanco con texto negro, alto ~48-52 px, debajo del subtítulo. Texto: **"Hablemos por WhatsApp"**. Va **además** de la fila de íconos de la esquina, no en su lugar.

> **Por qué van los dos.** En nyro los contactos abajo a la izquierda son **íconos chicos de ~24 px sin texto**: funcionan para alguien que ya conoce la marca y la está buscando. El tráfico de anuncios es distinto — cae alguien que no sabe quién sos, y tres iconitos en una esquina no le dicen qué hacer. La sección 2 exige una acción primaria dominante visible sin scroll, y un ícono suelto no la cumple. Los íconos quedan (se ve igual de bien que la referencia) y el botón resuelve la conversión.

### 4.3 Qué hacemos — especificación

**No son 4 recuadros.** Es el **selector interactivo** de paneles horizontales que se expanden, con **video** dentro de cada panel.

**Base:** el componente `InteractiveSelector` que pasó Facundo. Se conserva su comportamiento:
- Panel activo con `flex: 7`, los demás `flex: 1`; transición de **700 ms `ease-in-out`**.
- Entrada escalonada: cada panel aparece con **180 ms** de retraso respecto al anterior, desde `translateX(-60px)` + opacidad 0.
- Degradado interno inferior que oscurece la base del panel para que se lea el texto.
- Ícono en círculo + título + descripción que entran deslizando `25px` solo en el panel activo.
- Borde blanco en el activo, gris oscuro en los inactivos.

**Cambios obligatorios respecto del código de referencia:**

| Qué | Por qué |
|---|---|
| `backgroundImage` → **`<video>`** (`muted`, `loop`, `playsInline`, `preload="none"`, con `poster`) | Es lo que pidió Facundo: 4 videos. |
| **Solo el panel activo reproduce.** Los demás quedan pausados en su poster. | 4 videos reproduciendo a la vez es el mayor riesgo de rendimiento del sitio. |
| Quitar `min-w-[600px]` y `min-h-screen` | Rompen mobile y provocan scroll horizontal — prohibido por la sección 2. |
| **Variante mobile propia:** paneles apilados en vertical que se expanden hacia abajo (o tarjetas a ancho completo). | Un acordeón horizontal de 5 columnas no funciona en 390 px. No es "encoger": es otro layout. |
| Cada panel es un `<button>` real, navegable con teclado (flechas), con anillo de foco visible en `--brand-soft` | Accesibilidad no negociable. |
| `react-icons` → **`lucide-react`** o SVG inline | Más liviano y es el estándar de shadcn. Menos peso de JS. |
| `<style jsx>` → keyframes en la config de Tailwind | Evita styled-jsx y mantiene una sola forma de escribir estilos. |
| Colores `#222` / `#18181b` → tokens de la sección 3.3 | Coherencia de paleta. |

**Contenido — 4 paneles, uno por dolor** (fuente: `Agencia desarrollo IA/02 Playbooks/Catálogo de productos.md`):

| Panel | Título | Dolor que resuelve |
|---|---|---|
| 1 | Sitios web | "No me encuentran" |
| 2 | Tiendas online | "No puedo vender ni mostrar precios" |
| 3 | Sistemas de gestión | "Se me superponen los turnos / no sé qué vendí" |
| 4 | Automatizaciones y WhatsApp | "Pierdo mensajes fuera de horario / cargo lo mismo dos veces" |

**[FALTA — lo trae Facundo]** Los 4 videos, en la carpeta `Videos Que hacemos`, con el mapeo de cuál corresponde a cada panel.

**Especificación de los videos** (para que no haya que rehacerlos):
- Formato **MP4 (H.264)**; ideal sumar **WebM (VP9)** como alternativa.
- **Sin pista de audio.**
- Loop corto: **6-12 segundos**, con el corte que empalme.
- Peso: **≤ 2-3 MB cada uno**. Si pesan más, se recomprimen.
- **Poster** (primer frame) en JPG o WebP, obligatorio.
- ⚠️ **Encuadre — lo más importante:** un panel inactivo es una **franja alta y angosta**. Un video 16:9 recortado a franja pierde todo lo que pasa a los costados. **El motivo tiene que estar centrado** y funcionar tanto en franja angosta como en panel ancho. Si los videos ya están hechos en 16:9 con acción descentrada, conviene rehacer el encuadre.

### 4.4 Nuestros proyectos — especificación

**Referencia:** https://nyro.framer.website/projects — se copian también sus animaciones de entrada y de hover.

**Grilla (home y listado):**

> ⚠️ **REVISADO (30/08/2026).** El **nombre del negocio va encima de la miniatura, centrado**, como
> en la referencia — no debajo. La miniatura lleva un velo oscuro para que el nombre se lea, y en
> hover la imagen **se difumina** (`blur`) y aparece "Ver proyecto". En pantallas sin hover, "Ver
> proyecto" se muestra en reposo. Debajo de la miniatura quedan sólo la descripción y el chip.
>
> El leve `scale` del hover no es decorativo: al aplicar `blur` dentro de un contenedor recortado,
> los bordes de la imagen se transparentan y se ve un halo. Agrandarla un 6% empuja ese borde fuera.

- Recuadros con **imagen genérica del proyecto** arriba.
- Debajo: **nombre del rubro o de la empresa** (ej. *Dakar Propiedades*, *Distribuidora*).
- **Chip de categoría** — es el lugar donde nyro pone "UX design". Acá va lo que tiene el proyecto: `Tienda` · `Panel admin` · `Automatización` · `Landing page` · `Sistema de gestión`. Un proyecto puede llevar más de uno (`Tienda / Panel admin`).
- Debajo: **descripción de una o dos líneas**.
- Animaciones: entrada escalonada al hacer scroll; en hover, zoom suave de la imagen y realce del borde. **En mobile no puede depender del hover** — el estado de reposo ya tiene que verse completo.

> ✅ **RESUELTO — medido en vivo.** El orden real de nyro es **imagen → descripción (17px, peso 300) → categoría**. No hay título separado y el chip va **abajo**, no arriba. Lo que suponía este brief (*título → categoría → descripción*) era incorrecto.
>
> **Orden adoptado: imagen → nombre del negocio → descripción → chip.** Se toma el orden de nyro conservando el nombre: nyro muestra proyectos propios y no lo necesita; nosotros mostramos clientes y es lo primero que el visitante busca.

**Ficha de proyecto — `/proyectos/[slug]`:**

1. **Arriba: el título del rubro** — *Distribuidora*, *Administradora*, *Tienda*, *Óptica*, *Inmobiliaria*. Junto al nombre del negocio y los chips de categoría.
2. **En el medio: el iframe navegable.** El visitante recorre la web real sin salir del portafolio.
3. **Abajo: la descripción** — con qué cuenta esa web/tienda/sistema: secciones, panel, funciones, integraciones. Más stack y tiempo aproximado.
4. **CTA al final:** "Quiero algo así" → WhatsApp con mensaje prellenado que nombra la demo.
5. El header del portafolio queda **siempre visible** arriba del iframe, con vuelta clara a `/` — el visitante nunca puede quedar atrapado dentro de la demo.

**Comportamiento del iframe (`<DemoFrame>`):**

> ⚠️ **REVISADO (30/08/2026), por decisión de Facundo.** La versión anterior pedía **dos clicks**
> antes de poder tocar la demo (uno para montarla, otro para activarla) y se sentía lenta. Ahora
> son **cero**. Lo que sigue es la especificación vigente.

- Arranca mostrando el **poster** (captura). El `<iframe>` se monta **al entrar en viewport**, que ya era una de las dos opciones que daba el brief. **Nunca al cargar la página.** El poster se mantiene encima hasta que el iframe termina de cargar, así no hay un rectángulo en blanco.
- **Toggle de dispositivo:** escritorio (1440) / celular (390). **La vista tablet se eliminó:** no aportaba nada que no se viera en las otras dos.
- En vista escritorio, el iframe se renderiza a 1440 px y se encoge con `transform: scale()` dentro de un contenedor con `overflow: hidden`.
- **Anti scroll-trap sin pedir un click.** Mientras la demo no está activa, el iframe tiene `pointer-events: none`: la rueda del mouse lo atraviesa y la página scrollea normal. Se activa cuando el cursor se queda **200 ms** encima. **Cualquier scroll de la página cancela y desactiva**, así que pasar scrolleando por arriba nunca deja la rueda atrapada. Al sacar el cursor se desactiva sola: esa es la salida, y no hay que explicarla.
  - Se programa en `pointerenter` **y en `pointermove`**: con `pointerenter` solo, si el cursor ya estaba encima cuando el iframe montó (o al cambiar de vista), el evento no vuelve a dispararse y la demo queda muerta.
  - En pantallas táctiles no hay hover: ahí se activa al tocar.
- **Se eliminó el botón "Abrir en pestaña nueva".** La URL real sigue accesible en la ficha, dentro de "Con qué está hecho".
- **En celular:** iframe a **390 px sin escalar** dentro de un **marco de teléfono**. Lo que se escala es el marco entero, para que entre donde haya lugar. El marco reserva una **barra de estado de 44 px** arriba (por eso el iframe es 390×800 y no 390×844): sin ella, la isla dinámica le tapa el header al sitio embebido.

### 4.5 Cómo trabajamos — especificación

**Camino tipo serpiente que avanza con el scroll**, pasando por las 5 etapas en orden:

1. **Conocer al cliente**
2. **Diseñar propuesta a medida**
3. **Desarrollo completo**
4. **Revisar con el cliente**
5. **Entrega**

**Cómo se construye:**
- Un `<svg>` con un `<path>` serpenteante en `--brand-soft` (o degradado hacia `--brand`).
- El trazo se dibuja con `stroke-dasharray` / `stroke-dashoffset` atado al **progreso de scroll de la sección** (`useScroll` + `useTransform` de framer-motion, o animaciones CSS *scroll-driven* donde el navegador las soporte, con fallback).
- Las tarjetas de cada etapa están distribuidas a los lados del camino y **se encienden** (opacidad, borde, glow azul) cuando la línea llega a ellas.
- Numeradas 01–05.

**Reglas:**
- ⚠️ **El scroll es el del navegador.** La animación lee el progreso, no lo controla. Nada de pinear la sección ni de scroll-jacking.
- **Mobile:** el serpenteo horizontal no entra en 390 px. La variante mobile es un **camino vertical** (recto o con curva suave) con las tarjetas apiladas. Otra vez: variante propia, no encogido.
- Con `prefers-reduced-motion`: el camino aparece dibujado entero y las tarjetas ya encendidas.
- El texto de cada etapa responde las dudas del que contrata: qué pasa, cuánto tarda, qué necesita de él.

### 4.6 Quiénes somos — especificación

**Dos tarjetas grandes**, una por persona. **Sin fotos.**

- **Facundo Fernández Zone**
- **Mateo Orlando**

Sobre `--bg-elev`, borde de 1px, radio de la sección 3.4. El peso visual lo llevan la tipografía grande con el nombre y un detalle en azul de marca — al no haber foto, la tarjeta se sostiene con jerarquía tipográfica y aire, no con adornos.

**[FALTA — se profundiza después]** Rol de cada uno, una o dos líneas de bio, y si va algún link (LinkedIn, GitHub).

---

## 5. Contenido e inventario

### 5.1 Proyectos que entran (primera tanda)

- **Dakar Propiedades** — inmobiliaria.
- **Duo Administración** — administración (consorcios / propiedades).
- **Don Antonio Propiedades** — inmobiliaria.
- **Tienda Mates / Cimarrón** — tienda con panel de administración. Código en `C:\dev\tienda-mates`.
- **+ las que está terminando Mateo** — se suman cuando estén listas. La grilla y la plantilla de ficha se diseñan para agregar una demo **sin tocar código de layout**: cada proyecto es una entrada de datos.

Para cada una, Facundo pasa: **nombre → URL de producción**.

**Qué tiene que cumplir cada demo para poder embeberla:**
1. **URL de producción estable** (p. ej. `dakar-propiedades.vercel.app`), no un link de preview de commit.
2. **Sin Deployment Protection ni contraseña** en producción — si está activa, el iframe carga en blanco. Vercel → Project → Settings → Deployment Protection.
3. **Embebible:** que no mande `X-Frame-Options: DENY/SAMEORIGIN` ni un CSP `frame-ancestors` restrictivo. Lo ideal es agregar en cada demo `frame-ancestors 'self' https://<portafolio>` para permitir **solo** al portafolio.
4. **Ruta de entrada** del preview (normalmente `/`).
5. **Permiso del cliente** para mostrarlo, o que sea una versión demo con datos de ejemplo. Dakar, Don Antonio y Duo suenan a negocios reales — confirmar caso por caso.
6. **Datos para la ficha:** rubro, qué problema resuelve, con qué cuenta la web, stack, tiempo aproximado.
7. **Captura/poster** — la saca Claude Code del render si no la pasan.

Si el negocio o los datos son de ejemplo, la ficha lo dice (**"Demo"**). Nunca un negocio inventado presentado como cliente real, ni datos absurdos tipo "Juan Pérez / $999 / Lorem ipsum" (`6 Verificación UX.md`).

### 5.2 Videos

**Estado real (28/08/2026):** en `Videos Que hacemos/` hay **un solo archivo**, `demo-portafolio.mp4` — 1920×1080, **113 s**,
**20,4 MB** y **con pista de audio**. Está fuera de la especificación de §4.3 en todo: duración, peso, audio y encuadre
(fondo beige claro y textos explicativos a los costados, que en una franja angosta no se leen).

Es una demo narrada de una distribuidora y **cubre tres de los cuatro paneles**. Se cortaron tres loops con ffmpeg,
recortados en vertical al motivo central, sin audio y con el brillo bajado para que el beige no choque con el fondo negro:

| Panel | Tramo del original | Archivo | Peso |
|---|---|---|---|
| Tiendas online | 5-14 s (catálogo y checkout en celular) | `tienda.mp4` / `.webm` | 526 KB |
| Sistemas de gestión | 57-66 s (panel de administrador) | `gestion.mp4` / `.webm` | 55 KB |
| Automatizaciones y WhatsApp | 92-101 s (asistente de WhatsApp) | `whatsapp.mp4` / `.webm` | 74 KB |

**Falta el video de "Sitios web".** Ese panel usa como poster una captura real del sitio de Duo Administración —
es un sitio propio, así que no es un mockup.

⚠️ **Para los próximos videos:** el encuadre es lo que más cuesta arreglar después. El motivo tiene que estar **centrado**
y funcionar tanto en franja angosta como en panel ancho, y los textos explicativos no sirven: se pierden en el recorte.

### 5.3 Assets

| Asset | Estado |
|---|---|
| Logo MF en SVG, fondo transparente, versión blanca | ⬜ **falta** — ver `portafolio-mf/marca/README.md` |
| Favicon (SVG + PNG 32/180/512) | ⬜ falta (se deriva del SVG) |
| Imagen OG 1200×630 | ⬜ falta (se arma con el logo sobre el fondo negro/azul) |
| Imágenes genéricas de cada proyecto (grilla) | ⬜ se generan de la captura real de cada demo |
| Posters de los 4 videos | ⬜ falta (primer frame) |
| Fotos de Facundo y Mateo | ➖ **no hacen falta** — las tarjetas van sin foto |

### 5.4 Copy

**Sin Lorem ipsum.** Los borradores están escritos en la **sección 10** — Facundo los aprueba o los corrige, pero el sitio se puede construir con ellos: no son placeholders.

Lo único que **no** se puede escribir sin Facundo, porque son datos reales y no se inventan:
- **[FALTA]** Bios de Facundo y Mateo.
- **[FALTA]** Descripción de cada proyecto (qué tiene esa web/tienda concreta).

### 5.5 Datos de marca

- Nombre: **Desarrollos MF**
- WhatsApp: **+54 9 11 2272-8576** → `https://wa.me/5491122728576` con mensaje prellenado
- Mail: **desarrollosmf00@gmail.com**
- Instagram: **[FALTA el usuario]** — el hero lo necesita
- Dominio: se compra más adelante. Hasta entonces se trabaja sobre el `*.vercel.app` del portafolio. `wa.me`, metadatos OG y `frame-ancestors` quedan **parametrizados en un solo archivo de config** para cambiar el dominio sin tocar todo el código.
- Legales (`/aviso-legal`, `/privacidad`): se redactan con contenido real **antes de publicar los anuncios**; hasta entonces, placeholder marcado.

---

## 6. Stack y restricciones

**Base:** Next.js (App Router) + React + TypeScript + Tailwind CSS. Es el stack por defecto del cerebro (`Agencia desarrollo IA/03 Stack/Stack por defecto.md`), más TypeScript porque el componente de referencia lo asume.

**Estructura de componentes:** convención shadcn — los componentes reutilizables van en **`components/ui/`**. No hace falta instalar shadcn entero; sí respetar la ruta, porque el componente de referencia y cualquier otro que se sume después la asumen. Si se quiere el set completo, `npx shadcn@latest init`.

**Dependencias nuevas y por qué:**

| Paquete | Para qué | Nota |
|---|---|---|
| `framer-motion` (motion) | Palabra rotativa del hero, reveals al scroll, progreso del camino de "Cómo trabajamos" | **Una sola librería de animación** en todo el proyecto. No sumar GSAP ni otra encima. |
| `lucide-react` | Íconos | Reemplaza a `react-icons` del snippet: más liviano y tree-shakeable. |

**Dónde vive el código:** `C:\dev\portafolio-mf\` — **fuera de OneDrive**, sin excepción (`node_modules` en OneDrive = placeholders en la nube y loops de recarga). En OneDrive solo van los `.md` de este proyecto, este brief incluido.

**Hosting:** Vercel. El portafolio y **cada demo son deploys separados**. Las demos ya están desplegadas en sus propios proyectos; el portafolio las consume por URL, no las re-hostea.

**Formulario:** endpoint serverless que manda mail con **Resend** a `desarrollosmf00@gmail.com`. Sin base de datos.

**Analítica:** la más liviana posible — Vercel Analytics o Plausible. Sin banner de cookies; elegir la opción que no lo requiera.

**Integraciones:** ninguna de pagos ni envíos. WhatsApp = link `wa.me`, **no** la API de Meta.

### 6.1 Presupuesto de rendimiento ⚠️

Este sitio acumula tres cosas caras: humo animado, 4 videos e iframes. Reglas duras:

- **Nada de lo pesado carga de entrada.** El hero pinta primero; humo, videos e iframes vienen después.
- **Videos:** `preload="none"` + poster. Solo el panel activo reproduce. Ninguno se descarga hasta que la sección entra en viewport.
- **Iframes:** cero al cargar la página. Se montan al interactuar.
- **El humo no puede ser el elemento LCP.** El LCP tiene que ser el título del hero (texto).
- **Fuentes** con `next/font`, self-hosted, `display: swap`.
- Toda animación sobre `transform`/`opacity`.
- Objetivo medido en Lighthouse **mobile**: LCP ≤ 2,5 s · INP ≤ 200 ms · CLS ≤ 0,1.

**No-negociables:** mobile-first · contraste AA · una acción primaria por pantalla · WhatsApp clickeable en todas las pantallas · `prefers-reduced-motion` respetado en todo.

**Qué NO usar:** dark patterns, pop-up de newsletter, carrusel de logos, scroll-jacking, parallax pesado, video con audio, fuentes que bloqueen el render, **precios en el sitio** (el cerebro: nunca precio suelto), testimonios inventados, una segunda librería de animación.

---

## 7. Plan de construcción

Claude Code construye un bloque, para, y espera el OK de Facundo. No todo de un saque.

| # | Paso | Depende de |
|---|---|---|
| 1 | Scaffold Next.js + TS + Tailwind + tokens de la §3.3 + `components/ui/` + deploy vacío a Vercel (URL desde el día 1) | — |
| 2 | Layout base: header con logo y CTA, footer, y el archivo único de config (WhatsApp, mail, Instagram, dominio) | logo SVG |
| 3 | **Hero:** título con palabra rotativa + contactos abajo a la izquierda | usuario de Instagram, subtítulo |
| 4 | **Humo animado** del hero (versión barata primero; se evalúa si alcanza) | paso 3 |
| 5 | **Selector "Qué hacemos"** — primero con posters estáticos, para dejar cerrada la interacción y la variante mobile | copy de los 4 paneles |
| 6 | Enchufar los **4 videos** al selector + lógica de reproducir solo el activo | los videos |
| 7 | Componente **`<DemoFrame>`**: iframe + toggle de dispositivo + poster/lazy-load + overlay anti scroll-trap. Probado con **una** demo real | 1 URL de demo |
| 8 | Sección **"Nuestros proyectos"** (grilla estilo nyro) + ruta `/proyectos/[slug]` como plantilla | URLs + descripciones |
| 9 | Cargar las 4 demos | datos de cada una |
| 10 | **"Cómo trabajamos"** — camino serpiente con scroll + variante vertical mobile | texto de las 5 etapas |
| 11 | **"Quiénes somos"** — dos tarjetas | bios |
| 12 | **"Contacto"** + formulario → Resend, con validación en vivo y confirmación | — |
| 13 | Páginas legales (con texto real; hasta entonces placeholder marcado) | texto legal |
| 14 | Analítica + metadatos OG + favicon + `sitemap.xml` | imagen OG |
| 15 | **Pasada completa de verificación UX** (Parte A + Parte B) y arreglo de todo lo que sea severidad 3 o 4 | todo lo anterior |

**Se puede empezar por el paso 1 y 2 sin esperar nada más** que el logo en SVG. Los videos y las URLs de demo bloquean los pasos 6, 8 y 9, no el arranque.

---

## 8. Definición de "terminado"

- [ ] Le corrí la verificación UX del cerebro (`6 Verificación UX.md`, Parte A + B) y **no queda nada en severidad 3 o 4**.
- [ ] Test de los 5 segundos: alguien que no participó entiende qué hace Desarrollos MF, a quién le sirve, y encuentra cómo contactar — sin ayuda.
- [ ] Probado en un **celular real** (no redimensionando): sin scroll horizontal, targets ≥44 px, CTA en la zona del pulgar.
- [ ] **El selector de "Qué hacemos" y el camino de "Cómo trabajamos" tienen variante mobile propia** y funcionan con el dedo, no solo con mouse.
- [ ] **`prefers-reduced-motion`**: activado, el sitio sigue siendo usable y legible — humo estático, palabra fija, camino dibujado, sin reveals.
- [ ] **Contraste verificado con medidor** sobre fondo negro, texto y componentes. El navy oscuro no se usó para nada que necesite leerse.
- [ ] **Foco de teclado visible** en toda la página, incluidos los paneles del selector.
- [ ] Core Web Vitals OK en Lighthouse **mobile**: LCP ≤ 2,5 s · INP ≤ 200 ms · CLS ≤ 0,1 — con videos e iframes en lazy-load.
- [ ] **La palabra rotativa del hero no produce salto de layout** (CLS = 0 en ese bloque).
- [ ] Los iframes cargan **solo al interactuar**; cada demo abre y se puede volver al portafolio sin perderse.
- [ ] Los 4 videos: mudos, en loop, solo reproduce el activo, con poster, y se leen bien también en panel angosto.
- [ ] Formulario: envía, valida en vivo, no pierde lo escrito al fallar, confirma con "qué pasa ahora".
- [ ] WhatsApp clickeable en todas las pantallas, con mensaje prellenado.
- [ ] Sin placeholders ni datos inventados sin marcar. Las demos con datos de ejemplo dicen "Demo".
- [ ] Metadatos OG + favicon; el sitio aparece al buscar "Desarrollos MF" en Google.
- [ ] Analítica midiendo clicks al CTA y envíos de formulario.

---

## 9. Qué falta para poder construir

### 9.1 Bloqueantes reales

**Ninguno bloquea el arranque.** Los pasos 1 a 5, 7, 10 y 12 se pueden construir hoy.

| Bloquea | Qué falta | Estado |
|---|---|---|
| Paso 3 (hero) | **Usuario de Instagram** | ⬜ falta — mientras tanto el ícono se deja oculto, no roto |
| Paso 6 | **Los 4 videos** + a qué panel va cada uno | ⬜ faltan (`Videos Que hacemos/` está vacía). El paso 5 arma el selector con posters, así que no frena la sección |
| Pasos 8-9 | **URLs de producción** de las 4 demos + permiso del cliente + qué tiene cada una | ⬜ faltan |
| Paso 11 | Bios de Facundo y Mateo | ⬜ faltan |
| Paso 13 | Texto de aviso legal y privacidad | ⬜ pendiente (antes de publicar anuncios) |

### 9.2 Confirmaciones rápidas (no bloquean: hay default razonado)

| Tema | Default si Facundo no dice nada |
|---|---|
| Negro de fondo | `#08090C` (evita banding con el humo) |
| Radio de tarjetas | `16px` |
| Subtítulo del hero | Opción **A** de §10.1 |
| Copy en general | Los borradores de la sección 10, tal cual |

### 9.3 Resuelto ✅

**Logo vectorial** (`Marca/logo-mono.svg` + favicons) · tipografía **Manrope** · paleta completa con tokens y contrastes medidos · navy real `#1A213B` · contacto (WhatsApp, mail) · nicho · secciones y orden · las 4 demos elegidas · botón primario del hero confirmado · **todo el copy salvo bios y descripciones de proyecto**.

### 9.4 Qué se puede construir HOY

Los **pasos 1 a 5, 7, 10 y 12** salen completos sin esperar nada: scaffold, layout con logo, hero con palabra rotativa y humo, selector de "Qué hacemos" con posters, componente `<DemoFrame>`, camino de "Cómo trabajamos" y formulario de contacto.

Eso es **la mayor parte del sitio**. Lo que falta son datos que se enchufan después **sin rehacer estructura**: 4 videos, 4 URLs, 2 bios y el texto legal.

---

## Ubicación de archivos

| Qué | Dónde |
|---|---|
| Este brief y los assets | `Agencia/Portafolio MF/` (OneDrive — solo texto y assets) |
| Logo y derivados | `Agencia/Portafolio MF/Marca/` |
| Videos | `Agencia/Portafolio MF/Videos Que hacemos/` |
| **El código** | `C:\dev\portafolio-mf\` — **fuera de OneDrive, sin excepción** |

⚠️ El código **nunca** va en OneDrive: `node_modules` queda como placeholders en la nube y provoca loops de recarga y fallos de Turbopack. Ya pasó dos veces en Tienda Mates.

---

## 10. Copy — borradores listos para usar

> **Estado: borrador aprobable.** Está escrito, no es placeholder: Claude Code puede construir con este texto tal cual. Facundo lo corrige donde quiera, pero **no hace falta esperarlo para arrancar**. Tono: de vos, frases cortas, entrando por el problema del cliente.

### 10.1 Hero

**Título:** `Desarrollando` + palabra rotativa (`Landing pages` → `Tiendas` → `Automatizaciones` → `Sistemas de gestión` → `Sitios web`).

**Subtítulo — tres opciones, elegir una:**
- **A** *(recomendada — entra por el resultado)*: "Sitios, tiendas y sistemas a medida para negocios que quieren dejar de perder tiempo y clientes."
- **B** *(más directa)*: "Construimos las herramientas que tu negocio necesita para vender y trabajar mejor."
- **C** *(más corta)*: "Herramientas y desarrollos a medida para tu negocio."

**Botón primario:** `Hablemos por WhatsApp`

**Íconos de contacto (esquina inferior izquierda):** Instagram · Mail · WhatsApp — cada uno con `aria-label` ("Escribinos por WhatsApp", "Mandanos un mail", "Seguinos en Instagram").

### 10.2 Qué hacemos — los 4 paneles

**Título de sección:** "Qué hacemos"
**Bajada:** "Cada cosa que construimos resuelve un problema concreto. Estos son los cuatro que más nos piden."

| # | Título | Descripción (va en el panel activo) |
|---|---|---|
| 1 | **Sitios web** | Que te encuentren cuando te buscan. Rápido, claro y pensado para el celular, con todo lo que tu cliente pregunta antes de llamar. |
| 2 | **Tiendas online** | Vendé sin depender del mostrador. Catálogo, precios y pedidos online, con un panel donde cargás los productos vos mismo. |
| 3 | **Sistemas de gestión** | Ordená lo que hoy vive en un cuaderno. Turnos, pedidos, clientes y los números del negocio en un solo lugar. |
| 4 | **Automatizaciones y WhatsApp** | Que el negocio siga atendiendo cuando vos no estás. Respuestas automáticas, recordatorios y tareas repetidas que se hacen solas. |

*(Fuente: `Agencia desarrollo IA/02 Playbooks/Catálogo de productos.md` — cada panel entra por el dolor, no por la tecnología.)*

### 10.3 Nuestros proyectos

**Título de sección:** "Nuestros proyectos"
**Bajada:** "Entrá y navegalos como si fueran tuyos. Son sitios reales, funcionando."

**Chips de categoría:** `Sitio web` · `Tienda` · `Panel admin` · `Sistema de gestión` · `Automatización` · `Landing page`

**Botones:**
- Card de la grilla → `Ver proyecto`
- Ficha, sobre el poster → `Explorar la demo`
- Junto al iframe → `Abrir en pestaña nueva`
- Cierre de la ficha → `Quiero algo así`

**Aviso de demo** (solo si los datos son de ejemplo): "Los datos de esta demo son de ejemplo."

### 10.4 Cómo trabajamos — las 5 etapas

**Título de sección:** "Cómo trabajamos"
**Bajada:** "Cinco pasos, siempre los mismos. Sabés en qué punto está tu proyecto en todo momento."

| # | Etapa | Texto de la tarjeta | Qué necesitamos de vos |
|---|---|---|---|
| **01** | **Conocer al cliente** | Hablamos de tu negocio antes de hablar de tecnología: cómo trabajás hoy, qué te hace perder tiempo y qué te preguntan tus clientes todo el día. De ahí sale qué hay que construir — y a veces, qué no. | Una charla. |
| **02** | **Diseñar propuesta a medida** | Te llevamos una propuesta escrita con alcance, plazo y precio. Lo que entra y lo que no queda claro desde el principio: nada de "después vemos". | Que la leas y nos digas si el alcance es el correcto. |
| **03** | **Desarrollo completo** | Construimos por partes y te vamos mostrando. No desaparecemos tres semanas para volver con algo que no esperabas. | El contenido: fotos, textos y precios. Es lo que más atrasa un proyecto — cuanto antes llega, antes se termina. |
| **04** | **Revisar con el cliente** | Antes de entregar revisamos todo con vos y contra nuestra propia checklist de usabilidad: que se entienda, que funcione en el celular y que cargue rápido. Lo que no pasa, se corrige. | Que lo pruebes y nos digas qué no se entiende. |
| **05** | **Entrega** | Te lo entregamos funcionando y **a tu nombre**: el dominio, el hosting y los accesos son tuyos. Te mostramos cómo usarlo y quedamos disponibles para el mantenimiento. | Nada. Ya está andando. |

> El "a tu nombre" de la etapa 05 no es un detalle: responde la pregunta que todo cliente tiene y no se anima a hacer, y es una regla del cerebro (`Seguridad y datos`). Se deja **explícito**.

### 10.5 Quiénes somos

**Título de sección:** "Quiénes somos"
**Bajada:** "Somos dos. No hay un call center atrás: con quien hablás es con quien construye."

**Tarjetas:** `Facundo Fernández Zone` · `Mateo Orlando`
**[FALTA]** rol y una o dos líneas de bio de cada uno. **No se inventan.**

### 10.6 Contacto

**Título:** "Contemos qué necesitás"
**Bajada:** "Escribinos por WhatsApp y te respondemos en el día. Si preferís, dejanos los datos y te escribimos nosotros."

**Botón primario:** `Hablemos por WhatsApp`

**Formulario** — solo 4 campos (cada campo de más pierde gente):

| Campo | Label | Placeholder |
|---|---|---|
| 1 | Nombre | Cómo te llamás |
| 2 | Tu negocio | Nombre o rubro |
| 3 | Qué necesitás | Contanos en dos líneas qué querés resolver |
| 4 | WhatsApp o mail | Por dónde te contactamos |

- Botón: `Enviar` → mientras envía: `Enviando…` (y queda deshabilitado)
- **Confirmación:** "Listo. Te escribimos por WhatsApp en el día."
- **Error de envío:** "No pudimos enviar el mensaje. Escribinos directo por WhatsApp y lo resolvemos ahora." + botón de WhatsApp.

### 10.7 Mensajes prellenados de WhatsApp

- **General:** `Hola, vi el portafolio de Desarrollos MF y quiero consultarles por un proyecto.`
- **Desde una ficha de proyecto:** `Hola, vi la demo de [PROYECTO] en el portafolio y quiero algo así para mi negocio.`

### 10.8 Footer

Logo MF · `Desarrollos MF` · WhatsApp · desarrollosmf00@gmail.com · Instagram · `Aviso legal` · `Privacidad` · `© 2026 Desarrollos MF`

### 10.9 Metadatos

- **Title:** `Desarrollos MF — Sitios, tiendas y sistemas a medida`
- **Description:** `Construimos sitios web, tiendas online, sistemas de gestión y automatizaciones para negocios. Mirá nuestros proyectos funcionando.`

---

## Reglas fijas para Claude Code (la ley)
1. Seguí la dirección de diseño al pie. Si una decisión no está definida, preguntá antes de inventar — no tires el default genérico.
2. Mobile-first siempre.
3. Una acción primaria dominante por pantalla.
4. No inventes contenido: sin contenido real, dejá un placeholder marcado, nunca datos/precios/testimonios falsos.
5. Construí de a una sección y no avances sin mi confirmación.
6. Cada decisión sirve al objetivo del sitio. Lo que no aporta a la acción primaria, sobra.
7. Accesibilidad y performance no son opcionales: contraste AA, targets ≥44px, imágenes optimizadas, `prefers-reduced-motion` respetado.
8. Cuando termines una sección, recordame correrle la skill ux-audit antes de seguir.

---
### Handoff
Leé este brief completo: es la ley de este proyecto. Empezá por el paso 1 del plan de construcción y no avances de sección sin que confirme.
