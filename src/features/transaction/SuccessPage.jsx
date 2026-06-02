import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SuccessPage = () => {
    const navigate = useNavigate();
    const [receipt, setReceipt] = useState(null);

    useEffect(() => {
        const savedReceipt = localStorage.getItem('last_receipt');
        if (savedReceipt) {
            setReceipt(JSON.parse(savedReceipt));
        } else {
            setReceipt({
                invoice: '1005',
                nama_pelanggan: 'AMRI PRATAMA',
                nomor_hp: '08123456789',
                alamat: 'Tenggilis Mejoyo',
                catatan: '',
                metode_pembayaran: 'cash',
                kasir: 'Siti Aminah',
                subtotal: 20000,
                tax: 2200,
                total: 22200,
                cart: [
                    { id: 1, name: 'Cuci & Lipat', price: 10000, quantity: 2, unit: 'kg' }
                ],
                created_at: new Date().toISOString()
            });
        }
    }, []);

    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num).replace('Rp', 'Rp ');
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
            <div className="receipt-card" style={{ position: 'relative' }}>
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
                    <div className="receipt-header-icon" style={{ backgroundColor: '#10b981', color: '#fff' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <h2 style={{ textTransform: 'lowercase', fontWeight: '700', fontSize: '20px' }}>transaksi berhasil di input</h2>
                    <p>Terimakasih telah mempercayai laundry kami</p>
                </div>

                {/* Receipt Details Box */}
                <div className="receipt-body">
                    <div className="receipt-invoice-box">
                        <span className="receipt-invoice-label">ID Transaksi</span>
                        <div className="receipt-invoice-id">{receipt.invoice}</div>
                        <div className="receipt-invoice-status" style={{ color: '#ef4444', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>
                            antri
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="receipt-section-title">Informasi pelanggan</div>
                    <div className="receipt-info-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '8px', fontSize: '13px' }}>
                        <span className="receipt-info-label" style={{ color: '#6b7280' }}>Nama:</span>
                        <span className="receipt-info-val" style={{ textTransform: 'uppercase', fontWeight: '600' }}>{receipt.nama_pelanggan}</span>
                        
                        <span className="receipt-info-label" style={{ color: '#6b7280' }}>No Handphone:</span>
                        <span className="receipt-info-val" style={{ fontWeight: '600' }}>{receipt.nomor_hp || '-'}</span>

                        <span className="receipt-info-label" style={{ color: '#6b7280' }}>Metode pembayaran:</span>
                        <span className="receipt-info-val" style={{ fontWeight: '600', textTransform: 'uppercase' }}>{receipt.metode_pembayaran || 'cash'}</span>

                        {receipt.catatan && (
                            <>
                                <span className="receipt-info-label" style={{ color: '#6b7280' }}>Catatan:</span>
                                <span className="receipt-info-val" style={{ fontStyle: 'italic' }}>{receipt.catatan}</span>
                            </>
                        )}
                    </div>

                    {/* Services Breakdown */}
                    <div className="receipt-section-title">Detail layanan</div>
                    <div className="receipt-items-list">
                        {receipt.cart && receipt.cart.map((item, index) => (
                            <div key={index} className="receipt-item-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                                <span className="receipt-item-desc">
                                    {item.name} <span style={{ color: '#6b7280' }}>x{Math.round(item.quantity)}</span>
                                </span>
                                <span className="receipt-item-price">{formatRupiah(item.price * item.quantity)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="receipt-total-box" style={{ borderTop: '1px solid #e5e7eb', paddingTop: '10px', marginTop: '10px' }}>
                        <div className="receipt-total-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#4b5563', marginBottom: '4px' }}>
                            <span>Subtotal</span>
                            <span className="price-text">{formatRupiah(receipt.subtotal)}</span>
                        </div>
                        <div className="receipt-total-row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#4b5563', marginBottom: '4px' }}>
                            <span>Pajak + PPN (11%)</span>
                            <span className="price-text">{formatRupiah(receipt.tax)}</span>
                        </div>
                        <div className="receipt-total-row grand-total" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '15px', color: '#000', borderTop: '1px dashed #d1d5db', paddingTop: '8px', marginTop: '4px' }}>
                            <span>total</span>
                            <span className="price-text">{formatRupiah(receipt.total)}</span>
                        </div>
                    </div>

                    {/* Actions and redirection */}
                    <div className="receipt-actions" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button className="receipt-btn" onClick={() => navigate('/')} style={{ padding: '12px', borderRadius: '24px', backgroundColor: '#0f172a', color: '#fff', border: 'none', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
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
