import React from 'react';
import { cn } from './utils';
import { motion } from 'framer-motion';

export interface TabItem {
  id: string;
  label: string;
}

interface TabNavProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function TabNav({ tabs, activeTab, onChange, className }: TabNavProps) {
  return (
    <nav className={cn("flex items-end gap-2 px-6 pt-4 border-b-2 border-[var(--color-paper)] overflow-x-auto no-scrollbar", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative px-6 py-3 font-mono font-bold uppercase tracking-widest text-xs transition-all outline-none focus-visible:bg-[var(--color-paper-dim)]",
              isActive 
                ? "bg-[var(--color-ink)] text-[var(--color-paper)] border-2 border-b-0 border-[var(--color-paper)] pb-4 z-10 translate-y-[2px]" 
                : "bg-[var(--color-paper)] text-[var(--color-ink)] border-2 border-b-0 border-[var(--color-paper)] hover:bg-[var(--color-paper-dim)]"
            )}
            style={{
              borderTopLeftRadius: '8px',
              borderTopRightRadius: '8px',
            }}
          >
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute -top-2 left-0 right-0 h-1 bg-[var(--color-signal)]"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
