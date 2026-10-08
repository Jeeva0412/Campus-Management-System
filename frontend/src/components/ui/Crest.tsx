import React from 'react';
import { cn } from './utils';

interface CrestProps {
  name: string;
  className?: string;
}

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function Crest({ name, className }: CrestProps) {
  const hash = hashString(name);
  const hue = hash % 360;
  const color = `oklch(0.8 0.17 ${hue})`;
  
  // Choose a geometric shape based on hash
  const shapeType = hash % 3;

  return (
    <div 
      className={cn("relative flex items-center justify-center border-2 border-[var(--color-ink)] overflow-hidden shrink-0", className)}
      style={{ backgroundColor: color }}
    >
      {shapeType === 0 && (
        <div className="absolute inset-0 opacity-20 border-[var(--color-ink)] border-4 rounded-full scale-150 -translate-x-1/4 -translate-y-1/4" />
      )}
      {shapeType === 1 && (
        <div className="absolute inset-0 opacity-20 bg-[var(--color-ink)] rotate-45 scale-150 translate-x-1/2" />
      )}
      {shapeType === 2 && (
        <div className="absolute bottom-0 w-full h-1/2 opacity-20 bg-[var(--color-ink)]" />
      )}
      <span className="relative z-10 font-display font-bold text-[var(--color-ink)] text-2xl uppercase select-none">
        {name.charAt(0)}
      </span>
    </div>
  );
}
