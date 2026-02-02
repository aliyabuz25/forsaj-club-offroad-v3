import React from 'react';
import { Settings, ShieldCheck, Compass, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const WhatIsOffroad: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    { icon: <Settings className="text-[#FF4D00]" />, title: t('offroad.tech_title', 'TEXNİKİ TƏCHİZAT'), desc: t('offroad.tech_desc', 'Hər bir maşın xüsusi asqı sistemi və gücləndirilmiş mühərriklə təmin olunur.') },
    { icon: <ShieldCheck className="text-[#FF4D00]" />, title: t('offroad.safety_title', 'TƏHLÜKƏSİZLİK'), desc: t('offroad.safety_desc', 'Pilotların təhlükəsizliyi bizim üçün prioritetdir. Karkas və kəmərlər məcburidir.') },
    { icon: <Compass className="text-[#FF4D00]" />, title: t('offroad.nav_title', 'NAVİQASİYA'), desc: t('offroad.nav_desc', 'GPS və xəritə oxuma bacarığı offroad yarışlarında qalibiyyətin yarısıdır.') },
    { icon: <Zap className="text-[#FF4D00]" />, title: t('offroad.power_title', 'EKSTREMAL GÜC'), desc: t('offroad.power_desc', 'Sürücünün fiziki hazırlığı ən az avtomobilin gücü qədər əhəmiyyətlidir.') },
  ];

  return (
    <section className="py-24 px-6 lg:px-20 bg-[#050505] flex flex-col lg:flex-row gap-16 items-center">
      <div className="lg:w-1/2">
        <h4 className="text-[#FF4D00] font-black italic uppercase text-xs mb-4 tracking-widest">{t('offroad.badge', 'Offroad nədir?')}</h4>
        <h2 className="text-5xl font-black italic leading-none mb-8 tracking-tighter uppercase text-white">
          {t('offroad.title', 'ADRENALİN VƏ TEXNİKANIN SİMBİOZU')}
        </h2>
        <p className="text-gray-500 font-bold italic text-sm mb-12 uppercase leading-relaxed max-w-xl">
          {t('offroad.desc', 'Offroad – yalnız yolsuzluq şəraitində hərəkət etmək deyil, həm də dözümlülük, strateji düşüncə və mühəndislik bacarığının sınağıdır. Azərbaycanın çətin dağlıq relyefi bu idman növü üçün dünyada ən maraqlı məkanlardan biri hesab olunur.')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((f, i) => (
            <div key={i} className="flex gap-4">
              <div className="bg-[#111] p-3 shadow-lg rounded-sm transform -skew-x-12 shrink-0 border border-white/5">
                <div className="transform skew-x-12">{f.icon}</div>
              </div>
              <div>
                <h5 className="font-black italic text-sm mb-1 tracking-tight text-white">{f.title}</h5>
                <p className="text-[10px] text-gray-400 font-bold italic uppercase leading-tight">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:w-1/2 relative">
        <div className="aspect-video bg-[#111] shadow-2xl overflow-hidden rounded-sm transform skew-y-3 border border-white/5">
          <img
            src="https://images.unsplash.com/photo-1541447271487-09612b3f49f7?q=80&w=1974&auto=format&fit=crop"
            alt="Offroad Culture"
            className="w-full h-full object-cover opacity-40 grayscale"
          />
        </div>
        <div className="absolute -bottom-8 -left-8 bg-[#FF4D00] p-8 text-black font-black italic transform -skew-x-12 hidden md:block shadow-2xl">
          <div className="transform skew-x-12 text-center">
            <span className="text-4xl leading-none">15+</span>
            <p className="text-[10px] uppercase">{t('offroad.experience', 'YARIŞ İLLİK')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsOffroad;
