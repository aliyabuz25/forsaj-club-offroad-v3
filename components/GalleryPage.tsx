import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, X, Download, Share2, ZoomIn, Film, Image as ImageIcon, ChevronRight } from 'lucide-react';
import { useAdmin, GallerySection } from '../context/AdminContext';

interface GalleryPageProps {
  onViewChange: (view: 'home' | 'about' | 'news' | 'events' | 'drivers' | 'rules' | 'contact' | 'gallery') => void;
}

const GalleryPage: React.FC<GalleryPageProps> = ({ onViewChange }) => {
  const { gallery } = useAdmin();
  const [activeEvent, setActiveEvent] = useState<GallerySection | null>(null);
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [selectedMedia, setSelectedMedia] = useState<{ type: 'photo' | 'video', item: any } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeEvent]);

  if (!gallery || gallery.length === 0) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen py-24 px-6 lg:px-20 text-white font-['Inter'] flex items-center justify-center">
        <p className="text-gray-500 font-black italic uppercase tracking-widest">Qalereya məlumatı yüklənir və ya tapılmadı...</p>
      </div>
    );
  }

  if (activeEvent) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen text-white font-['Inter'] animate-in fade-in duration-500">
        <div className="px-6 lg:px-20 py-10 flex justify-between items-center border-b border-white/5">
          <button
            onClick={() => setActiveEvent(null)}
            className="flex items-center gap-3 text-gray-500 hover:text-[#FF4D00] font-black italic text-xs uppercase tracking-widest transition-all"
          >
            <ArrowLeft size={20} /> GERİ QAYIT
          </button>
          <div className="flex gap-2 bg-white/5 p-1 rounded-sm border border-white/10">
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-8 py-2 font-black italic text-[10px] uppercase tracking-widest transition-all ${activeTab === 'photos' ? 'bg-[#FF4D00] text-black transform -skew-x-12' : 'text-gray-500'}`}
            >
              <span className={activeTab === 'photos' ? 'transform skew-x-12 block' : ''}>FOTOLAR ({activeEvent.photos.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-8 py-2 font-black italic text-[10px] uppercase tracking-widest transition-all ${activeTab === 'videos' ? 'bg-[#FF4D00] text-black transform -skew-x-12' : 'text-gray-500'}`}
            >
              <span className={activeTab === 'videos' ? 'transform skew-x-12 block' : ''}>VİDEOLAR ({activeEvent.videos.length})</span>
            </button>
          </div>
        </div>

        <div className="px-6 lg:px-20 py-16">
          <div className="mb-16">
            <span className="text-[#FF4D00] font-black italic text-sm uppercase tracking-[0.3em] block mb-4">{activeEvent.date}</span>
            <h1 className="text-6xl md:text-9xl font-black italic text-white uppercase tracking-tighter leading-none">{activeEvent.title}</h1>
          </div>

          {activeTab === 'photos' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {activeEvent.photos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedMedia({ type: 'photo', item: photo })}
                  className="group relative aspect-square bg-[#111] overflow-hidden cursor-zoom-in border border-white/5 hover:border-[#FF4D00]/50 transition-all"
                >
                  <img src={photo.url} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt={photo.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all">
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                      <span className="text-[10px] font-black italic uppercase tracking-widest">{photo.title}</span>
                      <ZoomIn size={20} className="text-[#FF4D00]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {activeEvent.videos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => setSelectedMedia({ type: 'video', item: video })}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-video bg-[#111] overflow-hidden border border-white/5 mb-4 group-hover:border-[#FF4D00]/50 transition-all">
                    <img src={video.url} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-700" alt="" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-[#FF4D00] flex items-center justify-center transform -skew-x-12 group-hover:scale-110 group-hover:bg-white transition-all shadow-2xl">
                        <Play size={32} className="text-black transform skew-x-12 fill-black" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/80 px-3 py-1 text-[10px] font-black italic tracking-widest">{video.duration}</div>
                  </div>
                  <h3 className="text-xl font-black italic uppercase tracking-tighter group-hover:text-[#FF4D00] transition-colors">{video.title}</h3>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedMedia && (
          <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-xl flex items-center justify-center p-4 md:p-12">
            <button onClick={() => setSelectedMedia(null)} className="absolute top-8 right-8 text-gray-400 hover:text-white transition-colors z-[110]"><X size={40} /></button>
            <div className="w-full h-full flex flex-col items-center justify-center">
              {selectedMedia.type === 'photo' ? (
                <img src={selectedMedia.item.url} className="max-w-full max-h-[85vh] object-contain shadow-2xl animate-in zoom-in-95 duration-300" alt="" />
              ) : (
                <div className="w-full max-w-6xl aspect-video shadow-2xl animate-in zoom-in-95 duration-300">
                  <iframe
                    width="100%" height="100%"
                    src={`https://www.youtube.com/embed/${selectedMedia.item.videoId}?autoplay=1`}
                    title="YouTube video player" frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              <div className="mt-8 flex items-center gap-12 text-center animate-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h4 className="text-4xl font-black italic uppercase tracking-tighter mb-2">{selectedMedia.item.title}</h4>
                  <p className="text-[#FF4D00] font-black italic text-xs uppercase tracking-widest">{activeEvent.title}</p>
                </div>
                <div className="flex gap-4">
                  <button className="p-4 bg-white/5 hover:bg-[#FF4D00] hover:text-black transition-all rounded-sm border border-white/5"><Download size={24} /></button>
                  <button className="p-4 bg-white/5 hover:bg-white hover:text-black transition-all rounded-sm border border-white/5"><Share2 size={24} /></button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] min-h-screen py-24 px-6 lg:px-20 text-white font-['Inter']">
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="flex items-start gap-4">
            <div className="w-2 h-20 bg-[#FF4D00] shadow-[0_0_20px_rgba(255,77,0,0.3)]"></div>
            <div>
              <h2 className="text-7xl md:text-[120px] font-black italic tracking-tighter uppercase leading-none text-white">QALEREYA</h2>
              <p className="text-[#FF4D00] font-black italic text-sm mt-4 uppercase tracking-[0.5em] opacity-80">CHRONOLOGICAL MOTORSPORT ARCHIVE</p>
            </div>
          </div>
          <div className="flex gap-12 border-t border-white/5 pt-8 md:pt-0 md:border-t-0">
            <div className="text-center">
              <span className="block text-4xl font-black italic text-white mb-1">{gallery.length}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">EKSPEDİSİYA</span>
            </div>
            <div className="text-center">
              <span className="block text-4xl font-black italic text-white mb-1">{gallery.reduce((acc, curr) => acc + curr.photos.length, 0)}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">FOTOLAR</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
          {gallery.map((event) => (
            <div
              key={event.id}
              onClick={() => setActiveEvent(event)}
              className="group cursor-pointer relative h-[500px] md:h-[700px] overflow-hidden bg-[#111] border border-white/5 shadow-2xl"
            >
              <img src={event.photos[0]?.url} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

              <div className="absolute top-10 right-10 flex gap-2">
                <div className="bg-black/80 backdrop-blur-md px-4 py-2 flex items-center gap-2 border border-white/10">
                  <ImageIcon size={14} className="text-[#FF4D00]" />
                  <span className="text-xs font-black italic">{event.photos.length}</span>
                </div>
                <div className="bg-black/80 backdrop-blur-md px-4 py-2 flex items-center gap-2 border border-white/10">
                  <Film size={14} className="text-[#FF4D00]" />
                  <span className="text-xs font-black italic">{event.videos.length}</span>
                </div>
              </div>

              <div className="absolute bottom-16 left-16 right-16">
                <span className="text-[#FF4D00] font-black italic text-xs uppercase tracking-[0.3em] mb-4 block group-hover:translate-x-4 transition-transform duration-500">{event.date}</span>
                <h3 className="text-5xl md:text-8xl font-black italic text-white uppercase tracking-tighter leading-none mb-10 group-hover:translate-x-4 transition-transform duration-700">{event.title}</h3>
                <button className="flex items-center gap-4 text-white font-black italic text-xl uppercase tracking-widest group-hover:translate-x-6 transition-transform duration-500">
                  ARXİVƏ BAX <ChevronRight size={32} className="text-[#FF4D00]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
