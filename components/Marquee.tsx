import React from 'react';
import { Activity } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const Marquee: React.FC = () => {
  const { settings } = useAdmin();
  const text = settings.marqueeText;

  if (!settings.marqueeEnabled) return null;

  const MarqueeItem = () => (
    <div className="inline-flex items-center gap-8 mx-8">
      <span className="w-2 h-2 bg-black/40 rounded-full"></span>
      <Activity size={24} className="text-black/60" />
      <span className="text-black font-black italic text-xl tracking-widest uppercase whitespace-nowrap">
        {text}
      </span>
    </div>
  );

  return (
    <div className="bg-[#FF4D00] py-5 overflow-hidden whitespace-nowrap relative border-b border-[#CC3D00] flex items-center">
      <div className="inline-block animate-marquee">
        {new Array(10).fill(null).map((_, i) => (
          <MarqueeItem key={i} />
        ))}
      </div>
      <div className="inline-block animate-marquee" aria-hidden="true">
        {new Array(10).fill(null).map((_, i) => (
          <MarqueeItem key={i} />
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Marquee;