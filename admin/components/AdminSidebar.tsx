import React from 'react';

interface SidebarProps {
    currentView: string;
    onViewChange: (view: string) => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : { name: 'Admin', role: 'admin' };

    const menuItems = [
        { id: 'dashboard', icon: 'fa-tachometer-alt', label: 'Panel' },
        { id: 'content', icon: 'fa-edit', label: 'Məzmun' },
        { id: 'users', icon: 'fa-user-shield', label: 'İstifadəçilər' },
        { id: 'drivers', icon: 'fa-users', label: 'Sürücülər' },
        { id: 'news', icon: 'fa-newspaper', label: 'Xəbərlər' },
        { id: 'events', icon: 'fa-calendar', label: 'Yarışlar' },
        { id: 'gallery', icon: 'fa-images', label: 'Qalereya' },
        { id: 'video_archive', icon: 'fa-video', label: 'Video Arxiv' },
        { id: 'files', icon: 'fa-folder', label: 'Fayllar' },
        { id: 'partners', icon: 'fa-handshake', label: 'Tərəfdaşlar' },
        { id: 'translations', icon: 'fa-language', label: 'Tərcümələr' },
        { id: 'settings', icon: 'fa-cogs', label: 'Ayarlar' }
    ];

    return (
        <aside className="main-sidebar sidebar-dark-primary elevation-4">
            <a href="#" className="brand-link notranslate">
                <span className="brand-text font-weight-light pl-3">Forsaj Admin</span>
            </a>

            <div className="sidebar">
                <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                    <div className="image">
                        <img src={`https://ui-avatars.com/api/?name=${user.name || 'Admin'}&background=random`} className="img-circle elevation-2" alt="User Image" />
                    </div>
                    <div className="info">
                        <a href="#" className="d-block">{user.name || 'Admin'}</a>
                    </div>
                </div>

                <nav className="mt-2">
                    <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu">
                        {menuItems.map(item => (
                            <li className="nav-item" key={item.id}>
                                <a
                                    href="#"
                                    className={`nav-link ${currentView === item.id ? 'active' : ''}`}
                                    onClick={(e) => { e.preventDefault(); onViewChange(item.id); }}
                                >
                                    <i className={`nav-icon fas ${item.icon}`}></i>
                                    <p>{item.label}</p>
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default AdminSidebar;
