import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                toast.success('Xoş gəldiniz!');
                onLogin();
            } else {
                toast.error(data.message || 'Giriş uğursuz oldu');
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
                <div className="login-logo">
                    <a href="/"><b>Forsaj</b> Club</a>
                </div>
                <div className="card shadow-lg">
                    <div className="card-body login-card-body rounded">
                        <p className="login-box-msg font-weight-bold uppercase">Admin Girişi</p>

                        <form onSubmit={handleSubmit}>
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
                                        {loading ? 'Yoxlanılır...' : 'DAXİL OL'}
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
                }
                .login-card-body {
                    padding: 40px !important;
                }
                .btn-primary {
                    background-color: #FF4D00 !important;
                    border-color: #FF4D00 !important;
                }
                .btn-primary:hover {
                    background-color: #e64500 !important;
                }
            `}</style>
        </div>
    );
};

export default Login;
