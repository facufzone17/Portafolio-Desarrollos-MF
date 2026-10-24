import type { MetadataRoute } from "next";
import { planes } from "@/lib/planes";
import { proyectos } from "@/lib/proyectos";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paginasFijas: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/turnos`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/terminos`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/privacidad`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const fichasProyectos: MetadataRoute.Sitemap = proyectos.map((p) => ({
    url: `${site.url}/proyectos/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const paginasPlanes: MetadataRoute.Sitemap = planes.map((p) => ({
    url: `${site.url}/turnos/${p.id}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...paginasFijas, ...paginasPlanes, ...fichasProyectos];
}
