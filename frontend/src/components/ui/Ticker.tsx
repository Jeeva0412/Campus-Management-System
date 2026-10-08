import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TickerProps {
  items: string[];
}

export function Ticker({ items }: TickerProps) {
  const [isPaused, setIsPaused] = useState(false);

  if (!items || items.length === 0) return null;

  // Duplicate items for seamless scrolling
  const scrollItems = [...items, ...items, ...items];

  return (
    <div className="w-full border-y-2 border-[var(--color-ink)] bg-[var(--color-paper)] text-[var(--color-ink)] flex items-center h-8 relative overflow-hidden group">
      <div 
        className="absolute left-2 z-10 bg-[var(--color-paper)] px-2 border-2 border-[var(--color-ink)]"
        aria-hidden="true"
      >
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="font-mono text-[10px] font-bold uppercase hover:text-[var(--color-signal)]"
          aria-label={isPaused ? "Play ticker" : "Pause ticker"}
        >
          {isPaused ? 'PLAY' : 'PAUSE'}
        </button>
      </div>
      
      <div 
        className="flex whitespace-nowrap pl-24"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div
          className="flex gap-12 font-mono text-xs font-bold uppercase tracking-widest"
          animate={{ x: isPaused ? 0 : "-33.33%" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: items.length * 5,
          }}
          // If paused, we just let it stay where it is using Framer Motion's control, 
          // but for simplicity in React, using a CSS animation pause state is sometimes easier.
          // Since we use animate prop, framer motion will restart from 0 if not handled right.
          // We'll use CSS instead for the seamless marquee.
          style={{
            animation: `marquee ${items.length * 5}s linear infinite`,
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
        >
          {scrollItems.map((item, i) => (
            <span key={i} className="flex items-center gap-4">
              <span className="w-2 h-2 rounded-full bg-[var(--color-signal)] inline-block" />
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </div>
  );
}
