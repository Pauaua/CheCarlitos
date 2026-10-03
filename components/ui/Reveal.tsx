"use client";

import { MotionConfig, motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Retraso en segundos (útil para escalonar tarjetas) */
  delay?: number;
  as?: "div" | "li";
};

/**
 * Animación sutil de entrada al hacer scroll.
 * Con "reducir movimiento" activado en el sistema, solo hace un fundido (sin desplazamiento).
 */
export function Reveal({ children, className, delay = 0, as = "div" }: Props) {
  const Component = as === "li" ? motion.li : motion.div;

  return (
    <MotionConfig reducedMotion="user">
      <Component
        className={className}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: "easeOut", delay }}
      >
        {children}
      </Component>
    </MotionConfig>
  );
}
