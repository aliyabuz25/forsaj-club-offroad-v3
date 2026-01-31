import React from 'react';

const AdminNavbar: React.FC = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.hash = ''; // Return to home
        window.location.reload();
    };

    return (
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars"></i></a>
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
