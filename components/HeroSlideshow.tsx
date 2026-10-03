"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { HERO } from "@/lib/content";

const INTERVAL_MS = 5000;

/**
 * Imágenes del hero que van cambiando con un fundido suave.
 * - Se pausa al pasar el mouse o al enfocar los controles, y con el botón de pausa.
 * - Si el usuario tiene activado "reducir movimiento", no avanza sola (se cambia con los puntos).
 * Las imágenes y sus textos alternativos se editan en lib/content.ts → HERO.slides.
 */
export function HeroSlideshow() {
  const slides = HERO.slides;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const autoplay = !paused && !hovered && !reduceMotion && slides.length > 1;

  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [autoplay, slides.length]);

  const slide = slides[index];

  return (
    <div
      role="region"
      aria-roledescription="carrusel"
      aria-label="Imágenes de nuestros servicios"
      className="absolute inset-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[2.5rem]">
        <AnimatePresence initial={false}>
          <motion.div
            key={slide.src}
            className="absolute inset-0"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.2 : 0.9, ease: "easeOut" }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="(min-width: 1024px) 560px, (min-width: 640px) 448px, 90vw"
              className={slide.fit === "contain" ? "object-contain" : "object-cover"}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controles: puntos para elegir imagen y botón de pausa (debajo de la imagen) */}
      <div className="absolute inset-x-0 -bottom-12 flex items-center justify-center gap-1">
        {slides.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Ver imagen ${i + 1} de ${slides.length}`}
            aria-current={i === index}
            className="group flex h-8 w-8 items-center justify-center"
          >
            <span
              className={`block h-2.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-brand-orange-dark" : "w-2.5 bg-brand-navy/25 group-hover:bg-brand-navy/50"
              }`}
            />
          </button>
        ))}
        {!reduceMotion && slides.length > 1 && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "Reanudar el cambio de imágenes" : "Pausar el cambio de imágenes"}
            className="ml-1 flex h-8 w-8 items-center justify-center rounded-full text-brand-navy/60 transition-colors hover:bg-brand-navy/5 hover:text-brand-navy"
          >
            {paused ? <Play className="h-3.5 w-3.5" aria-hidden="true" /> : <Pause className="h-3.5 w-3.5" aria-hidden="true" />}
          </button>
        )}
      </div>
    </div>
  );
}
