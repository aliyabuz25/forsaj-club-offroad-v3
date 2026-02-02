import React, { useState } from 'react';
import { MapPin, Phone, Mail, Instagram, Youtube, Facebook, Send, Info, ChevronDown, Clock, Map as MapIcon, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    info: '',
    direction: t('contact.dir_general', 'ÜMUMİ SORĞU'),
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.info || !formData.message) {
      toast.error(t('error.fill_all', 'Zəhmət olmasa bütün xanaları doldurun'));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.info.includes('@') ? formData.info : '',
          phone: !formData.info.includes('@') ? formData.info : '',
          subject: formData.direction,
          message: formData.message
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || t('contact.success', 'Mesajınız uğurla göndərildi!'));
        setFormData({
          name: '',
          info: '',
          direction: t('contact.dir_general', 'ÜMUMİ SORĞU'),
          message: ''
        });
      } else {
        toast.error(data.error || t('contact.error', 'Xəta baş verdi.'));
      }
    } catch (error) {
      toast.error(t('contact.network_error', 'Şəbəkə xətası baş verdi.'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen py-16 px-6 lg:px-20 text-white animate-in fade-in duration-500">
      {/* Standardized Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-20">
        <div className="flex items-start gap-4">
          <div className="w-2 h-16 bg-[#FF4D00] shadow-[0_0_15px_rgba(255,77,0,0.4)]"></div>
          <div>
            <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none text-white">
              {t('nav.contact', 'ƏLAQƏ')}
            </h2>
            <p className="text-[#FF4D00] font-black italic text-[11px] md:text-sm mt-2 uppercase tracking-[0.4em]">
              GET IN TOUCH // CONTACT CENTER
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          {/* Main Office Info */}
          <div className="lg:w-[40%] bg-[#111] border border-white/5 p-10 flex flex-col justify-between relative shadow-2xl rounded-sm">
            <div className="absolute top-8 right-10 opacity-5">
              <MapIcon size={80} className="transform rotate-12 text-white" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="bg-[#FF4D00] p-3 rounded-sm shadow-[0_0_15px_rgba(255,77,0,0.3)]">
                  <MapPin size={24} className="text-black" />
                </div>
                <h4 className="text-lg font-black italic uppercase tracking-widest">{t('contact.hq', 'BAŞ OFİS')}</h4>
              </div>

              <h3 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-2 leading-none text-white">
                AZADLIQ 102, BAKI
              </h3>
              <p className="text-[#FF4D00] font-black italic text-[10px] uppercase tracking-[0.3em] pb-8 border-b border-white/5">
                AZƏRBAYCAN // SECTOR_01
              </p>

              <div className="mt-8 flex justify-between items-center text-[10px] font-black italic uppercase tracking-widest">
                <span className="flex items-center gap-3 text-gray-500"><Clock size={14} className="text-[#FF4D00]" /> 09:00 - 18:00</span>
                <span className="text-[#25D366] flex items-center gap-2 font-black"><span className="w-2 h-2 bg-[#25D366] rounded-full animate-pulse"></span> ONLINE</span>
              </div>
            </div>

            <div className="mt-16 space-y-6">
              <div className="flex items-center gap-5 group">
                <div className="bg-white/5 p-4 text-[#FF4D00] group-hover:bg-[#FF4D00] group-hover:text-black transition-all shadow-xl">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-gray-600 font-black italic text-[8px] uppercase tracking-[0.4em] mb-1">{t('contact.phone', 'ƏLAQƏ NÖMRƏSİ')}</p>
                  <p className="text-2xl font-black italic uppercase tracking-tighter text-white">+994 50 123 45 67</p>
                </div>
              </div>

              <div className="flex items-center gap-5 group">
                <div className="bg-white/5 p-4 text-[#FF4D00] group-hover:bg-[#FF4D00] group-hover:text-black transition-all shadow-xl">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-gray-600 font-black italic text-[8px] uppercase tracking-[0.4em] mb-1">{t('contact.email', 'E-POÇT ÜNVANI')}</p>
                  <p className="text-xl font-black italic uppercase tracking-tighter text-white">PROTOCOL@FORSAJ.AZ</p>
                </div>
              </div>

              <div className="flex gap-2 pt-6">
                {[Instagram, Youtube, Facebook].map((Icon, i) => (
                  <button key={i} className="flex-1 bg-white/5 py-4 flex justify-center text-gray-500 hover:text-black hover:bg-[#FF4D00] transition-all shadow-lg border border-white/5">
                    <Icon size={20} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Department Cards */}
          <div className="lg:w-[60%] flex flex-col gap-6">
            <DepartmentCard
              title={t('contact.hq', 'BAŞ OFİS')}
              desc={t('contact.hq_desc', 'ÜMUMİ SORĞULAR VƏ İDARƏETMƏ')}
              email="HQ@FORSAJ.AZ"
              icon={<Send size={24} />}
              t={t}
            />
            <DepartmentCard
              title={t('contact.media', 'MEDİA VƏ PR')}
              desc={t('contact.media_desc', 'MƏTBUAT VƏ ƏMƏKDAŞLIQ')}
              email="PR@FORSAJ.AZ"
              icon={<Youtube size={24} />}
              t={t}
            />
            <DepartmentCard
              title={t('contact.tech', 'TEXNİKİ DƏSTƏK')}
              desc={t('contact.tech_desc', 'PİLOTLAR ÜÇÜN TEXNİKİ YARDIM')}
              email="TECH@FORSAJ.AZ"
              icon={<Info size={24} />}
              t={t}
            />
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-[#050505] text-white p-10 md:p-20 relative overflow-hidden shadow-2xl border border-white/5 mb-12 rounded-sm">
          <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-8">
            <h3 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">{t('contact.form_title', 'MÜRACİƏT FORMU')}</h3>
            <span className="bg-[#FF4D00] px-4 py-1.5 text-black font-black italic text-[10px] uppercase tracking-widest shadow-lg">STATUS: ONLINE</span>
          </div>

          <form className="space-y-10" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-gray-600 font-black italic text-[10px] uppercase tracking-[0.3em]">{t('contact.name', 'AD VƏ SOYAD')}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('contact.name_placeholder', 'AD SOYAD DAXİL EDİN')}
                  className="w-full bg-[#111] border border-white/5 text-white p-5 font-black italic text-xs uppercase outline-none focus:border-[#FF4D00] transition-colors placeholder:text-gray-800"
                />
              </div>
              <div className="space-y-3">
                <label className="text-gray-600 font-black italic text-[10px] uppercase tracking-[0.3em]">{t('contact.info', 'ƏLAQƏ VASİTƏSİ')}</label>
                <input
                  type="text"
                  name="info"
                  value={formData.info}
                  onChange={handleChange}
                  placeholder={t('contact.info_placeholder', 'TELEFON VƏ YA EMAIL')}
                  className="w-full bg-[#111] border border-white/5 text-white p-5 font-black italic text-xs uppercase outline-none focus:border-[#FF4D00] transition-colors placeholder:text-gray-800"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-gray-600 font-black italic text-[10px] uppercase tracking-[0.3em]">{t('contact.direction', 'MÜRACİƏT İSTİQAMƏTİ')}</label>
              <div className="relative">
                <select
                  name="direction"
                  value={formData.direction}
                  onChange={handleChange}
                  className="w-full bg-[#111] border border-white/5 text-white p-5 font-black italic text-xs uppercase appearance-none outline-none focus:border-[#FF4D00] transition-colors"
                >
                  <option>{t('contact.dir_general', 'ÜMUMİ SORĞU')}</option>
                  <option>{t('contact.dir_pilot', 'PİLOT QEYDİYYATI')}</option>
                  <option>{t('contact.dir_tech', 'TEXNİKİ YARDIM')}</option>
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-[#FF4D00] pointer-events-none" size={20} />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-gray-600 font-black italic text-[10px] uppercase tracking-[0.3em]">{t('contact.message', 'MESAJINIZ')}</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t('contact.message_placeholder', 'BURADA YAZIN...')}
                rows={5}
                className="w-full bg-[#111] border border-white/5 text-white p-5 font-black italic text-xs uppercase outline-none focus:border-[#FF4D00] transition-colors resize-none placeholder:text-gray-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF4D00] text-black py-6 font-black italic text-3xl uppercase tracking-tighter flex items-center justify-center gap-4 hover:bg-white transition-all transform shadow-[0_15px_40px_rgba(255,77,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={28} className="animate-spin" />
              ) : (
                <>{t('contact.send', 'MESAJI GÖNDƏR')} <Send size={28} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const DepartmentCard = ({ title, desc, email, icon, t }: { title: string, desc: string, email: string, icon: React.ReactNode, t: any }) => (
  <div className="bg-[#111] border border-white/5 p-8 flex flex-col md:flex-row items-center gap-8 group transition-all duration-500 shadow-2xl flex-grow hover:border-[#FF4D00]/40 rounded-sm">
    <div className="w-16 h-16 flex items-center justify-center bg-white/5 text-[#FF4D00] group-hover:bg-[#FF4D00] group-hover:text-black transition-all shadow-inner shrink-0">
      {icon}
    </div>
    <div className="flex-grow text-center md:text-left">
      <h4 className="text-2xl font-black italic uppercase tracking-tighter mb-1 text-white group-hover:text-[#FF4D00] transition-colors">{title}</h4>
      <p className="text-gray-600 font-black italic text-[9px] uppercase tracking-[0.3em] leading-none mb-4 group-hover:text-gray-400">{desc}</p>
      <div className="h-px bg-white/5 w-full mb-4"></div>
      <p className="text-[#FF4D00] font-black italic text-sm uppercase tracking-tighter group-hover:text-white">{email}</p>
    </div>
  </div>
);

export default ContactPage;
