import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import InputField from '../../components/InputField';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loggedIn = localStorage.getItem('cashier_logged_in');
        if (loggedIn === 'true') {
            navigate('/');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
            const res = await axios.post(`${apiURL}/login`, {
                username,
                password
            });

            if (res.data.status === 'success') {
                localStorage.setItem('cashier_logged_in', 'true');
                localStorage.setItem('cashier_name', res.data.data.user.name);
                localStorage.setItem('cashier_outlet', res.data.data.user.outlet || 'Tenggilis Mejoyo');
                navigate('/');
            } else {
                setError('Login gagal. Silakan coba lagi.');
            }
        } catch (err) {
            console.error('Error logging in', err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Koneksi ke server gagal. Pastikan backend sudah menyala.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-bg-img"></div>
            <div className="login-card">
                <div className="login-logo-box">
                    <svg className="login-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 12a4 4 0 1 0 8 0 4 4 0 1 0-8 0" />
                        <path d="M12 12h.01" />
                        <rect width="6" height="4" x="9" y="4" rx="1" />
                    </svg>
                    <h2 className="login-title-primary">KASIR LAUNDRY</h2>
                    <p className="login-title-secondary">MANAJEMEN OUTLET & TRANSAKSI</p>
                </div>

                <h3 className="login-subtitle">Login</h3>
                
                {error && <div className="login-error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="login-form-group">
                        <input
                            type="text"
                            placeholder="username / email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="login-input"
                            disabled={loading}
                        />
                    </div>
                    
                    <div className="login-form-group">
                        <input
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="login-input"
                            disabled={loading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="login-submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Menghubungkan...' : (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                    <polyline points="10 17 15 12 10 7" />
                                    <line x1="15" x2="3" y1="12" y2="12" />
                                </svg>
                                Masuk
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
