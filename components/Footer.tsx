import React from 'react';
import { Instagram, Youtube, Facebook, ArrowRight, Music2 as TikTok } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAdmin } from '../context/AdminContext';

interface FooterProps {
  onViewChange: (view: 'home' | 'about' | 'news' | 'events' | 'drivers' | 'rules' | 'contact' | 'gallery') => void;
}

const Footer: React.FC<FooterProps> = ({ onViewChange }) => {
  const { t } = useLanguage();
  const { settings } = useAdmin();

  const navigationLinks = [
    { name: t('nav.home', 'ANA SƏHİFƏ'), id: 'home' as const },
    { name: t('nav.about', 'HAQQIMIZDA'), id: 'about' as const },
    { name: t('nav.news', 'XƏBƏRLƏR'), id: 'news' as const },
    { name: t('nav.events', 'YARIŞLAR'), id: 'events' as const },
    { name: t('nav.drivers', 'SÜRÜCÜLƏR'), id: 'drivers' as const },
    { name: t('nav.gallery', 'QALEREYA'), id: 'gallery' as const },
    { name: t('nav.contact', 'ƏLAQƏ'), id: 'contact' as const },
  ];

  const rulesLinks = [
    { name: t('rules.pilot_protocol', 'PİLOT PROTOKOLU'), id: 'rules' as const },
    { name: t('rules.technical_norms', 'TEXNİKİ NORMATİVLƏR'), id: 'rules' as const },
    { name: t('rules.safety_rules', 'TƏHLÜKƏSİZLİK QAYDALARI'), id: 'rules' as const },
    { name: t('rules.eco_responsibility', 'EKOLOJİ MƏSULİYYƏT'), id: 'rules' as const },
  ];

  const socialLinks = [
    { Icon: Instagram, url: settings.instagram },
    { Icon: Youtube, url: settings.youtube },
    { Icon: Facebook, url: settings.facebook },
    { Icon: TikTok, url: settings.tiktok },
  ].filter(link => link.url);

  return (
    <footer className="bg-[#050505] pt-32 pb-12 px-6 lg:px-20 border-t border-white/5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-24">

        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-8 cursor-pointer notranslate" onClick={() => onViewChange('home')}>
            <h2 className="text-4xl font-black italic tracking-tighter flex items-center">
              <span className="text-white">{settings.siteTitle?.split(' ')[0] || 'FORSAJ'}</span>
              <span className="text-[#FF4D00] ml-1">{settings.siteTitle?.split(' ')[1] || 'CLUB'}</span>
            </h2>
          </div>
          <p className="text-gray-500 font-bold italic text-[11px] uppercase leading-relaxed mb-10 max-w-xs tracking-tight">
            {settings.description || t('footer.desc', 'FORSAJ CLUB AZƏRBAYCANIN ƏN BÖYÜK OFFROAD MOTORSPORT HUB-DIR.')}
          </p>
          <div className="flex gap-4">
            {socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 p-4 rounded-sm text-gray-500 hover:bg-[#FF4D00] hover:text-black transition-all transform hover:-translate-y-1 shadow-sm"
              >
                <link.Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[#FF4D00] font-black italic text-[13px] mb-8 uppercase tracking-[0.3em]">{t('footer.nav', 'NAVİQASİYA')}</h4>
          <ul className="space-y-5">
            {navigationLinks.map(link => (
              <li key={link.id}>
                <button
                  onClick={() => onViewChange(link.id)}
                  className="text-gray-500 font-black italic text-[11px] uppercase hover:text-white transition-colors tracking-tight text-left"
                >
                  {link.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[#FF4D00] font-black italic text-[13px] mb-8 uppercase tracking-[0.3em]">{t('footer.motorsport', 'MOTORSPORT')}</h4>
          <ul className="space-y-5">
            {rulesLinks.map((link, idx) => (
              <li key={idx}>
                <button
                  onClick={() => onViewChange(link.id)}
                  className="text-gray-500 font-black italic text-[11px] uppercase hover:text-white transition-colors tracking-tight text-left"
                >
                  {link.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/5 p-8 rounded-sm border border-white/5">
          <h4 className="text-white font-black italic text-[13px] mb-4 uppercase tracking-tighter">{t('footer.stay_updated', 'YENİLİKLƏRƏ QOŞULUN')}</h4>
          <p className="text-gray-500 font-bold italic text-[10px] uppercase mb-8 leading-relaxed tracking-tight">
            {t('footer.newsletter_desc', 'ƏN SON YARIŞLAR VƏ TƏDBİRLƏR HAQQINDA MƏLUMAT ALIN.')}
          </p>
          <div className="flex items-center">
            <input
              type="email"
              placeholder={t('footer.email_placeholder', 'E-POÇT ÜNVANINIZ')}
              className="flex-grow bg-[#111] border border-white/10 border-r-0 py-4 px-5 font-black italic text-[10px] text-white uppercase focus:outline-none focus:border-[#FF4D00] transition-colors placeholder:text-gray-600"
            />
            <button className="bg-[#FF4D00] text-black p-4 hover:bg-white transition-colors flex items-center justify-center">
              <ArrowRight size={22} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-gray-600 font-black italic text-[9px] uppercase tracking-widest">
          © 2024 FORSAJ CLUB. ALL RIGHTS RESERVED.
        </p>
        <div className="flex gap-10">
          <a href="#" className="text-gray-600 font-black italic text-[9px] uppercase tracking-widest hover:text-[#FF4D00] transition-colors">Privacy Policy</a>
          <a href="#" className="text-gray-600 font-black italic text-[9px] uppercase tracking-widest hover:text-[#FF4D00] transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
