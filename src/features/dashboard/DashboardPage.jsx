import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import axios from 'axios';

const DashboardPage = () => {
    const navigate = useNavigate();
    const { setShowLogoutModal } = useOutletContext();
    const [stats, setStats] = useState({
        order_hari_ini: 26,
        pelanggan_aktif: 5,
        proses: '1/6',
        pemasukan_hari_ini: 250000,
        latest_transactions: []
    });
    const [loading, setLoading] = useState(true);

    // Mock recent transactions for when the database is empty
    const mockTransactions = [
        { id: 1001, nama_pelanggan: 'Amri Pratama', layanan: 'Cuci kering setrika', total_harga: 15000, status_pembayaran: 'sedang dicuci', created_at: '2025-10-24T12:00:00Z' },
        { id: 1002, nama_pelanggan: 'Rina Saputri', layanan: 'Cuci kering setrika', total_harga: 30000, status_pembayaran: 'selesai', created_at: '2025-11-12T14:30:00Z' },
        { id: 1003, nama_pelanggan: 'Fajar Nugroho', layanan: 'Cuci Kering (Biasa)', total_harga: 60000, status_pembayaran: 'selesai', created_at: '2025-11-16T09:15:00Z' },
        { id: 1004, nama_pelanggan: 'Dwi Lestari', layanan: 'Cuci kering (Setrika)', total_harga: 40000, status_pembayaran: 'selesai', created_at: '2025-12-22T16:45:00Z' }
    ];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
                const res = await axios.get(`${apiURL}/dashboard-stats`);
                if (res.data.status === 'success') {
                    setStats(res.data.data);
                }
            } catch (err) {
                console.error("Gagal mengambil data dashboard", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Format number to Indonesian Rupiah (IDR)
    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num).replace('Rp', 'Rp ');
    };

    // Format Date string
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const handleLaporan = () => {
        alert("Laporan akhir hari berhasil dibuat & diunduh!");
    };

    const transactionsToRender = stats.latest_transactions && stats.latest_transactions.length > 0
        ? stats.latest_transactions
        : mockTransactions;

    return (
        <div>
            {/* Header section */}
            <div className="dashboard-header">
                <div className="header-title">
                    <h1>Dashboard</h1>
                    <p>Selamat datang kembali! Berikut ringkasan untuk hari ini.</p>
                </div>
                <button className="logout-icon-btn" title="Logout" onClick={() => setShowLogoutModal(true)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" x2="9" y1="12" y2="12" />
                    </svg>
                </button>
            </div>

            {/* Metrics cards */}
            <div className="metrics-grid">
                <div className="metric-card orange">
                    <div className="metric-info">
                        <span className="metric-label">Order hari ini</span>
                        <span className="metric-value">{stats.order_hari_ini}</span>
                    </div>
                    <div className="metric-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m3 3 3 9 4-2 4 5 7-9" />
                        </svg>
                    </div>
                </div>

                <div className="metric-card purple">
                    <div className="metric-info">
                        <span className="metric-label">Pelanggan Aktif</span>
                        <span className="metric-value">{stats.pelanggan_aktif}</span>
                    </div>
                    <div className="metric-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </div>
                </div>

                <div className="metric-card blue">
                    <div className="metric-info">
                        <span className="metric-label">Menunggu/Proses</span>
                        <span className="metric-value">{stats.proses}</span>
                    </div>
                    <div className="metric-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M8 12a4 4 0 1 0 8 0 4 4 0 1 0-8 0" />
                            <path d="M12 12h.01" />
                        </svg>
                    </div>
                </div>

                <div className="metric-card green">
                    <div className="metric-info">
                        <span className="metric-label">Pemasukan hari ini</span>
                        <span className="metric-value">{formatRupiah(stats.pemasukan_hari_ini)}</span>
                    </div>
                    <div className="metric-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" x2="12" y1="2" y2="22" />
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Chart and Shortcut layout */}
            <div className="dashboard-middle">
                {/* SVG Line Chart Card */}
                <div className="chart-card">
                    <div className="chart-header">
                        <span className="chart-title">Pertumbuhan Mingguan</span>
                    </div>
                    <div className="chart-container">
                        <svg viewBox="0 0 500 160" width="100%" height="100%" style={{ overflow: 'visible' }}>
                            {/* Gradients */}
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2"/>
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0"/>
                                </linearGradient>
                            </defs>
                            
                            {/* Gridlines */}
                            <line x1="0" y1="20" x2="500" y2="20" stroke="#f3f4f6" strokeWidth="1" />
                            <line x1="0" y1="60" x2="500" y2="60" stroke="#f3f4f6" strokeWidth="1" />
                            <line x1="0" y1="100" x2="500" y2="100" stroke="#f3f4f6" strokeWidth="1" />
                            <line x1="0" y1="140" x2="500" y2="140" stroke="#f3f4f6" strokeWidth="1" />

                            {/* Chart Area Fill (Area Under Curve) */}
                            <path
                                d="M 10 140 
                                   L 10 120 
                                   Q 50 110, 90 90 
                                   T 170 100 
                                   T 250 50 
                                   T 330 65 
                                   T 410 40 
                                   T 490 55 
                                   L 490 140 Z"
                                fill="url(#chartGradient)"
                            />

                            {/* Chart Line Path */}
                            <path
                                d="M 10 120 
                                   Q 50 110, 90 90 
                                   T 170 100 
                                   T 250 50 
                                   T 330 65 
                                   T 410 40 
                                   T 490 55"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />

                            {/* Data Point Dots */}
                            <circle cx="10" cy="120" r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
                            <circle cx="90" cy="90" r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
                            <circle cx="170" cy="100" r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
                            <circle cx="250" cy="50" r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
                            <circle cx="330" cy="65" r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
                            <circle cx="410" cy="40" r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
                            <circle cx="490" cy="55" r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />

                            {/* X-Axis labels */}
                            <text x="10" y="156" fill="#9ca3af" fontSize="10" textAnchor="middle">senin</text>
                            <text x="90" y="156" fill="#9ca3af" fontSize="10" textAnchor="middle">selasa</text>
                            <text x="170" y="156" fill="#9ca3af" fontSize="10" textAnchor="middle">rabu</text>
                            <text x="250" y="156" fill="#9ca3af" fontSize="10" textAnchor="middle">kamis</text>
                            <text x="330" y="156" fill="#9ca3af" fontSize="10" textAnchor="middle">jumat</text>
                            <text x="410" y="156" fill="#9ca3af" fontSize="10" textAnchor="middle">sabtu</text>
                            <text x="490" y="156" fill="#9ca3af" fontSize="10" textAnchor="middle">minggu</text>
                        </svg>
                    </div>
                </div>

                {/* Shortcuts Card */}
                <div className="shortcut-card">
                    <span className="shortcut-title">Shortcut</span>
                    <div className="shortcut-buttons">
                        <button className="shortcut-btn" onClick={() => navigate('/transaksi')}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" x2="12" y1="5" y2="19" />
                                <line x1="5" x2="19" y1="12" y2="12" />
                            </svg>
                            Tambah transaksi
                        </button>
                        <button className="shortcut-btn secondary" onClick={handleLaporan}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                            Laporan akhir hari
                        </button>
                        <button className="shortcut-btn secondary" onClick={() => setShowLogoutModal(true)} style={{ color: '#ef4444' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" x2="9" y1="12" y2="12" />
                            </svg>
                            Log out
                        </button>
                    </div>
                </div>
            </div>

            {/* Latest Transactions Table */}
            <div className="table-card">
                <div className="table-header">
                    <span className="table-title">Transaksi terbaru</span>
                    <Link to="/riwayat" className="view-all-btn">View semua</Link>
                </div>
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th># Transaksi</th>
                                <th>Pelanggan</th>
                                <th>Layanan</th>
                                <th>Harga</th>
                                <th>Status</th>
                                <th>Tanggal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactionsToRender.map((tx) => {
                                const isMockId = String(tx.id).length === 4;
                                const invoiceLabel = isMockId ? tx.id : (tx.invoice || `TX-${tx.id}`);
                                const layananName = tx.layanan || 'Cuci kering setrika';
                                
                                // Map display badges
                                let badgeClass = 'pending';
                                if (tx.status_pembayaran === 'success' || tx.status_pembayaran === 'selesai') {
                                    badgeClass = 'success';
                                } else if (tx.status_pembayaran === 'sedang dicuci' || tx.status_pembayaran === 'process') {
                                    badgeClass = 'process';
                                }

                                return (
                                    <tr key={tx.id}>
                                        <td style={{ fontWeight: '600' }}>{invoiceLabel}</td>
                                        <td>{tx.nama_pelanggan}</td>
                                        <td>{layananName}</td>
                                        <td>{formatRupiah(tx.total_harga)}</td>
                                        <td>
                                            <span className={`badge ${badgeClass}`}>
                                                {tx.status_pembayaran === 'success' ? 'selesai' : tx.status_pembayaran}
                                            </span>
                                        </td>
                                        <td>{formatDate(tx.created_at)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
