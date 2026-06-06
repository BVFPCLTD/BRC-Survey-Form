import React from 'react';
import { cn } from '../lib/utils';
import { TabType } from '../types';

interface TabsProps {
  current: TabType;
  onChange: (tab: TabType) => void;
}

export function Tabs({ current, onChange }: TabsProps) {
  const tabs: { id: TabType; label: string }[] = [
    { id: 'how-to', label: 'Step guide' },
    { id: 'form', label: 'Field Form' },
  ];

  return (
    <div className="inline-flex w-full sm:w-auto items-center p-1.5 bg-gray-50 border border-gray-200/80 rounded-full shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex-1 sm:flex-none px-6 py-3 sm:py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300",
            current === tab.id
              ? "bg-white text-brand-900 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.12)] border border-gray-200/80"
              : "bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/50 border border-transparent"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
