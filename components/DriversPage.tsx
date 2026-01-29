import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Trophy, Zap } from 'lucide-react';
import { useAdmin, Driver as ContextDriver } from '../context/AdminContext';
import { useLanguage } from '../context/LanguageContext';

interface DisplayDriver extends ContextDriver {
  rank: number;
  license: string;
  wins: number;
  img: string;
}

interface Category {
  id: string;
  name: string;
  leaders: DisplayDriver[];
  fullStandings: DisplayDriver[];
}

interface DriversPageProps {
  initialCategoryId?: string | null;
}

const DriversPage: React.FC<DriversPageProps> = ({ initialCategoryId }) => {
  const { drivers } = useAdmin();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Helper to process drivers for a category
  const getCategoryData = (catId: string, catName: string, contextCat: 'UNLIMITED' | 'LEGEND' | 'SEMI STOCK' | 'UTV'): Category => {
    const categoryDrivers = drivers
      .filter(d => d.category === contextCat)
      .sort((a, b) => b.points - a.points)
      .map((d, index) => ({
        ...d,
        rank: index + 1,
        license: `${t('drivers.license')} // ${contextCat}`,
        wins: 0, // Placeholder as we don't track wins yet
        img: d.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&fit=crop'
      }));

    return {
      id: catId,
      name: catName,
      leaders: categoryDrivers.slice(0, 3),
      fullStandings: categoryDrivers
    };
  };

  const categories: Category[] = [
    getCategoryData('unlimited', 'UNLIMITED CLASS', 'UNLIMITED'),
    getCategoryData('legend', 'LEGEND CLASS', 'LEGEND'),
    getCategoryData('semistock', 'SEMI STOCK CLASS', 'SEMI STOCK'),
    getCategoryData('utv', 'UTV CLASS', 'UTV'),
  ];

  useEffect(() => {
    if (initialCategoryId) {
      const cat = categories.find(c => c.id === initialCategoryId);
      if (cat) setSelectedCategory(cat);
    }
  }, [initialCategoryId, drivers]); // Re-run when drivers change

  if (selectedCategory) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen py-16 px-6 lg:px-20 text-white animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-24">
          <div className="flex items-start gap-4">
            <div className="w-2 h-16 bg-[#FF4D00] shadow-[0_0_20px_rgba(255,77,0,0.6)]"></div>
            <div>
              <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
                <span className="text-white">{selectedCategory.name.split(' ')[0]}</span> <span className="text-[#FF4D00]">{t('drivers.rank')}</span>
              </h2>
              <p className="text-[#FF4D00] font-black italic text-[11px] md:text-sm mt-2 uppercase tracking-[0.4em]">
                {t('drivers.subtitle')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedCategory(null)}
            className="group relative bg-white/5 border border-white/10 text-white px-10 py-5 font-black italic text-xs uppercase tracking-widest overflow-hidden transform -skew-x-12 hover:border-[#FF4D00] transition-all"
          >
            <div className="absolute inset-0 bg-[#FF4D00] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
            <span className="relative z-10 transform skew-x-12 flex items-center gap-2 group-hover:text-black">
              <ArrowLeft size={18} /> {t('common.back')}
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
                  <h4 className="text-3xl font-black italic tracking-tighter uppercase group-hover:text-[#FF4D00] transition-colors leading-none mb-2">{driver.name}</h4>
                  <p className="text-[10px] font-black italic text-gray-500 uppercase tracking-widest">{driver.license}</p>
                </div>
              </div>
              <div className="col-span-3 text-center">
                <span className="text-white font-black italic text-sm uppercase tracking-widest">
                  {driver.team || 'NO TEAM'}
                </span>
              </div>
              <div className="col-span-2 text-right">
                <p className="text-gray-600 font-black italic text-[9px] uppercase tracking-widest mb-1">{t('drivers.pts')}</p>
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
              {t('drivers.title')}
            </h2>
            <p className="text-[#FF4D00] font-black italic text-[11px] md:text-sm mt-2 uppercase tracking-[0.4em]">
              {t('drivers.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Grid: 2 categories per row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-20 xl:gap-24">
        {categories.map((cat) => (
          <div key={cat.id} className="flex flex-col gap-10 relative bg-[#111]/40 border border-white/5 p-8 md:p-12 rounded-sm shadow-2xl overflow-hidden">
            {/* Background Accent */}
            <div className="absolute -top-10 -right-10 text-[200px] font-black italic text-white/[0.02] select-none pointer-events-none uppercase tracking-tighter leading-none">
              {cat.id.slice(0, 2).toUpperCase()}
            </div>

            {/* Category Header */}
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
              {/* LEFT: TOP 3 PODIUM LIST */}
              <div className="sm:w-3/5 flex flex-col gap-5">
                <p className="text-[#FF4D00] font-black italic text-[10px] uppercase tracking-[0.3em] mb-2">{t('drivers.podium')}</p>
                {cat.leaders.map((driver, idx) => (
                  <div
                    key={driver.id}
                    className={`relative flex items-center gap-5 p-5 transition-all duration-300 group border rounded-sm overflow-hidden ${driver.rank === 1
                      ? 'bg-[#FF4D00]/5 border-[#FF4D00] shadow-[0_10px_30px_rgba(255,77,0,0.1)] scale-[1.03] z-20'
                      : 'bg-black/40 border-white/10 hover:border-white/20'
                      }`}
                  >
                    {/* Rank Badge */}
                    <div className={`absolute top-0 right-0 px-4 py-1 text-2xl font-black italic skew-x-[-12deg] ${driver.rank === 1 ? 'bg-[#FF4D00] text-black' : 'bg-white/10 text-white/40'
                      }`}>
                      #{driver.rank}
                    </div>

                    <div className={`w-20 h-20 bg-black overflow-hidden shrink-0 border-2 ${driver.rank === 1 ? 'border-[#FF4D00]' : 'border-white/10'
                      }`}>
                      <img src={driver.img} className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700" alt={driver.name} />
                    </div>

                    <div className="overflow-hidden">
                      <h4 className={`text-xl md:text-2xl font-black italic leading-none uppercase tracking-tighter truncate mb-1 ${driver.rank === 1 ? 'text-white' : 'text-gray-400'
                        }`}>
                        {driver.name}
                      </h4>
                      <p className="text-[#FF4D00] text-[9px] font-black italic uppercase tracking-widest">{driver.team || 'NO TEAM'}</p>
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-white text-3xl font-black italic leading-none">{driver.points}</span>
                        <span className="text-gray-600 text-[9px] font-black italic uppercase">PTS</span>
                      </div>
                    </div>
                  </div>
                ))}
                {cat.leaders.length === 0 && <p className="text-gray-500 italic">No drivers yet</p>}
              </div>

              {/* RIGHT: BLURRED STANDINGS PREVIEW */}
              <div className="sm:w-2/5 flex flex-col bg-black/40 border border-white/5 p-6 rounded-sm relative group/blur shadow-inner">
                <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-2">
                  <span className="text-[10px] font-black italic text-gray-600 uppercase tracking-widest">TOP 10 GRID</span>
                  <Zap size={14} className="text-[#FF4D00]" />
                </div>

                {/* Lighter, readable but restricted list */}
                <div className="space-y-4">
                  {cat.fullStandings.slice(3, 10).map((d) => (
                    <div key={d.id} className="flex items-center justify-between text-[11px] font-black italic text-gray-500 uppercase blur-[0.6px] transition-all group-hover/blur:blur-none group-hover/blur:text-gray-400">
                      <div className="flex items-center gap-3">
                        <span className="w-5 text-gray-700">#{d.rank}</span>
                        <span className="truncate max-w-[80px]">{d.name.split(' ')[0]}</span>
                      </div>
                      <span className="text-gray-700">{d.points}</span>
                    </div>
                  ))}
                </div>

                {/* Light Blur Overlay with Action */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent backdrop-blur-[4px] flex flex-col items-center justify-center p-6 text-center">
                  <div className="mb-8">
                    <p className="text-white font-black italic text-sm uppercase tracking-widest leading-none mb-2">
                      {t('drivers.full_standing')}
                    </p>
                    <p className="text-[#FF4D00] font-black italic text-[9px] uppercase tracking-[0.2em] opacity-80">
                      BÜTÜN PİLOTLAR
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedCategory(cat)}
                    className="group/btn relative w-full h-16 bg-[#FF4D00] text-black font-black italic text-sm uppercase transition-all duration-300 shadow-[0_15px_30px_rgba(255,77,0,0.3)] hover:shadow-[0_20px_50px_rgba(255,77,0,0.6)] hover:bg-white active:scale-95 overflow-hidden"
                  >
                    {/* Button Animated Background */}
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500 skew-x-[-20deg]"></div>

                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {t('drivers.view_all')} <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
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
