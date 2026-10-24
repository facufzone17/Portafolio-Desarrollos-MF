import { ChevronDown } from "lucide-react";
import { Seccion } from "@/components/ui/Seccion";
import type { Pregunta } from "@/lib/preguntasTurnos";

/** Preguntas frecuentes en acordeon, sin JS: cada una es un `<details>`. */
export function Preguntas({
  preguntas,
  titulo = "Preguntas frecuentes",
  id,
}: {
  preguntas: Pregunta[];
  titulo?: string;
  id?: string;
}) {
  return (
    <Seccion ancho="max-w-[820px]" id={id} titulo={titulo}>
      <div className="mx-auto mt-12 max-w-[820px] divide-y divide-line border-y border-line">
        {preguntas.map((q) => (
          <details key={q.p} className="group">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg text-text [&::-webkit-details-marker]:hidden">
              {q.p}
              <ChevronDown
                className="size-5 shrink-0 text-text-muted transition-transform duration-[var(--duration-micro)] group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <p className="max-w-[64ch] pb-6 text-[15px] leading-relaxed text-text-muted sm:text-base">{q.r}</p>
          </details>
        ))}
      </div>
    </Seccion>
  );
}
