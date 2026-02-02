import React, { createContext, useContext, useState, ReactNode } from 'react';
import usersData from '../json/users.json';
import toast from 'react-hot-toast';

// Types
export interface Driver {
    id: string;
    name: string;
    category: 'UNLIMITED' | 'LEGEND' | 'SEMI STOCK' | 'UTV';
    points: number;
    car: string;
    image?: string;
    team?: string;
}

export interface NewsItem {
    id: string;
    title: string;
    description: string;
    date: string;
    image: string;
    category: string;
    isMain?: boolean;
}

export interface EventItem {
    id: string;
    title: string;
    date: string;
    location: string;
    category: string;
    image: string;
    img?: string; // Legacy support
    description?: string;
    rules?: string;
    status: 'planned' | 'past';
}

export interface GallerySection {
    id: string;
    title: string;
    date: string;
    photos: { id: string, title: string, url: string }[];
    videos: { id: string, title: string, videoId: string, duration: string, url: string }[];
}

export interface Partner {
    id: string;
    name: string;
    url?: string;
    image: string;
}

export interface AdminSettings {
    marqueeEnabled: boolean;
    marqueeText: string;
    siteTitle: string;
    description: string;
    keywords: string;
    facebook: string;
    instagram: string;
    youtube: string;
    tiktok: string;
    address: string;
    email: string;
    phone: string;
    mapUrl: string;
}

export interface AdminUser {
    username: string;
    role: 'master' | 'secondary';
}

interface AdminContextType {
    settings: AdminSettings;
    updateSettings: (newSettings: Partial<AdminSettings>) => Promise<void>;
    drivers: Driver[];
    news: NewsItem[];
    events: EventItem[];
    gallery: GallerySection[];
    partners: Partner[];
    saveDriver: (driver: Partial<Driver>, imageFile?: File) => Promise<void>;
    deleteDriver: (id: string) => Promise<void>;
    updateDriverPoints: (id: string, points: number) => Promise<void>;
    saveNews: (item: Partial<NewsItem>, imageFile?: File) => Promise<void>;
    deleteNews: (id: string) => Promise<void>;
    saveEvent: (item: Partial<EventItem>, imageFile?: File) => Promise<void>;
    deleteEvent: (id: string) => Promise<void>;
    saveGallery: (section: Partial<GallerySection>, imageFile?: File) => Promise<void>;
    deleteGallery: (id: string) => Promise<void>;
    savePartner: (partner: Partial<Partner>, imageFile?: File) => Promise<void>;
    deletePartner: (id: string) => Promise<void>;
    currentUser: AdminUser | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<AdminSettings>({
        marqueeEnabled: true,
        marqueeText: "",
        siteTitle: "Forsaj Club Offroad",
        description: "",
        keywords: "",
        facebook: "",
        instagram: "",
        youtube: "",
        tiktok: "",
        address: "",
        email: "",
        phone: "",
        mapUrl: ""
    });
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [news, setNews] = useState<NewsItem[]>([]);
    const [events, setEvents] = useState<EventItem[]>([]);
    const [gallery, setGallery] = useState<GallerySection[]>([]);
    const [partners, setPartners] = useState<Partner[]>([]);

