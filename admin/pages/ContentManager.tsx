import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface FieldConfig {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'image' | 'number' | 'date';
}

interface ContentManagerProps {
    entity: string;
    title: string;
    fields: FieldConfig[];
}

const ContentManager: React.FC<ContentManagerProps> = ({ entity, title, fields }) => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState<any>({});

    const [file, setFile] = useState<File | null>(null);

    const apiPath = `/api/${entity}`;

    useEffect(() => {
        fetchItems();
    }, [entity]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(apiPath, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            if (res.status === 401 || res.status === 403) {
                toast.error('Giriş icazəniz yoxdur');
                setLoading(false);
                return;
            }
            const data = await res.json();
            setItems(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error('Məlumat yüklənərkən xəta baş verdi');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Bu elementi silmək istədiyinizə əminsiniz?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${apiPath}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success('Uğurla silindi');
                fetchItems();
            } else {
                toast.error('Silinmə zamanı xəta');
            }
        } catch (e) {
            toast.error('Şəbəkə xətası');
        }
    };

    const handleEdit = (item: any) => {
        setCurrentItem(item);
        setIsEditing(true);
        setShowModal(true);
        setFile(null);
    };

    const handleAddNew = () => {
        setCurrentItem({});
        setIsEditing(false);
        setShowModal(true);
        setFile(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('data', JSON.stringify(currentItem));
        if (file) {
            formData.append('image', file);
        }

        try {
            const res = await fetch(apiPath, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                toast.success(isEditing ? 'Uğurla yeniləndi' : 'Uğurla yaradıldı');
                setShowModal(false);
                fetchItems();
            } else {
                toast.error('Əməliyyat uğursuz oldu');
            }
        } catch (e) {
            toast.error('Şəbəkə xətası');
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setCurrentItem({ ...currentItem, [field]: value });
    };

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">{title} - Siyahısı</h3>
                <div className="card-tools">
                    <button className="btn btn-primary btn-sm" onClick={handleAddNew}>
                        <i className="fas fa-plus mr-1"></i> Yeni Əlavə Et
                    </button>
                </div>
            </div>
            <div className="card-body p-0">
                {loading ? (
                    <div className="text-center p-3">Yüklənir...</div>
                ) : (
                    <table className="table table-striped projects">
                        <thead>
                            <tr>
                                {fields.slice(0, 3).map(f => <th key={f.name}>{f.label}</th>)}
                                <th>Əməliyyatlar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id}>
                                    {fields.slice(0, 3).map(f => (
                                        <td key={f.name}>
                                            {f.type === 'image' ? (
                                                <img src={item[f.name]} alt="img" style={{ height: 40 }} />
                                            ) : (
                                                item[f.name]?.toString().substring(0, 50)
                                            )}
                                        </td>
                                    ))}
                                    <td>
                                        <button className="btn btn-info btn-sm mr-1" onClick={() => handleEdit(item)}>
                                            <i className="fas fa-pencil-alt"></i>
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && <tr><td colSpan={4} className="text-center">Məlumat tapılmadı</td></tr>}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">{isEditing ? 'Düzəliş Et' : 'Yeni Əlavə Et'}</h4>
                                <button type="button" className="close" onClick={() => setShowModal(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    {fields.map(f => (
                                        <div className="form-group" key={f.name}>
                                            <label>{f.label}</label>
                                            {f.type === 'textarea' ? (
                                                <div>
                                                    <textarea
                                                        className="form-control"
                                                        value={currentItem[f.name] || ''}
                                                        onChange={e => handleInputChange(f.name, e.target.value)}
                                                        rows={4}
                                                    />
                                                    <div className="mt-2 text-right">
                                                        <small className="mr-2 text-muted">Auto Translate to:</small>
                                                        {['AZ', 'EN', 'RU'].map(lang => (
                                                            <button
                                                                key={lang}
                                                                type="button"
                                                                className="btn btn-xs btn-outline-secondary mr-1"
                                                                onClick={async () => {
                                                                    if (!currentItem[f.name]) return;
                                                                    const toastId = toast.loading(`Translating to ${lang}...`);
                                                                    try {
                                                                        const res = await fetch('/api/translate', {
                                                                            method: 'POST',
                                                                            headers: { 'Content-Type': 'application/json' },
                                                                            body: JSON.stringify({ text: currentItem[f.name], targetLang: lang.toLowerCase() })
                                                                        });
                                                                        const data = await res.json();
                                                                        if (data.translatedText) {
                                                                            toast.success('Translated!', { id: toastId });
                                                                            // Here we might want to update a specific field if we had separate fields for langs,
                                                                            // but for now let's just replace the content or show it.
                                                                            // Since the user asked for "translate content", usually this implies having multi-language support.
                                                                            // But our current system is simple key-value. 
                                                                            // I'll assume they might want to just see the translation or replace it.
                                                                            // For safety, let's copy to clipboard or replace.
                                                                            if (confirm(`Replace content with ${lang} translation?\n\n${data.translatedText}`)) {
                                                                                handleInputChange(f.name, data.translatedText);
                                                                            }
                                                                        } else {
                                                                            toast.error('Failed', { id: toastId });
                                                                        }
                                                                    } catch (e) { toast.error('Error', { id: toastId }); }
                                                                }}
                                                            >
                                                                {lang}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : f.type === 'image' ? (
                                                <div>
                                                    {currentItem[f.name] && <img src={currentItem[f.name]} alt="preview" style={{ height: 100, marginBottom: 10 }} />}
                                                    <input
                                                        type="file"
                                                        className="form-control-file"
                                                        onChange={e => e.target.files && setFile(e.target.files[0])}
                                                    />
                                                </div>
                                            ) : (
                                                <input
                                                    type={f.type}
                                                    className="form-control"
                                                    value={currentItem[f.name] || ''}
                                                    onChange={e => handleInputChange(f.name, e.target.value)}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="modal-footer justify-content-between">
                                    <button type="button" className="btn btn-default" onClick={() => setShowModal(false)}>Bağla</button>
                                    <button type="submit" className="btn btn-primary">Yadda Saxla</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentManager;
