import React, { useState } from 'react';

const CustomerDatabase = () => {
    // Initial customer list
    const [customers, setCustomers] = useState([
        {
            id: 'CUST-001',
            name: 'Andi Pratama',
            phone: '081298937000',
            email: 'andi.pratama@gmail.com',
            joinDate: 'Jan 15, 2025',
            status: 'ACTIVE',
            initials: 'AP',
            stats: {
                totalOrders: 28,
                totalRevenue: 2450000,
                avgProcessing: '24 Jam',
                priorityStatus: 'VIP'
            },
            history: [
                { id: '1024', date: 'Jun 24, 2026', service: 'Cuci Kering (Kemeja)', price: 95000, status: 'sedang dicuci' },
                { id: '1012', date: 'May 12, 2026', service: 'Setrika (Celana Panjang)', price: 40000, status: 'selesai' },
                { id: '0988', date: 'Apr 03, 2026', service: 'Cuci Basah + Setrika', price: 75000, status: 'selesai' },
                { id: '0954', date: 'Mar 15, 2026', service: 'Dry Clean (Setelan Jas)', price: 120000, status: 'selesai' }
            ]
        },
        {
            id: 'CUST-002',
            name: 'Rizky Saputra',
            phone: '081299483111',
            email: 'rizky.saputra@yahoo.com',
            joinDate: 'Feb 10, 2025',
            status: 'ACTIVE',
            initials: 'RS',
            stats: {
                totalOrders: 15,
                totalRevenue: 1350000,
                avgProcessing: '36 Jam',
                priorityStatus: 'Regular'
            },
            history: [
                { id: '1025', date: 'Mar 10, 2026', service: 'Cuci Kering (Celana)', price: 50000, status: 'selesai' },
                { id: '1004', date: 'Feb 18, 2026', service: 'Cuci Basah (Bed Cover)', price: 85000, status: 'selesai' }
            ]
        },
        {
            id: 'CUST-003',
            name: 'Fajar Nugroho',
            phone: '081294745222',
            email: 'fajar.nugroho@live.com',
            joinDate: 'Mar 05, 2025',
            status: 'ACTIVE',
            initials: 'FN',
            stats: {
                totalOrders: 8,
                totalRevenue: 850000,
                avgProcessing: '48 Jam',
                priorityStatus: 'Regular'
            },
            history: [
                { id: '1026', date: 'Nov 10, 2026', service: 'Cuci Kering (Setelan Jas)', price: 45000, status: 'belum dimulai' }
            ]
        },
        {
            id: 'CUST-004',
            name: 'Dwi Lestari',
            phone: '081264849333',
            email: 'dwi.lestari@outlook.com',
            joinDate: 'Apr 20, 2025',
            status: 'ACTIVE',
            initials: 'DL',
            stats: {
                totalOrders: 34,
                totalRevenue: 3820000,
                avgProcessing: '18 Jam',
                priorityStatus: 'VIP'
            },
            history: [
                { id: '1027', date: 'Dec 20, 2026', service: 'Cuci Kering (Dress)', price: 60000, status: 'selesai' },
                { id: '1019', date: 'Nov 14, 2026', service: 'Cuci Basah + Setrika', price: 95000, status: 'selesai' }
            ]
        },
        {
            id: 'CUST-005',
            name: 'Bambang Hermawan',
            phone: '085739281723',
            email: 'bambang.h@gmail.com',
            joinDate: 'May 14, 2025',
            status: 'INACTIVE',
            initials: 'BH',
            stats: {
                totalOrders: 3,
                totalRevenue: 240000,
                avgProcessing: '72 Jam',
                priorityStatus: 'Regular'
            },
            history: [
                { id: '0842', date: 'Oct 02, 2025', service: 'Setrika', price: 30000, status: 'selesai' }
            ]
        }
    ]);

    const [selectedId, setSelectedId] = useState('CUST-001');
    const [searchQuery, setSearchQuery] = useState('');

    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num).replace('Rp', 'Rp ');
    };

    // Filter customers
    const filteredCustomers = customers.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        c.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeCustomer = customers.find(c => c.id === selectedId) || customers[0];

    return (
        <div>
            {/* Header Section */}
            <div className="dashboard-header" style={{ marginBottom: '24px' }}>
                <div className="header-title">
                    <h1>Customer Database</h1>
                    <p>Kelola data pelanggan, riwayat transaksi, dan loyalitas member.</p>
                </div>
            </div>

            {/* Split Pane Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'stretch' }}>
                {/* Left Panel: Customer List */}
                <div style={{ 
                    background: '#ffffff', 
                    borderRadius: '16px', 
                    border: '1px solid var(--border-color)', 
                    display: 'flex', 
                    flexDirection: 'column',
                    maxHeight: 'calc(100vh - 180px)',
                    overflow: 'hidden'
                }}>
                    {/* Search Bar */}
                    <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
                        <div className="search-bar-container" style={{ width: '100%', margin: 0, position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '13px' }}>🔍</span>
                            <input 
                                type="text" 
                                placeholder="Cari pelanggan..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                                style={{ 
                                    padding: '8px 12px 8px 34px', 
                                    fontSize: '13px', 
                                    borderRadius: '18px', 
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    </div>

                    {/* Customer Scroll List */}
                    <div style={{ overflowY: 'auto', flex: 1, padding: '8px' }}>
                        {filteredCustomers.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '13px' }}>
                                Pelanggan tidak ditemukan
                            </div>
                        ) : (
                            filteredCustomers.map(c => {
                                const isSelected = c.id === selectedId;
                                return (
                                    <div
                                        key={c.id}
                                        onClick={() => setSelectedId(c.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '12px',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                                            border: isSelected ? '1px solid #bfdbfe' : '1px solid transparent',
                                            transition: 'all 0.2s',
                                            marginBottom: '4px'
                                        }}
                                    >
                                        <div style={{
                                            width: '38px',
                                            height: '38px',
                                            borderRadius: '50%',
                                            backgroundColor: isSelected ? '#3b82f6' : '#f3f4f6',
                                            color: isSelected ? '#ffffff' : 'var(--text-muted)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: '700',
                                            fontSize: '13px'
                                        }}>
                                            {c.initials}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                                            <span style={{ 
                                                fontWeight: '600', 
                                                fontSize: '13.5px', 
                                                color: isSelected ? '#1e3a8a' : 'var(--text-main)',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {c.name}
                                            </span>
                                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                {c.phone}
                                            </span>
                                        </div>
                                        {c.stats.priorityStatus === 'VIP' && (
                                            <span style={{
                                                fontSize: '9px',
                                                background: '#fef3c7',
                                                color: '#d97706',
                                                padding: '2px 6px',
                                                borderRadius: '8px',
                                                fontWeight: '700'
                                            }}>
                                                VIP
                                            </span>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right Panel: Customer Details */}
                {activeCustomer && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Profile Summary Card */}
                        <div style={{ 
                            background: '#ffffff', 
                            borderRadius: '16px', 
                            border: '1px solid var(--border-color)', 
                            padding: '24px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                                <div style={{
                                    width: '72px',
                                    height: '72px',
                                    borderRadius: '50%',
                                    backgroundColor: '#eff6ff',
                                    color: '#2563eb',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '800',
                                    fontSize: '24px',
                                    border: '2px solid #bfdbfe'
                                }}>
                                    {activeCustomer.initials}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: 'var(--text-main)' }}>
                                            {activeCustomer.name}
                                        </h2>
                                        <span style={{
                                            fontSize: '11px',
                                            background: activeCustomer.status === 'ACTIVE' ? '#d1fae5' : '#f3f4f6',
                                            color: activeCustomer.status === 'ACTIVE' ? '#065f46' : '#374151',
                                            padding: '4px 10px',
                                            borderRadius: '12px',
                                            fontWeight: '700'
                                        }}>
                                            {activeCustomer.status}
                                        </span>
                                    </div>
                                    <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                                        ID Pelanggan: <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>{activeCustomer.id}</span> • Bergabung sejak {activeCustomer.joinDate}
                                    </p>
                                </div>
                            </div>

                            {/* Contact Grid */}
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                                gap: '16px', 
                                marginTop: '24px',
                                paddingTop: '20px',
                                borderTop: '1px solid var(--border-color)'
                            }}>
                                <div>
                                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nomor Telepon</span>
                                    <span style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-main)', marginTop: '4px' }}>{activeCustomer.phone}</span>
                                </div>
                                <div>
                                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Alamat Email</span>
                                    <span style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: 'var(--text-main)', marginTop: '4px' }}>{activeCustomer.email}</span>
                                </div>
                                <div>
                                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status Prioritas</span>
                                    <span style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: activeCustomer.stats.priorityStatus === 'VIP' ? '#d97706' : 'var(--text-main)', marginTop: '4px' }}>{activeCustomer.stats.priorityStatus}</span>
                                </div>
                            </div>
                        </div>

                        {/* Metric Widgets */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                            <div className="metric-card">
                                <div className="metric-info">
                                    <span className="metric-label" style={{ fontSize: '11px' }}>TOTAL ORDERS</span>
                                    <span className="metric-value">{activeCustomer.stats.totalOrders} Pesanan</span>
                                </div>
                                <div className="metric-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <rect width="18" height="18" x="3" y="3" rx="2" />
                                        <path d="M8 12h8" />
                                        <path d="M12 8v8" />
                                    </svg>
                                </div>
                            </div>

                            <div className="metric-card">
                                <div className="metric-info">
                                    <span className="metric-label" style={{ fontSize: '11px' }}>TOTAL REVENUE</span>
                                    <span className="metric-value">{formatRupiah(activeCustomer.stats.totalRevenue)}</span>
                                </div>
                                <div className="metric-icon" style={{ background: '#d1fae5', color: '#059669' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <rect width="20" height="14" x="2" y="5" rx="2" />
                                        <line x1="2" x2="22" y1="10" y2="10" />
                                    </svg>
                                </div>
                            </div>

                            <div className="metric-card">
                                <div className="metric-info">
                                    <span className="metric-label" style={{ fontSize: '11px' }}>AVG PROCESSING</span>
                                    <span className="metric-value">{activeCustomer.stats.avgProcessing}</span>
                                </div>
                                <div className="metric-icon" style={{ background: '#fff0e0', color: '#ff7a00' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                </div>
                            </div>

                            <div className="metric-card">
                                <div className="metric-info">
                                    <span className="metric-label" style={{ fontSize: '11px' }}>LOYAITY STATUS</span>
                                    <span className="metric-value">{activeCustomer.stats.priorityStatus} Member</span>
                                </div>
                                <div className="metric-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Transaction History Table */}
                        <div className="table-card">
                            <span className="table-title" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', display: 'block' }}>
                                Riwayat Transaksi
                            </span>
                            <div className="data-table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>ID Transaksi</th>
                                            <th>Tanggal Masuk</th>
                                            <th>Layanan Utama</th>
                                            <th>Total Bayar</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeCustomer.history.map((tx) => {
                                            let badgeClass = 'success';
                                            const status = tx.status.toLowerCase();
                                            
                                            if (status === 'pending' || status === 'belum dimulai') {
                                                badgeClass = 'pending';
                                            } else if (status === 'sedang dicuci' || status === 'proses') {
                                                badgeClass = 'process';
                                            }

                                            return (
                                                <tr key={tx.id}>
                                                    <td style={{ fontWeight: '700', color: '#2563eb' }}>#{tx.id}</td>
                                                    <td>{tx.date}</td>
                                                    <td>{tx.service}</td>
                                                    <td className="price-text" style={{ fontWeight: '600' }}>{formatRupiah(tx.price)}</td>
                                                    <td>
                                                        <span className={`badge ${badgeClass}`} style={{ fontSize: '11px', padding: '4px 12px' }}>
                                                            {tx.status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDatabase;
