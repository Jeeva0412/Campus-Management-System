import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { cn } from './utils';

interface HoldButtonProps {
  onConfirm: () => void;
  children: React.ReactNode;
  holdTime?: number;
  className?: string;
}

export function HoldButton({ onConfirm, children, holdTime = 600, className }: HoldButtonProps) {
  const [isHolding, setIsHolding] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const controls = useAnimation();

  const startHold = () => {
    setIsHolding(true);
    controls.start({
      scaleX: 1,
      transition: { duration: holdTime / 1000, ease: "linear" }
    });
    
    timeoutRef.current = setTimeout(() => {
      onConfirm();
      setIsHolding(false);
      controls.stop();
      controls.set({ scaleX: 0 });
    }, holdTime);
  };

  const endHold = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsHolding(false);
    controls.stop();
    controls.start({ scaleX: 0, transition: { duration: 0.1 } });
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <button
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
      onKeyDown={(e) => {
        if (!isHolding && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          startHold();
        }
      }}
      onKeyUp={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          endHold();
        }
      }}
      className={cn(
        "relative overflow-hidden font-mono uppercase tracking-widest text-[11px] font-bold border-2 border-[var(--color-ink)] px-4 py-2 bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-paper-dim)] transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-void)]",
        className
      )}
    >
      <motion.div
        className="absolute inset-0 bg-[var(--color-void)] origin-left"
        initial={{ scaleX: 0 }}
        animate={controls}
      />
      <span className="relative z-10 mix-blend-difference text-[var(--color-paper)]">
        {children}
      </span>
    </button>
  );
}
