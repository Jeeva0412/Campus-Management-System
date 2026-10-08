import React from 'react';
import { cn } from './utils';

interface TagProps {
  variant: 'member' | 'staff' | 'confirmed' | 'outline';
  children: React.ReactNode;
  className?: string;
}

export function Tag({ variant, children, className }: TagProps) {
  const baseStyles = "inline-flex items-center font-mono uppercase tracking-widest text-[10px] font-bold px-2 py-0.5 border-2 border-[var(--color-ink)]";
  
  const variants = {
    member: "bg-[var(--color-stamp)] text-[var(--color-ink)]",
    staff: "bg-[var(--color-staff)] text-[var(--color-ink)]",
    confirmed: "bg-[var(--color-stamp)] text-[var(--color-ink)]",
    outline: "bg-transparent text-[var(--color-paper)] border-[var(--color-paper)]",
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)}>
      {children}
    </span>
  );
}
