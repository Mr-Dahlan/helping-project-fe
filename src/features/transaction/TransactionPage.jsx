import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { postTransaction } from '../../service/transactionService';
import ServiceCard from './ServiceCard';
import OrderSummary from './OrderSummary';

const TransactionPage = () => {
    const navigate = useNavigate();
    const [customer, setCustomer] = useState({ nama: '', nomor: '', alamat: '' });
    const [category, setCategory] = useState('normal'); // 'express' atau 'normal'
    const [cart, setCart] = useState([]);
    const [paying, setPaying] = useState(false);
    const [services, setServices] = useState([]);

    // List of services with prices based on category (fallback if API is empty/loading)
    const servicesData = {
        normal: [
            { id: 1, name: 'Cuci & Lipat', price: 10000, unit: 'kg' },
            { id: 2, name: 'Setrika Saja', price: 8000, unit: 'kg' },
            { id: 3, name: 'Cuci Kering Setrika', price: 12000, unit: 'kg' },
            { id: 4, name: 'Pembersih Pakaian', price: 15000, unit: 'item' },
        ],
        express: [
            { id: 5, name: 'Cuci & Lipat', price: 15000, unit: 'kg' },
            { id: 6, name: 'Setrika Saja', price: 12000, unit: 'kg' },
            { id: 7, name: 'Cuci Kering Setrika', price: 18000, unit: 'kg' },
            { id: 8, name: 'Pembersih Pakaian', price: 22000, unit: 'item' },
        ]
    };

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
                const res = await axios.get(`${apiURL}/services`);
                if (res.data.status === 'success' && res.data.data.length > 0) {
                    const formatted = res.data.data.map(s => ({
                        id: s.id,
                        name: s.nama,
                        price: s.harga,
                        unit: s.satuan,
                        kategori: s.kategori
                    }));
                    setServices(formatted);
                }
            } catch (err) {
                console.error("Gagal mengambil data layanan dari backend", err);
            }
        };
        fetchServices();
    }, []);

    const activeServices = services.length > 0
        ? services.filter(s => s.kategori === category)
        : servicesData[category];

    // Add item to cart
    const handleAddService = (serviceId) => {
        const service = activeServices.find(s => s.id === serviceId);
        if (!service) return;

        setCart(prevCart => {
            const existing = prevCart.find(item => item.id === serviceId);
            if (existing) {
                return prevCart.map(item => 
                    item.id === serviceId ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [
                ...prevCart,
                { id: service.id, name: service.name, price: service.price, unit: service.unit, quantity: 1 }
            ];
        });
    };

    // Increment qty
    const handleIncreaseQty = (itemId) => {
        setCart(prevCart => 
            prevCart.map(item => 
                item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    // Decrement qty
    const handleDecreaseQty = (itemId) => {
        setCart(prevCart => 
            prevCart.map(item => 
                item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
            )
        );
    };

    // Remove item
    const handleRemoveItem = (itemId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    };

    // Cart calculations
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.125); // 12.5% tax (VAT + service fee)
    const total = subtotal + tax;

    const handleBayar = async () => {
        if (cart.length === 0) return;
        setPaying(true);

        try {
            // Prepare payload
            const payload = {
                nama: customer.nama,
                nomor: customer.nomor,
                alamat: customer.alamat,
                total: total,
                cart: cart
            };

            const res = await postTransaction(payload);
            
            if (res.status === 'success') {
                // Save checkout receipt details locally so SuccessPage can render high-fidelity receipt
                const receiptDetails = {
                    invoice: res.data.invoice || 'INV-' + Date.now(),
                    nama_pelanggan: customer.nama,
                    nomor_hp: customer.nomor,
                    alamat: customer.alamat,
                    subtotal: subtotal,
                    tax: tax,
                    total: total,
                    cart: cart,
                    created_at: new Date().toISOString()
                };
                localStorage.setItem('last_receipt', JSON.stringify(receiptDetails));
                
                // Navigate to success page
                navigate('/success');
            }
        } catch (err) {
            console.error("Gagal melakukan transaksi", err);
            alert("Gagal memproses pembayaran. Coba lagi.");
        } finally {
            setPaying(false);
        }
    };

    return (
        <div>
            {/* Header / Title Section */}
            <div className="dashboard-header" style={{ marginBottom: '20px' }}>
                <div className="header-title">
                    <h1>Transaksi baru</h1>
                    <p>Pilih layanan dan proses pembayaran pelanggan.</p>
                </div>
                {/* Close Button */}
                <button 
                    onClick={() => navigate('/')}
                    style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#000',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '14px'
                    }}
                >
                    X
                </button>
            </div>

            {/* Main grid content */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '24px', alignItems: 'start' }}>
                {/* Left Panel: Services Catalog */}
                <div style={{ background: '#ffffff', borderRadius: '14px', padding: '24px', border: '1px solid #e5e7eb' }}>
                    {/* Category Filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                        <span style={{ fontWeight: '600', fontSize: '15px' }}>pilih layanan</span>
                        <div className="service-filter">
                            <button 
                                className={`filter-btn ${category === 'express' ? 'active' : ''}`}
                                onClick={() => setCategory('express')}
                            >
                                express
                            </button>
                            <button 
                                className={`filter-btn ${category === 'normal' ? 'active' : ''}`}
                                onClick={() => setCategory('normal')}
                            >
                                normal
                            </button>
                        </div>
                    </div>

                    {/* Services Grid */}
                    <div className="services-grid">
                        {activeServices.map(service => (
                            <ServiceCard 
                                key={service.id}
                                id={service.id}
                                name={service.name}
                                price={service.price}
                                unit={service.unit}
                                onAdd={handleAddService}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Panel: Customer info and Cart summary */}
                <OrderSummary 
                    customer={customer}
                    setCustomer={setCustomer}
                    cart={cart}
                    onIncrease={handleIncreaseQty}
                    onDecrease={handleDecreaseQty}
                    onRemove={handleRemoveItem}
                    onPay={handleBayar}
                    subtotal={subtotal}
                    tax={tax}
                    total={total}
                    paying={paying}
                />
            </div>
        </div>
    );
};

export default TransactionPage;