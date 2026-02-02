import React, { ReactNode } from 'react';
import '../../admin/assets/adminlte-custom.css'; // We might need to copy/link this or import from node_modules
import AdminNavbar from '../components/AdminNavbar';
import AdminSidebar from '../components/AdminSidebar';
import AdminFooter from '../components/AdminFooter';

// Import AdminLTE CSS directly from node_modules if possible, otherwise we rely on global import
import 'admin-lte/dist/css/adminlte.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

interface AdminLayoutProps {
    children: ReactNode;
    title: string;
    currentView: string;
    onViewChange: (view: string) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, currentView, onViewChange }) => {
    // AdminLTE requires body class 'sidebar-mini layout-fixed' usually.
    // We can add it on mount and remove on unmount.
    const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    React.useEffect(() => {
        if (isSidebarCollapsed) {
            document.body.classList.add('sidebar-collapse');
            document.body.classList.remove('sidebar-open');
        } else {
            document.body.classList.remove('sidebar-collapse');
            document.body.classList.add('sidebar-open');
        }
    }, [isSidebarCollapsed]);

    React.useEffect(() => {
        document.body.classList.add('sidebar-mini', 'layout-fixed', 'admin-page');
        return () => {
            document.body.classList.remove('sidebar-mini', 'layout-fixed', 'admin-page', 'sidebar-collapse', 'sidebar-open');
        };
    }, []);

    return (
        <div className="wrapper">
            <AdminNavbar onToggleSidebar={toggleSidebar} />
            <AdminSidebar currentView={currentView} onViewChange={onViewChange} />

            <div className="content-wrapper">
                <section className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1>{title}</h1>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="content">
                    <div className="container-fluid">
                        {children}
                    </div>
                </section>
            </div>

            <AdminFooter />
        </div>
    );
};

export default AdminLayout;
