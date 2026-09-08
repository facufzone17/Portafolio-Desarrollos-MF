import type { Metadata } from "next";
import { PaginaLegal } from "@/components/legal/PaginaLegal";
import { legal } from "@/lib/legal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Política de privacidad | ${site.name}`,
  description:
    "Qué datos personales trata Trevoo, para qué, con quién se comparten y qué derechos tenés. Ley N° 25.326.",
  robots: { index: false },
};

export default function Privacidad() {
  return (
    <PaginaLegal titulo="Política de privacidad">
      <p>
        Esta política explica qué datos personales tratamos cuando usás el sitio
        web de Trevoo o te comunicás con nosotros, y qué derechos tenés sobre
        ellos. Cumplimos con la Ley N° 25.326 de Protección de los Datos
        Personales y su reglamentación.
      </p>

      <h2>1. Responsables</h2>
      <p>
        {legal.responsables} («Trevoo»), con domicilio en {legal.ciudad}. Para
        cualquier tema relacionado con tus datos, escribinos a{" "}
        <a href={`mailto:${legal.email}`}>{legal.email}</a>.
      </p>

      <h2>2. El Sitio no recopila datos por sí mismo</h2>
      <p>
        El Sitio es un portfolio: no tiene formularios, cuentas de usuario,
        carrito ni pagos. Navegarlo no requiere que nos des ningún dato personal
        y no guardamos información tuya en nuestros servidores.
      </p>
      <p>
        La sección «Contacto» incluye un cuadro para redactar un mensaje: lo que
        escribís ahí <strong>no se envía a ningún servidor nuestro</strong>. Al
        presionar el botón se abre WhatsApp con ese texto ya cargado, y sos vos
        quien decide enviarlo.
      </p>

      <h2>3. Datos que sí tratamos</h2>
      <ul>
        <li>
          <strong>Cuando nos escribís</strong> por WhatsApp, correo, Instagram o
          teléfono: tratamos el contenido de tu mensaje y tu dato de contacto
          (tu número, tu dirección de correo o tu usuario), con el único fin de
          responderte y, si avanzamos, de gestionar la relación comercial.
        </li>
        <li>
          <strong>Datos técnicos de navegación:</strong> nuestro proveedor de
          alojamiento (Vercel Inc.) registra de forma automática datos técnicos
          como la dirección IP, el tipo de navegador y las páginas visitadas,
          con fines de seguridad, prevención de abuso y funcionamiento del
          Sitio. No usamos esos datos para identificarte ni para publicidad.
        </li>
      </ul>
      <p>No solicitamos datos sensibles ni recolectamos información de forma oculta.</p>

      <h2>4. Para qué usamos tus datos</h2>
      <p>
        Únicamente para responder tu consulta, contactarte, preparar y enviarte
        una propuesta y gestionar la relación comercial si avanzamos. No los
        usamos para otros fines, no los usamos para publicidad y no tomamos
        decisiones automatizadas sobre vos.
      </p>

      <h2>5. Base legal</h2>
      <p>
        El tratamiento se basa en tu consentimiento —que prestás al escribirnos
        por cualquiera de los canales— y en nuestro interés legítimo de
        responder y dar seguimiento a tu consulta.
      </p>

      <h2>6. Canales de contacto y terceros</h2>
      <p>No vendemos ni cedemos tus datos. Intervienen únicamente:</p>
      <ul>
        <li>
          <strong>Vercel Inc.</strong> — alojamiento del Sitio (Estados Unidos).
        </li>
        <li>
          <strong>Las plataformas que elegís para escribirnos:</strong> WhatsApp
          e Instagram (Meta Platforms, Inc.), el correo electrónico (tu proveedor
          y, del lado nuestro, Gmail de Google LLC) y la telefonía (tu operador).
          Lo que compartas a través de esas plataformas se rige también por sus
          propias políticas de privacidad, sobre las que no tenemos control.
        </li>
      </ul>
      <p>
        Además, podríamos divulgar datos si una autoridad competente lo requiere
        por ley.
      </p>

      <h2>7. Transferencia internacional</h2>
      <p>
        Vercel y, según el canal que uses, Meta y Google están ubicados en los
        Estados Unidos. Al usar el Sitio y esos canales de contacto, prestás tu
        consentimiento para esa transferencia, realizada al solo efecto de los
        fines descriptos en esta política.
      </p>

      <h2>8. Cuánto tiempo conservamos tus datos</h2>
      <p>
        Conservamos tu consulta y los mensajes intercambiados mientras dure la
        gestión y, si se genera una relación comercial, mientras esta continúe y
        por el plazo que exijan las obligaciones legales o contables. Cumplido
        ese plazo, los eliminamos. Podés pedirnos la eliminación antes (ver
        punto 10).
      </p>

      <h2>9. Cookies y tecnologías de seguimiento</h2>
      <p>
        Actualmente el Sitio <strong>no utiliza cookies ni herramientas de
        analítica o publicidad de terceros</strong>. Las tipografías se sirven
        desde el propio Sitio y no se cargan recursos externos que te rastreen.
      </p>
      <p>
        Más adelante podríamos incorporar herramientas de medición y publicidad
        (por ejemplo, Google Analytics, Google Ads o Meta Pixel), que usan
        cookies para medir el rendimiento de las campañas. Si lo hacemos,
        actualizaremos esta política y, cuando corresponda, te lo informaremos
        mediante un aviso en el Sitio y te pediremos tu consentimiento antes de
        activarlas.
      </p>

      <h2>10. Tus derechos</h2>
      <p>
        Tenés derecho a acceder a tus datos, rectificarlos, actualizarlos y
        solicitar su supresión, y a retirar tu consentimiento en cualquier
        momento. Para ejercer estos derechos, escribinos a{" "}
        <a href={`mailto:${legal.email}`}>{legal.email}</a>; te responderemos
        dentro de los plazos legales y sin costo.
      </p>
      <p>
        La <strong>Agencia de Acceso a la Información Pública (AAIP)</strong>,
        órgano de control de la Ley N° 25.326, atiende denuncias y reclamos por
        incumplimientos:{" "}
        <a href="https://www.argentina.gob.ar/aaip" target="_blank" rel="noopener noreferrer">
          argentina.gob.ar/aaip
        </a>
        .
      </p>
      <p>
        <em>
          El titular de los datos personales tiene la facultad de ejercer el
          derecho de acceso a los mismos en forma gratuita a intervalos no
          inferiores a seis meses, salvo que se acredite un interés legítimo al
          efecto, conforme lo establecido en el artículo 14, inciso 3 de la Ley
          N° 25.326.
        </em>
      </p>

      <h2>11. Menores de edad</h2>
      <p>
        El Sitio está dirigido a personas mayores de edad y a empresas. No
        recolectamos de forma intencional datos de menores.
      </p>

      <h2>12. Seguridad</h2>
      <p>
        Adoptamos medidas técnicas y organizativas razonables para proteger los
        mensajes y datos de contacto que recibimos. Ninguna transmisión por
        Internet es completamente segura, pero trabajamos para minimizar los
        riesgos.
      </p>

      <h2>13. Cambios en esta política</h2>
      <p>
        Podemos actualizar esta política. La versión vigente es la publicada en
        esta página, con su fecha. Si el cambio es relevante, lo comunicaremos
        por los medios disponibles.
      </p>

      <h2>14. Contacto</h2>
      <p>
        <a href={`mailto:${legal.email}`}>{legal.email}</a>
      </p>
    </PaginaLegal>
  );
}
