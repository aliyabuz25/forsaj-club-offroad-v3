
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Calendar, MapPin, X, Car, Users as UsersIcon, Download, FileText, ChevronDown } from 'lucide-react';

interface EventItem {
  id: number;
  title: string;
  date: string;
  location: string;
  category: string;
  img: string;
  description?: string;
  rules?: string;
  status: 'planned' | 'past';
}

interface EventsPageProps {
  onViewChange: (view: 'home' | 'about' | 'news' | 'events' | 'drivers' | 'rules' | 'contact' | 'gallery') => void;
}

const eventsData: EventItem[] = [
  {
    id: 1,
    title: 'SUMQAYIT CHALLENGE',
    date: '2024-07-20',
    location: 'SUMQAYIT',
    category: 'OFFROAD FEATURED',
    img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop',
    description: 'SUMQAYITIN SAHİL QUMRUQLARINDA KEÇİRİLƏN BU YARIŞDA PİLOTLARIN HƏM SÜRƏT, HƏM DƏ QUMLUQDA MANEVR QABİLİYYƏTLƏRİ SINAĞA ÇƏKİLƏCƏK. AZƏRBAYCANIN ƏN PRESTİJLİ SAHİL YARIŞI OLARAQ QƏBUL EDİLİR.',
    rules: '30KM/H LİMİT PİT-STOP ƏRAZİSİNDƏ MƏCBURİDİR. BÜTÜN AVTOMOBİLLƏRDƏ YANĞINSÖNDÜRƏN VƏ TƏHLÜKƏSİZLİK KARKASI OLMALIDIR.',
    status: 'planned'
  },
  {
    id: 2,
    title: 'XIZI DAĞ SINAĞI',
    date: '2024-08-15',
    location: 'XIZI',
    category: 'DAĞ SINAĞI',
    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop',
    status: 'planned'
  },
  {
    id: 3,
    title: 'NAXÇIVAN DESERT',
    date: '2024-09-10',
    location: 'NAXÇIVAN',
    category: 'DESERT',
    img: 'https://images.unsplash.com/photo-1547038577-da80abbc4f19?q=80&w=2055&auto=format&fit=crop',
    status: 'planned'
  },
  {
    id: 4,
    title: 'LERİK NIGHT TRAIL',
    date: '2024-10-05',
    location: 'LERİK',
    category: 'NIGHT TRAIL',
    img: 'https://images.unsplash.com/photo-1533558701576-23c65e0272fb?q=80&w=1974&auto=format&fit=crop',
    status: 'planned'
  },
  {
    id: 5,
    title: 'GABALA WINTER CUP',
    date: '2024-12-20',
    location: 'QƏBƏLƏ',
    category: 'WINTER CUP',
    img: 'https://images.unsplash.com/photo-1541447271487-09612b3f49f7?q=80&w=1974&auto=format&fit=crop',
    status: 'planned'
  },
  {
    id: 6,
    title: 'BAKU RALLY 2023',
    date: '2023-05-10',
    location: 'BAKI',
    category: 'RALLY',
    img: 'https://images.unsplash.com/photo-1547038577-da80abbc4f19?q=80&w=2055&auto=format&fit=crop',
    status: 'past'
  },
  {
    id: 7,
    title: 'QUSAR CHALLENGE',
    date: '2023-08-15',
    location: 'QUSAR',
    category: 'CHALLENGE',
    img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop',
    status: 'past'
  },
  {
    id: 8,
    title: 'QOBUSTAN TROPHY',
    date: '2023-11-20',
    location: 'QOBUSTAN',
    category: 'TROPHY',
    img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop',
    status: 'past'
  },
  {
    id: 9,
    title: 'SHEKİ TRAIL 2023',
    date: '2023-04-20',
    location: 'ŞƏKİ',
    category: 'TRAIL',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop',
    status: 'past'
  }
];

