import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [needsSetup, setNeedsSetup] = useState(false);

    useEffect(() => {
        checkSetupStatus();
    }, []);

    const checkSetupStatus = async () => {
        try {
            const res = await fetch('/api/auth/setup-status');
            if (res.ok) {
                const data = await res.json();
                if (data.initialized === false) {
                    setNeedsSetup(true);
                }
            }
        } catch (error) {
            console.error('Failed to check setup status', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const endpoint = needsSetup ? '/api/auth/setup' : '/api/login';
        const payload = needsSetup ? { username, password, name } : { username, password };

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            let data: any = {};
            try {
                data = await res.json();
            } catch (e) {
                data = { message: 'Server xətası' };
            }
            if (res.ok) {
                if (needsSetup) {
                    toast.success('Admin hesabı yaradıldı! İndi daxil olun.');
                    setNeedsSetup(false);
                    setPassword('');
                } else {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    toast.success('Xoş gəldiniz!');
                    onLogin();
                }
            } else {
                toast.error(data.message || 'Xəta baş verdi');
            }
        } catch (error) {
            toast.error('Şəbəkə xətası baş verdi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="hold-transition login-page bg-light">
            <div className="login-box">
                <div className="login-logo notranslate">
                    <a href="/"><b>Forsaj</b> Club</a>
                </div>
                <div className="card shadow-lg">
                    <div className="card-body login-card-body rounded">
                        <p className="login-box-msg font-weight-bold uppercase">
                            {needsSetup ? 'İLK QEYDİYYAT' : 'Admin Girişi'}
                        </p>

                        <form onSubmit={handleSubmit}>
                            {needsSetup && (
                                <div className="input-group mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ad Soyad"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                    <div className="input-group-append">
                                        <div className="input-group-text">
                                            <span className="fas fa-id-card"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="İstifadəçi adı"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-user"></span>
                                    </div>
                                </div>
                            </div>
                            <div className="input-group mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Şifrə"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-lock"></span>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-12">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-block py-2 font-weight-bold"
                                        disabled={loading}
                                    >
                                        {loading ? 'Gözləyin...' : (needsSetup ? 'QEYDİYYATDAN KEÇ' : 'DAXİL OL')}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                .login-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                }
                .login-card-body {
                    padding: 40px !important;
                }
                .btn-primary {
                    background-color: #FF4D00 !important;
                    border-color: #FF4D00 !important;
                    transition: all 0.3s ease;
                }
                .btn-primary:hover {
                    background-color: #e64500 !important;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(255, 77, 0, 0.2);
                }
                .card {
                    border: none;
                    border-radius: 12px;
                }
                .login-logo b {
                    color: #FF4D00;
                }
            `}</style>
        </div>
    );
};

export default Login;
