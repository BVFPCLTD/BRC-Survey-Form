import React, { useState } from 'react';
import { Tabs } from './components/Tabs';
import { SurveyForm } from './components/SurveyForm';
import { HowTo } from './components/HowTo';
import { TabType } from './types';
import { Sprout } from 'lucide-react';

export default function App() {
  const [tab, setTab] = useState<TabType>('form');

  return (
    <div className="min-h-screen bg-brand-50/30 text-gray-900 font-sans selection:bg-brand-200 md:py-8 lg:py-12 px-0 md:px-6 lg:px-8">
      <div className="w-full max-w-3xl mx-auto min-h-screen md:min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-6rem)] bg-white md:border border-gray-200/60 md:rounded-[2.5rem] shadow-xl shadow-brand-950/5 flex flex-col">
        <header className="px-6 md:px-12 pt-12 md:pt-16 pb-8 md:pb-10 flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-brand-300 via-brand-500 to-brand-700 opacity-80" />
          <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 text-brand-900">
            <div className="p-3 bg-brand-50 rounded-2xl hidden md:flex items-center justify-center border border-brand-100 shadow-sm">
              <Sprout className="w-8 h-8 stroke-[2]" />
            </div>
            <Sprout className="w-7 h-7 stroke-[2.2] text-brand-900 md:hidden" />
            <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-brand-950">Bandhari Valley</h1>
          </div>
          <p className="text-center text-sm md:text-base text-gray-500 font-medium tracking-wide uppercase">Bio Resource Center Survey</p>
        </header>

        <main className="px-5 sm:px-8 md:px-12 pb-12 md:pb-16 flex-1 flex flex-col pt-2">
          <div className="flex justify-center mb-10 w-full">
            <Tabs current={tab} onChange={setTab} />
          </div>
          
          <div className="animate-in fade-in duration-300 flex-1">
            {tab === 'how-to' && <HowTo />}
            {tab === 'form' && <SurveyForm />}
          </div>
        </main>
      </div>
    </div>
  );
}
