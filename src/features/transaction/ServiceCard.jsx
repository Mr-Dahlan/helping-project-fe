import React from 'react';

const ServiceCard = ({ id, name, price, unit, onAdd }) => {
    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num).replace('Rp', 'Rp ');
    };

    const renderIcon = () => {
        if (name.toLowerCase().includes('setrika') && !name.toLowerCase().includes('cuci')) {
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 8h11a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" />
                    <path d="M5 8V5a2 2 0 0 1 2-2h3" />
                </svg>
            );
        }
        if (name.toLowerCase().includes('pembersih') || name.toLowerCase().includes('pakaian')) {
            return (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.38 3.46L16 7.83l-1.42-1.42 4.38-4.38a1 1 0 0 1 1.42 0l1 1a1 1 0 0 1 0 1.43zM10.5 22h7a2.5 2.5 0 0 0 2.5-2.5V14h-10v5.5a2.5 2.5 0 0 0 2.5 2.5zM4 14h6.5v8H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z" />
                </svg>
            );
        }
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="4" />
                <path d="M12 20a8 8 0 0 0 8-8" />
            </svg>
        );
    };

    return (
        <div className="service-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#475569'
                }}>
                    {renderIcon()}
                </div>
                <div className="service-card-info">
                    <span className="service-card-name">{name}</span>
                    <span className="service-card-price">{formatRupiah(price)} / {unit}</span>
                </div>
            </div>
            <button className="service-add-btn" onClick={() => onAdd(id)}>
                +
            </button>
        </div>
    );
};

export default ServiceCard;
