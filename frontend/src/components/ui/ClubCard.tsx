import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Crest } from './Crest';
import { cn } from './utils';

interface ClubCardProps {
  name: string;
  description: string;
  children?: React.ReactNode;
}

export function ClubCard({ name, description, children }: ClubCardProps) {
  // Random static rotation between -1 and 1
  const rotation = useMemo(() => (Math.random() * 2) - 1, [name]);

  return (
    <motion.div 
      initial={{ rotate: rotation }}
      whileHover={{ rotate: 0, y: -4, boxShadow: '8px 8px 0 0 var(--color-paper)' }}
      whileFocus={{ rotate: 0, y: -4, boxShadow: '8px 8px 0 0 var(--color-paper)' }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative flex flex-col bg-[var(--color-ink)] border-2 border-[var(--color-paper)] p-6 shadow-[4px_4px_0_0_var(--color-paper)] group focus-within:rotate-0 focus-within:-translate-y-1 focus-within:shadow-[8px_8px_0_0_var(--color-paper)] transition-all duration-200 outline-none"
    >
      {/* Tape */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-[var(--color-paper-dim)] opacity-40 -rotate-2 mix-blend-screen" />
      
      <div className="flex items-start gap-4 mb-4">
        <Crest name={name} className="w-16 h-16" />
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-2xl text-[var(--color-paper)] leading-tight truncate">{name}</h3>
        </div>
      </div>
      
      <p className="font-sans text-[var(--color-paper-dim)] text-sm mb-6 line-clamp-3 flex-1">
        {description}
      </p>
      
      <div className="mt-auto space-y-2">
        {children}
      </div>
    </motion.div>
  );
}
