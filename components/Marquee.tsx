import React from 'react';
import { Activity } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const Marquee: React.FC = () => {
  const { settings } = useAdmin();
  const text = settings.marqueeText || "FORSAJ CLUB OFFROAD - AZƏRBAYCANIN ƏN BÖYÜK OFFROAD MOTORSPORT PLATFORMASI!";

  if (!settings.marqueeEnabled) return null;

  const MarqueeItem = () => (
    <div className="inline-flex items-center gap-8 mx-8 py-2">
      <span className="w-2 h-2 bg-black/30 rounded-full"></span>
      <Activity size={18} className="text-black/60" />
      <span className="text-black font-black italic text-sm tracking-[0.15em] uppercase whitespace-nowrap">
        {text}
      </span>
    </div>
  );

  return (
    <div className="bg-[#FF4D00] overflow-hidden whitespace-nowrap relative border-b border-[#CC3D00] flex select-none">
      <div className="flex animate-marquee-scroll">
        <div className="flex items-center flex-shrink-0">
          {new Array(5).fill(null).map((_, i) => (
            <MarqueeItem key={`first-${i}`} />
          ))}
        </div>
        <div className="flex items-center flex-shrink-0" aria-hidden="true">
          {new Array(5).fill(null).map((_, i) => (
            <MarqueeItem key={`second-${i}`} />
          ))}
        </div>
      </div>

      <style>{`
                @keyframes marquee-scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee-scroll {
                    display: flex;
                    animation: marquee-scroll 30s linear infinite;
                    width: max-content;
                }
                .animate-marquee-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
    </div>
  );
};

export default Marquee;