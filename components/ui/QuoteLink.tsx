"use client";

import type { ReactNode } from "react";
import { dispatchQuotePreset, type QuotePreset } from "@/lib/quote-preset";

type Props = {
  preset?: QuotePreset;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
};

/** Enlace a #cotizar que además deja preseleccionadas opciones en el formulario. */
export function QuoteLink({ preset, className, children, ...rest }: Props) {
  return (
    <a
      href="#cotizar"
      className={className}
      onClick={() => preset && dispatchQuotePreset(preset)}
      {...rest}
    >
      {children}
    </a>
  );
}
