
import React from 'react';
import { UserCircle, Globe } from 'lucide-react';
import { Language } from '../types';

export const Layout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-orange-50 text-amber-950 flex justify-center bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-2xl overflow-hidden flex flex-col pb-20 border-x border-orange-200">
        {children}
      </div>
    </div>
  );
};

interface HeaderProps {
  title?: string;
  onProfileClick?: () => void;
  language: Language;
  setLanguage: (l: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ title = "SriDurga Jyothishyalayam", onProfileClick, language, setLanguage }) => (
  <div className="bg-[#B91C1C] text-white p-4 shadow-lg sticky top-0 z-40 flex items-center justify-between border-b-4 border-amber-400">
    <div className="w-8 flex justify-start">
        <button 
          onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
          className="flex flex-col items-center justify-center text-[10px] font-bold text-amber-200 hover:text-white"
        >
          <Globe size={20} />
          {language === 'en' ? 'తెలుగు' : 'ENG'}
        </button>
    </div>
    
    <div className="flex flex-col items-center">
      <h1 className={`text-amber-200 font-bold text-lg tracking-wide text-center drop-shadow-md ${language === 'te' ? 'telugu-font text-xl' : 'heading-font'}`}>
        {title}
      </h1>
    </div>

    <div className="w-8 flex justify-end">
      {onProfileClick && (
        <button onClick={onProfileClick} className="text-amber-200 hover:text-white transition-colors">
          <UserCircle size={24} />
        </button>
      )}
    </div>
  </div>
);
