import React, { useState } from 'react';
import { ChevronRight, FileText, Download, ShieldAlert, Settings, Info, Leaf } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface RuleSection {
  id: string;
  titleKey: string;
  icon: React.ReactNode;
  rules: {
    subtitleKey: string;
    descKey: string;
  }[];
}

const RulesPage: React.FC = () => {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>('pilot');

  const ruleSections: RuleSection[] = [
    {
      id: 'pilot',
      titleKey: t('rules.pilot_protocol', 'PİLOT PROTOKOLU'),
      icon: <Info size={18} />,
      rules: [
        { subtitleKey: t('rules.pilot_duties', 'PİLOTUN ÖHDƏLİKLƏRİ'), descKey: t('rules.pilot_duties_desc', 'Hər bir pilot yarış zamanı nizam-intizam qaydalarına və hakimlərin qərarlarına tabe olmalıdır.') },
        { subtitleKey: t('rules.disqualification', 'KƏNARLAŞDIRMA'), descKey: t('rules.disqualification_desc', 'Təhlükəsizlik kəmərini taxmayan və ya qeyri-etik davranış sərgiləyən pilotlar yarışdan kənarlaşdırılır.') },
        { subtitleKey: t('rules.tech_req', 'TEXNİKİ TƏLƏBLƏR'), descKey: t('rules.tech_req_desc', 'Avtomobilin bütün asqı və mühərrik sistemləri texniki baxışdan keçməlidir.') }
      ]
    },
    {
      id: 'technical',
      titleKey: t('rules.technical_norms', 'TEXNİKİ NORMATİVLƏR'),
      icon: <Settings size={18} />,
      rules: [
        { subtitleKey: t('rules.tire_size', 'TƏKƏR ÖLÇÜLƏRİ'), descKey: t('rules.tire_size_desc', 'Kateqoriyalara görə maksimum təkər ölçüsü 37 düym olaraq təyin edilmişdir.') },
        { subtitleKey: t('rules.engine_power', 'MÜHƏRRİK GÜCÜ'), descKey: t('rules.engine_power_desc', 'Stock kateqoriyasında zavod istehsalı olan mühərrik gücü saxlanılmalıdır.') },
        { subtitleKey: t('rules.suspension', 'ASQI SİSTEMİ'), descKey: t('rules.suspension_desc', 'Unlimited kateqoriyasında istənilən tip asqı sistemindən istifadəyə icazə verilir.') }
      ]
    },
    {
      id: 'safety',
      titleKey: t('rules.safety_rules', 'TƏHLÜKƏSİZLİK QAYDALARI'),
      icon: <ShieldAlert size={18} />,
      rules: [
        { subtitleKey: t('rules.roll_cage', 'TƏHLÜKƏSİZLİK KARKASI'), descKey: t('rules.roll_cage_desc', 'Extreme kateqoriyasında bütün maşınlar xarici və ya daxili karkasla təchiz olunmalıdır.') },
        { subtitleKey: t('rules.fire_extinguisher', 'YANĞINSÖNDÜRƏN'), descKey: t('rules.fire_extinguisher_desc', 'Hər bir avtomobildə əlçatan yerdə ən azı 2 kq-lıq yanğınsöndürən olmalıdır.') },
        { subtitleKey: t('rules.belt_helmet', 'KƏMƏR VƏ DƏBİLQƏ'), descKey: t('rules.belt_helmet_desc', '4 nöqtəli kəmər və sertifikatlı dəbiqlə istifadəsi bütün mərhələlərdə məcburidir.') }
      ]
    },
    {
      id: 'eco',
      titleKey: t('rules.eco_responsibility', 'EKOLOJİ MƏSULİYYƏT'),
      icon: <Leaf size={18} />,
      rules: [
        { subtitleKey: t('rules.waste_management', 'TULLANTILARIN İDARƏSİ'), descKey: t('rules.waste_management_desc', 'Yarış ərazisində və düşərgələrdə tullantı atmaq qəti qadağandır.') },
        { subtitleKey: t('rules.fluid_leaks', 'MAYELƏRİN SIZMASI'), descKey: t('rules.fluid_leaks_desc', 'Yağ və ya soyuducu maye sızması olan avtomobillər starta buraxılmır.') },
        { subtitleKey: t('rules.route_adherence', 'MARŞRUTUN QORUNMASI'), descKey: t('rules.route_adherence_desc', 'Təyin olunmuş marşrutdan kənara çıxaraq təbiətə zərər vermək cərimələrə səbəb olur.') }
      ]
    }
  ];

  const currentSection = ruleSections.find(s => s.id === activeSection) || ruleSections[0];

  return (
    <div className="bg-[#0A0A0A] min-h-screen py-16 px-6 lg:px-20 text-white animate-in fade-in duration-500">
      {/* Standardized Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-20">
        <div className="flex items-start gap-4">
          <div className="w-2 h-16 bg-[#FF4D00] shadow-[0_0_15px_rgba(255,77,0,0.4)]"></div>
          <div>
            <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none text-white">
              {t('nav.rules', 'QAYDALAR')}
            </h2>
            <p className="text-[#FF4D00] font-black italic text-[11px] md:text-sm mt-2 uppercase tracking-[0.4em]">
              FORSAJ MOTORSPORT OFFICIAL RULES
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
        <div className="lg:w-1/4 space-y-4">
          <div className="flex flex-col gap-2">
            {ruleSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center justify-between p-6 font-black italic text-[11px] uppercase tracking-[0.2em] transition-all transform hover:translate-x-1 border border-white/5 ${activeSection === section.id
                  ? 'bg-[#FF4D00] text-black shadow-2xl border-[#FF4D00]'
                  : 'bg-[#111] text-white hover:bg-[#1a1a1a]'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <span className={activeSection === section.id ? 'text-black' : 'text-[#FF4D00]'}>
                    {section.icon}
                  </span>
                  {section.titleKey}
                </div>
                <ChevronRight size={16} className={activeSection === section.id ? 'text-black' : 'text-gray-600'} />
              </button>
            ))}
          </div>

          <div className="bg-[#111] p-8 border border-white/5 mt-8 shadow-2xl rounded-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-[#FF4D00]/10 p-4 text-[#FF4D00]">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-gray-600 font-black italic text-[8px] uppercase tracking-[0.3em] mb-1">{t('common.download', 'YÜKLƏ')}</p>
                <p className="text-white font-black italic text-[11px] uppercase tracking-tighter">{activeSection.toUpperCase()}_PROTOKOLU.PDF</p>
              </div>
            </div>
            <button className="w-full bg-[#FF4D00] text-black py-4 font-black italic text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-white transition-all transform -skew-x-12">
              <span className="transform skew-x-12 flex items-center gap-2">{t('common.download_pdf', 'PDF YÜKLƏ')} <Download size={14} /></span>
            </button>
          </div>
        </div>

        <div className="lg:w-3/4">
          <div className="bg-[#050505] text-white min-h-[600px] relative overflow-hidden group border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.5)] rounded-sm">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
              <span className="text-[250px] font-black italic leading-none select-none uppercase tracking-tighter">
                {currentSection.id}
              </span>
            </div>

            <div className="relative z-10 p-10 md:p-24">
              <div className="flex items-center gap-4 mb-16">
                <div className="w-2 h-12 bg-[#FF4D00] shadow-[0_0_15px_rgba(255,77,0,0.4)]"></div>
                <h3 className="text-5xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter leading-none">
                  {currentSection.titleKey}
                </h3>
              </div>

              <div className="space-y-16 mt-20">
                {currentSection.rules.map((rule, index) => (
                  <div key={index} className="relative pl-12 border-l border-white/5 group/rule">
                    <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 bg-[#FF4D00] shadow-[0_0_10px_rgba(255,77,0,0.3)]"></div>
                    <h4 className="text-[#FF4D00] font-black italic text-2xl uppercase tracking-tighter mb-4 group-hover/rule:text-white transition-colors">
                      {rule.subtitleKey}
                    </h4>
                    <p className="text-gray-500 font-bold italic text-sm md:text-base uppercase leading-relaxed tracking-widest max-w-3xl">
                      {rule.descKey}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesPage;
