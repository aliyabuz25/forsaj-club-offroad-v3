import React from 'react';
import { Shield, Users, Leaf, Zap, Target, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div id="haqqımızda" className="bg-[#0A0A0A] text-white">
      {/* Standardized Hero Header Section */}
      <section className="py-16 px-6 lg:px-20 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-20">
          <div className="flex items-start gap-4">
            <div className="w-2 h-16 bg-[#FF4D00] shadow-[0_0_15px_rgba(255,77,0,0.4)]"></div>
            <div>
              <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none text-white">
                {t('aboutTitle')}
              </h2>
              <p className="text-[#FF4D00] font-black italic text-[11px] md:text-sm mt-2 uppercase tracking-[0.4em]">
                {t('aboutSubtitle')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-7/12 relative z-10">
            <div className="mt-4">
              <h4 className="text-[#FF4D00] font-black italic text-2xl mb-4 tracking-tight">
                EST. 2018 // MOTORSPORT MƏRKƏZİ
              </h4>
              <h2 className="text-3xl md:text-5xl font-black italic leading-tight mb-8 uppercase max-w-2xl text-white tracking-tighter">
                {t('aboutHeroText')}
              </h2>
              <p className="text-gray-400 font-bold italic text-sm md:text-base leading-relaxed mb-12 max-w-xl uppercase tracking-wide">
                {t('aboutDescription')}
              </p>

              <div className="flex flex-wrap gap-4">
                {[
                  { label: t('pilotsLabel'), value: '140+' },
                  { label: t('racesLabel'), value: '50+' },
                  { label: t('youthLabel'), value: '20+' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[#111] border border-white/5 p-8 rounded-sm min-w-[140px] shadow-2xl">
                    <p className="text-[#FF4D00] font-black italic text-[10px] mb-2 tracking-widest uppercase">{stat.label}</p>
                    <p className="text-5xl font-black italic text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-5/12 relative hidden lg:block">
            <div className="absolute right-[-10%] top-0 w-[120%] h-full bg-[#111] transform -skew-x-12 overflow-hidden shadow-2xl border-l-8 border-[#FF4D00]/20">
              <img
                src="https://images.unsplash.com/photo-1541447271487-09612b3f49f7?q=80&w=1974&auto=format&fit=crop"
                alt="Forsaj Club Detail"
                className="w-full h-full object-cover opacity-40 grayscale"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-[#050505] py-24 px-6 lg:px-20 text-white relative border-y border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="relative">
            <div className="w-10 h-1 bg-[#FF4D00] mb-8"></div>
            <h3 className="text-5xl font-black italic mb-8 uppercase tracking-tighter">{t('missionTitle')}</h3>
            <p className="text-gray-400 font-bold italic text-sm leading-relaxed mb-12 max-w-lg uppercase tracking-wide">
              {t('missionDescription')}
            </p>
            <div className="bg-[#FF4D00] p-5 inline-flex items-center gap-4 transform -skew-x-12 text-black shadow-lg">
              <div className="bg-black p-2 text-[#FF4D00] transform skew-x-12 rounded-full">
                <Target size={20} />
              </div>
              <span className="font-black italic text-xs transform skew-x-12 uppercase">{t('targetText')}</span>
            </div>
          </div>

          <div className="relative">
            <div className="w-10 h-1 bg-white/20 mb-8"></div>
            <h3 className="text-5xl font-black italic mb-8 uppercase tracking-tighter">{t('visionTitle')}</h3>
            <p className="text-gray-400 font-bold italic text-sm leading-relaxed mb-12 max-w-lg uppercase tracking-wide">
              {t('visionDescription')}
            </p>
            <div className="bg-white/5 border border-white/10 p-5 inline-flex items-center gap-4 transform -skew-x-12">
              <div className="bg-white/10 p-2 text-white transform skew-x-12 rounded-full border border-white/10">
                <Globe size={20} />
              </div>
              <span className="font-black italic text-xs text-white transform skew-x-12 uppercase">{t('visionGoal')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 px-6 lg:px-20 bg-[#0A0A0A]">
        <div className="text-center mb-20">
          <h4 className="text-[#FF4D00] font-black italic text-[10px] tracking-[0.4em] mb-4 uppercase">{t('valuesHeader')}</h4>
          <h2 className="text-6xl font-black italic tracking-tighter uppercase leading-none text-white">{t('valuesTitle')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { icon: <Shield className="text-[#FF4D00]" />, title: t('value1Title'), desc: t('value1Desc') },
            { icon: <Users className="text-[#FF4D00]" />, title: t('value2Title'), desc: t('value2Desc') },
            { icon: <Leaf className="text-[#FF4D00]" />, title: t('value3Title'), desc: t('value3Desc') },
            { icon: <Zap className="text-[#FF4D00]" />, title: t('value4Title'), desc: t('value4Desc') },
          ].map((v, i) => (
            <div key={i} className="flex flex-col items-start gap-6 group cursor-default">
              <div className="bg-white/5 border border-white/5 p-10 rounded-sm transform group-hover:scale-110 group-hover:bg-[#FF4D00]/10 transition-all">
                {v.icon}
              </div>
              <h5 className="font-black italic text-2xl uppercase tracking-tighter text-white group-hover:text-[#FF4D00] transition-colors">{v.title}</h5>
              <p className="text-gray-500 font-bold italic text-[10px] uppercase leading-relaxed tracking-widest">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
