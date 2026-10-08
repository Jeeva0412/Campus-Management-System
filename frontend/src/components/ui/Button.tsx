import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from './utils';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'ghost' | 'staff' | 'danger';
  isLoading?: boolean;
}

export function Button({ variant = 'primary', isLoading, className, children, ...props }: ButtonProps) {
  const baseStyles = "relative inline-flex items-center justify-center font-mono uppercase tracking-widest text-[11px] font-bold border-2 px-6 py-3 transition-colors outline-none focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-signal)]";
  
  const variants = {
    primary: "bg-[var(--color-signal)] text-[var(--color-ink)] border-[var(--color-ink)]",
    ghost: "bg-transparent text-[var(--color-paper)] border-[var(--color-paper)] hover:bg-[var(--color-paper)] hover:text-[var(--color-ink)]",
    staff: "bg-[var(--color-staff)] text-[var(--color-ink)] border-[var(--color-ink)]",
    danger: "bg-[var(--color-void)] text-[var(--color-paper)] border-[var(--color-paper)]",
  };

  const shadowColor = variant === 'ghost' ? 'var(--color-paper)' : 'var(--color-ink)';

  return (
    <motion.button
      whileHover={{ x: -2, y: -2, boxShadow: `4px 4px 0 0 ${shadowColor}` }}
      whileTap={{ x: 0, y: 0, boxShadow: `0px 0px 0 0 ${shadowColor}` }}
      transition={{ duration: 0.1 }}
      className={cn(baseStyles, variants[variant], className, isLoading && "opacity-70 pointer-events-none")}
      {...props}
    >
      {isLoading ? <span className="animate-pulse">Loading...</span> : children}
    </motion.button>
  );
}
