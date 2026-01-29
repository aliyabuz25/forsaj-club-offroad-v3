import React, { useState, useEffect } from 'react';
import { useAdmin, Driver, NewsItem, EventItem, GallerySection, Partner } from '../context/AdminContext';
import { useLanguage } from '../context/LanguageContext';
import {
    Settings, Users, LogOut, Check, X, Edit2, Save, Plus, Trash2,
    Globe, Image as ImageIcon, Newspaper, Calendar, LayoutGrid, PlusCircle,
    LayoutDashboard, Info, Home, Search, ChevronRight, Menu, Bell, Mail,
    Camera, Video, Link, Facebook, Instagram, Youtube, Phone, MapPin, Handshake, ShieldAlert
} from 'lucide-react';

const AdminStyles = () => (
    <style dangerouslySetInnerHTML={{
        __html: `
        .admin-page .main-sidebar { background-color: #1e2229 !important; }
        .admin-page .brand-link { background-color: #1e2229 !important; border-bottom: 1px solid #2e353f !important; }
        .admin-page .nav-sidebar .nav-link.active { background-color: #007bff !important; border-left: 3px solid #00d1ff !important; box-shadow: 0 4px 10px rgba(0,123,255,0.3) !important; }
        .admin-page .content-wrapper { background-color: #f4f6f9 !important; }
        .admin-page .card { border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05) !important; }
        .admin-page .table thead th { border-top: 0; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; color: #6c757d; }
        .admin-page .user-panel img { border: 2px solid #3f474e; }
        .admin-page .badge-light-info { background: #e1f5fe !important; color: #01579b !important; }
        .admin-page .badge-light-success { background: #e8f5e9 !important; color: #1b5e20 !important; }
        .admin-page .badge-light-warning { background: #fff3e0 !important; color: #e65100 !important; }
        .admin-page .badge-tag { padding: 4px 8px !important; border-radius: 4px !important; font-weight: 800 !important; font-size: 0.65rem !important; }
        .admin-page .nav-sidebar .nav-link { display: flex !important; align-items: center !important; padding: 0.8rem 1rem !important; white-space: nowrap !important; }
        .admin-page .nav-sidebar .nav-link .nav-icon { display: flex !important; align-items: center !important; justify-content: center !important; width: 30px !important; margin-right: 0.5rem !important; flex-shrink: 0 !important; }
        .admin-page .nav-sidebar .nav-link p { margin: 0 !important; flex: 1 !important; overflow: hidden !important; text-overflow: ellipsis !important; }
        .admin-page .info-box { display: flex !important; align-items: center !important; }
        .admin-page .info-box-icon { display: flex !important; align-items: center !important; justify-content: center !important; width: 60px !important; height: 60px !important; flex-shrink: 0 !important; }
        .admin-page .info-box-content { padding-left: 1rem !important; }
        .admin-page .main-header { border-bottom: 1px solid #dee2e6 !important; }
        .admin-page .user-panel .image { line-height: 1 !important; display: flex !important; align-items: center !important; justify-content: center !important; }
        .admin-page .btn-logout { 
            border: 1px solid #dc3545; 
            color: #dc3545; 
            border-radius: 20px; 
            padding: 4px 15px; 
            font-size: 0.85rem; 
            transition: all 0.2s;
        }
        .admin-page .btn-logout:hover { 
            background-color: #dc3545; 
            color: white !important; 
        }
    `}} />
);

