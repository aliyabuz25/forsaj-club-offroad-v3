import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';

interface HeroProps {
  onViewChange: (view: any) => void;
}

const Hero: React.FC<HeroProps> = ({ onViewChange }) => {
  const { t } = useLanguage();
  const { settings } = useAdmin();

  const titlePart1 = settings.siteTitle?.split(' ')[0] || t('hero.title_1');
  const titlePart2 = settings.siteTitle?.split(' ')[1] || 'OFFROAD';
  const titlePart3 = settings.siteTitle?.split(' ').slice(2).join(' ') || t('hero.title_2');

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

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-0.5 bg-[#FF4D00]"></div>
          <h3 className="text-[#FF4D00] font-black italic tracking-[0.3em] text-[10px] uppercase">
            {t('hero.hub')}
          </h3>
          <div className="w-10 h-0.5 bg-[#FF4D00]"></div>
        </div>
        <h2 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-[0.85] mb-8 text-white">
          {titlePart1} <span className="text-[#FF4D00] drop-shadow-[0_0_30px_rgba(255,77,0,0.4)]">{titlePart2}</span><br />{titlePart3}
        </h2>
        <p className="text-gray-400 font-bold italic max-w-xl mx-auto mb-10 text-sm md:text-base leading-relaxed uppercase tracking-wide">
          {settings.description || t('hero.desc')}
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <button
            onClick={() => onViewChange('events')}
            className="bg-[#FF4D00] hover:bg-white hover:text-black text-black font-black italic py-5 px-12 rounded-sm flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-[0_10px_40px_rgba(255,77,0,0.3)]"
          >
            {t('hero.races')} <ChevronRight className="w-6 h-6" />
          </button>
          <button
            onClick={() => onViewChange('about')}
            className="border-2 border-white/20 text-white hover:border-[#FF4D00] hover:text-[#FF4D00] font-black italic py-5 px-12 rounded-sm transition-all bg-white/5 backdrop-blur-sm"
          >
            {t('nav.about')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;