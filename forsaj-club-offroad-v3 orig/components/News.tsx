
import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';

interface NewsProps {
  onViewChange: (view: any) => void;
}

const News: React.FC<NewsProps> = ({ onViewChange }) => {
  return (
    <section className="py-24 px-4 lg:px-10 bg-[#0A0A0A]">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex justify-between items-end mb-12 px-2">
          <div className="flex items-start gap-4">
            <div className="w-2 h-16 bg-[#FF4D00]"></div>
            <div>
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none text-white">
                SON XƏBƏRLƏR
              </h2>
              <p className="text-[#FF4D00] font-black italic text-xs mt-2 uppercase tracking-widest">
                Motorsport və Offroad dünyasından yeniliklər
              </p>
            </div>
          </div>
          <button 
            onClick={() => onViewChange('news')}
            className="bg-[#FF4D00] text-black font-black italic text-xs px-10 py-4 rounded-sm transform -skew-x-12 flex items-center gap-3 hover:bg-white transition-all shadow-xl hover:scale-105 active:scale-95"
          >
            <span className="transform skew-x-12 flex items-center gap-2">HAMISI <ArrowRight className="w-5 h-5" /></span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div 
            onClick={() => onViewChange('news')}
            className="lg:col-span-7 group relative overflow-hidden bg-[#111] min-h-[450px] md:min-h-[580px] flex items-end p-10 cursor-pointer shadow-2xl rounded-sm border border-white/5"
          >
             <img 
               src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop" 
               alt="Main News" 
               className="absolute inset-0 w-full h-full object-cover grayscale brightness-50 transition-transform duration-1000 group-hover:scale-110 group-hover:grayscale-0 group-hover:brightness-75"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
             <div className="relative z-10 w-full">
                <span className="text-[#FF4D00] text-[10px] font-black italic uppercase mb-3 block tracking-[0.3em]">SENSASİYA</span>
                <h3 className="text-4xl md:text-7xl font-black italic text-white leading-none tracking-tighter mb-5 uppercase">
                   QOBUSTAN 4X4 TROPHY: <br/> PALÇIQ MÜHARİBƏSİ
                </h3>
                <p className="text-gray-400 font-bold italic text-xs md:text-base uppercase tracking-wide max-w-xl">
                  Palçıqlı yolların qəhrəmanları və mövsümün ən böyük yarışı.
                </p>
             </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
             <div 
               onClick={() => onViewChange('news')} 
               className="group cursor-pointer flex flex-col flex-1 bg-white/5 p-6 rounded-sm border border-white/5 hover:border-[#FF4D00]/30 hover:bg-white/[0.08] transition-all shadow-sm"
             >
                <div className="aspect-video w-full overflow-hidden bg-[#000] mb-5 rounded-sm shadow-md relative">
                   <img 
                     src="https://images.unsplash.com/photo-1547038577-da80abbc4f19?q=80&w=2055&auto=format&fit=crop" 
                     alt="Buggy Sürət" 
                     className="w-full h-full object-cover grayscale opacity-50 transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-100"
                   />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[#FF4D00] text-[10px] font-black italic mb-2 uppercase tracking-widest">
                    <Calendar size={12} /> 2024-05-18
                  </div>
                  <h4 className="text-3xl font-black italic text-white uppercase leading-tight mb-2 group-hover:text-[#FF4D00] transition-colors tracking-tighter">
                     BUGGY SÜRƏT HƏDDİ
                  </h4>
                  <p className="text-gray-500 text-[10px] font-bold italic uppercase tracking-wider line-clamp-2">
                    Səhrada yeni rekordlar və tətbiq edilən innovativ mühəndislik həlləri.
                  </p>
                </div>
             </div>

             <div 
               onClick={() => onViewChange('news')} 
               className="group cursor-pointer flex flex-col flex-1 bg-white/5 p-6 rounded-sm border border-white/5 hover:border-[#FF4D00]/30 hover:bg-white/[0.08] transition-all shadow-sm"
             >
                <div className="aspect-video w-full overflow-hidden bg-[#000] mb-5 rounded-sm shadow-md relative">
                   <img 
                     src="https://images.unsplash.com/photo-1541447271487-09612b3f49f7?q=80&w=1974&auto=format&fit=crop" 
                     alt="Dakar 2025" 
                     className="w-full h-full object-cover grayscale opacity-50 transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-100"
                   />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[#FF4D00] text-[10px] font-black italic mb-2 uppercase tracking-widest">
                    <Calendar size={12} /> 2024-05-20
                  </div>
                  <h4 className="text-3xl font-black italic text-white uppercase leading-tight mb-2 group-hover:text-[#FF4D00] transition-colors tracking-tighter">
                     DAKAR 2025 HAZIRLIĞI
                  </h4>
                  <p className="text-gray-500 text-[10px] font-bold italic uppercase tracking-wider line-clamp-2">
                    Azərbaycan komandası Səudiyyə Ərəbistanındakı çətin çöl sınaqlarında.
                  </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default News;