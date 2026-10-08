import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80" // NO blur, plain dark scrim
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ y: -24, rotate: -4, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={{ y: 24, rotate: 4, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className="relative w-full max-w-lg bg-[var(--color-paper)] border-2 border-[var(--color-ink)] shadow-[8px_8px_0_0_var(--color-ink)] flex flex-col max-h-[90vh]"
          >
            {/* Header Strip */}
            <div className="bg-[var(--color-ink)] text-[var(--color-paper)] px-4 py-3 flex justify-between items-center border-b-2 border-[var(--color-ink)]">
              <h2 id="modal-title" className="font-mono uppercase tracking-widest text-sm font-bold">{title}</h2>
              <button 
                onClick={onClose}
                className="hover:text-[var(--color-signal)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-signal)]"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            {/* Content */}
            <div className="p-6 overflow-y-auto bg-[var(--color-paper)] text-[var(--color-ink)]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
