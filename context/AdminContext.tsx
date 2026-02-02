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
        const headers: any = { 'Accept': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const safeFetch = async (url: string) => {
            try {
                const res = await fetch(url, { headers });
                if (!res.ok) return null;
                return await res.json();
            } catch (e) {
                return null;
            }
        };

        const loadContent = async () => {
            const [s, dr, nw, ev, gl, pr] = await Promise.all([
                safeFetch('/api/settings'),
                safeFetch('/api/drivers'),
                safeFetch('/api/news'),
                safeFetch('/api/events'),
                safeFetch('/api/gallery'),
                safeFetch('/api/partners')
            ]);

            if (s) setSettings(s);
            if (dr) {
                const normalized = Array.isArray(dr) ? dr.map((d: any) => ({ ...d, image: d.image || d.img })) : [];
                setDrivers(normalized);
            }
            if (nw) {
                const normalized = Array.isArray(nw) ? nw.map((n: any) => ({ ...n, image: n.image || n.img })) : [];
                setNews(normalized);
            }
            if (ev) {
                const normalized = Array.isArray(ev) ? ev.map((e: any) => ({ ...e, image: e.image || e.img, img: e.image || e.img })) : [];
                setEvents(normalized);
            }
            if (gl) setGallery(Array.isArray(gl) ? gl : []);
            if (pr) setPartners(Array.isArray(pr) ? pr : []);
        };

        loadContent();
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
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (res.ok) {
                const userData: AdminUser = { username: data.user.username, role: data.user.role };
                setCurrentUser(userData);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('forsaj_admin_session', JSON.stringify(userData));
                toast.success(`Xoş gəlmisiniz, ${data.user.name || data.user.username}!`);
                return true;
            } else {
                toast.error(data.message || 'İstifadəçi adı və ya şifrə yanlışdır');
                return false;
            }
        } catch (error) {
            console.error(error);
            toast.error('Şəbəkə xətası baş verdi');
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
