"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor con forma de auto que deja una brisa de aire al moverse.
 * - El auto es un cursor nativo (public/cursors/*.svg): preciso al hacer clic y sin retraso.
 * - Mira hacia la izquierda o la derecha según hacia dónde se mueva el mouse.
 * - La brisa se dibuja en un <canvas> que no bloquea los clics, y es más intensa
 *   (más líneas, más largas y más rápidas) mientras más rápido se mueve el mouse.
 * - Solo se activa con mouse y si el usuario no pidió "reducir movimiento".
 */

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 1 → 0
  decay: number;
  length: number;
  wave: number;
  dot: boolean;
  strength: number; // 0 → 1 según la velocidad con que se creó
};

const MAX_PARTICLES = 500;
const CAR_LENGTH = 42; // distancia entre el parachoques (punto del clic) y la parte trasera del auto
const COLOR = "96, 146, 214"; // azul aire (se ve sobre fondos claros y oscuros)
// Velocidad (px por cuadro) a partir de la cual la brisa alcanza su máxima intensidad
const MAX_SPEED = 45;

export function CursorBreeze() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const root = document.documentElement;
    root.classList.add("car-cursor");
    root.dataset.carDir = "right";

    let direction = 1; // 1 = derecha, -1 = izquierda
    let last: { x: number; y: number; t: number } | null = null;
    let frame = 0;
    const particles: Particle[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    /** Crea brisa entre la posición anterior y la actual; "intensity" va de 0 (lento) a 1 (rápido). */
    const spawn = (from: { x: number; y: number }, to: { x: number; y: number }, intensity: number) => {
      // Lento: una brisa suave y esporádica. Rápido: hasta 10 líneas por movimiento.
      const count = Math.random() < 0.45 + intensity ? 1 + Math.round(intensity * 9) : 0;
      const spread = 10 + intensity * 16;
      for (let i = 0; i < count && particles.length < MAX_PARTICLES; i++) {
        // Repartidas a lo largo del recorrido para que no queden huecos al mover rápido
        const t = Math.random();
        const x = from.x + (to.x - from.x) * t;
        const y = from.y + (to.y - from.y) * t;
        const boost = 1 + intensity * 1.6;
        particles.push({
          x: x - direction * CAR_LENGTH + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.6) * spread,
          vx: -direction * (0.8 + Math.random() * 1.8) * boost,
          vy: (Math.random() - 0.5) * (0.5 + intensity),
          life: 1,
          decay: 0.009 + Math.random() * 0.014,
          length: (14 + Math.random() * 22) * boost,
          wave: (Math.random() - 0.5) * (10 + intensity * 8),
          dot: Math.random() < 0.25 - intensity * 0.1,
          strength: intensity,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.life -= p.decay;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = p.life * (0.6 + p.strength * 0.35);
        if (p.dot) {
          ctx.fillStyle = `rgba(${COLOR}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.5 + p.life * 1.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Línea de viento con una leve ondulación
          const len = p.length * (0.6 + p.life * 0.4) * -direction;
          ctx.strokeStyle = `rgba(${COLOR}, ${alpha})`;
          ctx.lineWidth = 1.5 + p.life * (1.2 + p.strength * 1.3);
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.quadraticCurveTo(p.x + len / 2, p.y + p.wave * p.life, p.x + len, p.y);
          ctx.stroke();
        }
      }

      // Solo sigue animando mientras haya brisa visible
      frame = particles.length ? requestAnimationFrame(draw) : 0;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const { clientX: x, clientY: y } = event;
      const now = performance.now();

      if (last) {
        const dx = x - last.x;
        const dy = y - last.y;
        if (Math.abs(dx) > 3) {
          const next = dx > 0 ? 1 : -1;
          if (next !== direction) {
            direction = next;
            root.dataset.carDir = next > 0 ? "right" : "left";
          }
        }
        // Velocidad en px por cuadro (~16 ms), independiente de la frecuencia del mouse
        const elapsed = Math.max(now - last.t, 4);
        const speed = (Math.hypot(dx, dy) / elapsed) * 16;
        if (speed > 0.5) spawn(last, { x, y }, Math.min(speed / MAX_SPEED, 1));
      }
      last = { x, y, t: now };

      if (!frame && particles.length) frame = requestAnimationFrame(draw);
    };

    const onLeave = () => {
      last = null;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frame);
      root.classList.remove("car-cursor");
      delete root.dataset.carDir;
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] h-full w-full" />;
}
