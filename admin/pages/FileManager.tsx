import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const FileManager: React.FC = () => {
    const [files, setFiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/files', {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            let data: any = null;
            if (res.ok) {
                try {
                    data = await res.json();
                } catch (e) { }
            }
            setFiles(Array.isArray(data) ? data : []);
        } catch (e) {
            toast.error('Failed to load files');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        const toastId = toast.loading('Uploading...');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/files', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
            if (res.ok) {
                toast.success('Uploaded successfully', { id: toastId });
                fetchFiles();
            } else {
                toast.error('Upload failed', { id: toastId });
            }
        } catch (e) {
            toast.error('Network error', { id: toastId });
        }
    };

    const handleDelete = async (filename: string) => {
        if (!window.confirm(`Delete ${filename}?`)) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/files/${filename}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success('Deleted');
                setFiles(files.filter(f => f.name !== filename));
            } else {
                toast.error('Delete failed');
            }
        } catch (e) {
            toast.error('Network error');
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h3 className="card-title">File Manager</h3>
                <div className="card-tools">
                    <div className="btn btn-primary btn-sm btn-file">
                        <i className="fas fa-upload mr-1"></i> Upload
                        <input type="file" onChange={handleUpload} />
                    </div>
                </div>
            </div>
            <div className="card-body">
                {loading ? <p>Loading...</p> : (
                    <div className="row">
                        {files.map(f => (
                            <div className="col-md-3 col-sm-6 col-12 mb-3" key={f.name}>
                                <div className="info-box shadow-sm d-flex flex-column h-100 p-2">
                                    <div className="text-center mb-2" style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f6f9' }}>
                                        {f.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                            <img src={f.url} alt={f.name} style={{ maxHeight: '100%', maxWidth: '100%' }} />
                                        ) : (
                                            <i className="far fa-file fa-3x text-secondary"></i>
                                        )}
                                    </div>
                                    <div className="info-box-content text-truncate w-100">
                                        <span className="info-box-text" title={f.name}>{f.name}</span>
                                        <span className="info-box-number" style={{ fontSize: '0.8rem' }}>{Math.round(f.size / 1024)} KB</span>
                                    </div>
                                    <div className="mt-auto text-right">
                                        <button className="btn btn-xs btn-outline-primary mr-1" onClick={() => {
                                            navigator.clipboard.writeText(window.location.origin + f.url);
                                            toast.success('URL copied');
                                        }}>
                                            <i className="fas fa-link"></i>
                                        </button>
                                        <button className="btn btn-xs btn-outline-danger" onClick={() => handleDelete(f.name)}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {files.length === 0 && <p className="col-12 text-center text-muted">No files found.</p>}
                    </div>
                )}
            </div>
            <style>{`
                .btn-file {
                    position: relative;
                    overflow: hidden;
                }
                .btn-file input[type=file] {
                    position: absolute;
                    top: 0;
                    right: 0;
                    min-width: 100%;
                    min-height: 100%;
                    font-size: 100px;
                    text-align: right;
                    filter: alpha(opacity=0);
                    opacity: 0;
                    outline: none;
                    background: white;
                    cursor: inherit;
                    display: block;
                }
            `}</style>
        </div>
    );
};

export default FileManager;
