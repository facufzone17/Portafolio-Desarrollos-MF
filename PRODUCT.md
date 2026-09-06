# Trevoo

> Escrito el 06/09/2026 a partir de lo que ya estaba registrado en el repo
> (`lib/site.ts`, `lib/servicios.ts`, `lib/proyectos.ts`, `lib/comoTrabajamos.ts`
> y el vault `Agencia desarrollo IA/`). **Nada de esto es inventado**, pero
> tampoco fue confirmado por Facundo en una entrevista: lo que falta cerrar
> está marcado abajo, en "Decisiones abiertas".

## Qué es

Trevoo construye herramientas digitales a medida para negocios locales: sitios
web, tiendas online, paneles de administración y automatizaciones.

Antes se llamaba **Desarrollos MF**. El cambio de marca es del 04/09/2026 e
incluyó nombre, logo, tipografía y paleta.

## El mecanismo, en una frase

Son dos personas que entienden cómo funciona el negocio antes de escribir
código, construyen la herramienta ellos mismos y no la dan por terminada hasta
verla funcionando con los datos reales del cliente.

Lo que ningún competidor puede copiar y pegar: **con quien hablás es con quien
construye**. No hay intermediarios, ni cuentas, ni proyectos que pasen de mano
en mano.

## Quiénes

Facundo Fernández Zone y Mateo. Dos personas, de punta a punta.

## A quién le habla este sitio

Al dueño de un negocio local que hoy resuelve a mano lo que debería estar
automatizado: responde precios por WhatsApp uno por uno, no tiene stock real,
depende de los portales para que lo encuentren, o llama a alguien cada vez que
quiere cambiar una foto.

No es un comprador técnico. No sabe (ni le importa) qué es Next.js. Mide en
tiempo perdido y en ventas que no cerró.

## Qué tiene que pasar en el sitio

Que entienda en cinco segundos que esto se construye a medida, que vea el
trabajo **andando** (no descrito), y que escriba por WhatsApp.

La acción primaria es una sola y se llama igual en todos lados: **Hablemos**.

## Lo que se ofrece

| Rubro | La promesa, en palabras del dueño |
|---|---|
| Sitios web | Que te encuentren y entiendan qué hacés antes de llamarte |
| Tiendas | Vendé de madrugada y enterate con el pedido ya cobrado |
| Paneles | Cambiá un precio o una foto vos, sin llamar a nadie |
| Automatizaciones | Lo que respondés veinte veces por día, respondido solo |

## La prueba

Cuatro proyectos, con demo visitable y ficha propia:

- **Duo Administración** (`duo-administracion`) — administradora de consorcios
  de CABA. Cliente real, datos reales.
- **Inmobiliaria** (`inmobiliaria`) — inmobiliaria de Villa Devoto. La cartera,
  la dirección y la reseña son del negocio real; solo el WhatsApp es de relleno.
- **Tienda de mates** (`tienda-mates`) — demo. Productos, precios y fotos de
  ejemplo, y el sitio lo avisa.
- **Distribuidora** (`distribuidora`) — demo. Nombre, dirección y reseñas de
  ejemplo; el catálogo sí es de un surtido real.

**Regla dura:** todo lo que es demo se marca como demo (`esDemo` en
`lib/proyectos.ts`). Nunca se presenta un negocio de ejemplo como cliente.

## Cómo se trabaja

Cinco pasos fijos, en `lib/comoTrabajamos.ts`: conocer al cliente, diseñar la
propuesta, desarrollo completo, revisar con el cliente, entrega. El proceso
completo (prospección, validación, verificación UX contra las 10 heurísticas de
Nielsen) vive en el vault `Agencia desarrollo IA/`, fuera de este repo.

## Restricciones que no se negocian

- **No inventar datos.** Si falta información, se pregunta. Un dato inventado en
  investigación se convierte en una propuesta equivocada tres pasos después.
- **Sin placeholders al cerrar una fase.** Y sin huecos dibujados tampoco: un
  recuadro punteado en el lugar donde el resto de la página muestra producto no
  se lee como "falta el material", se lee como que la sección está rota. El
  rubro sin captura cambia de layout (pasa a bloque de texto) en vez de mostrar
  una ventana vacía. Lo que falta se anota acá abajo, no se dibuja.
- **Nunca credenciales en texto plano.**
- El efecto de la palabra que rota bajo "Desarrollando" se conserva: es decisión
  explícita de Facundo.
- Las demos embebidas y las miniaturas de los proyectos se conservan.

## Decisiones abiertas

Estas todavía no están cerradas. Al llegar a ellas hay que avisar que se está
improvisando, no inventar un criterio y presentarlo como establecido.

- **Dominio propio.** `site.url` sigue apuntando a `localhost:3000`.
- **Instagram.** No hay usuario; el ícono no se dibuja hasta que lo haya.
- **Pricing.** El método está escrito en el vault, los números no.
- **Nicho.** A qué rubro se apunta específicamente.
- **Capturas de automatizaciones.** La carpeta `Portafolio MF/Imagenes Que
  hacemos/Automatizaciones` está vacía, así que ese rubro es el único sin
  producto a la vista.
- **Foto de Facundo y Mateo.** La sección "Quiénes somos" hace la afirmación más
  personal de la página y no tiene ni una imagen. Una foto de los dos es el
  único material honesto que la levantaría.
- **Apellido de Mateo**, para poder nombrarlo completo.
