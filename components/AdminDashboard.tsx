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
            case 'dashboard': return <Dashboard />;
            case 'content': return <ContentManager
                entity="translations"
                title="Sayt Məzmunu (Tərcümələr)"
                fields={[
                    { name: 'key', label: 'Məzmun Açar Sözü', type: 'text' },
                    { name: 'AZ', label: 'Azərbaycanca (AZ)', type: 'textarea' },
                    { name: 'EN', label: 'İngiliscə (EN)', type: 'textarea' },
                    { name: 'RU', label: 'Rusca (RU)', type: 'textarea' }
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
                    { name: 'name', label: 'Ad', type: 'text' },
                    { name: 'car', label: 'Maşın Modeli', type: 'text' },
                    { name: 'image', label: 'Şəkil', type: 'image' },
                    { name: 'description', label: 'Təsvir', type: 'textarea' }
                ]}
            />;
            case 'news': return <ContentManager
                entity="news"
                title="Xəbərlər"
                fields={[
                    { name: 'title', label: 'Başlıq', type: 'text' },
                    { name: 'date', label: 'Tarix', type: 'date' },
                    { name: 'image', label: 'Şəkil', type: 'image' },
                    { name: 'content', label: 'Məzmun', type: 'textarea' }
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
                title="Qalereya"
                fields={[
                    { name: 'title', label: 'Başlıq', type: 'text' },
                    { name: 'image', label: 'Şəkil', type: 'image' },
                    { name: 'category', label: 'Kateqoriya', type: 'text' }
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
                title="Translations"
                fields={[
                    { name: 'key', label: 'Key', type: 'text' },
                    { name: 'AZ', label: 'Azeri (AZ)', type: 'textarea' },
                    { name: 'EN', label: 'English (EN)', type: 'textarea' },
                    { name: 'RU', label: 'Russian (RU)', type: 'textarea' }
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
