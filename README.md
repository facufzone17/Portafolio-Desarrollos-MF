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

## Variables de entorno

Van en `.env.local` (ya está en `.gitignore`) y, para el deploy, en Vercel.
**Nunca en un commit.**

| Variable | Obligatoria | Default | Para qué |
|---|---|---|---|
| `RESEND_API_KEY` | para que el formulario entregue | — | Clave de [resend.com](https://resend.com). Sin ella el endpoint no rompe: en dev y en preview registra y devuelve ok; en producción devuelve 502 y el formulario cae a su CTA de WhatsApp. |
| `CONTACTO_REMITENTE` | no | `Trevoo <onboarding@resend.dev>` | Remitente del mail de consulta. |
| `CONTACTO_DESTINO` | no | `site.email` (`lib/site.ts`) | A dónde llegan las consultas. |

**Todavía no hay dominio, y no hace falta.** Resend pide dominio verificado solo
para un remitente propio; `onboarding@resend.dev` no pide nada, con la
restricción de que **solo entrega al mail dueño de la cuenta de Resend**. Como
el destino es justamente `desarrollosmf00@gmail.com`, alcanza con crear la
cuenta de Resend **con ese gmail** y el formulario queda andando. El día que
haya dominio se cambia `CONTACTO_REMITENTE` en Vercel y no se toca código.

## Protección del formulario

Dos capas, las dos en código y sin dependencias ni servicios externos:

- **Honeypot** (`apodo`): un campo fuera de pantalla, `aria-hidden`,
  `tabIndex={-1}` y `autocomplete="off"`. Si viene lleno, la ruta responde
  **200 y descarta en silencio** — a un bot no se le avisa que lo detectaron,
  porque si recibe un error prueba otra cosa.
- **Límite por IP** (`lib/limite.ts`): **5 envíos cada 10 minutos**, en memoria.
  Al pasarse devuelve **429** con `Retry-After` y el formulario muestra un
  mensaje propio (no el de error genérico) más el CTA de WhatsApp.

**El límite no es distribuido**: cada instancia serverless tiene su propio
contador, así que con varias instancias vivas el tope real es más alto, y no
frena a alguien con muchas IP. Es una capa, no la última palabra. Si el abuso
llega a ser real, la respuesta es el firewall de Vercel o un límite sobre KV,
no estirar esto.

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
