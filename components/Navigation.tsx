
import React from 'react';
import { Home, Star, Calendar, MapPin, Sun } from 'lucide-react';
import { View, Language } from '../types';

interface NavigationProps {
  currentView: View;
  setView: (view: View) => void;
  lang: Language;
}

const labels = {
  en: { home: "Home", daily: "Daily", kundali: "Kundali", book: "Book", visit: "Visit" },
  te: { home: "హోమ్", daily: "రాశి ఫలాలు", kundali: "జాతకం", book: "బుకింగ్", visit: "అడ్రస్" }
};

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView, lang }) => {
  const t = labels[lang];
  const navItems = [
    { view: View.HOME, icon: Home, label: t.home },
    { view: View.HOROSCOPE, icon: Star, label: t.daily },
    { view: View.KUNDALI, icon: Sun, label: t.kundali },
    { view: View.BOOKING, icon: Calendar, label: t.book },
    { view: View.CONTACT, icon: MapPin, label: t.visit },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t-4 border-amber-500 pb-safe shadow-[0_-5px_10px_rgba(0,0,0,0.1)] z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
              currentView === item.view ? 'text-[#B91C1C]' : 'text-gray-400 hover:text-amber-600'
            }`}
          >
            <item.icon size={24} className={currentView === item.view ? 'mb-1 drop-shadow-sm scale-110 transition-transform' : 'mb-1'} strokeWidth={currentView === item.view ? 2.5 : 2} />
            <span className={`text-[10px] uppercase font-bold tracking-wider ${lang === 'te' ? 'telugu-font' : ''}`}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
