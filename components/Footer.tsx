import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { IconInstagram } from "@/components/ui/IconInstagram";
import { LinkMail } from "@/components/ui/LinkMail";
import { Logo } from "@/components/ui/Logo";
import { instagramUrl, site, whatsappUrl } from "@/lib/site";

/**
 * Pie. Instagram solo aparece si hay usuario: nunca un link a ningun lado.
 *
 * El lockup ya trae la palabra, asi que aca NO va el nombre escrito al lado:
 * repetido, "Trevoo Trevoo" es lo que se leia mientras el logo era solo el
 * monograma.
 */
export function Footer() {
  const instagram = instagramUrl();

  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-start md:justify-between">
        <Logo className="text-[19px] text-text" />

        <nav className="flex flex-col gap-3 text-sm" aria-label="Contacto">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2.5 text-text-muted transition-colors hover:text-text"
          >
            <MessageCircle className="size-4 shrink-0" aria-hidden />
            {site.whatsappDisplay}
          </a>
          <LinkMail className="inline-flex min-h-11 items-center gap-2.5 text-text-muted transition-colors hover:text-text">
            <Mail className="size-4 shrink-0" aria-hidden />
            {site.email}
          </LinkMail>
          {instagram && (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2.5 text-text-muted transition-colors hover:text-text"
            >
              <IconInstagram className="size-4 shrink-0" />
              Instagram
            </a>
          )}
        </nav>

        <nav className="flex flex-col gap-3 text-sm" aria-label="Legales">
          <Link
            href="/terminos"
            className="inline-flex min-h-11 items-center text-text-muted transition-colors hover:text-text"
          >
            Términos y condiciones
          </Link>
          <Link
            href="/privacidad"
            className="inline-flex min-h-11 items-center text-text-muted transition-colors hover:text-text"
          >
            Privacidad
          </Link>
        </nav>
      </div>

      <div className="mx-auto max-w-[1400px] px-5 pb-10 sm:px-8">
        <p className="text-sm text-text-muted">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
