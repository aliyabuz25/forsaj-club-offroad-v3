import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
    const [settings, setSettings] = useState({
        siteTitle: '',
        siteDescription: '',
        contactEmail: '',
        contactPhone: '',
        facebookUrl: '',
        instagramUrl: '',
        youtubeUrl: '',
        address: ''
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
            const data = await res.json();
            if (data && Object.keys(data).length > 0) {
                setSettings(prev => ({ ...prev, ...data }));
            }
        } catch (e) {
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
                toast.success('Settings updated');
            } else {
                toast.error('Failed to update settings');
            }
        } catch (e) {
            toast.error('Network error');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    return (
        <div className="card card-primary">
            <div className="card-header">
                <h3 className="card-title">Ümumi Ayarlar</h3>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="card-body">
                    <div className="form-group">
                        <label>Sayt Başlığı</label>
                        <input name="siteTitle" className="form-control" value={settings.siteTitle} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Sayt Təsviri (SEO)</label>
                        <textarea name="siteDescription" className="form-control" rows={3} value={settings.siteDescription} onChange={handleChange} />
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <div className="form-group">
                                <label>Əlaqə E-poçtu</label>
                                <input name="contactEmail" className="form-control" value={settings.contactEmail} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <label>Əlaqə Telefonu</label>
                                <input name="contactPhone" className="form-control" value={settings.contactPhone} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Ünvan</label>
                        <input name="address" className="form-control" value={settings.address} onChange={handleChange} />
                    </div>

                    <h5 className="mt-4 mb-3">Sosial Media</h5>
                    <div className="row">
                        <div className="col-4">
                            <div className="form-group">
                                <label>Facebook URL</label>
                                <input name="facebookUrl" className="form-control" value={settings.facebookUrl} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="form-group">
                                <label>Instagram URL</label>
                                <input name="instagramUrl" className="form-control" value={settings.instagramUrl} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="form-group">
                                <label>YouTube URL</label>
                                <input name="youtubeUrl" className="form-control" value={settings.youtubeUrl} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-footer">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Yadda saxlanılır...' : 'Ayarları Yadda Saxla'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;
