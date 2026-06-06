import React from 'react';
import { Target, Clock, MessageSquareQuote, MapPin, Users } from 'lucide-react';

export function HowTo() {
  const steps = [
    {
      num: 1,
      icon: <Target className="w-5 h-5 text-brand-600" />,
      title: "Preparation",
      desc: "Carry a small bag of vermicompost or a bottle of Jeevamrit as a demo and conversation starter. Brief surveyors to ask questions politely."
    },
    {
      num: 2,
      icon: <Clock className="w-5 h-5 text-brand-600" />,
      title: "Timing & Location",
      desc: "Best time: early morning (7-9 AM) or evening (5-7 PM). Avoid mid-day. Visit village chowk, panchayat, or farmer meetings."
    },
    {
      num: 3,
      icon: <MessageSquareQuote className="w-5 h-5 text-brand-600" />,
      title: "The Conversation Starter",
      desc: "Introduce yourself. Show the sample. Say: 'We are from Bandhari Valley FPC. Our Bio Resource Center is ready and we want your input for training.' It's free and takes 5 mins."
    },
    {
      num: 4,
      icon: <MapPin className="w-5 h-5 text-brand-600" />,
      title: "Fill it FOR Them",
      desc: "Read each question aloud in Marathi. Fill the form based on their spoken answers to ensure accurate data."
    },
    {
      num: 5,
      icon: <Users className="w-5 h-5 text-brand-600" />,
      title: "Pre-enrollment",
      desc: "Ask if they'd like to be placed on a non-binding waitlist and collect their mobile number."
    }
  ];

  return (
    <div className="space-y-10 md:px-6 py-4">
      <div className="bg-brand-900 border border-brand-800 rounded-2xl md:rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-lg shadow-brand-900/10 fade-in-up">
        <div className="absolute -right-6 -top-6 w-40 h-40 bg-brand-800/50 rounded-full blur-3xl mix-blend-screen" />
        <h3 className="font-serif text-2xl md:text-3xl font-medium text-white mb-6 tracking-tight relative z-10">Survey Goals</h3>
        <ul className="text-[15px] md:text-base text-brand-50 space-y-4 font-medium relative z-10">
          <li className="flex items-start"><span className="text-brand-400 mr-3 mt-0.5">•</span> Understand topics farmers need most</li>
          <li className="flex items-start"><span className="text-brand-400 mr-3 mt-0.5">•</span> Determine willingness to pay</li>
          <li className="flex items-start"><span className="text-brand-400 mr-3 mt-0.5">•</span> Find the best time/day for training schedules</li>
          <li className="flex items-start"><span className="text-brand-400 mr-3 mt-0.5">•</span> Build an initial pre-enrollment waitlist</li>
        </ul>
      </div>

      <div className="space-y-8 md:space-y-10 pl-2">
        {steps.map((step, i) => (
          <div key={step.num} className="flex gap-5 md:gap-6 items-start fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white border border-gray-100 shadow-sm text-brand-700 flex items-center justify-center shrink-0 mt-1 relative">
              <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-[11px] font-bold text-brand-900">{step.num}</div>
              {step.icon}
            </div>
            <div className="pt-1 flex-1">
              <h4 className="font-serif text-lg md:text-xl font-medium text-brand-950 mb-2">{step.title}</h4>
              <p className="text-base text-gray-600 leading-relaxed font-light">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-amber-50/80 border border-amber-200/60 rounded-2xl md:rounded-[2rem] p-6 md:p-8 text-amber-900 text-[15px] md:text-base mt-12 shadow-sm fade-in-up">
        <strong className="font-semibold tracking-wide uppercase text-[13px] block mb-2 opacity-80">Important Rule</strong> 
        Never mention a fee in the first 3 questions. Let farmers naturally share their interest level before pricing comes up.
      </div>
    </div>
  );
}
