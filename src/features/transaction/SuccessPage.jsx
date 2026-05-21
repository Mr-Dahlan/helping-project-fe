import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SuccessPage = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5);
    const [receipt, setReceipt] = useState(null);

    useEffect(() => {

        const savedReceipt = localStorage.getItem('last_receipt');
        if (savedReceipt) {
            setReceipt(JSON.parse(savedReceipt));
        } else {

            setReceipt({
                invoice: '1125',
                nama_pelanggan: 'AMRI PRATAMA',
                nomor_hp: '08123456789',
                alamat: 'Tenggilis Mejoyo',
                subtotal: 20000,
                tax: 2000,
                total: 22000,
                cart: [
                    { id: 1, name: 'Cuci & Lipat', price: 10000, quantity: 2, unit: 'kg' }
                ],
                created_at: new Date().toISOString()
            });
        }
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num).replace('Rp', 'Rp ');
    };

    const formatDateTime = (dateStr) => {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        
        const pad = (n) => String(n).padStart(2, '0');
        const day = pad(date.getDate());
        const month = pad(date.getMonth() + 1);
        const year = date.getFullYear();
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds} WIB`;
    };

    if (!receipt) {
        return (
            <div className="success-container">
                <div style={{ color: '#fff', fontSize: '18px' }}>Loading receipt...</div>
            </div>
        );
    }

    return (
        <div className="success-container">
            <div className="receipt-card">
                {/* Close Button X */}
                <button 
                    onClick={() => navigate('/')}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: '#000',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '12px',
                        zIndex: 10
                    }}
                >
                    X
                </button>

                {/* Receipt Success Header Banner */}
                <div className="receipt-header">
                    <div className="receipt-header-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <h2>Pembayaran Berhasil!</h2>
                    <p>Terimakasih telah mempercayai laundry kami</p>
                </div>

                {/* Receipt Details Box */}
                <div className="receipt-body">
                    <div className="receipt-invoice-box">
                        <span className="receipt-invoice-label">ID Transaksi</span>
                        <div className="receipt-invoice-id">{receipt.invoice}</div>
                        <div className="receipt-invoice-status" style={{ color: '#ff7a00', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>
                            pending
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="receipt-section-title">Informasi pelanggan</div>
                    <div className="receipt-info-grid">
                        <span className="receipt-info-label">Nama:</span>
                        <span className="receipt-info-val" style={{ textTransform: 'uppercase' }}>{receipt.nama_pelanggan}</span>
                        
                        <span className="receipt-info-label">Tanggal & Waktu:</span>
                        <span className="receipt-info-val">{formatDateTime(receipt.created_at)}</span>
                        
                        <span className="receipt-info-label">Metode pembayaran:</span>
                        <span className="receipt-info-val">Tunai</span>
                    </div>

                    {/* Services Breakdown */}
                    <div className="receipt-section-title">Detail layanan</div>
                    <div className="receipt-items-list">
                        {receipt.cart && receipt.cart.map((item, index) => (
                            <div key={index} className="receipt-item-row">
                                <span className="receipt-item-desc">
                                    {item.name} <span style={{ color: '#6b7280' }}>x{item.quantity}</span>
                                </span>
                                <span className="receipt-item-price">{formatRupiah(item.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="receipt-total-box">
                        <div className="receipt-total-row">
                            <span>Subtotal</span>
                            <span>{formatRupiah(receipt.subtotal)}</span>
                        </div>
                        <div className="receipt-total-row">
                            <span>Pajak + PPN (11%)</span>
                            <span>{formatRupiah(receipt.tax)}</span>
                        </div>
                        <div className="receipt-total-row grand-total">
                            <span>total</span>
                            <span>{formatRupiah(receipt.total)}</span>
                        </div>
                    </div>

                    {/* Actions and redirection */}
                    <div className="receipt-actions">
                        <a href="#" className="receipt-link-btn disabled" onClick={(e) => e.preventDefault()}>
                            print struk (belum tersedia)
                        </a>
                        <Link to="/transaksi" className="receipt-link-btn">
                            klik disini untuk melanjutkan order
                        </Link>
                        
                        <div className="receipt-timer-text">
                            kembali ke dashboard dalam {countdown} detik...
                        </div>

                        <button className="receipt-btn" onClick={() => navigate('/')}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" x2="12" y1="19" y2="5" />
                                <polyline points="5 12 12 5 19 12" />
                            </svg>
                            kembali ke dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
