import React from 'react';

const CardItem = ({ item, onIncrease, onDecrease, onRemove }) => {
    // Format number to Rupiah
    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num).replace('Rp', 'Rp ');
    };

    const itemTotalPrice = item.price * item.quantity;

    return (
        <div className="cart-item" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0',
            borderBottom: '1px solid #f1f5f9'
        }}>
            <div className="cart-item-info">
                <span className="cart-item-name" style={{ fontWeight: '600', fontSize: '14px', color: '#1f2937' }}>
                    {item.name}
                </span>
                <span className="cart-item-price" style={{ fontSize: '12px', color: '#6b7280' }}>
                    {formatRupiah(item.price)} x {item.quantity} = {formatRupiah(itemTotalPrice)}
                </span>
            </div>
            
            <div className="cart-item-controls" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button className="cart-qty-btn" onClick={onDecrease}>
                    -
                </button>
                <span className="cart-qty">{item.quantity}</span>
                <button className="cart-qty-btn" onClick={onIncrease}>
                    +
                </button>
                <button 
                    onClick={onRemove}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default CardItem;