    // Recovery session from localStorage safely
    const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('forsaj_admin_session');
            if (saved) {
                try { return JSON.parse(saved); } catch (e) { return null; }
            }
        }
        return null;
    });

    // Initial load
    React.useEffect(() => {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        fetch('/api/settings', { headers }).then(res => res.json()).then(setSettings).catch(() => { });

        fetch('/api/drivers', { headers }).then(res => res.json()).then(data => {
            const normalized = Array.isArray(data) ? data.map((d: any) => ({ ...d, image: d.image || d.img })) : [];
            setDrivers(normalized);
        }).catch(() => { });

        fetch('/api/news', { headers }).then(res => res.json()).then(data => {
            const normalized = Array.isArray(data) ? data.map((n: any) => ({ ...n, image: n.image || n.img })) : [];
            setNews(normalized);
        }).catch(() => { });

        fetch('/api/events', { headers }).then(res => res.json()).then(data => {
            const normalized = Array.isArray(data) ? data.map((e: any) => ({ ...e, image: e.image || e.img, img: e.image || e.img })) : [];
            setEvents(normalized);
        }).catch(() => { });

        fetch('/api/gallery', { headers }).then(res => res.json()).then(data => {
            const normalized = Array.isArray(data) ? data.map((g: any) => ({ ...g, image: g.image || g.img })) : [];
            setGallery(normalized);
        }).catch(() => { });

        fetch('/api/partners', { headers }).then(res => res.json()).then(data => {
            const normalized = Array.isArray(data) ? data.map((p: any) => ({ ...p, image: p.image || p.img })) : [];
            setPartners(normalized);
        }).catch(() => { });
    }, []);

    const updateSettings = async (newSettings: Partial<AdminSettings>) => {
        const updated = { ...settings, ...newSettings };
        const res = await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated)
        });
        if (res.ok) {
            setSettings(updated);
            toast.success('Ayarlar yadda saxlanıldı');
        } else {
            toast.error('Xəta baş verdi');
        }
    };

    const saveEntity = async (entity: string, data: any, file?: File, setter?: any) => {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        if (file) formData.append('image', file);

        const res = await fetch(`/api/${entity}`, {
            method: 'POST',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
            body: formData
        });

        if (res.ok) {
            const freshData = await fetch(`/api/${entity}`).then(r => r.json());
            const normalized = Array.isArray(freshData) ? freshData.map((item: any) => ({ ...item, image: item.image || item.img, img: item.image || item.img })) : freshData;
            setter(normalized);
            toast.success('Məlumat uğurla yeniləndi');
        } else {
            const err = await res.json().catch(() => ({}));
            toast.error(err.error || 'Xəta baş verdi');
        }
    };

    const deleteEntity = async (entity: string, id: string, setter?: any) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/${entity}/${id}`, {
            method: 'DELETE',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
            const freshData = await fetch(`/api/${entity}`).then(r => r.json());
            const normalized = Array.isArray(freshData) ? freshData.map((item: any) => ({ ...item, image: item.image || item.img, img: item.image || item.img })) : freshData;
            setter(normalized);
            toast.success('Məlumat silindi');
        } else {
            toast.error('Silinərkən xəta baş verdi');
        }
    };

    const saveDriver = (data: any, file?: File) => saveEntity('drivers', data, file, setDrivers);
    const deleteDriver = (id: string) => deleteEntity('drivers', id, setDrivers);
    const updateDriverPoints = async (id: string, newPoints: number) => {
        const d = drivers.find(x => x.id === id);
        if (d) await saveDriver({ ...d, points: newPoints });
    };

    const saveNews = (data: any, file?: File) => saveEntity('news', data, file, setNews);
    const deleteNews = (id: string) => deleteEntity('news', id, setNews);

    const saveEvent = (data: any, file?: File) => saveEntity('events', data, file, setEvents);
    const deleteEvent = (id: string) => deleteEntity('events', id, setEvents);

    const saveGallery = (data: any, file?: File) => saveEntity('gallery', data, file, setGallery);
    const deleteGallery = (id: string) => deleteEntity('gallery', id, setGallery);

    const savePartner = (data: any, file?: File) => saveEntity('partners', data, file, setPartners);
    const deletePartner = (id: string) => deleteEntity('partners', id, setPartners);

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const users = await fetch('/api/users').then(res => res.json());
            const user = users.find((u: any) => u.username === username && u.password === password);
            if (user) {
                const userData: AdminUser = { username: user.username, role: user.role as 'master' | 'secondary' };
                setCurrentUser(userData);
                localStorage.setItem('forsaj_admin_session', JSON.stringify(userData));
                toast.success(`Xoş gəlmisiniz, ${user.username}!`);
                return true;
            }
            toast.error('İstifadəçi adı və ya şifrə yanlışdır');
            return false;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('forsaj_admin_session');
        toast.success('Sistemdən çıxıldı');
    };

    return (
        <AdminContext.Provider value={{
            settings, updateSettings, drivers, news, events, gallery, partners,
            saveDriver, deleteDriver, updateDriverPoints,
            saveNews, deleteNews, saveEvent, deleteEvent, saveGallery, deleteGallery,
            savePartner, deletePartner,
            currentUser, login, logout
        }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};