const AdminDashboard: React.FC = () => {
    const {
        settings, updateSettings, drivers, saveDriver, deleteDriver,
        news, saveNews, deleteNews,
        events, saveEvent, deleteEvent,
        gallery, saveGallery, deleteGallery,
        partners, savePartner, deletePartner,
        currentUser, logout, login
    } = useAdmin();

    const { translations, updateTranslation } = useLanguage();
    const [activeTab, setActiveTab] = useState<'dashboard' | 'settings' | 'drivers' | 'news' | 'events' | 'gallery' | 'words' | 'partners' | 'about' | 'rules' | 'contact' | 'home'>('dashboard');
    const [loginData, setLoginData] = useState({ username: '', password: '' });

    // Modals
    const [editingDriver, setEditingDriver] = useState<Partial<Driver> | null>(null);
    const [editingNews, setEditingNews] = useState<Partial<NewsItem> | null>(null);
    const [editingEvent, setEditingEvent] = useState<Partial<EventItem> | null>(null);
    const [editingGallery, setEditingGallery] = useState<Partial<GallerySection> | null>(null);
    const [editingPartner, setEditingPartner] = useState<Partial<Partner> | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await login(loginData.username, loginData.password);
        if (!success) alert('Giriş alınmadı: Yanlış istifadəçi adı və ya şifrə');
    };

    // Initialize AdminLTE and handle Body classes
    useEffect(() => {
        // Apply AdminLTE required classes to body
        if (currentUser) {
            document.body.classList.add('hold-transition', 'sidebar-mini', 'layout-fixed', 'admin-page');
            document.body.classList.remove('bg-[#0A0A0A]', 'text-white');
        } else {
            document.body.classList.remove('hold-transition', 'sidebar-mini', 'layout-fixed', 'admin-page');
            document.body.classList.add('bg-[#0A0A0A]', 'text-white');
        }

        if (currentUser && (window as any).$ && (window as any).adminlte) {
            (window as any).$('[data-widget="treeview"]').Treeview('init');
            (window as any).$('[data-widget="pushmenu"]').PushMenu('init');
        }

        return () => {
            document.body.classList.remove('sidebar-mini', 'layout-fixed', 'admin-page');
        };
    }, [currentUser]);

    if (!currentUser) {
        return (
            <div className="login-page admin-page bg-dark" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1541890289-b86df5bafd81?q=80&w=2000) center/cover no-repeat' }}>
                <div className="login-box">
                    <div className="login-logo text-white mb-4 animate_animated animate_fadeInDown">
                        <div className="d-flex align-items-center justify-content-center">
                            <img src="/logo.png" alt="Forsaj Logo" className="mr-3" style={{ height: 60, filter: 'drop-shadow(0 0 10px rgba(255,77,0,0.5))' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                            <a href="#" className="text-white"><b className="text-primary italic-extra-bold" style={{ fontSize: '2.5rem' }}>FORSAJ</b> <span className="font-weight-light" style={{ fontSize: '1.2rem', letterSpacing: '2px' }}>CMS</span></a>
                        </div>
                    </div>
                    <div className="card shadow-lg border-0 bg-white elevation-5 login-card-container overflow-hidden" style={{ borderRadius: '1rem' }}>
                        <div className="card-header bg-primary text-center py-3 border-0">
                            <h4 className="mb-0 font-weight-black text-uppercase tracking-widest" style={{ fontSize: '0.9rem' }}>İDARƏETMƏ SİSTEMİ</h4>
                        </div>
                        <div className="card-body login-card-body rounded p-5">
                            <p className="login-box-msg font-weight-bold tracking-widest text-muted uppercase-xs mb-4">MƏXFİ GİRİŞ</p>
                            <form onSubmit={handleLogin}>
                                <div className="input-group mb-4 shadow-sm">
                                    <input type="text" placeholder="İstifadəçi Adı" className="form-control border-right-0" style={{ height: '50px', background: '#f8f9fa' }} value={loginData.username} onChange={(e) => setLoginData({ ...loginData, username: e.target.value })} />
                                    <div className="input-group-append">
                                        <div className="input-group-text bg-light border-left-0">
                                            <Users size={18} className="text-primary" />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-group mb-4 shadow-sm">
                                    <input type="password" placeholder="Şifrə" className="form-control border-right-0" style={{ height: '50px', background: '#f8f9fa' }} value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
                                    <div className="input-group-append">
                                        <div className="input-group-text bg-light border-left-0">
                                            <span className="fas fa-lock text-primary"></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-4">
                                    <div className="col-12">
                                        <button type="submit" className="btn btn-primary btn-block btn-flat font-weight-bold py-3 shadow-lg text-uppercase tracking-widest" style={{ borderRadius: '8px' }}>DAXİL OL</button>
                                    </div>
                                </div>
                            </form>
                            <div className="text-center mt-5">
                                <small className="text-muted tracking-widest font-weight-bold uppercase-xs">© 2026 Forsaj Club v3.0 / Azerbaijan</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <AdminStyles />
            <div className="wrapper">
                {/* Navbar */}
                <nav className="main-header navbar navbar-expand navbar-white navbar-light border-bottom-0 shadow-sm">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" data-widget="pushmenu" href="#" role="button"><Menu size={18} /></a>
                        </li>
                        <li className="nav-item d-none d-sm-inline-block">
                            <a href="/" className="nav-link">Sayta Bax</a>
                        </li>
                    </ul>

                </nav>

                {/* Sidebar */}
                <aside className="main-sidebar sidebar-dark-primary elevation-4">
                    <a href="#" className="brand-link border-bottom-0 text-center py-3">
                        <span className="brand-text font-weight-light font-weight-bold tracking-tighter" style={{ fontSize: '1.4rem' }}>FORSAJ<span className="text-primary">CMS</span></span>
                    </a>

                    <div className="sidebar px-2">


                        <nav className="mt-2 text-sm">
                            <ul className="nav nav-pills nav-sidebar flex-column nav-flat nav-child-indent" data-widget="treeview" role="menu">
                                <MenuItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={18} />} label="Dashboard" />
                                <div className="nav-header text-uppercase text-muted" style={{ fontSize: '0.65rem', padding: '20px 1rem 10px' }}>SAYT MENECMENTİ</div>
                                <MenuItem active={activeTab === 'news'} onClick={() => setActiveTab('news')} icon={<Newspaper size={18} />} label="Xəbərlər" />
                                <MenuItem active={activeTab === 'events'} onClick={() => setActiveTab('events')} icon={<Calendar size={18} />} label="Tədbirlər" />
                                <MenuItem active={activeTab === 'drivers'} onClick={() => setActiveTab('drivers')} icon={<Users size={18} />} label="Sürücülər" />
                                <MenuItem active={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} icon={<LayoutGrid size={18} />} label="Qalereya" />
                                <MenuItem active={activeTab === 'partners'} onClick={() => setActiveTab('partners')} icon={<Handshake size={18} />} label="Tərəfdaşlar" />
                                <div className="nav-header text-uppercase text-muted" style={{ fontSize: '0.65rem', padding: '20px 1rem 10px' }}>SƏHİFƏLƏR</div>
                                <MenuItem active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home size={18} />} label="Ana Səhifə" />
                                <MenuItem active={activeTab === 'about'} onClick={() => setActiveTab('about')} icon={<Info size={18} />} label="Haqqımızda" />
                                <MenuItem active={activeTab === 'rules'} onClick={() => setActiveTab('rules')} icon={<ShieldAlert size={18} />} label="Qaydalar" />
                                <MenuItem active={activeTab === 'contact'} onClick={() => setActiveTab('contact')} icon={<Mail size={18} />} label="Əlaqə" />
                                <div className="nav-header text-uppercase text-muted" style={{ fontSize: '0.65rem', padding: '20px 1rem 10px' }}>SİSTEM</div>
                                <MenuItem active={activeTab === 'words'} onClick={() => setActiveTab('words')} icon={<Globe size={18} />} label="Sözlər (CMS)" />
                                <MenuItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={18} />} label="Sayt Ayarları" />
                                <li className="nav-item mt-4">
                                    <a onClick={(e) => { e.preventDefault(); logout(); }} href="#" className="nav-link text-danger border border-danger-light rounded">
                                        <div className="nav-icon"><LogOut size={18} /></div>
                                        <p className="font-weight-bold">SİSTEMDƏN ÇIXIŞ</p>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </aside>

                <div className="content-wrapper">
                    {/* Content Header */}
                    <div className="content-header py-4">
                        <div className="container-fluid">
                            <div className="row mb-2">
                                <div className="col-12 text-center text-md-left">
                                    <h1 className="m-0 font-weight-black tracking-tight text-uppercase" style={{ fontSize: '1.6rem' }}>
                                        {activeTab === 'dashboard' && 'Dashboard'}
                                        {activeTab === 'news' && 'Xəbərlər'}
                                        {activeTab === 'events' && 'Tədbirlər'}
                                        {activeTab === 'drivers' && 'Sürücülər'}
                                        {activeTab === 'gallery' && 'Qalereya'}
                                        {activeTab === 'partners' && 'Tərəfdaşlar'}
                                        {activeTab === 'home' && 'Ana Səhifə'}
                                        {activeTab === 'about' && 'Haqqımızda'}
                                        {activeTab === 'rules' && 'Qaydalar'}
                                        {activeTab === 'contact' && 'Əlaqə'}
                                        {activeTab === 'words' && 'Dil Ayarları'}
                                        {activeTab === 'settings' && 'Ayarlar'}
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <section className="content">
                        <div className="container-fluid">
                            {activeTab === 'dashboard' && (
                                <>
                                    <div className="row">
                                        <InfoBox color="info" icon={<Newspaper size={24} />} title="Xəbərlər" value={news.length} />
                                        <InfoBox color="success" icon={<Users size={24} />} title="Sürücülər" value={drivers.length} />
                                        <InfoBox color="warning" icon={<Calendar size={24} />} title="Tədbirlər" value={events.length} />
                                        <InfoBox color="danger" icon={<LayoutGrid size={24} />} title="Qalereya" value={gallery.length} />
                                    </div>
                                    <div className="row mt-4">
                                        <div className="col-12">
                                            <div className="card shadow-sm border-0 bg-white">
                                                <div className="card-header border-bottom-0 pt-4 px-4 bg-white">
                                                    <h3 className="card-title font-weight-bold"><LayoutDashboard size={18} className="mr-2 text-primary" /> Son Aktivlik</h3>
                                                </div>
                                                <div className="card-body p-0">
                                                    <div className="table-responsive">
                                                        <table className="table table-hover mb-0 lh-1">
                                                            <thead className="thead-light">
                                                                <tr>
                                                                    <th className="font-weight-bold uppercase-xs" style={{ fontSize: '0.7rem' }}>Tarix</th>
                                                                    <th className="font-weight-bold uppercase-xs" style={{ fontSize: '0.7rem' }}>Mövzu</th>
                                                                    <th className="font-weight-bold uppercase-xs" style={{ fontSize: '0.7rem' }}>Növ</th>
                                                                    <th className="font-weight-bold uppercase-xs text-right" style={{ fontSize: '0.7rem' }}>Status</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {news.slice(0, 3).map(n => (
                                                                    <tr key={n.id}>
                                                                        <td><small className="text-muted">{n.date}</small></td>
                                                                        <td><span className="font-weight-bold text-sm text-dark">{n.title}</span></td>
                                                                        <td><span className="badge badge-tag badge-light-info uppercase-xs">XƏBƏR</span></td>
                                                                        <td className="text-right text-success"><Check size={14} /></td>
                                                                    </tr>
                                                                ))}
                                                                {events.slice(0, 3).map(e => (
                                                                    <tr key={e.id}>
                                                                        <td><small className="text-muted">{e.date}</small></td>
                                                                        <td><span className="font-weight-bold text-sm text-dark">{e.title}</span></td>
                                                                        <td><span className="badge badge-tag badge-light-warning uppercase-xs">TƏDBİR</span></td>
                                                                        <td className="text-right text-success"><Check size={14} /></td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-4">
                                        <div className="col-md-6">
                                            <div className="card shadow-sm border-0 bg-white">
                                                <div className="card-body p-4">
                                                    <h4 className="font-weight-black uppercase-xs mb-4">Forsaj CMS v3</h4>
                                                    <p className="opacity-80 text-sm mb-4">Siz hal-hazırda ən son admin paneli versiyasından istifadə edirsiniz. Sistem tam yenilənib.</p>
                                                    <button className="btn btn-outline-light btn-pill btn-sm border-2 font-weight-bold px-4">YENİLİKLƏR</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="info-box bg-light shadow-sm mb-3">
                                                <span className="info-box-icon text-primary"><Search size={24} /></span>
                                                <div className="info-box-content">
                                                    <span className="info-box-text text-muted uppercase-xs font-weight-bold" style={{ fontSize: '0.65rem' }}>SEO Reytinqi</span>
                                                    <span className="info-box-number font-weight-black h4 text-primary">84%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === 'news' && <NewsSection items={news} onEdit={setEditingNews} onDelete={deleteNews} onAdd={() => setEditingNews({ title: '', category: '', description: '', date: new Date().toISOString().split('T')[0], isMain: false })} />}
                            {activeTab === 'events' && <EventsSection items={events} onEdit={setEditingEvent} onDelete={deleteEvent} onAdd={() => setEditingEvent({ title: '', location: '', date: '', category: '', status: 'planned', description: '', rules: '' })} />}
                            {activeTab === 'drivers' && <DriversSection items={drivers} onEdit={setEditingDriver} onDelete={deleteDriver} onAdd={() => setEditingDriver({ name: '', points: 0, category: 'UNLIMITED', team: '', car: '' })} />}
                            {activeTab === 'gallery' && <GallerySectionUI items={gallery} onEdit={setEditingGallery} onDelete={deleteGallery} onAdd={() => setEditingGallery({ title: '', date: '', photos: [], videos: [] })} />}
                            {activeTab === 'partners' && <PartnersSection items={partners} onEdit={setEditingPartner} onDelete={deletePartner} onAdd={() => setEditingPartner({ name: '', url: '' })} />}
                            {activeTab === 'home' && <PageSection title="Ana Səhifə" keys={['hero.title_1', 'hero.title_2', 'hero.desc', 'news.subtitle', 'common.all']} translations={translations} onUpdate={updateTranslation} />}
                            {activeTab === 'about' && <PageSection title="Haqqımızda" keys={['aboutTitle', 'aboutSubtitle', 'aboutHeroText', 'aboutDescription', 'missionTitle', 'missionDescription', 'visionTitle', 'visionDescription', 'targetText', 'visionGoal', 'valuesHeader', 'valuesTitle']} translations={translations} onUpdate={updateTranslation} />}
                            {activeTab === 'rules' && <PageSection title="Qaydalar" keys={['rules.title', 'rules.subtitle', 'rules.pilot_protocol', 'rules.technical_norms', 'rules.safety_rules', 'rules.eco_responsibility']} translations={translations} onUpdate={updateTranslation} />}
                            {activeTab === 'contact' && <PageSection title="Əlaqə" keys={['contact.title', 'contact.subtitle', 'contact.form_name', 'contact.form_email', 'contact.form_message', 'contact.send_button']} translations={translations} onUpdate={updateTranslation} />}
                            {activeTab === 'words' && <WordsSection translations={translations} onUpdate={updateTranslation} />}
                            {activeTab === 'settings' && <SettingsSection settings={settings} onUpdate={updateSettings} isMaster={currentUser.role === 'master'} />}
                        </div>
                    </section>
                </div>

                <footer className="main-footer text-sm">
                    <strong>Copyright &copy; 2026 Forsaj Club.</strong> Bütün hüquqlar qorunur.
                    <div className="float-right d-none d-sm-inline-block">
                        <b>Version</b> 3.0.0 (AdminLTE)
                    </div>
                </footer>
            </div>

            {/* Modals */}
            {editingDriver && <DriverModal driver={editingDriver} onClose={() => setEditingDriver(null)} onSave={saveDriver} />}
            {editingNews && <NewsModal item={editingNews} onClose={() => setEditingNews(null)} onSave={saveNews} />}
            {editingEvent && <EventModal item={editingEvent} onClose={() => setEditingEvent(null)} onSave={saveEvent} />}
            {editingGallery && <GalleryModal item={editingGallery} onClose={() => setEditingGallery(null)} onSave={saveGallery} />}
            {editingPartner && <PartnerModal partner={editingPartner} onClose={() => setEditingPartner(null)} onSave={savePartner} />}
        </>
    );
};

// --- COMPONENTS ---

const MenuItem: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
    <li className="nav-item">
        <a onClick={(e) => { e.preventDefault(); onClick(); }} href="#" className={`nav-link border-left-3 ${active ? 'active bg-primary elevation-2 border-left-info' : ''}`}>
            <span className="nav-icon">{icon}</span>
            <p>{label}</p>
        </a>
    </li>
);

const InfoBox: React.FC<{ color: string, icon: React.ReactNode, title: string, value: number | string }> = ({ color, icon, title, value }) => (
    <div className="col-12 col-sm-6 col-md-3">
        <div className="info-box shadow-sm mb-3">
            <span className={`info-box-icon bg-${color} elevation-1`}>{icon}</span>
            <div className="info-box-content">
                <span className="info-box-text text-uppercase text-muted font-weight-bold" style={{ fontSize: '0.7rem' }}>{title}</span>
                <span className="info-box-number font-weight-bold h4">{value}</span>
            </div>
        </div>
    </div>
);

const PageSection: React.FC<{ title: string, keys: string[], translations: any, onUpdate: any }> = ({ title, keys, translations, onUpdate }) => {
    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-bottom-0 pt-4 px-4">
                <h3 className="card-title font-weight-bold">{title} Səhifəsi Mətnləri</h3>
            </div>
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="thead-light">
                            <tr>
                                <th style={{ width: '20%' }}>Mətn Key</th>
                                <th>AZ (Azərbaycan)</th>
                                <th>EN (English)</th>
                                <th>RU (Русский)</th>
                                <th className="text-right" style={{ width: 120 }}>Yadda Saxla</th>
                            </tr>
                        </thead>
                        <tbody>
                            {keys.map(key => (
                                <TranslationRow key={key} k={key} val={translations[key] || { AZ: '', EN: '', RU: '' }} onUpdate={onUpdate} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const TranslationRow: React.FC<{ k: string, val: any, onUpdate: any }> = ({ k, val, onUpdate }) => {
    const [vals, setVals] = useState(val);
    useEffect(() => { setVals(val); }, [val]);
    const isChanged = JSON.stringify(vals) !== JSON.stringify(val);
    return (
        <tr>
            <td className="align-middle">
                <div className="text-xs font-weight-bold text-muted font-monospace">{k}</div>
            </td>
            <td><textarea className="form-control form-control-sm border-0 bg-light" rows={2} style={{ fontSize: '0.85rem' }} value={vals.AZ} onChange={e => setVals({ ...vals, AZ: e.target.value })} /></td>
            <td><textarea className="form-control form-control-sm border-0 bg-light" rows={2} style={{ fontSize: '0.85rem' }} value={vals.EN} onChange={e => setVals({ ...vals, EN: e.target.value })} /></td>
            <td><textarea className="form-control form-control-sm border-0 bg-light" rows={2} style={{ fontSize: '0.85rem' }} value={vals.RU} onChange={e => setVals({ ...vals, RU: e.target.value })} /></td>
            <td className="text-right align-middle">
                <button
                    onClick={() => onUpdate(k, vals)}
                    className={`btn btn-xs shadow-sm ${!isChanged ? 'btn-outline-secondary disabled' : 'btn-primary'}`}
                >
                    <Save size={12} className="mr-1" /> Saxla
                </button>
            </td>
        </tr>
    );
};

// --- SECTIONS ---

const NewsSection: React.FC<{ items: NewsItem[], onEdit: any, onDelete: any, onAdd: any }> = ({ items, onEdit, onDelete, onAdd }) => (
    <div className="card shadow-sm border-0">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h3 className="card-title font-weight-bold">Xəbərlər Siyahısı</h3>
            <div className="card-tools ml-auto">
                <button onClick={onAdd} className="btn btn-primary btn-sm"><Plus size={14} className="mr-1" /> Yeni Xəbər</button>
            </div>
        </div>
        <div className="card-body p-0">
            <div className="table-responsive">
                <table className="table table-hover table-striped mb-0">
                    <thead className="thead-light">
                        <tr>
                            <th style={{ width: 80 }}>Şəkil</th>
                            <th>Başlıq</th>
                            <th>Kateqoriya</th>
                            <th>Tarix</th>
                            <th>Status</th>
                            <th className="text-right">Əməliyyatlar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id}>
                                <td><img src={item.image} className="img-thumbnail" style={{ width: 50, height: 50, objectFit: 'cover' }} /></td>
                                <td className="font-weight-bold">{item.title}</td>
                                <td><span className="badge badge-secondary">{item.category}</span></td>
                                <td>{item.date}</td>
                                <td>{item.isMain ? <span className="badge badge-success">Əsas</span> : <span className="badge badge-light">Normal</span>}</td>
                                <td className="text-right">
                                    <button onClick={() => onEdit(item)} className="btn btn-info btn-xs mr-1"><Edit2 size={12} /></button>
                                    <button onClick={() => confirm('Silinsin?') && onDelete(item.id)} className="btn btn-danger btn-xs"><Trash2 size={12} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const DriversSection: React.FC<{ items: Driver[], onEdit: any, onDelete: any, onAdd: any }> = ({ items, onEdit, onDelete, onAdd }) => (
    <div className="card shadow-sm border-0">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h3 className="card-title font-weight-bold">Sürücü Reytinqi</h3>
            <div className="card-tools ml-auto">
                <button onClick={onAdd} className="btn btn-primary btn-sm"><Plus size={14} className="mr-1" /> Yeni Sürücü</button>
            </div>
        </div>
        <div className="card-body p-0">
            <div className="table-responsive">
                <table className="table table-hover table-striped mb-0">
                    <thead className="thead-light">
                        <tr>
                            <th style={{ width: 60 }}>Avatar</th>
                            <th>Ad Soyad</th>
                            <th>Maşın</th>
                            <th>Kateqoriya</th>
                            <th>Xal</th>
                            <th className="text-right">Əməliyyatlar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(d => (
                            <tr key={d.id}>
                                <td><img src={d.image} className="rounded-circle border" style={{ width: 40, height: 40, objectFit: 'cover' }} /></td>
                                <td className="font-weight-bold">{d.name}</td>
                                <td>{d.car}</td>
                                <td><span className={`badge badge-outline-primary`}>{d.category}</span></td>
                                <td className="font-weight-bold text-primary">{d.points}</td>
                                <td className="text-right">
                                    <button onClick={() => onEdit(d)} className="btn btn-info btn-xs mr-1"><Edit2 size={12} /></button>
                                    <button onClick={() => confirm('Silinsin?') && onDelete(d.id)} className="btn btn-danger btn-xs"><Trash2 size={12} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const EventsSection: React.FC<{ items: EventItem[], onEdit: any, onDelete: any, onAdd: any }> = ({ items, onEdit, onDelete, onAdd }) => (
    <div className="row">
        {items.map(event => (
            <div key={event.id} className="col-md-4">
                <div className="card card-outline card-primary shadow-sm border-0 mb-4 overflow-hidden">
                    <img src={event.img} className="card-img-top" style={{ height: 180, objectFit: 'cover' }} />
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <h5 className="card-title font-weight-bold text-truncate" style={{ maxWidth: '70%' }}>{event.title}</h5>
                            <span className={`badge badge-${event.status === 'planned' ? 'success' : 'secondary shadow-sm'}`}>
                                {event.status === 'planned' ? 'Gələcək' : 'Bitib'}
                            </span>
                        </div>
                        <p className="card-text text-muted small"><MapPin size={12} className="mr-1" /> {event.location} // {event.date}</p>
                        <div className="mt-4 pt-3 border-top d-flex justify-content-between">
                            <span className="text-xs text-uppercase font-weight-bold text-muted">{event.category}</span>
                            <div>
                                <button onClick={() => onEdit(event)} className="btn btn-link text-info btn-xs"><Edit2 size={14} /></button>
                                <button onClick={() => confirm('Silinsin?') && onDelete(event.id)} className="btn btn-link text-danger btn-xs"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ))}
        <div className="col-md-4">
            <div onClick={onAdd} className="card border-dashed shadow-none d-flex align-items-center justify-content-center text-muted" style={{ height: 350, border: '2px dashed #ddd', cursor: 'pointer', background: 'transparent' }}>
                <div className="text-center">
                    <Plus size={48} className="mb-2" />
                    <p className="font-weight-bold">Yeni Tədbir Əlavə Et</p>
                </div>
            </div>
        </div>
    </div>
);

const GallerySectionUI: React.FC<{ items: GallerySection[], onEdit: any, onDelete: any, onAdd: any }> = ({ items, onEdit, onDelete, onAdd }) => (
    <div className="row">
        {items.map(g => (
            <div key={g.id} className="col-md-6">
                <div className="card shadow-sm mb-4">
                    <div className="card-header d-flex justify-content-between align-items-center bg-white border-bottom-0 pt-4 px-4">
                        <div>
                            <h4 className="card-title font-weight-black text-uppercase h5 mb-0">{g.title}</h4>
                            <small className="text-muted">{g.date}</small>
                        </div>
                        <div className="ml-auto">
                            <button onClick={() => onEdit(g)} className="btn btn-info btn-xs mr-1"><Edit2 size={12} /></button>
                            <button onClick={() => confirm('Silinsin?') && onDelete(g.id)} className="btn btn-danger btn-xs"><Trash2 size={12} /></button>
                        </div>
                    </div>
                    <div className="card-body p-4">
                        <div className="row g-2">
                            {g.photos.slice(0, 4).map((p, i) => (
                                <div key={i} className="col-3">
                                    <img src={p.url} className="img-fluid rounded border shadow-sm" style={{ aspectRatio: '1/1', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 text-xs font-weight-bold text-uppercase text-muted d-flex gap-3">
                            <span><Camera size={12} className="mr-1" /> {g.photos.length} Şəkil</span>
                            <span className="ml-3"><Video size={12} className="mr-1" /> {g.videos.length} Video</span>
                        </div>
                    </div>
                </div>
            </div>
        ))}
        <div className="col-md-6">
            <div onClick={onAdd} className="card border-dashed shadow-none d-flex align-items-center justify-content-center text-muted mb-4" style={{ height: 215, border: '2px dashed #ddd', cursor: 'pointer', background: 'transparent' }}>
                <div className="text-center">
                    <PlusCircle size={40} className="mb-2" />
                    <p className="font-weight-bold">Yeni Ekspedisiya</p>
                </div>
            </div>
        </div>
    </div>
);

const PartnersSection: React.FC<{ items: Partner[], onEdit: any, onDelete: any, onAdd: any }> = ({ items, onEdit, onDelete, onAdd }) => (
    <div className="card shadow-sm border-0">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
            <h3 className="card-title font-weight-bold">Tərəfdaşlar Siyahısı</h3>
            <div className="card-tools ml-auto">
                <button onClick={onAdd} className="btn btn-primary btn-sm"><Plus size={14} className="mr-1" /> Yeni Tərəfdaş</button>
            </div>
        </div>
        <div className="card-body p-0">
            <div className="table-responsive">
                <table className="table table-hover table-striped mb-0">
                    <thead className="thead-light">
                        <tr>
                            <th style={{ width: 80 }}>Loqo</th>
                            <th>Ad</th>
                            <th>Link</th>
                            <th className="text-right">Əməliyyatlar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(p => (
                            <tr key={p.id}>
                                <td><img src={p.image} className="img-thumbnail" style={{ width: 50, height: 50, objectFit: 'contain' }} /></td>
                                <td className="font-weight-bold">{p.name}</td>
                                <td>{p.url ? <a href={p.url} target="_blank" className="text-info">{p.url}</a> : '-'}</td>
                                <td className="text-right">
                                    <button onClick={() => onEdit(p)} className="btn btn-info btn-xs mr-1"><Edit2 size={12} /></button>
                                    <button onClick={() => confirm('Silinsin?') && onDelete(p.id)} className="btn btn-danger btn-xs"><Trash2 size={12} /></button>
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && <tr><td colSpan={4} className="text-center py-4 text-muted">Hələ tərəfdaş əlavə edilməyib</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

const WordsSection: React.FC<{ translations: any, onUpdate: any }> = ({ translations, onUpdate }) => {
    const [search, setSearch] = useState('');
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editValues, setEditValues] = useState({ AZ: '', EN: '', RU: '' });

    const filteredKeys = Object.keys(translations).filter(key =>
        key.toLowerCase().includes(search.toLowerCase()) ||
        translations[key].AZ.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-white border-bottom-0 pt-4 px-4">
                <div className="row align-items-center">
                    <div className="col-md-4">
                        <h3 className="card-title font-weight-bold">Saytın Tərcümələri (i18n)</h3>
                    </div>
                    <div className="col-md-8 text-right d-flex align-items-center justify-content-end">
                        <button
                            className="btn btn-primary btn-sm mr-3 font-weight-bold"
                            onClick={() => {
                                const key = prompt('Yeni key daxil edin (məs: section.title):');
                                if (key) {
                                    if (translations[key]) {
                                        alert('Bu key artıq mövcuddur!');
                                        return;
                                    }
                                    onUpdate(key, { AZ: '', EN: '', RU: '' });
                                }
                            }}
                        >
                            <Plus size={14} className="mr-1" /> YENİ KEY
                        </button>
                        <div className="input-group input-group-sm ml-auto" style={{ maxWidth: 300 }}>
                            <input type="text" placeholder="Key və ya söz axtar..." className="form-control" value={search} onChange={e => setSearch(e.target.value)} />
                            <div className="input-group-append">
                                <span className="input-group-text"><Search size={14} /></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover mb-0">
                        <thead className="thead-light">
                            <tr>
                                <th style={{ width: '15%' }}>ID / Key</th>
                                <th style={{ width: '25%' }}>AZ (Azərbaycan)</th>
                                <th style={{ width: '25%' }}>EN (English)</th>
                                <th style={{ width: '25%' }}>RU (Русский)</th>
                                <th className="text-right" style={{ width: 100 }}>Əməliyyat</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredKeys.map(key => (
                                <tr key={key} className={editingKey === key ? 'bg-light' : ''}>
                                    <td className="font-weight-bold text-xs text-muted font-monospace">{key}</td>
                                    <td>
                                        {editingKey === key ?
                                            <textarea className="form-control form-control-sm" value={editValues.AZ} onChange={e => setEditValues({ ...editValues, AZ: e.target.value })} /> :
                                            <span className="text-sm">{translations[key].AZ}</span>
                                        }
                                    </td>
                                    <td>
                                        {editingKey === key ?
                                            <textarea className="form-control form-control-sm" value={editValues.EN} onChange={e => setEditValues({ ...editValues, EN: e.target.value })} /> :
                                            <span className="text-sm">{translations[key].EN}</span>
                                        }
                                    </td>
                                    <td>
                                        {editingKey === key ?
                                            <textarea className="form-control form-control-sm" value={editValues.RU} onChange={e => setEditValues({ ...editValues, RU: e.target.value })} /> :
                                            <span className="text-sm">{translations[key].RU}</span>
                                        }
                                    </td>
                                    <td className="text-right">
                                        {editingKey === key ? (
                                            <>
                                                <button onClick={() => { onUpdate(key, editValues); setEditingKey(null); }} className="btn btn-success btn-xs mr-1"><Save size={12} /></button>
                                                <button onClick={() => setEditingKey(null)} className="btn btn-secondary btn-xs"><X size={12} /></button>
                                            </>
                                        ) : (
                                            <button onClick={() => { setEditingKey(key); setEditValues(translations[key]); }} className="btn btn-info btn-xs"><Edit2 size={12} /></button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const SettingsSection: React.FC<{ settings: any, onUpdate: any, isMaster: boolean }> = ({ settings, onUpdate, isMaster }) => (
    <div className="row">
        {/* General Settings */}
        <div className="col-md-12">
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-primary text-white">
                    <h3 className="card-title font-weight-bold"><Search size={16} className="mr-2" /> SEO & Meta Ayarlar</h3>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6 form-group">
                            <label className="font-weight-bold">Site Başlığı (Site Title)</label>
                            <input type="text" className="form-control" value={settings.siteTitle} onChange={e => onUpdate({ siteTitle: e.target.value })} />
                        </div>
                        <div className="col-md-6 form-group">
                            <label className="font-weight-bold">Açarsözlər (Keywords)</label>
                            <input type="text" className="form-control" placeholder="offroad, racing, club..." value={settings.keywords} onChange={e => onUpdate({ keywords: e.target.value })} />
                        </div>
                        <div className="col-12 form-group">
                            <label className="font-weight-bold">Site Təsviri (Description)</label>
                            <textarea className="form-control" rows={3} value={settings.description} onChange={e => onUpdate({ description: e.target.value })} />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Marquee Settings */}
        <div className="col-md-6">
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-info text-white">
                    <h3 className="card-title font-weight-bold"><Info size={16} className="mr-2" /> Canlı Elan Zolağı (Marquee)</h3>
                </div>
                <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                        <div className="custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
                            <input type="checkbox" className="custom-control-input" id="marqueeSwitch" checked={settings.marqueeEnabled} onChange={e => onUpdate({ marqueeEnabled: e.target.checked })} />
                            <label className="custom-control-label" htmlFor="marqueeSwitch">Marquee Aktivdir</label>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="font-weight-bold">Elan Mətni</label>
                        <textarea className="form-control" rows={3} value={settings.marqueeText} onChange={e => onUpdate({ marqueeText: e.target.value })} />
                    </div>
                </div>
            </div>
        </div>

        {/* Social & Contact */}
        <div className="col-md-6">
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-success text-white">
                    <h3 className="card-title font-weight-bold"><Phone size={16} className="mr-2" /> Sosial Media & Əlaqə</h3>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-sm table-borderless mb-0">
                            <tbody>
                                <SettingsInput icon={<Facebook size={14} />} label="Facebook" value={settings.facebook} onChange={v => onUpdate({ facebook: v })} />
                                <SettingsInput icon={<Instagram size={14} />} label="Instagram" value={settings.instagram} onChange={v => onUpdate({ instagram: v })} />
                                <SettingsInput icon={<Youtube size={14} />} label="Youtube" value={settings.youtube} onChange={v => onUpdate({ youtube: v })} />
                                <SettingsInput icon={<Phone size={14} />} label="Telefon" value={settings.phone} onChange={v => onUpdate({ phone: v })} />
                                <SettingsInput icon={<Mail size={14} />} label="Email" value={settings.email} onChange={v => onUpdate({ email: v })} />
                                <SettingsInput icon={<MapPin size={14} />} label="Ünvan" value={settings.address} onChange={v => onUpdate({ address: v })} />
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const SettingsInput: React.FC<{ icon: any, label: string, value: string, onChange: (v: string) => void }> = ({ icon, label, value, onChange }) => (
    <tr className="border-bottom">
        <td className="align-middle px-3 py-2 text-muted" style={{ width: 40 }}>{icon}</td>
        <td className="align-middle font-weight-bold py-2" style={{ width: 100 }}>{label}</td>
        <td className="py-2 pr-3">
            <input type="text" className="form-control form-control-sm border-0 bg-light" value={value || ''} onChange={e => onChange(e.target.value)} />
        </td>
    </tr>
);

// --- MODAL WRAPPER ---

const ModalWrapper: React.FC<{ title: string, onClose: () => void, onSave: () => void, children: React.ReactNode }> = ({ title, onClose, onSave, children }) => (
    <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)' }}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg px-2">
                <div className="modal-header border-bottom-0 pt-4 pb-0">
                    <h5 className="modal-title font-weight-black text-uppercase tracking-tighter" style={{ fontSize: '1.4rem' }}>{title}</h5>
                    <button type="button" className="close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>
                <div className="modal-body py-4">
                    {children}
                </div>
                <div className="modal-footer border-top-0 pb-4">
                    <button type="button" className="btn btn-secondary px-4 mr-2" onClick={onClose}>Ləğv Et</button>
                    <button type="button" className="btn btn-primary px-5 shadow-sm font-weight-bold" onClick={onSave}>YADDA SAXLA</button>
                </div>
            </div>
        </div>
    </div>
);

// --- SPECIFIC MODALS ---

const DriverModal: React.FC<{ driver: Partial<Driver>, onClose: () => void, onSave: any }> = ({ driver, onClose, onSave }) => {
    const [data, setData] = useState(driver);
    const [file, setFile] = useState<File | null>(null);
    return (
        <ModalWrapper title={driver.id ? "Sürücü Redaktə" : "Yeni Sürücü"} onClose={onClose} onSave={() => onSave(data, file)}>
            <div className="row">
                <div className="col-md-6 form-group">
                    <label className="font-weight-bold">Ad Soyad</label>
                    <input type="text" className="form-control" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />
                </div>
                <div className="col-md-6 form-group">
                    <label className="font-weight-bold">Kateqoriya</label>
                    <select className="form-control" value={data.category} onChange={e => setData({ ...data, category: e.target.value as any })}>
                        <option value="UNLIMITED">UNLIMITED</option>
                        <option value="LEGEND">LEGEND</option>
                        <option value="SEMI STOCK">SEMI STOCK</option>
                        <option value="UTV">UTV</option>
                    </select>
                </div>
                <div className="col-md-4 form-group">
                    <label className="font-weight-bold">Xal</label>
                    <input type="number" className="form-control" value={data.points} onChange={e => setData({ ...data, points: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="col-md-8 form-group">
                    <label className="font-weight-bold">Avtomobil</label>
                    <input type="text" className="form-control" value={data.car} onChange={e => setData({ ...data, car: e.target.value })} />
                </div>
                <div className="col-12 form-group">
                    <label className="font-weight-bold">Sürücü Şəkli</label>
                    <div className="d-flex align-items-center bg-light p-3 rounded border">
                        <img src={data.image || 'https://via.placeholder.com/80'} className="rounded border mr-3" style={{ width: 80, height: 80, objectFit: 'cover' }} />
                        <div className="custom-file">
                            <input type="file" className="custom-file-input" id="driverImg" onChange={e => setFile(e.target.files?.[0] || null)} />
                            <label className="custom-file-label" htmlFor="driverImg">{file ? file.name : 'Yeni şəkil seçin...'}</label>
                        </div>
                    </div>
                </div>
            </div>
        </ModalWrapper>
    );
};

const NewsModal: React.FC<{ item: Partial<NewsItem>, onClose: () => void, onSave: any }> = ({ item, onClose, onSave }) => {
    const [data, setData] = useState(item);
    const [file, setFile] = useState<File | null>(null);
    return (
        <ModalWrapper title="Xəbər Redaktə" onClose={onClose} onSave={() => onSave(data, file)}>
            <div className="row">
                <div className="col-12 form-group">
                    <label className="font-weight-bold">Başlıq</label>
                    <input type="text" className="form-control" value={data.title} onChange={e => setData({ ...data, title: e.target.value })} />
                </div>
                <div className="col-md-6 form-group">
                    <label className="font-weight-bold">Kateqoriya</label>
                    <input type="text" className="form-control" value={data.category} onChange={e => setData({ ...data, category: e.target.value })} />
                </div>
                <div className="col-md-6 form-group">
                    <label className="font-weight-bold">Tarix</label>
                    <input type="date" className="form-control" value={data.date} onChange={e => setData({ ...data, date: e.target.value })} />
                </div>
                <div className="col-12 form-group">
                    <label className="font-weight-bold">Mətn</label>
                    <textarea className="form-control" rows={6} value={data.description} onChange={e => setData({ ...data, description: e.target.value })} />
                </div>
                <div className="col-md-6 form-group">
                    <div className="custom-control custom-checkbox mt-2">
                        <input type="checkbox" className="custom-control-input" id="isMainNews" checked={data.isMain} onChange={e => setData({ ...data, isMain: e.target.checked })} />
                        <label className="custom-control-label font-weight-bold" htmlFor="isMainNews">Əsas Xəbər Kimi Göstər</label>
                    </div>
                </div>
                <div className="col-12 form-group">
                    <label className="font-weight-bold">Xəbər Şəkli</label>
                    <div className="d-flex align-items-center bg-light p-3 rounded border">
                        <img src={data.image || 'https://via.placeholder.com/120x80'} className="rounded border mr-3 shadow-sm" style={{ width: 120, height: 80, objectFit: 'cover' }} />
                        <div className="custom-file">
                            <input type="file" className="custom-file-input" id="newsImg" onChange={e => setFile(e.target.files?.[0] || null)} />
                            <label className="custom-file-label" htmlFor="newsImg">{file ? file.name : 'Yeni şəkil seçin...'}</label>
                        </div>
                    </div>
                </div>
            </div>
        </ModalWrapper>
    );
};

const EventModal: React.FC<{ item: Partial<EventItem>, onClose: () => void, onSave: any }> = ({ item, onClose, onSave }) => {
    const [data, setData] = useState(item);
    const [file, setFile] = useState<File | null>(null);
    return (
        <ModalWrapper title="Tədbir Redaktə" onClose={onClose} onSave={() => onSave(data, file)}>
            <div className="row">
                <div className="col-md-8 form-group">
                    <label className="font-weight-bold">Tədbir Adı</label>
                    <input type="text" className="form-control" value={data.title} onChange={e => setData({ ...data, title: e.target.value })} />
                </div>
                <div className="col-md-4 form-group">
                    <label className="font-weight-bold">Status</label>
                    <select className="form-control" value={data.status} onChange={e => setData({ ...data, status: e.target.value as any })}>
                        <option value="planned">GƏLƏCƏK</option>
                        <option value="past">BİTİB</option>
                    </select>
                </div>
                <div className="col-md-6 form-group">
                    <label className="font-weight-bold">Məkan</label>
                    <input type="text" className="form-control" value={data.location} onChange={e => setData({ ...data, location: e.target.value })} />
                </div>
                <div className="col-md-3 form-group">
                    <label className="font-weight-bold">Tarix</label>
                    <input type="date" className="form-control" value={data.date} onChange={e => setData({ ...data, date: e.target.value })} />
                </div>
                <div className="col-md-3 form-group">
                    <label className="font-weight-bold">Kateqoriya</label>
                    <input type="text" className="form-control" value={data.category} onChange={e => setData({ ...data, category: e.target.value })} />
                </div>
                <div className="col-12 form-group">
                    <label className="font-weight-bold">Təsvir</label>
                    <textarea className="form-control" rows={3} value={data.description} onChange={e => setData({ ...data, description: e.target.value })} />
                </div>
                <div className="col-12 form-group">
                    <label className="font-weight-bold">Qaydalar & Detallar (Hər sətr bir bənd)</label>
                    <textarea className="form-control" rows={4} value={data.rules} onChange={e => setData({ ...data, rules: e.target.value })} placeholder="Qeydiyyat haqqı: 50 AZN\nKaska vacibdir..." />
                </div>
                <div className="col-12 form-group mb-0">
                    <label className="font-weight-bold">Poster / Şəkil</label>
                    <div className="d-flex align-items-center bg-light p-3 rounded border">
                        <img src={data.img || 'https://via.placeholder.com/120x80'} className="rounded border mr-3 shadow-sm" style={{ width: 120, height: 80, objectFit: 'cover' }} />
                        <div className="custom-file">
                            <input type="file" className="custom-file-input" id="eventImg" onChange={e => setFile(e.target.files?.[0] || null)} />
                            <label className="custom-file-label" htmlFor="eventImg">{file ? file.name : 'Yeni şəkil seçin...'}</label>
                        </div>
                    </div>
                </div>
            </div>
        </ModalWrapper>
    );
};

const GalleryModal: React.FC<{ item: Partial<GallerySection>, onClose: () => void, onSave: any }> = ({ item, onClose, onSave }) => {
    const [data, setData] = useState(item);

    const addPhoto = () => {
        const url = prompt('Şəkil URL-i daxil edin:');
        if (url) {
            setData({
                ...data,
                photos: [...(data.photos || []), { id: Date.now().toString(), title: '', url }]
            });
        }
    };

    const addVideo = () => {
        const id = prompt('Youtube Video ID daxil edin (məs: dQw4w9WgXcQ):');
        if (id) {
            setData({
                ...data,
                videos: [...(data.videos || []), { id: Date.now().toString(), title: '', videoId: id, duration: '', url: `https://www.youtube.com/watch?v=${id}` }]
            });
        }
    };

    const removePhoto = (id: string) => {
        setData({ ...data, photos: data.photos?.filter(p => p.id !== id) });
    };

    const removeVideo = (id: string) => {
        setData({ ...data, videos: data.videos?.filter(v => v.id !== id) });
    };

    return (
        <ModalWrapper title="Qalereya & Ekspedisiya Redaktə" onClose={onClose} onSave={() => onSave(data)}>
            <div className="row">
                <div className="col-md-9 form-group">
                    <label className="font-weight-bold uppercase-xs">Ekspedisiya Başlığı</label>
                    <input type="text" className="form-control" value={data.title} onChange={e => setData({ ...data, title: e.target.value })} />
                </div>
                <div className="col-md-3 form-group">
                    <label className="font-weight-bold uppercase-xs">Tarix / İl</label>
                    <input type="text" className="form-control" value={data.date} onChange={e => setData({ ...data, date: e.target.value })} />
                </div>

                <div className="col-12 mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <label className="font-weight-bold text-primary mb-0"><Camera size={16} className="mr-1" /> Şəkillər ({data.photos?.length || 0})</label>
                        <button type="button" onClick={addPhoto} className="btn btn-outline-primary btn-xs"><Plus size={12} /> Əlavə Et</button>
                    </div>
                    <div className="row g-2 bg-light p-3 rounded border" style={{ maxHeight: 250, overflowY: 'auto' }}>
                        {data.photos?.map(p => (
                            <div key={p.id} className="col-md-3 mb-2 position-relative">
                                <img src={p.url} className="img-thumbnail w-100" style={{ aspectRatio: '1/1', objectFit: 'cover' }} />
                                <button onClick={() => removePhoto(p.id)} className="btn btn-danger btn-xs position-absolute shadow-sm" style={{ top: 5, right: 10 }}><X size={10} /></button>
                            </div>
                        ))}
                        {(!data.photos || data.photos.length === 0) && <div className="col-12 text-center text-muted py-4">Hələ şəkil əlavə edilməyib</div>}
                    </div>
                </div>

                <div className="col-12 mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <label className="font-weight-bold text-danger mb-0"><Video size={16} className="mr-1" /> Videolar ({data.videos?.length || 0})</label>
                        <button type="button" onClick={addVideo} className="btn btn-outline-danger btn-xs"><Plus size={12} /> Əlavə Et</button>
                    </div>
                    <div className="row g-2 bg-light p-3 rounded border" style={{ maxHeight: 250, overflowY: 'auto' }}>
                        {data.videos?.map(v => (
                            <div key={v.id} className="col-md-4 mb-2">
                                <div className="card shadow-sm border-0 mb-0">
                                    <div className="position-relative">
                                        <img src={`https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg`} className="card-img-top rounded-top" />
                                        <button onClick={() => removeVideo(v.id)} className="btn btn-danger btn-xs position-absolute shadow-sm" style={{ top: 5, right: 5 }}><X size={10} /></button>
                                    </div>
                                    <div className="card-body p-2 text-center">
                                        <small className="font-weight-bold text-xs">ID: {v.videoId}</small>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {(!data.videos || data.videos.length === 0) && <div className="col-12 text-center text-muted py-4">Hələ video əlavə edilməyib</div>}
                    </div>
                </div>
            </div>
        </ModalWrapper>
    );
};

const PartnerModal: React.FC<{ partner: Partial<Partner>, onClose: () => void, onSave: any }> = ({ partner, onClose, onSave }) => {
    const [data, setData] = useState(partner);
    const [file, setFile] = useState<File | null>(null);
    return (
        <ModalWrapper title={partner.id ? "Tərəfdaş Redaktə" : "Yeni Tərəfdaş"} onClose={onClose} onSave={() => onSave(data, file)}>
            <div className="row">
                <div className="col-12 form-group">
                    <label className="font-weight-bold">Tərəfdaş Adı</label>
                    <input type="text" className="form-control" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />
                </div>
                <div className="col-12 form-group">
                    <label className="font-weight-bold">Vebsayt Linki (URL)</label>
                    <input type="text" className="form-control" placeholder="https://example.com" value={data.url} onChange={e => setData({ ...data, url: e.target.value })} />
                </div>
                <div className="col-12 form-group mb-0">
                    <label className="font-weight-bold">Tərəfdaş Loqosu</label>
                    <div className="d-flex align-items-center bg-light p-3 rounded border">
                        <img src={data.image || 'https://via.placeholder.com/100x100?text=Logo'} className="rounded border mr-3 shadow-sm" style={{ width: 80, height: 80, objectFit: 'contain', background: '#fff' }} />
                        <div className="custom-file">
                            <input type="file" className="custom-file-input" id="partnerLogo" onChange={e => setFile(e.target.files?.[0] || null)} />
                            <label className="custom-file-label" htmlFor="partnerLogo">{file ? file.name : 'Yeni loqo seçin...'}</label>
                        </div>
                    </div>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default AdminDashboard;
