import React, { useState } from 'react';
import { PlayCircle, ArrowRight, X } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useLanguage } from '../context/LanguageContext';

interface VideoArchiveProps {
  onViewChange: (view: any) => void;
}

const VideoArchive: React.FC<VideoArchiveProps> = ({ onViewChange }) => {
  const { gallery } = useAdmin();
  const { t } = useLanguage();
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  // Collect all videos from all gallery sections
  const allVideos = gallery
    .flatMap(section => section.videos.map(v => ({
      ...v,
      sectionTitle: section.title
    })))
    .slice(0, 4);

  if (allVideos.length === 0) return null;

  const VideoModal = () => {
    if (!playingVideoId) return null;

    return (
      <div
        className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
        onClick={() => setPlayingVideoId(null)}
      >
        <div className="relative w-full max-w-5xl aspect-video bg-black border border-white/10 shadow-[0_0_100px_rgba(255,77,0,0.3)]">
          <button
            onClick={(e) => { e.stopPropagation(); setPlayingVideoId(null); }}
            className="absolute -top-12 right-0 md:-right-12 text-white/50 hover:text-[#FF4D00] transition-colors"
          >
            <X size={40} strokeWidth={1.5} />
          </button>

          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${playingVideoId}?autoplay=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    );
  };

  return (
    <section className="py-24 px-6 lg:px-20 bg-[#050505]">
      <VideoModal />

      <div className="flex justify-between items-end mb-16">
        <div className="flex items-start gap-4">
          <div className="w-2 h-16 bg-[#FF4D00] shadow-[0_0_15px_rgba(255,77,0,0.4)]"></div>
          <div>
            <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none text-white">
              {t('nav.video_archive', 'VİDEO ARXİV')}
            </h2>
            <p className="text-[#FF4D00] font-black italic text-[11px] md:text-sm mt-2 uppercase tracking-[0.4em]">{t('video.archive_desc', 'FORSAJ CLUB // RƏSMİ KANAL')}</p>
          </div>
        </div>
        <button
          onClick={() => onViewChange('gallery')}
          className="bg-white/5 text-white font-black italic text-xs px-10 py-4 rounded-sm transform -skew-x-12 flex items-center gap-3 hover:bg-[#FF4D00] hover:text-black transition-all border border-white/10 shadow-xl"
        >
          <span className="transform skew-x-12 flex items-center gap-2 uppercase tracking-widest">{t('common.all', 'HAMISI')} <ArrowRight className="w-5 h-5" /></span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {allVideos.map((video, idx) => (
          <div
            key={idx}
            onClick={() => setPlayingVideoId(video.videoId)}
            className="group cursor-pointer relative flex flex-col bg-[#111] overflow-hidden border border-white/5 hover:border-[#FF4D00]/50 transition-all duration-500 shadow-2xl"
          >
            <div className="aspect-video relative overflow-hidden">
              <img
                src={video.url}
                alt={video.title}
                className="w-full h-full object-cover grayscale opacity-40 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-[#FF4D00] p-4 rounded-full transform -skew-x-12 group-hover:scale-110 group-hover:bg-white transition-all shadow-xl">
                  <PlayCircle size={40} className="text-black transform skew-x-12" />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/5 flex-grow">
              <h3 className="text-xl font-black italic text-white uppercase leading-tight group-hover:text-[#FF4D00] transition-colors tracking-tighter">
                {video.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VideoArchive;
