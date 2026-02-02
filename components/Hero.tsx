import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { useLanguage } from '../context/LanguageContext';
import TranslatableText from './TranslatableText';

interface HeroProps {
  onViewChange: (view: 'home' | 'about' | 'news' | 'events' | 'drivers' | 'rules' | 'contact' | 'gallery') => void;
}

const Hero: React.FC<HeroProps> = ({ onViewChange }) => {
  const { getContent } = useContent();
  const { t } = useLanguage();

  return (
    <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop"
          alt="Offroad background"
          className="w-full h-full object-cover opacity-30 grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/40"></div>
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-0.5 bg-[#FF4D00]"></div>
          <TranslatableText
            text={getContent('hero_badge', 'AZERBAIJAN OFFROAD MOTORSPORT HUB')}
            as="h3"
            className="text-[#FF4D00] font-black italic tracking-[0.3em] text-[9px] md:text-[10px] uppercase"
          />
          <div className="w-8 h-0.5 bg-[#FF4D00]"></div>
        </div>

        <h2 className="text-5xl md:text-7xl lg:text-[100px] font-black italic tracking-tighter leading-[0.9] mb-10 text-white uppercase">
          <TranslatableText text={getContent('hero_title_line1', 'SƏRHƏDSİZ')} as="span" />{' '}
          <TranslatableText
            text={getContent('hero_title_highlight', 'OFFROAD')}
            as="span"
            className="text-[#FF4D00] drop-shadow-[0_0_30px_rgba(255,77,0,0.4)]"
          /><br />
          <TranslatableText text={getContent('hero_title_line2', 'HƏYƏCANI')} as="span" />
        </h2>

        <TranslatableText
          text={getContent('hero_subtitle', 'Azərbaycanın ən çətin yollarında peşəkar yarışlar və adrenalin dolu anlar.')}
          as="p"
          className="text-gray-400 font-bold italic max-w-2xl mx-auto mb-12 text-sm md:text-base leading-relaxed uppercase tracking-wide px-4"
        />

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
          <button
            onClick={() => onViewChange('events')}
            className="w-full sm:w-auto min-w-[220px] bg-[#FF4D00] hover:bg-white hover:text-black text-black font-black italic py-5 px-10 rounded-sm flex items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-[0_10px_40px_rgba(255,77,0,0.3)]"
          >
            <span className="uppercase text-sm tracking-widest">{t('hero.races', 'YARIŞ TƏQVİMİ')}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewChange('about')}
            className="w-full sm:w-auto min-w-[220px] border-2 border-white/10 text-white hover:border-[#FF4D00] hover:text-[#FF4D00] font-black italic py-5 px-10 rounded-sm transition-all bg-white/5 backdrop-blur-sm"
          >
            <span className="uppercase text-sm tracking-widest">{t('hero.about', 'HAQQIMIZDA')}</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;