import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [filterTime, setFilterTime] = useState('Minggu Ini');
    
    // Mock cashiers
    const cashiers = [
        { name: 'Siti Aminah', active: true, avatar: 'SA' },
        { name: 'Budi Santoso', active: false, avatar: 'BS' }
    ];

    // Mock recent transactions matching the design
    const recentTransactions = [
        { id: '1024', customer: 'Andi Pratama', phone: '081298937000', service: 'Cuci Kering (Kemeja)', price: 95000, status: 'sedang dicuci', date: 'Jun 24, 2026', initials: 'AP' },
        { id: '1025', customer: 'Rizky Saputra', phone: '081299483111', service: 'Cuci Kering (Celana)', price: 50000, status: 'selesai', date: 'Mar 10, 2026', initials: 'RS' },
        { id: '1026', customer: 'Fajar Nugroho', phone: '081294745222', service: 'Cuci Kering (Setelan Jas)', price: 45000, status: 'belum dimulai', date: 'Nov 10, 2026', initials: 'FN' },
        { id: '1027', customer: 'Dwi Lestari', phone: '081264849333', service: 'Cuci Kering (Dress)', price: 60000, status: 'selesai', date: 'Dec 20, 2026', initials: 'DL' }
    ];

    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num).replace('Rp', 'Rp ');
    };

    return (
        <div>
            {/* Header Section */}
            <div className="dashboard-header">
                <div className="header-title">
                    <h1>Dashboard</h1>
                    <p>Selamat datang kembali! Berikut ringkasan operasional hari ini.</p>
                </div>
            </div>

            {/* Metrics cards */}
            <div className="metrics-grid">
                <div className="metric-card green">
                    <div className="metric-info">
                        <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            TOTAL REVENUE 
                            <span style={{ fontSize: '10px', color: '#10b981', background: '#d1fae5', padding: '2px 6px', borderRadius: '10px', fontWeight: '600' }}>↗ +12%</span>
                        </span>
                        <span className="metric-value">{formatRupiah(25450000)}</span>
                    </div>
                    <div className="metric-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect width="20" height="14" x="2" y="5" rx="2" />
                            <line x1="2" x2="22" y1="10" y2="10" />
                        </svg>
                    </div>
                </div>

                <div className="metric-card purple">
                    <div className="metric-info">
                        <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            TOTAL USERS
                            <span style={{ fontSize: '10px', color: '#8b5cf6', background: '#ede9fe', padding: '2px 6px', borderRadius: '10px', fontWeight: '600' }}>12 Staff Active</span>
                        </span>
                        <span className="metric-value">45 Accounts</span>
                    </div>
                    <div className="metric-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </div>
                </div>

                <div className="metric-card orange">
                    <div className="metric-info">
                        <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            ACTIVE ORDERS
                            <span style={{ fontSize: '10px', color: '#ff7a00', background: '#fff0e0', padding: '2px 6px', borderRadius: '10px', fontWeight: '600' }}>8 Urgent Priority</span>
                        </span>
                        <span className="metric-value">156 Items</span>
                    </div>
                    <div className="metric-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="m7.5 4.27 9 5.15" />
                            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                            <path d="m3.3 7 8.7 5 8.7-5" />
                            <path d="M12 22V12" />
                        </svg>
                    </div>
                </div>

                <div className="metric-card blue">
                    <div className="metric-info">
                        <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            TOTAL CUSTOMERS
                            <span style={{ fontSize: '10px', color: '#3b82f6', background: '#dbeafe', padding: '2px 6px', borderRadius: '10px', fontWeight: '600' }}>+5 New Today</span>
                        </span>
                        <span className="metric-value">1,204</span>
                    </div>
                    <div className="metric-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Middle Section: Chart & Cashier list */}
            <div className="dashboard-middle">
                {/* SVG Chart Card */}
                <div className="chart-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                            <span className="chart-title" style={{ display: 'block', fontSize: '16px', fontWeight: '600', color: 'var(--text-main)' }}>Penjualan Mingguan</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Trend pendapatan operasional 7 hari terakhir</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Filter:</span>
                            <select 
                                value={filterTime} 
                                onChange={(e) => setFilterTime(e.target.value)}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '16px',
                                    border: '1px solid var(--border-color)',
                                    fontSize: '13px',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    backgroundColor: '#f1f5f9',
                                    fontWeight: '500'
                                }}
                            >
                                <option value="Minggu Ini">Minggu Ini</option>
                                <option value="Bulan Ini">Bulan Ini</option>
                            </select>
                        </div>
                    </div>

                    <div className="chart-container">
                        <svg viewBox="0 0 500 160" width="100%" height="100%" style={{ overflow: 'visible' }}>
                            {/* SVG Bars to match the bar layout in Admin screenshot */}
                            <g transform="translate(10, 0)">
                                {/* Monday */}
                                <rect x="35" y="70" width="28" height="50" rx="6" fill="#eff6ff" />
                                <rect x="35" y="90" width="28" height="30" rx="4" fill="#2563eb" />
                                <text x="49" y="135" fontSize="10" fill="var(--text-muted)" textAnchor="middle" fontWeight="600">SENIN</text>

                                {/* Tuesday */}
                                <rect x="95" y="40" width="28" height="80" rx="6" fill="#eff6ff" />
                                <rect x="95" y="80" width="28" height="40" rx="4" fill="#2563eb" />
                                <text x="109" y="135" fontSize="10" fill="var(--text-muted)" textAnchor="middle" fontWeight="600">SELASA</text>

                                {/* Wednesday */}
                                <rect x="155" y="60" width="28" height="60" rx="6" fill="#eff6ff" />
                                <rect x="155" y="85" width="28" height="35" rx="4" fill="#2563eb" />
                                <text x="169" y="135" fontSize="10" fill="var(--text-muted)" textAnchor="middle" fontWeight="600">RABU</text>

                                {/* Thursday - Highlighted active */}
                                <rect x="215" y="30" width="28" height="90" rx="6" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1" />
                                <rect x="215" y="55" width="28" height="65" rx="4" fill="#1d4ed8" />
                                <text x="229" y="135" fontSize="10" fill="#1d4ed8" textAnchor="middle" fontWeight="700">KAMIS</text>

                                {/* Friday */}
                                <rect x="275" y="50" width="28" height="70" rx="6" fill="#eff6ff" />
                                <rect x="275" y="80" width="28" height="40" rx="4" fill="#2563eb" />
                                <text x="289" y="135" fontSize="10" fill="var(--text-muted)" textAnchor="middle" fontWeight="600">JUMAT</text>

                                {/* Saturday */}
                                <rect x="335" y="80" width="28" height="40" rx="6" fill="#eff6ff" />
                                <rect x="335" y="95" width="28" height="25" rx="4" fill="#2563eb" />
                                <text x="349" y="135" fontSize="10" fill="var(--text-muted)" textAnchor="middle" fontWeight="600">SABTU</text>

                                {/* Sunday */}
                                <rect x="395" y="70" width="28" height="50" rx="6" fill="#eff6ff" />
                                <rect x="395" y="85" width="28" height="35" rx="4" fill="#2563eb" />
                                <text x="409" y="135" fontSize="10" fill="var(--text-muted)" textAnchor="middle" fontWeight="600">MINGGU</text>
                            </g>
                        </svg>
                    </div>
                </div>

                {/* Kasir List Card */}
                <div className="shortcut-card" style={{ padding: '24px' }}>
                    <span className="shortcut-title" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>KASIR</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {cashiers.map((c, idx) => (
                            <div 
                                key={idx} 
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'space-between',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-color)',
                                    background: '#ffffff'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div 
                                        style={{ 
                                            width: '36px', 
                                            height: '36px', 
                                            borderRadius: '50%', 
                                            backgroundColor: '#eff6ff', 
                                            color: '#2563eb', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            fontWeight: '600',
                                            fontSize: '14px',
                                            position: 'relative'
                                        }}
                                    >
                                        {c.avatar}
                                        <span 
                                            style={{ 
                                                position: 'absolute',
                                                bottom: 0,
                                                right: 0,
                                                width: '10px',
                                                height: '10px',
                                                borderRadius: '50%',
                                                backgroundColor: c.active ? '#10b981' : '#9ca3af',
                                                border: '2px solid #ffffff'
                                            }}
                                        />
                                    </div>
                                    <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-main)' }}>{c.name}</span>
                                </div>
                                <span style={{ fontSize: '12px', color: c.active ? '#10b981' : '#9ca3af', fontWeight: '600' }}>
                                    {c.active ? 'Aktif' : 'Offline'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section: Transaksi Terkini Table */}
            <div className="table-card" style={{ marginTop: '24px' }}>
                <div className="table-header">
                    <div>
                        <span className="table-title" style={{ display: 'block', fontSize: '16px', fontWeight: '600' }}>Transaksi Terkini</span>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Monitor dan kelola 10 transaksi pelanggan terbaru</span>
                    </div>
                    <Link 
                        to="/admin/customer-database" 
                        className="view-all-btn"
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '6px', 
                            fontSize: '13px',
                            background: '#eff6ff',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            textDecoration: 'none',
                            fontWeight: '600'
                        }}
                    >
                        Lihat Semua Transaksi
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="7" x2="17" y1="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                        </svg>
                    </Link>
                </div>

                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID Transaksi</th>
                                <th>Pelanggan</th>
                                <th>Layanan Utama</th>
                                <th>Total Harga</th>
                                <th>Status Proses</th>
                                <th>Tanggal Masuk</th>
                                <th style={{ textAlign: 'center' }}>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions.map((tx) => {
                                let badgeClass = 'success';
                                const status = tx.status.toLowerCase();
                                
                                if (status === 'pending' || status === 'belum dimulai' || status === 'belum bayar') {
                                    badgeClass = 'pending';
                                } else if (status === 'sedang dicuci' || status === 'proses' || status === 'process') {
                                    badgeClass = 'process';
                                }

                                return (
                                    <tr key={tx.id}>
                                        <td style={{ fontWeight: '700', color: '#2563eb' }}>#{tx.id}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div 
                                                    style={{ 
                                                        width: '32px', 
                                                        height: '32px', 
                                                        borderRadius: '50%', 
                                                        backgroundColor: '#f3f4f6', 
                                                        color: '#4b5563', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center',
                                                        fontWeight: '600',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    {tx.initials}
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontWeight: '600', fontSize: '13px' }}>{tx.customer}</span>
                                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{tx.phone}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{tx.service}</td>
                                        <td className="price-text" style={{ fontWeight: '600' }}>{formatRupiah(tx.price)}</td>
                                        <td>
                                            <span className={`badge ${badgeClass}`} style={{ fontSize: '11px', padding: '4px 12px', fontWeight: '700', letterSpacing: '0.5px' }}>
                                                {tx.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>{tx.date}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <button 
                                                style={{ 
                                                    background: 'none', 
                                                    border: 'none', 
                                                    cursor: 'pointer',
                                                    padding: '4px',
                                                    color: 'var(--text-muted)'
                                                }}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <circle cx="12" cy="12" r="1" />
                                                    <circle cx="12" cy="5" r="1" />
                                                    <circle cx="12" cy="19" r="1" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '10px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500', letterSpacing: '0.5px' }}>
                © 2026 LAUNDRYINAJA • V1.0.1
            </div>
        </div>
    );
};

export default AdminDashboard;
