import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { updateTransactionStatus } from '../../service/transactionService';

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
    const [allTransactions, setAllTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const mockTransactions = [
        { id: 1001, nama_pelanggan: 'Amri Pratama', layanan: 'Cuci kering setrika', total_harga: 16875, status_pembayaran: 'selesai', created_at: '2026-05-24T09:15:00+07:00' },
        { id: 1002, nama_pelanggan: 'Rina Saputri', layanan: 'Cuci kering setrika', total_harga: 33750, status_pembayaran: 'selesai', created_at: '2026-05-25T13:45:00+07:00' },
        { id: 1003, nama_pelanggan: 'Fajar Nugroho', layanan: 'Cuci Kering (Biasa)', total_harga: 49500, status_pembayaran: 'selesai', created_at: '2026-05-26T10:30:00+07:00' },
        { id: 1004, nama_pelanggan: 'Dwi Lestari', layanan: 'Cuci kering (Setrika)', total_harga: 33750, status_pembayaran: 'pending', created_at: '2026-05-26T15:20:00+07:00' }
    ];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
                const [statsRes, ordersRes] = await Promise.all([
                    axios.get(`${apiURL}/dashboard-stats`),
                    axios.get(`${apiURL}/orders`).catch(e => {
                        console.warn("Gagal mengambil orders", e);
                        return { data: { status: 'success', data: [] } };
                    })
                ]);
                
                if (statsRes.data.status === 'success') {
                    setStats(statsRes.data.data);
                }
                if (ordersRes.data.status === 'success') {
                    setAllTransactions(ordersRes.data.data);
                }
            } catch (err) {
                console.error("Gagal mengambil data dashboard", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

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
        const todayStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        const dateIso = new Date().toISOString().split('T')[0];
        
        let reportText = `==================================================\n`;
        reportText += `       LAPORAN AKHIR HARI - LAUNDRYinAja\n`;
        reportText += `       Tanggal: ${todayStr}\n`;
        reportText += `==================================================\n\n`;
        reportText += `RINGKASAN TRANSAKSI HARI INI:\n`;
        reportText += `--------------------------------------------------\n`;
        reportText += `Total Order       : ${stats.order_hari_ini} transaksi\n`;
        reportText += `Pelanggan Aktif   : ${stats.pelanggan_aktif} orang\n`;
        reportText += `Status Antrean    : ${stats.proses} (Pending/Total)\n`;
        reportText += `Total Pemasukan   : ${formatRupiah(stats.pemasukan_hari_ini)}\n\n`;
        
        reportText += `DAFTAR TRANSAKSI TERBARU:\n`;
        reportText += `--------------------------------------------------\n`;
        
        const txList = stats.latest_transactions && stats.latest_transactions.length > 0 
            ? stats.latest_transactions 
            : mockTransactions;
            
        txList.forEach((tx) => {
            const isMockId = String(tx.id).length === 4;
            const invoiceLabel = isMockId ? tx.id : (tx.invoice || `TX-${tx.id}`);
            const layananName = getLayananText(tx);
            const priceLabel = formatRupiah(tx.total_harga);
            const statusLabel = tx.status_pembayaran;
            const timeLabel = new Date(tx.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
            
            reportText += `#${invoiceLabel} | ${tx.nama_pelanggan.padEnd(16)} | ${layananName.padEnd(20)} | ${priceLabel.padEnd(12)} | [${statusLabel}] | ${timeLabel}\n`;
        });
        
        reportText += `\n==================================================\n`;
        reportText += `Laporan digenerate secara otomatis pada ${new Date().toLocaleTimeString('id-ID')} WIB.\n`;
        reportText += `==================================================\n`;

        try {
            localStorage.setItem(`laporan_${dateIso}`, reportText);
            
            const reportIndex = JSON.parse(localStorage.getItem('riwayat_laporan_index') || '[]');
            if (!reportIndex.includes(dateIso)) {
                reportIndex.push(dateIso);
                localStorage.setItem('riwayat_laporan_index', JSON.stringify(reportIndex));
            }
        } catch (e) {
            console.error("Gagal menyimpan laporan ke localStorage", e);
        }

        const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `laporan_akhir_hari_${dateIso}.txt`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert(`Laporan akhir hari (${dateIso}) berhasil diunduh dan disimpan di Local Storage!`);
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateTransactionStatus(id, newStatus);
            
            setStats(prev => {
                const updatedList = (prev.latest_transactions || []).map(tx => 
                    tx.id === id ? { ...tx, status_pembayaran: newStatus } : tx
                );
                
                // Recalculate pending/proses/antri vs total processes
                const activeCount = updatedList.filter(tx => 
                    tx.status_pembayaran === 'antri' || 
                    tx.status_pembayaran === 'proses' || 
                    tx.status_pembayaran === 'pending'
                ).length;
                const totalCount = updatedList.length;
                const processString = `${activeCount}/${totalCount}`;

                return {
                    ...prev,
                    proses: totalCount > 0 ? processString : prev.proses,
                    latest_transactions: updatedList
                };
            });
        } catch (err) {
            console.error("Gagal memperbarui status transaksi", err);
            setStats(prev => ({
                ...prev,
                latest_transactions: (prev.latest_transactions || []).map(tx => 
                    tx.id === id ? { ...tx, status_pembayaran: newStatus } : tx
                )
            }));
        }
    };

    const rawTransactions = stats.latest_transactions && stats.latest_transactions.length > 0
        ? stats.latest_transactions
        : mockTransactions;

    // Sort by id descending
    const transactionsToRender = [...rawTransactions].sort((a, b) => b.id - a.id);

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
        return tx.layanan || 'Cuci kering setrika';
    };

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

            {/* Metrics cards (Only Order Hari Ini and Menunggu/Proses, side-by-side) */}
            <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
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
            </div>

            {/* Space buffer */}
            <div style={{ margin: '24px 0' }}></div>

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
                                <th>ID Transaksi</th>
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
                                const invoiceLabel = isMockId ? tx.id : (tx.invoice || tx.id);
                                const layananName = getLayananText(tx);
                                
                                return (
                                    <tr key={tx.id}>
                                        <td style={{ fontWeight: '600' }}>{invoiceLabel}</td>
                                        <td>{tx.nama_pelanggan}</td>
                                        <td style={{ maxWidth: '350px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={layananName}>
                                            {layananName}
                                        </td>
                                        <td className="price-text">{formatRupiah(tx.total_harga)}</td>
                                        <td>
                                            <select 
                                                value={tx.status_pembayaran}
                                                onChange={(e) => handleStatusChange(tx.id, e.target.value)}
                                                className={`status-select ${tx.status_pembayaran}`}
                                            >
                                                <option value="antri">antri</option>
                                                <option value="proses">proses</option>
                                                <option value="selesai">selesai</option>
                                                <option value="diambil">diambil</option>
                                                <option value="batal">batal</option>
                                            </select>
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
