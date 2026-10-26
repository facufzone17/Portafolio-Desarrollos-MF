import Script from "next/script";

/**
 * Pixel de Meta. Solo se monta si existe NEXT_PUBLIC_META_PIXEL_ID: sin el ID
 * no carga nada, y el sitio anda igual.
 *
 * Registra PageView al entrar. Al enviar el formulario de /turnos dispara
 * Contact (`registrarContacto`): la persona completo sus datos y abrio
 * WhatsApp con el mensaje armado. Antes era Lead, pero la web no puede saber
 * si despues apreto "enviar" en WhatsApp, y contarlo como Lead inflaba las
 * conversiones con gente que nunca escribio. Un Lead de verdad solo se puede
 * registrar cuando el contacto queda guardado o el mensaje llega.
 */
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export function PixelMeta() {
  if (!PIXEL_ID) return null;

  return (
    <Script id="pixel-meta" strategy="afterInteractive">
      {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
    </Script>
  );
}

type Fbq = (accion: "track", evento: string, datos?: Record<string, unknown>) => void;

/** Evento Contact del formulario. No hace nada si el pixel no esta cargado. */
export function registrarContacto(datos: Record<string, unknown>) {
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  fbq?.("track", "Contact", datos);
}
