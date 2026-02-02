import React from 'react';

interface AdminNavbarProps {
    onToggleSidebar: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ onToggleSidebar }) => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.hash = ''; // Return to home
        window.location.reload();
    };

    return (
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <button className="nav-link border-0 bg-transparent" onClick={(e) => { e.preventDefault(); onToggleSidebar(); }} role="button"><i className="fas fa-bars"></i></button>
                </li>
            </ul>

            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt mr-2"></i>Logout
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default AdminNavbar;
