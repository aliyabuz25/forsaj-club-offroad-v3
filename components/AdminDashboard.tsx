import React, { useState, useEffect } from 'react';
import AdminLayout from '../admin/layouts/AdminLayout';
import Login from '../admin/pages/Login';
import Dashboard from '../admin/pages/Dashboard';
import ContentManager from '../admin/pages/ContentManager';
import Settings from '../admin/pages/Settings';
import FileManager from '../admin/pages/FileManager';

const AdminDashboard: React.FC = () => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [currentView, setCurrentView] = useState('dashboard');

    useEffect(() => {
        // Optional: Verify token validity via API on mount
    }, []);

    if (!token) {
        return <Login onLogin={() => setToken(localStorage.getItem('token'))} />;
    }

    const renderContent = () => {
        switch (currentView) {
            case 'dashboard': return <Dashboard onViewChange={setCurrentView} />;
            case 'content': return <ContentManager
                entity="content"
                title="Bütün Sayt Məzmunu"
                fields={[
                    { name: 'section', label: 'Bölmə', type: 'text' },
                    { name: 'key', label: 'Açar Söz (Kod üçün)', type: 'text' },
                    { name: 'value', label: 'Mətn (Azərbaycanca)', type: 'textarea' },
                    { name: 'image', label: 'Şəkil URL', type: 'image' }
                ]}
            />;
            case 'users': return <ContentManager
                entity="users"
                title="Admin İstifadəçiləri"
                fields={[
                    { name: 'name', label: 'Tam Ad', type: 'text' },
                    { name: 'username', label: 'İstifadəçi Adı', type: 'text' },
                    { name: 'role', label: 'Vəzifə (admin/editor)', type: 'text' },
                    { name: 'password', label: 'Şifrə (dəyişməmək üçün boş qoyun)', type: 'text' }
                ]}
            />;
            case 'about': return <ContentManager
                entity="about"
                title="Haqqımızda"
                fields={[
                    { name: 'title', label: 'Bölmə Başlığı', type: 'text' },
                    { name: 'image', label: 'Şəkil', type: 'image' },
                    { name: 'content', label: 'Məzmun', type: 'textarea' }
                ]}
            />;
            case 'drivers': return <ContentManager
                entity="drivers"
                title="Sürücülər"
                fields={[
                    { name: 'name', label: 'Tam Ad', type: 'text' },
                    { name: 'category', label: 'Kateqoriya (UNLIMITED/LEGEND/SEMI STOCK/UTV)', type: 'text' },
                    { name: 'points', label: 'Xal', type: 'text' },
                    { name: 'car', label: 'Avtomobil', type: 'text' },
                    { name: 'team', label: 'Komanda', type: 'text' },
                    { name: 'image', label: 'Şəkil', type: 'image' }
                ]}
            />;
            case 'news': return <ContentManager
                entity="news"
                title="Xəbərlər"
                fields={[
                    { name: 'title', label: 'Başlıq', type: 'text' },
                    { name: 'date', label: 'Tarix', type: 'date' },
                    { name: 'category', label: 'Kateqoriya', type: 'text' },
                    { name: 'image', label: 'Şəkil', type: 'image' },
                    { name: 'description', label: 'Məzmun', type: 'textarea' },
                    { name: 'isMain', label: 'Əsas Xəbər (true/false)', type: 'text' }
                ]}
            />;
            case 'events': return <ContentManager
                entity="events"
                title="Yarışlar"
                fields={[
                    { name: 'title', label: 'Yarış Adı', type: 'text' },
                    { name: 'date', label: 'Yarış Tarixi', type: 'date' },
                    { name: 'location', label: 'Məkan', type: 'text' },
                    { name: 'image', label: 'Banner', type: 'image' },
                    { name: 'description', label: 'Detallar', type: 'textarea' }
                ]}
            />;
            case 'gallery': return <ContentManager
                entity="gallery"
                title="Şəkil Qalereyası"
                fields={[
                    { name: 'title', label: 'Başlıq', type: 'text' },
                    { name: 'image', label: 'Şəkil', type: 'image' },
                    { name: 'category', label: 'Kateqoriya', type: 'text' }
                ]}
            />;
            case 'video_archive': return <ContentManager
                entity="video_archive"
                title="Video Arxiv"
                fields={[
                    { name: 'title', label: 'Video Başlığı', type: 'text' },
                    { name: 'videoUrl', label: 'YouTube Linki', type: 'text' },
                    { name: 'duration', label: 'Müddət (məs: 04:20)', type: 'text' }
                ]}
            />;
            case 'partners': return <ContentManager
                entity="partners"
                title="Tərəfdaşlar"
                fields={[
                    { name: 'name', label: 'Tərəfdaş Adı', type: 'text' },
                    { name: 'image', label: 'Loqo', type: 'image' },
                    { name: 'url', label: 'URL', type: 'text' }
                ]}
            />;
            case 'settings': return <Settings />;
            case 'files': return <FileManager />;
            case 'translations': return <ContentManager
                entity="translations"
                title="Tərcümələr"
                fields={[
                    { name: 'key', label: 'Açar', type: 'text' },
                    { name: 'AZ', label: 'Azerbaycan (AZ)', type: 'textarea' },
                    { name: 'EN', label: 'English (EN)', type: 'textarea' },
                    { name: 'RU', label: 'Russian (RU)', type: 'textarea' },
                    { name: 'TR', label: 'Turkish (TR)', type: 'textarea' }
                ]}
            />;
            default: return <div>Select a module</div>;
        }
    };

    return (
        <AdminLayout
            title={currentView.charAt(0).toUpperCase() + currentView.slice(1)}
            currentView={currentView}
            onViewChange={setCurrentView}
        >
            {/* Pass state setter to Sidebar via Context or Props? 
                AdminLayout renders Sidebar. AdminSidebar needs onViewChange.
                AdminLayout needs to accept Sidebar props or we clone element?
                Better: AdminLayout should probably manage the view or accept sidebar as prop?
                No, AdminLayout uses AdminSidebar directly in my previous code.
                I need to pass props to AdminLayout to pass to AdminSidebar.
            */}
            {/* 
                Refactoring AdminLayout to accept currentView and onViewChange 
                to pass them to Sidebar is the cleanest quick way.
                But AdminLayout is currently "hardcoded" to import AdminSidebar.
                I'll update AdminLayout to accept these props.
             */}
            {/* 
                Wait, I can't pass props to AdminSidebar if AdminLayout imports it directly 
                without AdminLayout accepting props for it.
             */}
            {renderContent()}
        </AdminLayout>
    );
};

export default AdminDashboard;
