"use client";

import { useLenis } from "@/lib/useLenis";

/**
 * Punto de montaje de Lenis para toda la app. No renderiza nada: el efecto
 * de useLenis es lo unico que importa. Va en app/layout.tsx, junto a
 * {children}, para que el scroll con inercia corra en cualquier pagina.
 */
export function SmoothScroll() {
  useLenis();
  return null;
}
