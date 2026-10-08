import React from 'react';
import { Tag } from './Tag';

interface PassCardProps {
  name: string;
  role: string;
  clubCount: number;
  lastLogin: string;
}

export function PassCard({ name, role, clubCount, lastLogin }: PassCardProps) {
  return (
    <div className="bg-[var(--color-paper)] text-[var(--color-ink)] p-8 shadow-[8px_8px_0_0_var(--color-paper-dim)] max-w-sm w-full mx-auto relative border-2 border-[var(--color-ink)] flex flex-col h-full">
      
      {/* Top punched hole */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-3 border-2 border-[var(--color-ink)] rounded-full bg-[var(--color-ink)]" />

      <div className="mt-8 mb-auto">
        <div className="flex justify-between items-start mb-6">
          <div className="font-mono text-xs font-bold tracking-widest uppercase">ID. PASS</div>
          <Tag variant={role === 'STUDENT' ? 'member' : 'staff'}>{role}</Tag>
        </div>

        <h2 className="font-display font-black text-5xl leading-none uppercase mb-2">
          {name.split(' ').map((part, i) => (
            <React.Fragment key={i}>
              {part}<br/>
            </React.Fragment>
          ))}
        </h2>
      </div>

      <div className="mt-8 space-y-4 font-mono text-xs font-bold uppercase tracking-widest border-t-2 border-[var(--color-ink)] pt-4">
        <div className="flex justify-between">
          <span>Clubs</span>
          <span>{clubCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Last Login</span>
          <span>{lastLogin}</span>
        </div>
        <div className="flex justify-between text-[var(--color-signal)]">
          <span>Session</span>
          <span>Verified</span>
        </div>
      </div>

      {/* Barcode */}
      <div className="mt-6 h-12 w-full flex items-end justify-between opacity-80" aria-hidden="true">
        {Array.from({ length: 30 }).map((_, i) => (
          <div 
            key={i} 
            className="bg-[var(--color-ink)] h-full" 
            style={{ width: `${Math.max(1, Math.random() * 6)}px` }}
          />
        ))}
      </div>
    </div>
  );
}
