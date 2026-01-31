import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface LoginProps {
    onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('admin');
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
                onLogin(data.user);
            } else {
                toast.error(data.message || 'Giriş uğursuz oldu');
            }
        } catch (err) {
            toast.error('Şəbəkə xətası');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="hold-transition login-page">
            <div className="login-box">
                <div className="card card-outline card-primary">
                    <div className="card-header text-center">
                        <a href="#" className="h1"><b>Forsaj</b>Admin</a>
                    </div>
                    <div className="card-body">
                        <p className="login-box-msg">Sessiyaya başlamaq üçün daxil olun</p>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="İstifadəçi Adı"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
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
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-lock"></span>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-8">
                                    {/* Məni Xatırla bura əlavə oluna bilər */}
                                </div>
                                <div className="col-4">
                                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                                        {loading ? '...' : 'Daxil Ol'}
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
                    background: #e9ecef;
                }
            `}</style>
        </div>
    );
};

export default Login;
