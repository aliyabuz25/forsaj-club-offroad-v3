import React, { useState } from 'react';
import { ArrowLeft, Clock, Share2, MessageSquare, ChevronRight, Calendar } from 'lucide-react';
import { useAdmin, NewsItem } from '../context/AdminContext';
import { useLanguage } from '../context/LanguageContext';

interface NewsPageProps {
  onViewChange: (view: any) => void;
}

const NewsPage: React.FC<NewsPageProps> = ({ onViewChange }) => {
  const { news } = useAdmin();
  const { t } = useLanguage();
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  if (!news || news.length === 0) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen flex items-center justify-center text-white">
        <p className="text-gray-500 font-black italic uppercase tracking-widest">Xəbərlər yüklənir...</p>
      </div>
    );
  }

  const mainNews = news.find(n => n.isMain) || news[0];

  if (selectedNews) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen text-white animate-in fade-in duration-500">
        <div className="px-6 lg:px-20 py-10">
          <button onClick={() => setSelectedNews(null)} className="flex items-center gap-2 text-[#FF4D00] font-black italic text-xs uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
            <ArrowLeft size={16} /> GERİ QAYIT
          </button>
        </div>

        <div className="px-6 lg:px-20 max-w-7xl mx-auto">
          <div className="relative h-[400px] md:h-[600px] overflow-hidden rounded-sm mb-12 border border-white/5 shadow-2xl">
            <img src={selectedNews.image || selectedNews.img} className="w-full h-full object-cover grayscale brightness-50" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent"></div>
            <div className="absolute bottom-12 left-12 right-12">
              <span className="text-[#FF4D00] font-black italic text-[10px] uppercase tracking-widest mb-4 block">{selectedNews.category} // {selectedNews.date}</span>
              <h1 className="text-4xl md:text-7xl font-black italic uppercase leading-none tracking-tighter">{selectedNews.title}</h1>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-16 mb-24 pb-20">
            <div className="lg:w-8/12">
              <p className="text-gray-400 font-bold italic text-2xl uppercase leading-relaxed tracking-wide whitespace-pre-wrap">
                {selectedNews.description}
              </p>
            </div>
            <div className="lg:w-4/12">
              <div className="bg-[#111] p-10 border border-white/5 sticky top-32">
                <h4 className="text-xl font-black italic uppercase mb-6 tracking-widest border-b border-white/5 pb-4">DİGƏR XƏBƏRLƏR</h4>
                <div className="space-y-6">
                  {news.filter(n => n.id !== selectedNews.id).slice(0, 5).map(n => (
                    <div key={n.id} onClick={() => setSelectedNews(n)} className="cursor-pointer group border-b border-white/5 pb-4">
                      <p className="text-[9px] text-[#FF4D00] font-black italic uppercase mb-1">{n.date}</p>
                      <h5 className="text-sm font-black italic uppercase group-hover:text-[#FF4D00] transition-colors leading-tight">{n.title}</h5>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] min-h-screen py-24 px-6 lg:px-20 text-white font-['Inter']">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex items-start gap-4 mb-20">
          <div className="w-2 h-16 bg-[#FF4D00] shadow-[0_0_15px_rgba(255,77,0,0.3)]"></div>
          <div>
            <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none text-white">XƏBƏRLƏR</h2>
            <p className="text-[#FF4D00] font-black italic text-xs mt-2 uppercase tracking-widest">MOTORSPORT ARXİVİ VƏ YENİLİKLƏR</p>
          </div>
        </div>

        <div
          onClick={() => setSelectedNews(mainNews)}
          className="group relative h-[500px] md:h-[700px] bg-[#111] overflow-hidden cursor-pointer mb-20 border border-white/5 shadow-2xl"
        >
          <img src={mainNews.image} className="w-full h-full object-cover grayscale brightness-50 transition-all duration-1000 group-hover:scale-105 group-hover:grayscale-0" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent"></div>
          <div className="absolute bottom-16 left-16 right-16">
            <span className="bg-[#FF4D00] text-black px-4 py-1 font-black italic text-[10px] uppercase mb-6 inline-block transform -skew-x-12 tracking-widest">ƏSAS XƏBƏR</span>
            <h3 className="text-5xl md:text-[100px] font-black italic leading-[0.8] uppercase tracking-tighter mb-8">{mainNews.title}</h3>
            <button className="flex items-center gap-4 text-white font-black italic text-2xl group-hover:translate-x-4 transition-transform uppercase">
              OXU <ChevronRight size={32} className="text-[#FF4D00]" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.filter(n => n.id !== mainNews.id).map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedNews(item)}
              className="group cursor-pointer bg-[#111] border border-white/5 overflow-hidden hover:border-[#FF4D00]/40 transition-all shadow-xl"
            >
              <div className="aspect-video relative overflow-hidden">
                <img src={item.image} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt="" />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 text-[#FF4D00] text-[10px] font-black italic mb-4 uppercase tracking-widest">
                  <Calendar size={14} /> {item.date}
                </div>
                <h4 className="text-3xl font-black italic uppercase leading-none tracking-tighter mb-4 group-hover:text-[#FF4D00] transition-colors line-clamp-2">{item.title}</h4>
                <p className="text-gray-500 text-[10px] font-bold italic uppercase tracking-widest line-clamp-3">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
