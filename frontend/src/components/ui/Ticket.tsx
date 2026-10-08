import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './utils';
import { Tag } from './Tag';

interface TicketProps {
  title: string;
  description: string;
  date: string; // ISO string
  capacity: number;
  registeredCount: number;
  isRegistered?: boolean;
  onRegister?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

export function Ticket({ title, description, date, capacity, registeredCount, isRegistered, onRegister, onDelete, isAdmin }: TicketProps) {
  const d = new Date(date);
  const month = d.toLocaleString('default', { month: 'short' }).toUpperCase();
  const day = d.getDate();
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const seatsLeft = capacity - registeredCount;

  return (
    <div className="relative flex w-full max-w-4xl bg-[var(--color-paper)] text-[var(--color-ink)] font-sans shadow-[6px_6px_0_0_var(--color-ink)] mb-6 group">
      
      {/* Left Stub */}
      <div className="w-32 flex flex-col items-center justify-center p-4 border-r-2 border-dashed border-[var(--color-ink)] relative">
        <span className="font-mono text-sm tracking-widest uppercase font-bold">{month}</span>
        <span className="font-display text-5xl font-extrabold leading-none my-1">{day}</span>
        <span className="font-mono text-xs font-bold">{time}</span>
        
        {/* Notches */}
        <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-[var(--color-ink)]" />
        <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-[var(--color-ink)]" />
      </div>

      {/* Main Body */}
      <div className="flex-1 p-6 flex flex-col justify-between relative overflow-hidden">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-display font-bold text-3xl leading-tight pr-8">{title}</h3>
            {isAdmin && onDelete && (
              <button onClick={onDelete} className="p-2 border-2 border-[var(--color-ink)] hover:bg-[var(--color-void)] hover:text-[var(--color-paper)] transition-colors focus-visible:outline-[var(--color-signal)] shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            )}
          </div>
          <p className="text-[var(--color-ink-2)] text-sm mb-6 max-w-lg">{description}</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
          {/* Capacity blocks */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {Array.from({ length: Math.min(10, capacity) }).map((_, i) => (
                <div key={i} className={cn("w-2 h-4 border border-[var(--color-ink)]", i < (registeredCount / capacity) * 10 ? "bg-[var(--color-ink)]" : "bg-transparent")} />
              ))}
            </div>
            <span className="font-mono text-xs tracking-widest font-bold uppercase">{seatsLeft} SEATS LEFT</span>
          </div>
          
          <div>
            {isRegistered ? (
              <div className="font-display text-2xl font-bold text-[var(--color-signal)]">
                STAMPED
              </div>
            ) : (
              <button 
                onClick={onRegister}
                disabled={seatsLeft <= 0}
                className="font-mono uppercase tracking-widest text-xs font-bold border-2 border-[var(--color-ink)] px-6 py-2 hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)] transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-signal)] disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[var(--color-ink)] disabled:cursor-not-allowed"
              >
                {seatsLeft > 0 ? 'RSVP' : 'SOLD OUT'}
              </button>
            )}
          </div>
        </div>

        {/* Animated Stamp overlay */}
        <AnimatePresence>
          {isRegistered && (
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-multiply"
              initial={{ opacity: 0, scale: 2.4, rotate: -14 }}
              animate={{ opacity: 1, scale: 1, rotate: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="border-4 border-[var(--color-stamp)] text-[var(--color-stamp)] px-6 py-2 font-display text-5xl font-black uppercase tracking-tighter">
                CONFIRMED
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
