import React from 'react';
import { useContent } from '../context/ContentContext';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onViewChange: (view: 'home' | 'about' | 'news' | 'events' | 'drivers' | 'rules' | 'contact') => void;
}

const Hero: React.FC<HeroProps> = ({ onViewChange }) => {
  const { getContent } = useContent();
  const { t } = useLanguage();

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://cdn.pixabay.com/vimeo/462192080/offroad-50361.mp4?width=1280&hash=85e2b005118747440813e3362624564887309506" type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 italic tracking-tighter animate-fade-in-up">
          {getContent('hero_title', 'AZƏRBAYCAN OFFROAD MƏDƏNİYYƏTİ')}
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl animate-fade-in-up delay-100">
          {getContent('hero_subtitle', 'Adrenalin, Güc və Təbiətin Vəhdəti')}
        </p>
        <div className="flex gap-4 animate-fade-in-up delay-200">
          <button
            onClick={() => onViewChange('events')}
            className="bg-[#FF4D00] hover:bg-[#ff6a00] text-white px-8 py-4 rounded-none font-bold italic transform skew-x-[-10deg] transition-all hover:scale-105"
          >
            <span className="block transform skew-x-[10deg]">{t('hero.races')}</span>
          </button>
          <button
            onClick={() => onViewChange('drivers')}
            className="border-2 border-white text-white px-8 py-4 rounded-none font-bold italic transform skew-x-[-10deg] hover:bg-white hover:text-black transition-all hover:scale-105"
          >
            <span className="block transform skew-x-[10deg]">{t('hero.drivers')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;