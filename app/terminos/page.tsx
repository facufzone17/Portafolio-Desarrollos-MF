import type { Metadata } from "next";
import { PaginaLegal } from "@/components/legal/PaginaLegal";
import { legal } from "@/lib/legal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Términos y condiciones | ${site.name}`,
  description:
    "Condiciones de uso del sitio web de Trevoo: titularidad, propiedad intelectual, responsabilidad y ley aplicable.",
  robots: { index: false },
};

export default function Terminos() {
  return (
    <PaginaLegal titulo="Términos y condiciones de uso">
      <p>
        Estos términos regulan el acceso y el uso del sitio web de Trevoo (el
        «Sitio»). Al navegarlo, aceptás estas condiciones. Si no estás de
        acuerdo, no lo utilices.
      </p>

      <h2>1. Titularidad</h2>
      <p>
        El Sitio es operado por {legal.responsables} («Trevoo», «nosotros»), con
        domicilio en {legal.ciudad}. Podés contactarnos en{" "}
        <a href={`mailto:${legal.email}`}>{legal.email}</a>.
      </p>

      <h2>2. Objeto del Sitio</h2>
      <p>
        El Sitio tiene carácter informativo: muestra trabajos realizados por
        Trevoo y ofrece formas de contactarnos. No se venden productos ni
        servicios a través del Sitio, ni se realizan pagos en él, ni se procesan
        datos en nuestros servidores. Toda contratación se acuerda por separado,
        a través de los canales de contacto.
      </p>

      <h2>3. Uso permitido</h2>
      <p>Podés usar el Sitio para conocer nuestros servicios y contactarnos. No está permitido:</p>
      <ul>
        <li>usarlo con fines ilícitos o que afecten derechos de terceros;</li>
        <li>intentar acceder a áreas, cuentas o sistemas no públicos;</li>
        <li>introducir código malicioso o interferir con su funcionamiento;</li>
        <li>
          extraer su contenido de forma masiva o automatizada (<em>scraping</em>)
          sin autorización;
        </li>
        <li>
          reproducir, distribuir o explotar su contenido con fines comerciales
          sin nuestro permiso por escrito.
        </li>
      </ul>

      <h2>4. Propiedad intelectual</h2>
      <p>
        El diseño, el código, los textos, el nombre «Trevoo» y sus signos
        distintivos pertenecen a sus titulares y están protegidos por la
        legislación vigente.
      </p>
      <p>
        Las capturas de pantalla y demos de proyectos de clientes se muestran
        con autorización de sus titulares. Los proyectos cuyos titulares no
        autorizaron su difusión se muestran sin identificar, con un nombre
        genérico. Las marcas y contenidos de terceros pertenecen a sus
        respectivos dueños y se citan a título ilustrativo.
      </p>

      <h2>5. Enlaces a sitios de terceros</h2>
      <p>
        El Sitio incluye enlaces a sitios web de clientes y a servicios de
        terceros (por ejemplo, WhatsApp). No controlamos ni respondemos por el
        contenido, las políticas ni el funcionamiento de esos sitios.
      </p>

      <h2>6. Disponibilidad y responsabilidad</h2>
      <p>
        El Sitio se ofrece «tal como está». Hacemos un esfuerzo razonable por
        mantenerlo disponible y actualizado, pero no garantizamos su
        funcionamiento ininterrumpido ni la ausencia de errores. En la medida
        permitida por la ley, no seremos responsables por daños derivados del
        uso o de la imposibilidad de uso del Sitio, ni por decisiones tomadas en
        base a su contenido.
      </p>
      <p>
        Los plazos, alcances y precios de nuestros servicios que puedan
        mencionarse en el Sitio son orientativos y no constituyen una oferta
        vinculante.
      </p>

      <h2>7. Consultas que nos hacés</h2>
      <p>
        El Sitio no procesa consultas por sí mismo: te contactás con nosotros a
        través de canales externos (WhatsApp, correo, Instagram o teléfono). Al
        escribirnos, declarás que los datos que aportás son veraces y que estás
        autorizado a compartirlos. Iniciar una consulta no genera obligación de
        contratar para ninguna de las partes. El tratamiento de tus datos se
        rige por nuestra <a href="/privacidad">Política de privacidad</a>.
      </p>

      <h2>8. Cambios</h2>
      <p>
        Podemos modificar estos términos en cualquier momento. La versión
        vigente es la publicada en esta página, con su fecha de actualización.
      </p>

      <h2>9. Ley aplicable y jurisdicción</h2>
      <p>
        Estos términos se rigen por las leyes de la República Argentina. Ante
        cualquier controversia, las partes se someten a los tribunales
        ordinarios de la Ciudad Autónoma de Buenos Aires, salvo que una norma de
        orden público disponga otra cosa.
      </p>

      <h2>10. Contacto</h2>
      <p>
        <a href={`mailto:${legal.email}`}>{legal.email}</a>
      </p>
    </PaginaLegal>
  );
}
