"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "che-carlitos-modal-visto";

function readSeen() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

const noopSubscribe = () => () => {};

/**
 * Modal con la imagen promocional (public/imagenmodal.jpg) que aparece la primera vez que alguien entra a la página.
 * Al cerrarlo se guarda en el navegador (localStorage) para no volver a mostrarlo.
 * Se cierra con la X, con la tecla Escape o haciendo clic fuera de la imagen.
 */
export function WelcomeModal() {
  // En el servidor se asume "ya visto" para no mostrarlo antes de poder revisar el navegador
  const seen = useSyncExternalStore(noopSubscribe, readSeen, () => true);
  const [closed, setClosed] = useState(false);
  const open = !seen && !closed;
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Sin acceso al almacenamiento: solo se cierra por esta vez
    }
    setClosed(true);
  };

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      // Mantiene el foco dentro del modal (el único elemento enfocable es la X)
      if (e.key === "Tab") {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-navy/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => close()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Promoción Che Carlitos"
            className="relative"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src="/imagenmodal.jpg"
              alt="Che Carlitos: aire acondicionado domiciliario y vehicular. Reparación, mantención, instalación y venta de equipos split. Promoción: mantención a $24.000. Correo aireacondicionado.cc@hotmail.com, teléfonos +569 7692 5964 y +569 9802 7948."
              width={800}
              height={1424}
              priority
              sizes="(min-width: 640px) 480px, 90vw"
              className="h-auto max-h-[88dvh] w-auto rounded-2xl shadow-lift"
            />
            <button
              ref={closeRef}
              type="button"
              onClick={() => close()}
              aria-label="Cerrar"
              title="Cerrar"
              className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-navy shadow-lift transition-colors hover:bg-brand-navy hover:text-white"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
