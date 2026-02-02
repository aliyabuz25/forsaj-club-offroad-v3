
import React, { useState } from 'react';
import Marquee from './components/Marquee';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import NewsPage from './components/NewsPage';
import EventsPage from './components/EventsPage';
import DriversPage from './components/DriversPage';
import RulesPage from './components/RulesPage';
import ContactPage from './components/ContactPage';
import GalleryPage from './components/GalleryPage';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import SEO from './components/SEO';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'about' | 'news' | 'events' | 'drivers' | 'rules' | 'contact' | 'gallery' | 'admin'>('home');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Simple routing for admin
  React.useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') setCurrentView('admin');
      else if (currentView === 'admin') setCurrentView('home');
    };
    window.addEventListener('hashchange', handleHash);
    if (window.location.hash === '#admin') setCurrentView('admin');
    return () => window.removeEventListener('hashchange', handleHash);
  }, [currentView]);

  const handleViewChange = (view: 'home' | 'about' | 'news' | 'events' | 'drivers' | 'rules' | 'contact' | 'gallery' | 'admin', category: string | null = null) => {
    setCurrentView(view);
    setActiveCategory(category);
    window.scrollTo(0, 0);
    // Remove hash if navigating away from admin
    if (view !== 'admin' && window.location.hash === '#admin') {
      window.history.pushState("", document.title, window.location.pathname + window.location.search);
    }
  };

  if (currentView === 'admin') {
    return <AdminDashboard />;
  }


  const getPageTitle = () => {
    switch (currentView) {
      case 'about': return 'Haqqımızda';
      case 'news': return 'Xəbərlər';
      case 'events': return 'Yarışlar & Tədbirlər';
      case 'drivers': return 'Sürücülər & Reytinqlər';
      case 'rules': return 'Qaydalar';
      case 'contact': return 'Əlaqə';
      case 'gallery': return 'Qalereya & Media';
      default: return 'Offroad & Motorsport Azerbaijan';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title={getPageTitle()}
        url={`https://forsaj.az/${currentView !== 'home' ? currentView : ''}`}
      />
      <Marquee />
      <Navbar currentView={currentView} onViewChange={(view) => handleViewChange(view, null)} />
      <main className="flex-grow">
        {currentView === 'home' && <Home onViewChange={(view, cat) => handleViewChange(view, cat || null)} />}
        {currentView === 'about' && <About />}
        {currentView === 'news' && <NewsPage onViewChange={(view) => handleViewChange(view, null)} />}
        {currentView === 'events' && <EventsPage onViewChange={(view) => handleViewChange(view, null)} />}
        {currentView === 'drivers' && <DriversPage initialCategoryId={activeCategory} />}
        {currentView === 'rules' && <RulesPage />}
        {currentView === 'contact' && <ContactPage />}
        {currentView === 'gallery' && <GalleryPage onViewChange={(view) => handleViewChange(view, null)} />}
      </main>
      <Footer onViewChange={(view) => handleViewChange(view, null)} />
    </div>
  );
};

export default App;
