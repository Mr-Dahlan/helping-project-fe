import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminHistoryPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedTx, setSelectedTx] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
                const res = await axios.get(`${apiURL}/orders`);
                if (res.data.status === 'success') {
                    setTransactions(res.data.data);
                }
            } catch (err) {
                console.error("Gagal mengambil riwayat transaksi admin:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    // Format Rupiah
    const formatRupiah = (num) => {
        if (num === undefined || num === null) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num).replace('Rp', 'Rp ');
    };

    // Format Tanggal & Waktu
    const formatDate = (dateStr) => {
        if (!dateStr) return { date: '-', time: '' };
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return { date: dateStr, time: '' };
        
        const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('id-ID', dateOptions);
        
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
        const formattedTime = date.toLocaleTimeString('id-ID', timeOptions).replace(':', '.') + ' WIB';
        
        return { date: formattedDate, time: formattedTime };
    };

    // Filter pencarian
    const filteredTransactions = transactions.filter(tx => {
        const query = searchQuery.toLowerCase();
        const invoice = String(tx.invoice || tx.id || '').toLowerCase();
        const name = String(tx.nama_pelanggan || '').toLowerCase();
        const kasir = String(tx.kasir || '').toLowerCase();
        const metode = String(tx.metode_pembayaran || '').toLowerCase();
        
        let servicesStr = '';
        if (tx.details && tx.details.length > 0) {
            servicesStr = tx.details.map(d => d.layanan ? d.layanan.nama : '').join(' ').toLowerCase();
        }
        
        const dateObj = formatDate(tx.created_at);
        const dateStr = String(dateObj.date || '').toLowerCase();
        const timeStr = String(dateObj.time || '').toLowerCase();

        return invoice.includes(query) || 
               name.includes(query) || 
               kasir.includes(query) || 
               metode.includes(query) || 
               servicesStr.includes(query) || 
               dateStr.includes(query) || 
               timeStr.includes(query);
    });

    // Helper untuk detail layanan
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

    return (
        <div>
            {/* Header Section */}
            <div className="dashboard-header">
                <div className="header-title">
                    <h1>Riwayat Transaksi (Admin)</h1>
                    <p>Audit dan monitor seluruh laporan transaksi masuk secara real-time.</p>
                </div>
            </div>

            {/* Search Controls */}
            <div className="history-controls">
                <div className="search-bar-container">
                    <svg className="search-icon-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input 
                        type="text" 
                        placeholder="Cari ID transaksi, nama, kasir, metode pembayaran..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {/* Table Card */}
            <div className="table-card">
                <div className="table-header">
                    <span className="table-title">Audit Ledger Transaksi</span>
                    <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>
                        Menampilkan {filteredTransactions.length} records
                    </span>
                </div>
                
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#6b7280' }}>
                        Mengambil data audit ledger...
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>
                        {searchQuery ? 'Tidak ada data yang cocok dengan kriteria pencarian.' : 'Belum ada transaksi terekam.'}
                    </div>
                ) : (
                    <div className="data-table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID Transaksi</th>
                                    <th>Pelanggan</th>
                                    <th>Layanan Utama</th>
                                    <th>Kasir</th>
                                    <th>Metode</th>
                                    <th>Total Bayar</th>
                                    <th>Status</th>
                                    <th>Tanggal & Waktu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...filteredTransactions].sort((a, b) => b.id - a.id).map((tx) => {
                                    return (
                                        <tr 
                                            key={tx.id} 
                                            onClick={() => setSelectedTx(tx)}
                                            style={{ cursor: 'pointer' }}
                                            className="clickable-row"
                                        >
                                            <td style={{ fontWeight: '700', color: '#2563eb' }}>{tx.invoice || tx.id}</td>
                                            <td>{tx.nama_pelanggan}</td>
                                            <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={getLayananText(tx)}>
                                                {getLayananText(tx)}
                                            </td>
                                            <td style={{ fontWeight: '500' }}>{tx.kasir || 'Siti Aminah'}</td>
                                            <td style={{ textTransform: 'uppercase', fontSize: '12px', fontWeight: '600' }}>{tx.metode_pembayaran || 'cash'}</td>
                                            <td className="price-text" style={{ fontWeight: '600' }}>{formatRupiah(tx.total_harga)}</td>
                                            <td>
                                                <span className={`badge ${tx.status_pembayaran}`} style={{ fontSize: '11px', padding: '4px 10px', fontWeight: '700' }}>
                                                    {tx.status_pembayaran}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="date-time-cell">
                                                    <span className="date-text">{formatDate(tx.created_at).date}</span>
                                                    {formatDate(tx.created_at).time && (
                                                        <span className="time-text" style={{ fontSize: '11px', color: '#6b7280' }}>{formatDate(tx.created_at).time}</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Premium detail modal */}
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
                                fontSize: '13px',
                                transition: 'background-color 0.2s'
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
                                <span style={{ fontWeight: '700', fontSize: '14px', color: '#111827', textTransform: 'uppercase' }}>{selectedTx.nama_pelanggan}</span>
                            </div>
                            <div>
                                <span style={{ fontSize: '10px', color: '#6b7280', display: 'block', textTransform: 'uppercase', fontWeight: '600' }}>No Handphone</span>
                                <span style={{ fontWeight: '600', fontSize: '14px', color: '#111827' }}>{selectedTx.nomor_hp || '-'}</span>
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
                                    {formatDate(selectedTx.created_at).date}, {formatDate(selectedTx.created_at).time}
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
                            <span style={{ color: '#10b981', fontSize: '16px' }}>{formatRupiah(selectedTx.total_harga)}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminHistoryPage;
