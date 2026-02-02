import React, { useState, useEffect } from 'react';

interface DashboardProps {
    onViewChange: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
    const [stats, setStats] = useState({
        drivers: 0,
        events: 0,
        news: 0,
        gallery: 0,
        partners: 0,
        translations: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            const safeFetch = async (url: string) => {
                try {
                    const res = await fetch(url);
                    if (!res.ok) return [];
                    const data = await res.json();
                    return Array.isArray(data) ? data : [];
                } catch (e) {
                    return [];
                }
            };

            const [d, e, n, g, p, t] = await Promise.all([
                safeFetch('/api/drivers'),
                safeFetch('/api/events'),
                safeFetch('/api/news'),
                safeFetch('/api/gallery'),
                safeFetch('/api/partners'),
                safeFetch('/api/translations'),
            ]);
            setStats({
                drivers: d.length,
                events: e.length,
                news: n.length,
                gallery: g.length,
                partners: p.length,
                translations: t.length
            });
        };
        fetchStats();
    }, []);

    return (
        <div className="row">
            <div className="col-lg-3 col-6">
                <div className="small-box bg-info">
                    <div className="inner">
                        <h3>{stats.drivers}</h3>
                        <p>Ümumi Sürücülər</p>
                    </div>
                    <div className="icon">
                        <i className="fas fa-users"></i>
                    </div>
                    <div className="small-box-footer" style={{ cursor: 'pointer' }} onClick={() => onViewChange('drivers')}>
                        Sürücüləri İdarə Et <i className="fas fa-arrow-circle-right"></i>
                    </div>
                </div>
            </div>
            <div className="col-lg-3 col-6">
                <div className="small-box bg-success">
                    <div className="inner">
                        <h3>{stats.events}</h3>
                        <p>Gələcək Yarışlar</p>
                    </div>
                    <div className="icon">
                        <i className="fas fa-calendar-alt"></i>
                    </div>
                    <div className="small-box-footer" style={{ cursor: 'pointer' }} onClick={() => onViewChange('events')}>
                        Yarışları İdarə Et <i className="fas fa-arrow-circle-right"></i>
                    </div>
                </div>
            </div>
            <div className="col-lg-3 col-6">
                <div className="small-box bg-warning">
                    <div className="inner">
                        <h3>{stats.news}</h3>
                        <p>Xəbər Məqalələri</p>
                    </div>
                    <div className="icon">
                        <i className="fas fa-newspaper"></i>
                    </div>
                    <div className="small-box-footer" style={{ cursor: 'pointer' }} onClick={() => onViewChange('news')}>
                        Xəbərləri İdarə Et <i className="fas fa-arrow-circle-right"></i>
                    </div>
                </div>
            </div>
            <div className="col-lg-3 col-6">
                <div className="small-box bg-danger">
                    <div className="inner">
                        <h3>{stats.gallery}</h3>
                        <p>Qalereya Şəkilləri</p>
                    </div>
                    <div className="icon">
                        <i className="fas fa-images"></i>
                    </div>
                    <div className="small-box-footer" style={{ cursor: 'pointer' }} onClick={() => onViewChange('gallery')}>
                        Qalereyanı İdarə Et <i className="fas fa-arrow-circle-right"></i>
                    </div>
                </div>
            </div>
            <div className="col-lg-3 col-6">
                <div className="small-box bg-primary">
                    <div className="inner">
                        <h3>{stats.partners}</h3>
                        <p>Tərəfdaşlar</p>
                    </div>
                    <div className="icon">
                        <i className="fas fa-handshake"></i>
                    </div>
                    <div className="small-box-footer" style={{ cursor: 'pointer' }} onClick={() => onViewChange('partners')}>
                        Tərəfdaşları İdarə Et <i className="fas fa-arrow-circle-right"></i>
                    </div>
                </div>
            </div>
            <div className="col-lg-3 col-6">
                <div className="small-box bg-secondary">
                    <div className="inner">
                        <h3>{stats.translations}</h3>
                        <p>Tərcümələr</p>
                    </div>
                    <div className="icon">
                        <i className="fas fa-language"></i>
                    </div>
                    <div className="small-box-footer" style={{ cursor: 'pointer' }} onClick={() => onViewChange('translations')}>
                        Tərcümələri İdarə Et <i className="fas fa-arrow-circle-right"></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