const EventsPage: React.FC<EventsPageProps> = ({ onViewChange }) => {
  const [activeTab, setActiveTab] = useState<'planned' | 'past'>('planned');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [regStep, setRegStep] = useState<'select' | 'pilot' | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedEvent]);

  const handleJoinSpectator = () => {
    window.open('https://iticket.az', '_blank');
  };

  const RegistrationModal = () => {
    if (!regStep) return null;

    const clubs = [
      'Fərdi İştirakçı',
      'Club 4X4',
      'Extreme 4X4',
      'Forsaj Club',
      'Offroad.az',
      'Overland 4X4',
      'PatrolClub.az',
      'Victory Club',
      'Zəfər 4X4 Club'
    ];

    return (
      <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-[#0A0A0A] border border-white/5 p-8 md:p-16 min-h-[600px] flex flex-col justify-center shadow-[0_0_100px_rgba(255,77,0,0.1)]">
          <button 
            onClick={() => setRegStep(null)}
            className="absolute top-8 right-8 text-gray-600 hover:text-white transition-colors"
          >
            <X size={32} />
          </button>

          {regStep === 'select' ? (
            <div className="text-center animate-in fade-in zoom-in-95 duration-300">
              <h2 className="text-5xl md:text-8xl font-black italic text-white uppercase tracking-tighter mb-2 leading-none">YARIŞDA İŞTİRAK</h2>
              <p className="text-[#FF4D00] font-black italic text-xs uppercase tracking-[0.3em] mb-16">
                {selectedEvent?.title} // {selectedEvent?.location}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div 
                  onClick={() => setRegStep('pilot')}
                  className="group cursor-pointer bg-black border border-white/5 hover:border-[#FF4D00] transition-all p-12 flex flex-col items-center justify-center min-h-[300px] shadow-2xl"
                >
                  <div className="bg-[#FF4D00] p-6 mb-8 transform -skew-x-12 group-hover:scale-110 group-hover:bg-white transition-all shadow-[0_0_20px_rgba(255,77,0,0.3)]">
                    <Car size={40} className="text-black transform skew-x-12" />
                  </div>
                  <h3 className="text-3xl font-black italic text-white uppercase mb-2 tracking-tighter">PİLOT KİMİ QATIL</h3>
                  <p className="text-gray-500 font-bold italic text-[10px] uppercase tracking-widest">TEXNİKİ REQLAMENTƏ UYĞUN OLARAQ</p>
                </div>

                <div 
                  onClick={handleJoinSpectator}
                  className="group cursor-pointer bg-black border border-white/5 hover:border-white transition-all p-12 flex flex-col items-center justify-center min-h-[300px] shadow-2xl"
                >
                  <div className="bg-white/10 p-6 mb-8 transform -skew-x-12 group-hover:scale-110 group-hover:bg-white transition-all">
                    <UsersIcon size={40} className="text-white transform skew-x-12 group-hover:text-black" />
                  </div>
                  <h3 className="text-3xl font-black italic text-white uppercase mb-2 tracking-tighter">İZLƏYİCİ KİMİ QATIL</h3>
                  <p className="text-gray-500 font-bold italic text-[10px] uppercase tracking-widest">YARIŞI TRİBUNADAN İZLƏ</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in slide-in-from-right duration-400">
              <button 
                onClick={() => setRegStep('select')}
                className="flex items-center gap-2 text-[#FF4D00] font-black italic text-xs uppercase tracking-widest mb-12 hover:translate-x-[-4px] transition-transform"
              >
                <ArrowLeft size={16} /> GERİ QAYIT
              </button>

              <div className="mb-12">
                <h2 className="text-5xl md:text-7xl font-black italic text-white uppercase tracking-tighter mb-2 leading-none">PİLOT QEYDİYYATI</h2>
                <div className="w-16 h-2 bg-[#FF4D00] shadow-[0_0_15px_rgba(255,77,0,0.4)]"></div>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-4">
                  <label className="text-gray-600 font-black italic text-[10px] uppercase tracking-widest">AD VƏ SOYAD</label>
                  <input type="text" className="w-full bg-black border border-white/5 text-white p-5 font-black italic text-sm focus:ring-1 focus:ring-[#FF4D00] outline-none uppercase placeholder:text-gray-800" placeholder="Tam ad daxil edin" />
                </div>
                <div className="space-y-4">
                  <label className="text-gray-600 font-black italic text-[10px] uppercase tracking-widest">TELEFON</label>
                  <input type="text" className="w-full bg-black border border-white/5 text-white p-5 font-black italic text-sm focus:ring-1 focus:ring-[#FF4D00] outline-none placeholder:text-gray-800" placeholder="+994 -- --- -- --" />
                </div>
                <div className="space-y-4">
                  <label className="text-gray-600 font-black italic text-[10px] uppercase tracking-widest">AVTOMOBİLİN MARKA/MODELİ</label>
                  <input type="text" className="w-full bg-black border border-white/5 text-white p-5 font-black italic text-sm focus:ring-1 focus:ring-[#FF4D00] outline-none uppercase placeholder:text-gray-800" placeholder="Məs: Toyota LC 105" />
                </div>
                <div className="space-y-4">
                  <label className="text-gray-600 font-black italic text-[10px] uppercase tracking-widest">TƏKƏR ÖLÇÜSÜ</label>
                  <input type="text" className="w-full bg-black border border-white/5 text-white p-5 font-black italic text-sm focus:ring-1 focus:ring-[#FF4D00] outline-none uppercase placeholder:text-gray-800" placeholder="Məs: 35 DÜYM" />
                </div>
                
                <div className="space-y-4">
                  <label className="text-gray-600 font-black italic text-[10px] uppercase tracking-widest">MÜHƏRRİK HƏCMİ</label>
                  <input type="text" className="w-full bg-black border border-white/5 text-white p-5 font-black italic text-sm focus:ring-1 focus:ring-[#FF4D00] outline-none uppercase placeholder:text-gray-800" placeholder="Məs: 4.4L" />
                </div>

                <div className="space-y-4">
                  <label className="text-gray-600 font-black italic text-[10px] uppercase tracking-widest">TƏMSİL ETDİYİ KLUB</label>
                  <div className="relative">
                    <select className="w-full bg-black border border-white/5 text-white p-5 font-black italic text-sm focus:ring-1 focus:ring-[#FF4D00] outline-none uppercase appearance-none cursor-pointer">
                      {clubs.map((club) => (
                        <option key={club} value={club.toLowerCase()}>{club.toUpperCase()}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-[#FF4D00] pointer-events-none" size={20} />
                  </div>
                </div>

                <div className="md:col-span-2 pt-8">
                  <button className="w-full bg-[#FF4D00] text-black py-6 font-black italic text-xl uppercase tracking-tighter transform -skew-x-12 hover:bg-white transition-all shadow-xl">
                    <span className="transform skew-x-12 block">QEYDİYYATI TAMAMLA</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (selectedEvent) {
    return (
      <div className="bg-[#0A0A0A] min-h-screen pb-20 text-white animate-in fade-in duration-500">
        <RegistrationModal />
        <div className="px-6 lg:px-20 py-8">
          <button 
            onClick={() => setSelectedEvent(null)}
            className="bg-[#FF4D00] text-black px-8 py-3 font-black italic text-xs uppercase tracking-widest transform -skew-x-12 flex items-center gap-2 hover:bg-white transition-all"
          >
            <span className="transform skew-x-12 flex items-center gap-2 tracking-widest">
              <ArrowLeft size={16} /> GERİ QAYIT
            </span>
          </button>
        </div>

        <div className="px-6 lg:px-20 mb-16">
          <div className="relative h-[400px] md:h-[600px] overflow-hidden rounded-sm group border border-white/5 shadow-2xl">
            <img 
              src={selectedEvent.img} 
              className="w-full h-full object-cover grayscale brightness-[0.2] transition-transform duration-1000 group-hover:scale-105" 
              alt={selectedEvent.title} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent"></div>
            
            <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <span className="bg-[#FF4D00] text-black px-4 py-1.5 font-black italic text-[10px] uppercase mb-6 inline-block transform -skew-x-12 shadow-lg">
                  <span className="transform skew-x-12 block tracking-widest uppercase font-black">{selectedEvent.status === 'planned' ? 'GƏLƏCƏK YARIŞ' : 'BAŞA ÇATIB'}</span>
                </span>
                <h1 className="text-5xl md:text-[100px] font-black italic text-white uppercase tracking-tighter leading-[0.8] mb-6">
                  {selectedEvent.title}
                </h1>
                <div className="flex flex-wrap gap-8 text-gray-500 font-black italic text-xs uppercase tracking-widest">
                  <span className="flex items-center gap-2"><Calendar size={14} className="text-[#FF4D00]" /> {selectedEvent.date}</span>
                  <span className="flex items-center gap-2"><MapPin size={14} className="text-[#FF4D00]" /> {selectedEvent.location}</span>
                </div>
              </div>
              
              {selectedEvent.status === 'planned' && (
                <button 
                  onClick={() => setRegStep('select')}
                  className="bg-[#FF4D00] text-black px-12 py-6 font-black italic text-lg uppercase transform -skew-x-12 hover:bg-white transition-all flex items-center gap-3 shadow-[0_10px_40px_rgba(255,77,0,0.3)]"
                >
                  <span className="transform skew-x-12 flex items-center gap-3">TƏDBİRƏ QOŞUL <ArrowRight size={24} /></span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 lg:px-20">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
            <div className="lg:w-8/12 space-y-20">
              {/* DESCRIPTION */}
              <div>
                <h3 className="text-white text-3xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-4">
                  <span className="w-2 h-10 bg-[#FF4D00] shadow-[0_0_10px_rgba(255,77,0,0.4)]"></span> TƏSVİR
                </h3>
                <p className="text-gray-400 font-bold italic text-2xl uppercase leading-relaxed tracking-wide">
                  {selectedEvent.description || 'Bu tədbir haqqında ətraflı məlumat tezliklə paylaşılacaq.'}
                </p>
              </div>

              {/* DOWNLOAD INSTRUCTIONS */}
              <div className="bg-[#111] border border-white/5 p-10 md:p-16 relative overflow-hidden group/dl shadow-2xl">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <FileText size={120} className="text-white transform rotate-12" />
                 </div>
                 <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="text-center md:text-left">
                       <h3 className="text-white text-4xl font-black italic uppercase tracking-tighter mb-4 leading-none">TƏLİMATI YÜKLƏ</h3>
                       <p className="text-gray-500 font-bold italic text-sm uppercase tracking-widest max-w-sm">YARIŞA HAZIRLIQ VƏ TEXNİKİ REQLAMENT HAQQINDA BÜTÜN MƏLUMATLAR BU SƏNƏDDƏ QEYD OLUNUB.</p>
                    </div>
                    <button className="bg-[#FF4D00] text-black px-12 py-6 font-black italic text-xl uppercase transform -skew-x-12 hover:bg-white transition-all flex items-center gap-4 shadow-[0_15px_40px_rgba(255,77,0,0.3)] group-hover/dl:scale-105 active:scale-95">
                       <span className="transform skew-x-12 flex items-center gap-3 whitespace-nowrap">PDF YÜKLƏ <Download size={24} className="animate-bounce" /></span>
                    </button>
                 </div>
              </div>

              {/* RULES */}
              <div>
                <h3 className="text-white text-3xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-4">
                  <span className="w-2 h-10 bg-white/20"></span> QAYDALAR VƏ TƏLƏBLƏR
                </h3>
                <div className="bg-[#111] p-12 border-l-4 border-[#FF4D00] shadow-2xl">
                  <p className="text-gray-300 font-bold italic text-xl uppercase tracking-widest leading-loose">
                    {selectedEvent.rules || 'Yarış qaydaları iştirakçılara brifinq zamanı elan ediləcək.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:w-4/12">
              <div className="bg-[#111] p-12 border border-white/5 sticky top-32 shadow-2xl rounded-sm">
                <h4 className="text-white text-4xl font-black italic uppercase tracking-tighter mb-6 leading-none">SUALINIZ VAR?</h4>
                <p className="text-gray-500 font-bold italic text-xs uppercase mb-10 leading-relaxed tracking-widest">
                  YARIŞLA BAĞLI ƏLAVƏ SUALLARINIZ ÜÇÜN BİZİMLƏ ƏLAQƏ SAXLAYIN.
                </p>
                <button 
                  onClick={() => onViewChange('contact')}
                  className="w-full border-2 border-white/10 text-white py-5 font-black italic text-xs uppercase hover:bg-[#FF4D00] hover:text-black hover:border-[#FF4D00] transition-all transform -skew-x-12 tracking-widest"
                >
                  <span className="transform skew-x-12 block uppercase">ƏLAQƏ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const plannedEvents = eventsData.filter(e => e.status === 'planned');
  const pastEvents = eventsData.filter(e => e.status === 'past');
  const displayEvents = activeTab === 'planned' ? plannedEvents : pastEvents;
  const featuredEvent = plannedEvents[0];

  return (
    <div className="bg-[#0A0A0A] min-h-screen py-16 px-6 lg:px-20 text-white">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-20">
        <div className="flex items-start gap-4">
          <div className="w-2 h-16 bg-[#FF4D00] shadow-[0_0_15px_rgba(255,77,0,0.4)]"></div>
          <div>
            <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none text-white">
              TƏDBİRLƏR
            </h2>
            <p className="text-[#FF4D00] font-black italic text-[11px] md:text-sm mt-2 uppercase tracking-[0.4em]">
              OFFICIAL EVENT CALENDAR // FORSAJ CLUB
            </p>
          </div>
        </div>

        <div className="bg-white/5 p-1 rounded-sm flex items-center border border-white/10">
          <button 
            onClick={() => setActiveTab('planned')}
            className={`px-8 py-3 font-black italic text-xs uppercase tracking-widest transition-all ${activeTab === 'planned' ? 'bg-[#FF4D00] text-black transform -skew-x-12' : 'text-gray-500'}`}
          >
            <span className={activeTab === 'planned' ? 'transform skew-x-12 block' : ''}>PLANLANAN TƏDBİRLƏR</span>
          </button>
          <button 
            onClick={() => setActiveTab('past')}
            className={`px-8 py-3 font-black italic text-xs uppercase tracking-widest transition-all ${activeTab === 'past' ? 'bg-[#FF4D00] text-black transform -skew-x-12' : 'text-gray-500'}`}
          >
            <span className={activeTab === 'past' ? 'transform skew-x-12 block' : ''}>KEÇMİŞ TƏDBİRLƏR</span>
          </button>
        </div>
      </div>

      {activeTab === 'planned' && (
        <div 
          onClick={() => setSelectedEvent(featuredEvent)}
          className="group relative bg-[#111] h-[400px] md:h-[600px] overflow-hidden cursor-pointer mb-20 border border-white/5 rounded-sm shadow-[0_40px_80px_rgba(0,0,0,0.5)]"
        >
          <img 
            src={featuredEvent.img} 
            className="w-full h-full object-cover grayscale opacity-40 transition-transform duration-1000 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0 group-hover:brightness-75" 
            alt={featuredEvent.title} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-black/20 to-transparent"></div>
          <div className="absolute bottom-16 left-16 right-16">
            <div className="bg-[#FF4D00] text-black px-5 py-2 font-black italic text-[10px] inline-block mb-8 transform -skew-x-12 shadow-lg">
              <span className="transform skew-x-12 block tracking-widest uppercase font-black">OFFROAD FEATURED</span>
            </div>
            <h3 className="text-6xl md:text-[140px] font-black italic text-white leading-[0.75] uppercase tracking-tighter mb-10">
              {featuredEvent.title}
            </h3>
            <button className="flex items-center gap-4 text-white font-black italic text-2xl hover:translate-x-6 transition-transform uppercase tracking-tighter">
              DAHA ƏTRAFLI <ArrowRight size={36} className="text-[#FF4D00]" />
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayEvents.filter(e => activeTab === 'past' || e.id !== featuredEvent.id).map((event) => (
          <div 
            key={event.id} 
            onClick={() => setSelectedEvent(event)}
            className="group cursor-pointer relative aspect-[4/5] bg-[#111] border border-white/5 overflow-hidden rounded-sm hover:border-[#FF4D00]/40 transition-all shadow-xl"
          >
            <img 
              src={event.img} 
              className="w-full h-full object-cover grayscale opacity-50 transition-all duration-700 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110" 
              alt={event.title} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            
            <div className="absolute bottom-8 left-8 right-8">
              <div className="text-[#FF4D00] font-black italic text-[10px] mb-2 uppercase tracking-widest">{event.date}</div>
              <h4 className="text-3xl font-black italic text-white uppercase leading-none tracking-tighter group-hover:text-[#FF4D00] transition-colors">
                {event.title}
              </h4>
              {activeTab === 'planned' && (
                <div className="mt-6 bg-white/5 border border-white/10 text-white px-5 py-2 font-black italic text-[8px] inline-block transform -skew-x-12 group-hover:bg-[#FF4D00] group-hover:text-black transition-all">
                  <span className="transform skew-x-12 block uppercase tracking-[0.2em]">ƏTRAFLI BAX</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
