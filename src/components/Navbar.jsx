import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = ({ onLogoutClick }) => {
    const navigate = useNavigate();
    
    const cashierName = localStorage.getItem('cashier_name') || 'Riana Rasti';
    const outletName = localStorage.getItem('cashier_outlet') || 'Tenggilis Mejoyo';
    // Mengambil status role pengguna
    const role = localStorage.getItem('user_role');

    return (
        <aside className="sidebar">
            <div>
                {/* Logo Section */}
                <div className="sidebar-logo">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 12a4 4 0 1 0 8 0 4 4 0 1 0-8 0" />
                        <path d="M12 12h.01" />
                    </svg>
                    <span>LAUNDRYinAja</span>
                </div>

                {/* Menu Section */}
                <nav className="sidebar-menu">
                    {/* 1. JIKA YANG LOGIN ADALAH ADMIN */}
                    {role === 'admin' ? (
                        <>
                            <NavLink 
                                to="/" 
                                className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="7" height="9" x="3" y="3" rx="1" />
                                    <rect width="7" height="5" x="14" y="3" rx="1" />
                                    <rect width="7" height="9" x="14" y="12" rx="1" />
                                    <rect width="7" height="5" x="3" y="16" rx="1" />
                                </svg>
                                Dashboard Admin
                            </NavLink>

                            <NavLink 
                                to="/admin/financial-reports" 
                                className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" x2="12" y1="2" y2="22" />
                                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                                Laporan Keuangan
                            </NavLink>

                            <NavLink 
                                to="/admin/product-management" 
                                className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m7.5 4.27 9 5.15" />
                                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                                    <path d="m3.3 7 8.7 5 8.7-5" />
                                    <path d="M12 22V12" />
                                </svg>
                                Manajemen Produk
                            </NavLink>

                            <NavLink 
                                to="/admin/user-management" 
                                className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                                Manajemen User
                            </NavLink>

                            <NavLink 
                                to="/admin/customer-database" 
                                className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                                Database Pelanggan
                            </NavLink>
                        </>
                    ) : (
                        /* 2. JIKA YANG LOGIN ADALAH KASIR / USER BIAYA */
                        <>
                            <NavLink 
                                to="/" 
                                className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="7" height="9" x="3" y="3" rx="1" />
                                    <rect width="7" height="5" x="14" y="3" rx="1" />
                                    <rect width="7" height="9" x="14" y="12" rx="1" />
                                    <rect width="7" height="5" x="3" y="16" rx="1" />
                                </svg>
                                Dashboard
                            </NavLink>

                            <NavLink 
                                to="/transaksi" 
                                className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="18" height="18" x="3" y="3" rx="2" />
                                    <path d="M8 12h8" />
                                    <path d="M12 8v8" />
                                </svg>
                                Input transaksi
                            </NavLink>

                            <NavLink 
                                to="/riwayat" 
                                className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 8v4l3 3" />
                                    <circle cx="12" cy="12" r="10" />
                                </svg>
                                Riwayat transaksi
                            </NavLink>
                        </>
                    )}
                </nav>
            </div>

            {/* Profile & Logout Section */}
            <div className="sidebar-profile-box" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="sidebar-profile">
                    <div className="profile-avatar">
                        {cashierName ? cashierName.substring(0, 2).toUpperCase() : 'RR'}
                    </div>
                    <div className="profile-details">
                        <span className="profile-name">{cashierName}</span>
                        <span className="profile-role">{role === 'admin' ? 'Super Admin' : outletName}</span>
                    </div>
                </div>

                <button 
                    onClick={onLogoutClick}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 16px',
                        borderRadius: '14px',
                        color: '#ef4444',
                        background: '#fef2f2',
                        border: 'none',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                        transition: 'opacity 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = 0.9}
                    onMouseOut={(e) => e.currentTarget.style.opacity = 1}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" x2="9" y1="12" y2="12" />
                    </svg>
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Navbar;