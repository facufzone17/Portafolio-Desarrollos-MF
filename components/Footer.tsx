import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { IconInstagram } from "@/components/ui/IconInstagram";
import { Logo } from "@/components/ui/Logo";
import { instagramUrl, mailtoUrl, site, whatsappUrl } from "@/lib/site";

/** §10.8. Instagram solo aparece si hay usuario: nunca un link a ningun lado. */
export function Footer() {
  const instagram = instagramUrl();

  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-2.5">
          <Logo className="h-6 w-auto text-text" />
          <span className="text-[15px] tracking-tight">{site.name}</span>
        </div>

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
          <a
            href={mailtoUrl}
            className="inline-flex min-h-11 items-center gap-2.5 text-text-muted transition-colors hover:text-text"
          >
            <Mail className="size-4 shrink-0" aria-hidden />
            {site.email}
          </a>
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
            href="/aviso-legal"
            className="inline-flex min-h-11 items-center text-text-muted transition-colors hover:text-text"
          >
            Aviso legal
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
