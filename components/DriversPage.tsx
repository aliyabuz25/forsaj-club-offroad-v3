import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Trophy, Zap } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useLanguage } from '../context/LanguageContext';
import TranslatableText from './TranslatableText';

interface Driver {
  id: number | string;
  rank: number;
  name: string;
  license: string;
  team: string;
  wins: number;
  points: number;
  img: string;
}

interface Category {
  id: string;
  name: string;
  leaders: Driver[];
  fullStandings: Driver[];
}

interface DriversPageProps {
  initialCategoryId?: string | null;
}

const DriversPage: React.FC<DriversPageProps> = ({ initialCategoryId }) => {
  const { drivers } = useAdmin();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Group drivers by category
  const categories: Category[] = [
    { id: 'Unlimited', name: 'UNLIMITED CLASS', leaders: [], fullStandings: [] },
    { id: 'Legend', name: 'LEGEND CLASS', leaders: [], fullStandings: [] },
    { id: 'SemiStock', name: 'SEMI STOCK CLASS', leaders: [], fullStandings: [] },
    { id: 'Utv', name: 'UTV CLASS', leaders: [], fullStandings: [] },
  ];

  categories.forEach(cat => {
    const catDrivers = drivers
      .filter(d => d.category.toLowerCase() === cat.id.toLowerCase())
      .sort((a, b) => b.points - a.points)
      .map((d, index) => ({
        id: d.id,
        rank: index + 1,
        name: d.name,
        license: `LICENSE // ${d.category.toUpperCase()}`,
        team: d.team,
        wins: d.wins || 0,
        points: d.points,
        img: d.image || d.img
      }));
    cat.fullStandings = catDrivers;
    cat.leaders = catDrivers.slice(0, 3);
  });

  useEffect(() => {
    if (initialCategoryId) {
      const cat = categories.find(c => c.id.toLowerCase() === initialCategoryId.toLowerCase());
      if (cat) setSelectedCategory(cat);
    }
  }, [initialCategoryId]);

  if (selectedCategory) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen py-16 px-6 lg:px-20 text-white animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-24">
          <div className="flex items-start gap-4">
            <div className="w-2 h-16 bg-[#FF4D00] shadow-[0_0_20px_rgba(255,77,0,0.6)]"></div>
            <div>
              <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
                <span className="text-white">{selectedCategory.name.split(' ')[0]}</span> <span className="text-[#FF4D00]">{t('drivers.rating', 'REYTİNQ')}</span>
              </h2>
              <p className="text-[#FF4D00] font-black italic text-[11px] md:text-sm mt-2 uppercase tracking-[0.4em]">
                {t('drivers.standings_desc', 'BÜTÜN PİLOTLARIN RƏSMİ SIRALAMASI // 2024')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedCategory(null)}
            className="group relative bg-white/5 border border-white/10 text-white px-10 py-5 font-black italic text-xs uppercase tracking-widest overflow-hidden transform -skew-x-12 hover:border-[#FF4D00] transition-all"
          >
            <div className="absolute inset-0 bg-[#FF4D00] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
            <span className="relative z-10 transform skew-x-12 flex items-center gap-2 group-hover:text-black">
              <ArrowLeft size={18} /> {t('common.back', 'GERİ')}
            </span>
          </button>
        </div>

        <div className="space-y-4">
          {selectedCategory.fullStandings.map((driver) => (
            <div
              key={driver.id}
              className="grid grid-cols-12 gap-4 py-8 items-center px-8 bg-[#111] border border-white/5 hover:border-[#FF4D00]/40 transition-all group shadow-lg"
            >
              <div className={`col-span-1 text-5xl font-black italic ${driver.rank <= 3 ? (driver.rank === 1 ? 'text-[#FF4D00]' : 'text-white') : 'text-gray-800'}`}>
                #{driver.rank}
              </div>
              <div className="col-span-6 flex items-center gap-8">
                <div className="w-20 h-20 bg-black overflow-hidden border border-white/10 rounded-sm shrink-0 shadow-2xl transition-transform group-hover:scale-105">
                  <img src={driver.img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={driver.name} />
                </div>
                <div>
                  <TranslatableText text={driver.name} as="h4" className="text-3xl font-black italic tracking-tighter uppercase group-hover:text-[#FF4D00] transition-colors leading-none mb-2" />
                  <p className="text-[10px] font-black italic text-gray-500 uppercase tracking-widest">{driver.license}</p>
                </div>
              </div>
              <div className="col-span-3 text-center">
                <TranslatableText text={driver.team} as="span" className="text-white font-black italic text-sm uppercase tracking-widest" />
              </div>
              <div className="col-span-2 text-right">
                <p className="text-gray-600 font-black italic text-[9px] uppercase tracking-widest mb-1">{t('drivers.pts', 'XAL')}</p>
                <span className="text-5xl font-black italic text-[#FF4D00] tracking-tighter">
                  {driver.points}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] min-h-screen py-16 px-6 lg:px-20 text-white">
      {/* Standardized Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-20">
        <div className="flex items-start gap-4">
          <div className="w-2 h-16 bg-[#FF4D00] shadow-[0_0_15px_rgba(255,77,0,0.4)]"></div>
          <div>
            <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none text-white">
              {t('nav.drivers', 'SÜRÜCÜLƏR')}
            </h2>
            <p className="text-[#FF4D00] font-black italic text-[11px] md:text-sm mt-2 uppercase tracking-[0.4em]">
              {t('drivers.pilots_standings', 'PİLOTLARIN SIRALAMASI')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-20 xl:gap-24">
        {categories.map((cat) => (
          <div key={cat.id} className="flex flex-col gap-10 relative bg-[#111]/40 border border-white/5 p-8 md:p-12 rounded-sm shadow-2xl overflow-hidden">
            <div className="absolute -top-10 -right-10 text-[200px] font-black italic text-white/[0.02] select-none pointer-events-none uppercase tracking-tighter leading-none">
              {cat.id.slice(0, 2)}
            </div>

            <div className="flex items-center justify-between relative z-10 border-b border-white/5 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-2 h-10 bg-[#FF4D00] shadow-[0_0_15px_rgba(255,77,0,0.4)]"></div>
                <h3 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none text-white">
                  {cat.name}
                </h3>
              </div>
              <Trophy className="text-[#FF4D00] opacity-20" size={40} />
            </div>

            <div className="flex flex-col sm:flex-row gap-10 items-stretch relative z-10">
              <div className="sm:w-3/5 flex flex-col gap-5">
                <p className="text-[#FF4D00] font-black italic text-[10px] uppercase tracking-[0.3em] mb-2">{t('drivers.podium_leaders', 'PODİUM LİDERLƏRİ')}</p>
                {cat.leaders.map((driver) => (
                  <div
                    key={driver.id}
                    className={`relative flex items-center gap-5 p-5 transition-all duration-300 group border rounded-sm overflow-hidden ${driver.rank === 1
                      ? 'bg-[#FF4D00]/5 border-[#FF4D00] shadow-[0_10px_30px_rgba(255,77,0,0.1)] scale-[1.03] z-20'
                      : 'bg-black/40 border-white/10 hover:border-white/20'
                      }`}
                  >
                    <div className={`absolute top-0 right-0 px-4 py-1 text-2xl font-black italic skew-x-[-12deg] ${driver.rank === 1 ? 'bg-[#FF4D00] text-black' : 'bg-white/10 text-white/40'
                      }`}>
                      #{driver.rank}
                    </div>

                    <div className={`w-20 h-20 bg-black overflow-hidden shrink-0 border-2 ${driver.rank === 1 ? 'border-[#FF4D00]' : 'border-white/10'
                      }`}>
                      <img src={driver.img} className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700" alt={driver.name} />
                    </div>

                    <div className="overflow-hidden">
                      <TranslatableText text={driver.name} as="h4" className={`text-xl md:text-2xl font-black italic leading-none uppercase tracking-tighter truncate mb-1 ${driver.rank === 1 ? 'text-white' : 'text-gray-400'}`} />
                      <TranslatableText text={driver.team} as="p" className="text-[#FF4D00] text-[9px] font-black italic uppercase tracking-widest" />
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-white text-3xl font-black italic leading-none">{driver.points}</span>
                        <span className="text-gray-600 text-[9px] font-black italic uppercase">{t('drivers.pts_label', 'XAL')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="sm:w-2/5 flex flex-col bg-black/40 border border-white/5 p-6 rounded-sm relative group/blur shadow-inner min-h-[300px]">
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-2">
                  <span className="text-[10px] font-black italic text-gray-600 uppercase tracking-widest">{t('drivers.top_10', 'TOP 10')}</span>
                  <Zap size={14} className="text-[#FF4D00]" />
                </div>

                <div className="space-y-4">
                  {cat.fullStandings.slice(3, 10).map((d) => (
                    <div key={d.id} className="flex items-center justify-between text-[11px] font-black italic text-gray-500 uppercase blur-[0.6px] transition-all group-hover/blur:blur-none group-hover/blur:text-gray-400">
                      <div className="flex items-center gap-3">
                        <span className="w-5 text-gray-700">#{d.rank}</span>
                        <TranslatableText text={d.name.split(' ')[0]} as="span" className="truncate max-w-[80px]" />
                      </div>
                      <span className="text-gray-700">{d.points}</span>
                    </div>
                  ))}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent backdrop-blur-[4px] flex flex-col items-center justify-center p-6 text-center">
                  <div className="mb-8">
                    <p className="text-white font-black italic text-sm uppercase tracking-widest leading-none mb-2">
                      {t('drivers.full_ranking', 'TAM SIRALAMA')}
                    </p>
                    <p className="text-[#FF4D00] font-black italic text-[9px] uppercase tracking-[0.2em] opacity-80">
                      {t('drivers.all_pilots', 'BÜTÜN PİLOTLAR')}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedCategory(cat)}
                    className="group/btn relative w-full h-16 bg-[#FF4D00] text-black font-black italic text-sm uppercase transition-all duration-300 shadow-[0_15px_30px_rgba(255,77,0,0.3)] hover:shadow-[0_20px_50px_rgba(255,77,0,0.6)] hover:bg-white active:scale-95 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500 skew-x-[-20deg]"></div>
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {t('common.see_all', 'HAMISI')} <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriversPage;
