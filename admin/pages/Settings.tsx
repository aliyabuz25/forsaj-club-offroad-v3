import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
    const [settings, setSettings] = useState({
        siteTitle: '',
        siteDescription: '',
        siteKeywords: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
        facebookUrl: '',
        instagramUrl: '',
        youtubeUrl: '',
        tiktokUrl: '',
        marqueeEnabled: true,
        marqueeText: '',
        // SMTP Settings
        smtpHost: '',
        smtpPort: '',
        smtpUser: '',
        smtpPass: '',
        smtpSecure: true,
        smtpFromEmail: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/settings', {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            if (res.ok) {
                try {
                    const data = await res.json();
                    if (data && Object.keys(data).length > 0) {
                        setSettings(prev => ({ ...prev, ...data }));
                    }
                } catch (e) { }
            }
        } catch (e) {
            toast.error('Ayarları yükləmək mümkün olmadı');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(settings)
            });

            if (res.ok) {
                toast.success('Ayarlar yadda saxlanıldı');
            } else {
                toast.error('Ayarları yadda saxlamaq mümkün olmadı');
            }
        } catch (e) {
            toast.error('Şəbəkə xətası baş verdi');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as any;
        setSettings({
            ...settings,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        });
    };

    return (
        <div className="card card-outline card-primary shadow-sm pb-5">
            <div className="card-header">
                <h3 className="card-title font-weight-bold">
                    <i className="fas fa-cogs mr-2 text-primary"></i> Ümumi Ayarlar
                </h3>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <h5 className="text-primary border-bottom pb-2 mb-3">Əsas Məlumatlar</h5>

                            <div className="form-group">
                                <label>Sayt Başlığı</label>
                                <input name="siteTitle" className="form-control" value={settings.siteTitle} onChange={handleChange} placeholder="Məs: Forsaj Club Offroad" />
                            </div>

                            <div className="form-group">
                                <label>Sayt Təsviri (SEO)</label>
                                <textarea name="siteDescription" className="form-control" rows={3} value={settings.siteDescription} onChange={handleChange} placeholder="Sayt haqqında qısa məlumat..." />
                            </div>

                            <div className="form-group">
                                <label>Açar Sözlər (Keywords)</label>
                                <input name="siteKeywords" className="form-control" value={settings.siteKeywords} onChange={handleChange} placeholder="offroad, racing, baku, forsaj..." />
                            </div>

                            <h5 className="text-primary border-bottom pb-2 mt-5 mb-3">Qaçan Sətir (Marquee)</h5>
                            <div className="custom-control custom-switch mb-3">
                                <input type="checkbox" className="custom-control-input" id="marqueeSwitch" name="marqueeEnabled" checked={settings.marqueeEnabled} onChange={handleChange} />
                                <label className="custom-control-label font-weight-bold" htmlFor="marqueeSwitch">Aktivləşdir</label>
                            </div>
                            <div className="form-group">
                                <input name="marqueeText" className="form-control" value={settings.marqueeText} onChange={handleChange} placeholder="Qaçan sətir mətni..." disabled={!settings.marqueeEnabled} />
                            </div>
                        </div>

                        <div className="col-md-6 border-left">
                            <h5 className="text-primary border-bottom pb-2 mb-3">Əlaqə Məlumatları</h5>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>E-poçt</label>
                                        <input name="contactEmail" className="form-control" value={settings.contactEmail} onChange={handleChange} placeholder="info@forsaj.az" />
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="form-group">
                                        <label>Telefon</label>
                                        <input name="contactPhone" className="form-control" value={settings.contactPhone} onChange={handleChange} placeholder="+994 -- --- -- --" />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Ünvan</label>
                                <input name="address" className="form-control" value={settings.address} onChange={handleChange} placeholder="Baku, Azerbaijan" />
                            </div>

                            <h5 className="text-primary border-bottom pb-2 mt-5 mb-3">Sosial Media Linkləri</h5>
                            <div className="row">
                                <div className="col-sm-6 mb-3">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text bg-primary text-white"><i className="fab fa-facebook-f"></i></span>
                                        </div>
                                        <input name="facebookUrl" className="form-control" value={settings.facebookUrl} onChange={handleChange} placeholder="Facebook URL" />
                                    </div>
                                </div>
                                <div className="col-sm-6 mb-3">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text bg-danger text-white"><i className="fab fa-instagram"></i></span>
                                        </div>
                                        <input name="instagramUrl" className="form-control" value={settings.instagramUrl} onChange={handleChange} placeholder="Instagram URL" />
                                    </div>
                                </div>
                                <div className="col-sm-6 mb-3">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text bg-danger text-white"><i className="fab fa-youtube"></i></span>
                                        </div>
                                        <input name="youtubeUrl" className="form-control" value={settings.youtubeUrl} onChange={handleChange} placeholder="YouTube URL" />
                                    </div>
                                </div>
                                <div className="col-sm-6 mb-3">
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text bg-dark text-white"><i className="fab fa-tiktok"></i></span>
                                        </div>
                                        <input name="tiktokUrl" className="form-control" value={settings.tiktokUrl} onChange={handleChange} placeholder="TikTok URL" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-5">
                        <div className="col-12">
                            <h5 className="text-warning border-bottom pb-2 mb-3">SMTP Mail Ayarları</h5>
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label>SMTP Host</label>
                                        <input name="smtpHost" className="form-control" value={settings.smtpHost} onChange={handleChange} placeholder="smtp.gmail.com" />
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="form-group">
                                        <label>Port</label>
                                        <input name="smtpPort" className="form-control" value={settings.smtpPort} onChange={handleChange} placeholder="465" />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group pt-4 mt-2">
                                        <div className="custom-control custom-switch">
                                            <input type="checkbox" className="custom-control-input" id="smtpSecure" name="smtpSecure" checked={settings.smtpSecure} onChange={handleChange} />
                                            <label className="custom-control-label" htmlFor="smtpSecure">Secure (SSL/TLS)</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label>Göndərən Mail (From)</label>
                                        <input name="smtpFromEmail" className="form-control" value={settings.smtpFromEmail} onChange={handleChange} placeholder="noreply@forsaj.az" />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>İstifadəçi Adı (Mail)</label>
                                        <input name="smtpUser" className="form-control" value={settings.smtpUser} onChange={handleChange} placeholder="mail@example.com" />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Şifrə</label>
                                        <input name="smtpPass" type="password" className="form-control" value={settings.smtpPass} onChange={handleChange} placeholder="••••••••" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-footer bg-white border-top text-right">
                    <button type="submit" className="btn btn-primary px-5 font-weight-bold" disabled={loading}>
                        {loading ? 'Yadda saxlanılır...' : 'Ayarları Yadda Saxla'}
                    </button>
                </div>
            </form>

            <style>{`
                .btn-primary {
                    background-color: #FF4D00 !important;
                    border-color: #FF4D00 !important;
                }
                .text-primary {
                    color: #FF4D00 !important;
                }
                .card-primary.card-outline {
                    border-top: 3px solid #FF4D00;
                }
            `}</style>
        </div>
    );
};

export default Settings;
