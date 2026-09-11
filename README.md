This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contacto: no hay backend

**El sitio no tiene rutas de API ni formulario.** Hubo uno con entrega por
Resend, honeypot y límite por IP; se sacó el 07/09/2026 junto con la sección
vieja, y está entero en el historial de git si alguna vez hace falta.

Hoy la sección de contacto son dos columnas, las dos sin servidor: el
compositor de WhatsApp (`components/contacto/MensajeWhatsApp.tsx`, arma un link
`wa.me` con lo que el visitante escribe) y las vías
(`components/contacto/Vias.tsx`: WhatsApp, mail, Instagram y teléfono).

Consecuencia a tener presente: **ninguna vía retiene al visitante en el sitio.**
Todas abren WhatsApp, el cliente de mail, Instagram o el discador.

Dos datos siguen faltando, y los dos los tiene que traer Facundo:

- **Usuario de Instagram** — mientras `site.instagram` sea `null`, ese bloque
  directamente no se dibuja (§9.1: un ícono que no lleva a ningún lado es peor
  que no tenerlo). Se completa en `lib/site.ts` y aparece solo.
- **El `tel:` hay que probarlo en un teléfono real.** Sale de `site.whatsapp`,
  que lleva el `9` del formato internacional (`tel:+5491130256777`). Desde
  afuera del país es lo correcto; adentro, algunos discadores lo toleran y
  otros no. Si falla, la versión sin el `9` es `tel:+541130256777`.

## Verificación

No hay framework de tests. Las compuertas son:

```bash
npm run lint && npm run build
node scripts/verificar-arreglos.mjs      # regresiones (sale != 0 si falla)
node scripts/verificar-contacto.mjs      # la sección de contacto
```

Y para mirar la página, con el dev server arriba, los scripts de captura por
CDP dejan PNG en `capturas/` (ignorado por git):

```bash
node scripts/estados.mjs http://localhost:3000/ capturas/contacto-desktop 1440 900 0.82,0.88,0.94,1
node scripts/estados.mjs http://localhost:3000/ capturas/contacto-mobile 390 844 0.86,0.92,0.97,1
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
