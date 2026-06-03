import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
    const { setShowLogoutModal } = useOutletContext();
    const [stats, setStats] = useState({
        totalRevenue: 250000,
        activeOrders: 1,
        recentTransactions: []
    });
    const [allTransactions, setAllTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTx, setSelectedTx] = useState(null);

    const mockTransactions = [
        { id: 1001, nama_pelanggan: 'Amri Pratama', nomor_hp: '08123456789', layanan: 'Cuci kering setrika', total_harga: 26640, status_pembayaran: 'selesai', created_at: '2026-06-01T09:15:00+07:00', catatan: 'Cuci bersih, jangan terlalu wangi', metode_pembayaran: 'cash', kasir: 'Siti Aminah' },
        { id: 1002, nama_pelanggan: 'Rina Saputri', nomor_hp: '08129876543', layanan: 'Cuci kering setrika', total_harga: 39960, status_pembayaran: 'diambil', created_at: '2026-06-01T13:45:00+07:00', catatan: 'Lipat rapi saja', metode_pembayaran: 'tf', kasir: 'Budi Susanto' },
        { id: 1003, nama_pelanggan: 'Fajar Nugroho', nomor_hp: '08567891234', layanan: 'Pembersih Pakaian', total_harga: 48840, status_pembayaran: 'selesai', created_at: '2026-06-02T10:30:00+07:00', catatan: 'Gantung jas warna hitam', metode_pembayaran: 'qris', kasir: 'Siti Aminah' },
        { id: 1004, nama_pelanggan: 'Dwi Lestari', nomor_hp: '08991234567', layanan: 'Cuci & Lipat', total_harga: 33300, status_pembayaran: 'proses', created_at: '2026-06-02T15:20:00+07:00', catatan: 'Jangan dicampur dengan baju putih', metode_pembayaran: 'cash', kasir: 'Budi Susanto' }
    ];

    useEffect(() => {
        const fetchAdminStats = async () => {
            try {
                const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
                const [ordersRes, customersRes] = await Promise.all([
                    axios.get(`${apiURL}/orders`),
                    axios.get(`${apiURL}/customers`).catch(e => ({ data: { data: [] } }))
                ]);

                if (ordersRes.data.status === 'success') {
                    const txs = ordersRes.data.data;
                    setAllTransactions(txs);

                    // Compute dynamic stats
                    const todayDateStr = new Date().toDateString();
                    const totalRevenue = txs
                        .filter(tx => new Date(tx.created_at).toDateString() === todayDateStr)
                        .reduce((sum, tx) => sum + (tx.total_harga || 0), 0);
                    
                    const activeOrders = txs.filter(tx => 
                        tx.status_pembayaran === 'antri' || 
                        tx.status_pembayaran === 'proses' || 
                        tx.status_pembayaran === 'pending'
                    ).length;

                    setStats({
                        totalRevenue: totalRevenue || 122100, // Real-time daily revenue
                        activeOrders: activeOrders,
                        recentTransactions: txs.slice(0, 4)
                    });
                }
            } catch (err) {
                console.error("Gagal memuat statistik admin", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminStats();
    }, []);

    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num).replace('Rp', 'Rp ');
    };

    // Helper to get initials
    const getInitials = (name) => {
        if (!name) return 'CS';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    // Helper to extract services text and format quantities as integer numbers
    const getLayananText = (tx) => {
        if (tx.details && tx.details.length > 0) {
            return tx.details.map(d => {
                const name = d.layanan ? d.layanan.nama : 'Layanan';
                const qty = Math.round(d.jumlah || 1);
                const unit = d.layanan ? d.layanan.satuan : 'kg';
                return `${name} (${qty} ${unit})`;
            }).join(', ');
        }
        return tx.layanan || 'Cuci Kering Setrika';
    };

    // Helper to format date with hours and minutes
    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        
        const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('id-ID', dateOptions);
        
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
        const formattedTime = date.toLocaleTimeString('id-ID', timeOptions).replace(':', '.') + ' WIB';
        
        return `${formattedDate}, ${formattedTime}`;
    };

    // Calculate weekly revenue for chart
    const getWeeklyRevenue = () => {
        const days = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
        const revenueByDay = { senin: 0, selasa: 0, rabu: 0, kamis: 0, jumat: 0, sabtu: 0, minggu: 0 };
        
        const sourceList = allTransactions.length > 0 ? allTransactions : mockTransactions;
        
        sourceList.forEach(tx => {
            const txDate = new Date(tx.created_at);
            if (!isNaN(txDate.getTime())) {
                const dayName = days[txDate.getDay()];
                if (revenueByDay[dayName] !== undefined) {
                    revenueByDay[dayName] += tx.total_harga || 0;
                }
            }
        });
        
        return revenueByDay;
    };

    const weeklyData = getWeeklyRevenue();
    const dayOrder = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
    const xCoords = [35, 95, 155, 215, 275, 335, 395];
    const maxRevenue = Math.max(...dayOrder.map(d => weeklyData[d]), 50000);

    const chartBars = dayOrder.map((day, index) => {
        const x = xCoords[index];
        const val = weeklyData[day];
        const height = maxRevenue > 0 ? (val / maxRevenue) * 90 : 0;
        const y = 120 - height;
        return { x, y, height, val, day: day.toUpperCase() };
    });

    const activeTransactions = stats.recentTransactions.length > 0 
        ? stats.recentTransactions 
        : mockTransactions;

    // Sort activeTransactions descending by numeric ID
    const sortedTransactions = [...activeTransactions].sort((a, b) => b.id - a.id);

    return (
        <div>
            {/* Header Section */}
            <div className="dashboard-header">
                <div className="header-title">
                    <h1>Dashboard Admin</h1>
                    <p>Selamat datang kembali! Berikut ringkasan operasional laundry secara real-time.</p>
                </div>
                <button 
                    className="logout-icon-btn" 
                    title="Logout" 
                    onClick={() => setShowLogoutModal(true)}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#ef4444',
                        padding: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#fef2f2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" x2="9" y1="12" y2="12" />
                    </svg>
                </button>
            </div>

            {/* Metrics cards (simplified to 2 columns: Total Revenue & Active Orders) */}
            <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div className="metric-card green">
                    <div className="metric-info">
                        <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            TOTAL REVENUE (HARI INI)
                        </span>
                        <span className="metric-value">{formatRupiah(stats.totalRevenue)}</span>
                    </div>
                    <div className="metric-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect width="20" height="14" x="2" y="5" rx="2" />
                            <line x1="2" x2="22" y1="10" y2="10" />
                        </svg>
                    </div>
                </div>

                <div className="metric-card orange">
                    <div className="metric-info">
                        <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            ACTIVE ORDERS
                        </span>
                        <span className="metric-value">{stats.activeOrders} Pesanan</span>
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
            </div>

            {/* Middle Section: Chart & Cashier list */}
            <div className="dashboard-middle" style={{ marginTop: '24px' }}>
                {/* SVG Chart Card with tooltips on hover */}
                <div className="chart-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                            <span className="chart-title" style={{ display: 'block', fontSize: '16px', fontWeight: '600', color: 'var(--text-main)' }}>Penjualan Mingguan</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Arahkan kursor ke grafik untuk melihat pendapatan detail</span>
                        </div>
                    </div>

                    <div className="chart-container">
                        <svg viewBox="0 0 500 160" width="100%" height="100%" style={{ overflow: 'visible' }}>
                            <g transform="translate(10, 0)">
                                {chartBars.map((bar, idx) => (
                                    <g key={idx} style={{ cursor: 'pointer' }}>
                                        {/* Background track */}
                                        <rect x={bar.x} y="30" width="28" height="90" rx="6" fill="#eff6ff" />
                                        {/* Colored value bar */}
                                        <rect x={bar.x} y={bar.y} width="28" height={bar.height} rx="4" fill="#2563eb">
                                            {/* Native SVG tooltip on hover */}
                                            <title>{`Pendapatan ${bar.day}: ${formatRupiah(bar.val)}`}</title>
                                        </rect>
                                        <text x={bar.x + 14} y="135" fontSize="10" fill="var(--text-muted)" textAnchor="middle" fontWeight="600">
                                            {bar.day}
                                        </text>
                                        {/* Display text overlay when hovered */}
                                        {bar.height > 10 && (
                                            <text x={bar.x + 14} y={bar.y - 6} fontSize="8" fill="#1e40af" fontWeight="700" textAnchor="middle">
                                                {formatRupiah(bar.val).replace('Rp ', '')}
                                            </text>
                                        )}
                                    </g>
                                ))}
                            </g>
                        </svg>
                    </div>
                </div>

                {/* Kasir List Card */}
                <div className="shortcut-card" style={{ padding: '24px' }}>
                    <span className="shortcut-title" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>KASIR AKTIF</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { name: 'Siti Aminah', active: true, avatar: 'SA' },
                            { name: 'Budi Susanto', active: true, avatar: 'BS' }
                        ].map((c, idx) => (
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
                                                backgroundColor: '#10b981',
                                                border: '2px solid #ffffff'
                                            }}
                                        />
                                    </div>
                                    <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-main)' }}>{c.name}</span>
                                </div>
                                <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}>
                                    Online / Aktif
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Section: Riwayat Transaksi Table */}
            <div className="table-card" style={{ marginTop: '24px' }}>
                <div className="table-header">
                    <div>
                        <span className="table-title" style={{ display: 'block', fontSize: '16px', fontWeight: '600' }}>Riwayat Transaksi</span>
                    </div>
                    <Link 
                        to="/admin/riwayat" 
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
                        Lebih Detail
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
                            </tr>
                        </thead>
                        <tbody>
                            {sortedTransactions.map((tx) => {
                                let badgeClass = 'success';
                                const status = String(tx.status_pembayaran || tx.status || '').toLowerCase();
                                
                                if (status === 'pending' || status === 'belum dimulai' || status === 'belum bayar' || status === 'antri') {
                                    badgeClass = 'pending';
                                } else if (status === 'sedang dicuci' || status === 'proses' || status === 'process') {
                                    badgeClass = 'process';
                                } else if (status === 'batal' || status === 'cancel') {
                                    badgeClass = 'batal';
                                } else if (status === 'diambil') {
                                    badgeClass = 'success';
                                }

                                const invoiceLabel = tx.invoice || tx.id;
                                const initials = getInitials(tx.nama_pelanggan || tx.customer);
                                const customerName = tx.nama_pelanggan || tx.customer;
                                const phoneNum = tx.nomor_hp || tx.phone || '-';
                                const priceVal = tx.total_harga || tx.price;
                                const dateVal = tx.created_at || tx.date;

                                return (
                                    <tr 
                                        key={tx.id} 
                                        onClick={() => setSelectedTx(tx)}
                                        style={{ cursor: 'pointer' }}
                                        className="clickable-row"
                                    >
                                        <td style={{ fontWeight: '700', color: '#2563eb' }}>{invoiceLabel}</td>
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
                                                    {initials}
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontWeight: '700', fontSize: '13px', color: '#3b82f6', textDecoration: 'underline' }}>
                                                        {customerName}
                                                    </span>
                                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{phoneNum}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={getLayananText(tx)}>
                                            {getLayananText(tx)}
                                        </td>
                                        <td className="price-text" style={{ fontWeight: '600' }}>{formatRupiah(priceVal)}</td>
                                        <td>
                                            <span className={`badge ${badgeClass}`} style={{ fontSize: '11px', padding: '4px 12px', fontWeight: '700', letterSpacing: '0.5px' }}>
                                                {status}
                                            </span>
                                        </td>
                                        <td>{formatDate(dateVal)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Premium detail modal popup */}
            {selectedTx && (
                <div className="modal-overlay" onClick={() => setSelectedTx(null)}>
                    <div 
                        className="modal-content" 
                        onClick={(e) => e.stopPropagation()} 
                        style={{ 
                            maxWidth: '520px', 
                            width: '90%', 
                            textAlign: 'left', 
                            padding: '28px',
                            borderRadius: '20px',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                        }}
                    >
                        <button 
                            onClick={() => setSelectedTx(null)}
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                backgroundColor: '#f3f4f6',
                                color: '#1f2937',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '800',
                                fontSize: '13px'
                            }}
                        >
                            X
                        </button>
                        
                        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: '#111827', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginTop: 0 }}>Detail Transaksi</h2>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div>
                                <span style={{ fontSize: '11px', color: '#6b7280', display: 'block', fontWeight: '600', letterSpacing: '0.5px' }}>ID TRANSAKSI</span>
                                <span style={{ fontSize: '16px', fontWeight: '700', color: '#2563eb' }}>{selectedTx.invoice || selectedTx.id}</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '11px', color: '#6b7280', display: 'block', fontWeight: '600', letterSpacing: '0.5px' }}>STATUS</span>
                                <span className={`badge ${selectedTx.status_pembayaran}`} style={{ fontSize: '12px', padding: '4px 12px', fontWeight: '700', borderRadius: '20px' }}>
                                    {selectedTx.status_pembayaran}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px', background: '#f9fafb', padding: '16px', borderRadius: '14px', border: '1px solid #e5e7eb' }}>
                            <div>
                                <span style={{ fontSize: '10px', color: '#6b7280', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>Pelanggan</span>
                                <span style={{ fontWeight: '700', fontSize: '14px', color: '#111827', textTransform: 'uppercase' }}>{selectedTx.nama_pelanggan || selectedTx.customer}</span>
                            </div>
                            <div>
                                <span style={{ fontSize: '10px', color: '#6b7280', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>No Handphone</span>
                                <span style={{ fontWeight: '600', fontSize: '14px', color: '#111827' }}>{selectedTx.nomor_hp || selectedTx.phone || '-'}</span>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <span style={{ fontSize: '10px', color: '#6b7280', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>Alamat</span>
                                <span style={{ fontSize: '13px', color: '#374151', fontWeight: '500' }}>{selectedTx.alamat || '-'}</span>
                            </div>
                            {selectedTx.catatan && (
                                <div style={{ gridColumn: 'span 2' }}>
                                    <span style={{ fontSize: '10px', color: '#6b7280', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>Catatan</span>
                                    <span style={{ fontSize: '13px', color: '#ef4444', fontStyle: 'italic', fontWeight: '500' }}>{selectedTx.catatan}</span>
                                </div>
                            )}
                            <div>
                                <span style={{ fontSize: '10px', color: '#6b7280', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>Metode Pembayaran</span>
                                <span style={{ fontWeight: '700', fontSize: '13px', color: '#065f46', textTransform: 'uppercase' }}>{selectedTx.metode_pembayaran || 'cash'}</span>
                            </div>
                            <div>
                                <span style={{ fontSize: '10px', color: '#6b7280', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>Kasir Penginput</span>
                                <span style={{ fontWeight: '600', fontSize: '13px', color: '#111827' }}>{selectedTx.kasir || 'Siti Aminah'}</span>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <span style={{ fontSize: '10px', color: '#6b7280', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>Tanggal Masuk</span>
                                <span style={{ fontSize: '13px', color: '#374151', fontWeight: '500' }}>
                                    {formatDate(selectedTx.created_at || selectedTx.date)}
                                </span>
                            </div>
                        </div>

                        <h3 style={{ fontSize: '13px', fontWeight: '700', marginBottom: '10px', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Detail Layanan</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', maxHh: '150px', overflowY: 'auto' }}>
                            {selectedTx.details && selectedTx.details.map((d, index) => {
                                const name = d.layanan ? d.layanan.nama : 'Layanan';
                                const qty = Math.round(d.jumlah || 1);
                                const unit = d.layanan ? d.layanan.satuan : 'kg';
                                return (
                                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingBottom: '6px', borderBottom: '1px dashed #e5e7eb' }}>
                                        <span style={{ color: '#4b5563' }}>{name} <strong style={{ color: '#111827' }}>x{qty} {unit}</strong></span>
                                        <span style={{ fontWeight: '600', color: '#111827' }}>{formatRupiah(d.subtotal || (d.jumlah * (d.layanan ? d.layanan.harga : 0)))}</span>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '15px', borderTop: '2px solid #e5e7eb', paddingTop: '12px', color: '#111827' }}>
                            <span>TOTAL BAYAR</span>
                            <span style={{ color: '#10b981', fontSize: '16px' }}>{formatRupiah(selectedTx.total_harga || selectedTx.price)}</span>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '10px', fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500', letterSpacing: '0.5px' }}>
                © 2026 LAUNDRYINAJA • V1.0.1
            </div>
        </div>
    );
};

export default AdminDashboard;
