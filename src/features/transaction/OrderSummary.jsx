import React from 'react';
import CardItem from './CardItem';

const OrderSummary = ({ 
    customer, 
    setCustomer, 
    cart, 
    onIncrease, 
    onDecrease, 
    onRemove, 
    onPay, 
    subtotal, 
    tax, 
    total,
    paying
}) => {
    // Format number to Rupiah
    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num).replace('Rp', 'Rp ');
    };

    const isCartEmpty = cart.length === 0;
    const isFormIncomplete = !customer.nama.trim() || !customer.nomor.trim() || !customer.alamat.trim();

    return (
        <div className="transaction-right-panel">
            {/* Info Pelanggan Section */}
            <div className="client-info-card">
                <h3 className="client-info-title">Info pelanggan</h3>
                
                <div className="form-group">
                    <input 
                        type="text" 
                        placeholder="Nama" 
                        value={customer.nama} 
                        onChange={(e) => setCustomer({ ...customer, nama: e.target.value })}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <input 
                        type="text" 
                        placeholder="Nomor HP" 
                        value={customer.nomor} 
                        onChange={(e) => setCustomer({ ...customer, nomor: e.target.value })}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <textarea 
                        placeholder="Alamat" 
                        value={customer.alamat} 
                        onChange={(e) => setCustomer({ ...customer, alamat: e.target.value })}
                        className="form-input"
                        rows="3"
                        style={{ resize: 'none', fontFamily: 'inherit' }}
                    />
                </div>

                <button className="continue-btn" disabled={true} style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                    lanjutkan
                </button>
            </div>

            {/* Keranjang Section */}
            <div className="cart-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 className="cart-title" style={{ margin: 0 }}>Keranjang</h3>
                    <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>
                        {cart.reduce((sum, item) => sum + item.quantity, 0)} Porsi/kg
                    </span>
                </div>

                <div className="cart-items-list">
                    {isCartEmpty ? (
                        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '24px 0', fontSize: '14px' }}>
                            Keranjang kosong
                        </div>
                    ) : (
                        cart.map(item => (
                            <CardItem 
                                key={item.id} 
                                item={item} 
                                onIncrease={() => onIncrease(item.id)}
                                onDecrease={() => onDecrease(item.id)}
                                onRemove={() => onRemove(item.id)}
                            />
                        ))
                    )}
                </div>

                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#4b5563' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Layanan Laundry</span>
                        <span>{formatRupiah(subtotal)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Pajak + PPN (12.5%)</span>
                        <span>{formatRupiah(tax)}</span>
                    </div>
                    <div className="cart-total-section">
                        <span>TOTAL</span>
                        <span>{formatRupiah(total)}</span>
                    </div>
                </div>

                <button 
                    className="pay-btn" 
                    onClick={onPay}
                    disabled={isCartEmpty || isFormIncomplete || paying}
                >
                    {paying ? 'Memproses...' : 'Selesaikan Pembayaran'}
                </button>
            </div>
        </div>
    );
};

export default OrderSummary;
