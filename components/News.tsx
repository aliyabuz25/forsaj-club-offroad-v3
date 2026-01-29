import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useLanguage } from '../context/LanguageContext';

interface NewsProps {
  onViewChange: (view: any) => void;
}

const News: React.FC<NewsProps> = ({ onViewChange }) => {
  const { news } = useAdmin();
  const { t } = useLanguage();

  if (!news || news.length === 0) return null;

  const mainNews = news.find(n => n.isMain) || news[0];
  const otherNews = news.filter(n => n.id !== mainNews.id).slice(0, 2);

  return (
    <section className="py-24 px-4 lg:px-10 bg-[#0A0A0A]">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex justify-between items-end mb-12 px-2">
          <div className="flex items-start gap-4">
            <div className="w-2 h-16 bg-[#FF4D00]"></div>
            <div>
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none text-white">
                {t('nav.news')}
              </h2>
              <p className="text-[#FF4D00] font-black italic text-xs mt-2 uppercase tracking-widest">
                {t('news.subtitle') || 'Motorsport və Offroad dünyasından yeniliklər'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onViewChange('news')}
            className="bg-[#FF4D00] text-black font-black italic text-xs px-10 py-4 rounded-sm transform -skew-x-12 flex items-center gap-3 hover:bg-white transition-all shadow-xl hover:scale-105 active:scale-95"
          >
            <span className="transform skew-x-12 flex items-center gap-2">{t('common.all') || 'HAMISI'} <ArrowRight className="w-5 h-5" /></span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main News */}
          <div
            onClick={() => onViewChange('news')}
            className="lg:col-span-7 group relative overflow-hidden bg-[#111] min-h-[450px] md:min-h-[580px] flex items-end p-10 cursor-pointer shadow-2xl rounded-sm border border-white/5"
          >
            <img
              src={mainNews.image || mainNews.img}
              alt={mainNews.title}
              className="absolute inset-0 w-full h-full object-cover grayscale brightness-50 transition-transform duration-1000 group-hover:scale-110 group-hover:grayscale-0 group-hover:brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div className="relative z-10 w-full">
              <span className="text-[#FF4D00] text-[10px] font-black italic uppercase mb-3 block tracking-[0.3em]">{mainNews.category}</span>
              <h3 className="text-4xl md:text-7xl font-black italic text-white leading-none tracking-tighter mb-5 uppercase">
                {mainNews.title}
              </h3>
              <p className="text-gray-400 font-bold italic text-xs md:text-base uppercase tracking-wide max-w-xl">
                {mainNews.description}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            {otherNews.map(item => (
              <div
                key={item.id}
                onClick={() => onViewChange('news')}
                className="group cursor-pointer flex flex-col flex-1 bg-white/5 p-6 rounded-sm border border-white/5 hover:border-[#FF4D00]/30 hover:bg-white/[0.08] transition-all shadow-sm"
              >
                <div className="aspect-video w-full overflow-hidden bg-[#000] mb-5 rounded-sm shadow-md relative">
                  <img
                    src={item.image || item.img}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale opacity-50 transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-100"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[#FF4D00] text-[10px] font-black italic mb-2 uppercase tracking-widest">
                    <Calendar size={12} /> {item.date}
                  </div>
                  <h4 className="text-3xl font-black italic text-white uppercase leading-tight mb-2 group-hover:text-[#FF4D00] transition-colors tracking-tighter">
                    {item.title}
                  </h4>
                  <p className="text-gray-500 text-[10px] font-bold italic uppercase tracking-wider line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default News;