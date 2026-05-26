import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { updateTransactionStatus } from '../../service/transactionService';

const HistoryPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Memastikan fallback URL mengarah ke backend Laravel/Express kamu
                const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
                const res = await axios.get(`${apiURL}/orders`);
                if (res.data.status === 'success') {
                    setTransactions(res.data.data);
                }
            } catch (err) {
                console.error("Gagal mengambil riwayat transaksi:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    // Format angka ke Rupiah
    const formatRupiah = (num) => {
        if (num === undefined || num === null) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num).replace('Rp', 'Rp ');
    };

    // Format string tanggal
    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        const options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return date.toLocaleDateString('id-ID', options) + ' WIB'; // Diubah ke id-ID agar serasi dengan Rupiah dan menambahkan WIB
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateTransactionStatus(id, newStatus);
            setTransactions(prev => 
                prev.map(tx => tx.id === id ? { ...tx, status_pembayaran: newStatus } : tx)
            );
            alert(`Status transaksi #${id} berhasil diubah menjadi ${newStatus}`);
        } catch (err) {
            console.error("Gagal memperbarui status transaksi:", err);
            // Local fallback update for offline testing
            setTransactions(prev => 
                prev.map(tx => tx.id === id ? { ...tx, status_pembayaran: newStatus } : tx)
            );
            alert(`Status transaksi berhasil diperbarui secara lokal.`);
        }
    };

    // Filter transaksi berdasarkan query pencarian
    const filteredTransactions = transactions.filter(tx => {
        const query = searchQuery.toLowerCase();
        const invoice = String(tx.invoice || tx.id || '').toLowerCase();
        const name = String(tx.nama_pelanggan || '').toLowerCase();
        return invoice.includes(query) || name.includes(query);
    });

    return (
        <div>
            {/* Header Section */}
            <div className="dashboard-header">
                <div className="header-title">
                    <h1>Riwayat Transaksi</h1>
                    <p>Daftar seluruh transaksi yang telah tercatat di outlet.</p>
                </div>
            </div>

            {/* Controls: Search Bar */}
            <div className="history-controls">
                <div className="search-bar-container">
                    <span style={{ marginRight: '8px', color: '#9ca3af' }}>🔍</span>
                    <input 
                        type="text" 
                        placeholder="Cari nama pelanggan atau invoice..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {/* Transactions Table Card */}
            <div className="table-card">
                <div className="table-header">
                    <span className="table-title">Daftar Transaksi</span>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>
                        Menampilkan {filteredTransactions.length} transaksi
                    </span>
                </div>
                
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                        Mengambil data transaksi...
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>
                        {searchQuery ? 'Tidak ada transaksi yang cocok dengan pencarian.' : 'Belum ada riwayat transaksi.'}
                    </div>
                ) : (
                    <div className="data-table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>No Invoice</th>
                                    <th>Pelanggan</th>
                                    <th>No Handphone</th>
                                    <th>Alamat</th>
                                    <th>Total Bayar</th>
                                    <th>Status Pembayaran</th>
                                    <th>Tanggal & Waktu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map((tx) => {
                                    // Dinamisasi kelas badge status
                                    let badgeClass = 'success';
                                    const status = String(tx.status_pembayaran || '').toLowerCase();
                                    
                                    if (status === 'pending' || status === 'belum bayar') {
                                        badgeClass = 'pending';
                                    } else if (status === 'sedang dicuci' || status === 'process' || status === 'proses') {
                                        badgeClass = 'process';
                                    }

                                    return (
                                        <tr key={tx.id}>
                                            <td style={{ fontWeight: '600' }}>{tx.invoice || `INV-${tx.id}`}</td>
                                            <td>{tx.nama_pelanggan}</td>
                                            <td>{tx.nomor_hp || '-'}</td>
                                            <td>{tx.alamat || '-'}</td>
                                            <td className="price-text">{formatRupiah(tx.total_harga)}</td>
                                            <td>
                                                <select 
                                                    value={tx.status_pembayaran === 'success' ? 'selesai' : (tx.status_pembayaran === 'sedang dicuci' || tx.status_pembayaran === 'process' ? 'proses' : tx.status_pembayaran)}
                                                    onChange={(e) => handleStatusChange(tx.id, e.target.value)}
                                                    className={`status-select ${
                                                        tx.status_pembayaran === 'selesai' || tx.status_pembayaran === 'success' ? 'success' :
                                                        tx.status_pembayaran === 'proses' || tx.status_pembayaran === 'sedang dicuci' || tx.status_pembayaran === 'process' ? 'process' :
                                                        tx.status_pembayaran === 'cancel' ? 'cancel' : 'pending'
                                                    }`}
                                                >
                                                    <option value="pending">pending</option>
                                                    <option value="proses">proses</option>
                                                    <option value="selesai">selesai</option>
                                                    <option value="cancel">cancel</option>
                                                </select>
                                            </td>
                                            <td>{formatDate(tx.created_at)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;