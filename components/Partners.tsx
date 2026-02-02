import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { useLanguage } from '../context/LanguageContext';

const Partners: React.FC = () => {
  const { partners } = useAdmin();
  const { t } = useLanguage();

  if (!partners || partners.length === 0) return null;

  return (
    <section className="py-32 bg-[#050505] relative overflow-hidden border-t border-white/5">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.05]">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#FF4D00] rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-white rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        <div className="flex flex-col items-center mb-20">
          <h4 className="text-[#FF4D00] font-black italic text-[11px] uppercase tracking-[0.5em] mb-4">
            {t('partners.title', 'RƏSMİ TƏRƏFDAŞLARIMIZ')}
          </h4>
          <div className="w-20 h-1 bg-white/10"></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {partners.map((p) => (
            <div
              key={p.name}
              className="group flex flex-col items-center justify-center p-10 bg-[#0A0A0A] border border-white/5 rounded-sm transition-all duration-500 hover:border-[#FF4D00]/30 hover:shadow-[0_20px_50px_rgba(255,77,0,0.1)] cursor-pointer"
              onClick={() => p.url && window.open(p.url, '_blank')}
            >
              <div className="mb-6 p-4 h-24 w-full flex items-center justify-center grayscale brightness-50 contrast-125 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-500">
                <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain" />
              </div>

              <div className="relative">
                <span className="text-xl md:text-2xl font-black italic tracking-tighter uppercase text-gray-600 group-hover:text-white transition-colors duration-300">
                  {p.name}
                </span>
                <div className={`absolute -bottom-2 left-0 w-0 h-1 transition-all duration-300 group-hover:w-full bg-[#FF4D00] shadow-[0_0_10px_rgba(255,77,0,0.5)]`}></div>
              </div>

              <p className="mt-6 text-[9px] font-black italic text-[#FF4D00] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                OFFICIAL PARTNER
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
