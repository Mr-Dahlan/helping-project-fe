import React, { useState } from 'react';
import type { CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { useService } from '../hooks/useService';
import { useOrder } from '../hooks/useOrder';
import type { CreateServicePayload } from '../types/Service';
import ServiceCard from '../components/ServiceCard';
import OrderSummary from '../components/OrderSummary';

// ── Types lokal ──────────────────────────────────────────────────────────────
interface CartItem {
    id: number;
    name: string;
    price: number;
    unit: string;
    quantity: number;
}

interface CustomerForm {
    nama: string;
    nomor: string;
    alamat: string;
}

interface NewServiceForm {
    nama_layanan: string;
    harga: string;
    satuan: string;
    kategori: string;
    deskripsi: string;
}

const TransactionPage = () => {
    const navigate = useNavigate();
    const [customer, setCustomer] = useState<CustomerForm>({ nama: '', nomor: '', alamat: '' });
    const [category, setCategory] = useState<string>('reguler');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [paying, setPaying] = useState<boolean>(false);

    // ── Modal state ──────────────────────────────────────────────────────────
    const [showAddModal, setShowAddModal] = useState<boolean>(false);
    const [newService, setNewService] = useState<NewServiceForm>({
        nama_layanan: '',
        harga: '',
        satuan: 'kg',
        kategori: 'reguler',
        deskripsi: '',
    });
    const [addingService, setAddingService] = useState<boolean>(false);

    // ── Hooks ────────────────────────────────────────────────────────────────
    const { services, addService } = useService();
    const { createOrder } = useOrder();

    // ── Filter layanan berdasarkan kategori aktif ────────────────────────────
    const activeServices = services.filter(
        (s) => (s.kategori ?? 'reguler') === category
    );

    // ── Cart handlers ────────────────────────────────────────────────────────
    const handleAddService = (serviceId: number) => {
        const service = activeServices.find((s) => s.id === serviceId);
        if (!service) return;
        setCart((prev) => {
            const existing = prev.find((item) => item.id === serviceId);
            if (existing) {
                return prev.map((item) =>
                    item.id === serviceId ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [
                ...prev,
                { id: service.id, name: service.nama_layanan, price: service.harga, unit: service.satuan, quantity: 1 },
            ];
        });
    };

    const handleIncreaseQty = (itemId: number) =>
        setCart((prev) =>
            prev.map((item) => (item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item))
        );

    const handleDecreaseQty = (itemId: number) =>
        setCart((prev) =>
            prev.map((item) =>
                item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
            )
        );

    const handleRemoveItem = (itemId: number) =>
        setCart((prev) => prev.filter((item) => item.id !== itemId));

    // ── Kalkulasi harga ──────────────────────────────────────────────────────
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.11);
    const total = subtotal + tax;

    // ── Submit order ─────────────────────────────────────────────────────────
    const handleBayar = async () => {
        if (cart.length === 0) return;
        setPaying(true);
        try {
            const today = new Date();
            const terimaDate = new Date(today);
            terimaDate.setDate(terimaDate.getDate() + 3);
            const toDateStr = (d: Date) => d.toISOString().split('T')[0];

            const payload = {
                pelanggan_id: null,
                nama_pelanggan: customer.nama,
                nomor_hp: customer.nomor,
                alamat: customer.alamat,
                tanggal_order: toDateStr(today),
                tanggal_terima: toDateStr(terimaDate),
                details: cart.map((item) => ({
                    layanan_id: item.id,
                    jumlah: item.quantity,
                    harga: item.price,
                    subtotal: item.price * item.quantity,
                })),
            };

            const res = await createOrder(payload);
            localStorage.setItem('last_receipt', JSON.stringify({
                invoice: res.invoice,
                nama_pelanggan: customer.nama,
                nomor_hp: customer.nomor,
                alamat: customer.alamat,
                subtotal, tax, total, cart,
                created_at: new Date().toISOString(),
            }));
            navigate('/success');
        } catch (err) {
            console.error('Gagal melakukan transaksi', err);
            alert('Gagal memproses pembayaran. Coba lagi.');
        } finally {
            setPaying(false);
        }
    };

    // ── Tambah layanan baru ──────────────────────────────────────────────────
    const handleSubmitNewService = async () => {
        if (!newService.nama_layanan.trim() || !newService.harga) return;
        setAddingService(true);
        try {
            const payload: CreateServicePayload = {
                nama_layanan: newService.nama_layanan.trim(),
                harga: Number(newService.harga),
                satuan: newService.satuan,
                kategori: newService.kategori,
                deskripsi: newService.deskripsi.trim() || undefined,
            };
            await addService(payload);
            setNewService({ nama_layanan: '', harga: '', satuan: 'kg', kategori: 'reguler', deskripsi: '' });
            setShowAddModal(false);
            setCategory(newService.kategori);
        } catch {
            alert('Gagal menambah layanan. Coba lagi.');
        } finally {
            setAddingService(false);
        }
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setNewService({ nama_layanan: '', harga: '', satuan: 'kg', kategori: 'reguler', deskripsi: '' });
    };

    const isSubmitDisabled = addingService || !newService.nama_layanan.trim() || !newService.harga;

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <div>
            {/* Header */}
            <div className="dashboard-header" style={{ marginBottom: '20px' }}>
                <div className="header-title">
                    <h1>Transaksi baru</h1>
                    <p>Pilih layanan dan proses pembayaran pelanggan.</p>
                </div>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        backgroundColor: '#000', color: '#fff', border: 'none',
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontWeight: '700', fontSize: '14px',
                    }}
                >
                    X
                </button>
            </div>

            {/* Main grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '24px', alignItems: 'start' }}>
                {/* Left Panel */}
                <div style={{ background: '#ffffff', borderRadius: '14px', padding: '24px', border: '1px solid #e5e7eb' }}>

                    {/* Filter row + tombol tambah layanan */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span style={{ fontWeight: '600', fontSize: '15px' }}>pilih layanan</span>
                            <div className="service-filter">
                                <button
                                    className={`filter-btn ${category === 'express' ? 'active' : ''}`}
                                    onClick={() => setCategory('express')}
                                >
                                    express
                                </button>
                                <button
                                    className={`filter-btn ${category === 'reguler' ? 'active' : ''}`}
                                    onClick={() => setCategory('reguler')}
                                >
                                    normal
                                </button>
                            </div>
                        </div>

                        {/* Tombol tambah layanan */}
                        <button
                            onClick={() => setShowAddModal(true)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '7px 14px', borderRadius: '8px',
                                backgroundColor: '#3b82f6', color: '#fff',
                                border: 'none', cursor: 'pointer',
                                fontSize: '13px', fontWeight: '600',
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Tambah layanan
                        </button>
                    </div>

                    {/* Services Grid */}
                    <div className="services-grid">
                        {activeServices.map((service) => (
                            <ServiceCard
                                key={service.id}
                                id={service.id}
                                name={service.nama_layanan}
                                price={service.harga}
                                unit={service.satuan}
                                onAdd={handleAddService}
                            />
                        ))}
                        {activeServices.length === 0 && (
                            <p style={{ color: '#9ca3af', fontSize: '13px', gridColumn: '1/-1' }}>
                                Belum ada layanan untuk kategori ini.
                            </p>
                        )}
                    </div>
                </div>

                {/* Right Panel */}
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

            {/* ── Modal Tambah Layanan ─────────────────────────────────────── */}
            {showAddModal && (
                <div
                    style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1000,
                    }}
                    onClick={handleCloseModal}
                >
                    <div
                        style={{
                            backgroundColor: '#fff', borderRadius: '16px',
                            padding: '28px', width: '100%', maxWidth: '420px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Tambah layanan baru</h2>
                            <button
                                onClick={handleCloseModal}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '18px', lineHeight: '1' }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Form fields */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                            <div>
                                <label style={labelStyle}>Nama layanan</label>
                                <input
                                    type="text"
                                    placeholder="contoh: Cuci & Lipat"
                                    value={newService.nama_layanan}
                                    onChange={(e) => setNewService((p) => ({ ...p, nama_layanan: e.target.value }))}
                                    style={inputStyle}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={labelStyle}>Harga (Rp)</label>
                                    <input
                                        type="number"
                                        placeholder="contoh: 10000"
                                        value={newService.harga}
                                        onChange={(e) => setNewService((p) => ({ ...p, harga: e.target.value }))}
                                        style={inputStyle}
                                        min={0}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Satuan</label>
                                    <select
                                        value={newService.satuan}
                                        onChange={(e) => setNewService((p) => ({ ...p, satuan: e.target.value }))}
                                        style={selectStyle}
                                    >
                                        <option value="kg">kg</option>
                                        <option value="pcs">pcs</option>
                                        <option value="item">item</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>Kategori</label>
                                <select
                                    value={newService.kategori}
                                    onChange={(e) => setNewService((p) => ({ ...p, kategori: e.target.value }))}
                                    style={selectStyle}
                                >
                                    <option value="reguler">Normal / Reguler</option>
                                    <option value="express">Express</option>
                                </select>
                            </div>

                            <div>
                                <label style={labelStyle}>
                                    Deskripsi <span style={{ color: '#9ca3af' }}>(opsional)</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="contoh: Layanan cuci standar 2-3 hari"
                                    value={newService.deskripsi}
                                    onChange={(e) => setNewService((p) => ({ ...p, deskripsi: e.target.value }))}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* Modal footer */}
                        <div style={{ display: 'flex', gap: '10px', marginTop: '22px' }}>
                            <button
                                onClick={handleCloseModal}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '8px',
                                    border: '1px solid #e5e7eb', background: '#fff',
                                    cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#374151',
                                }}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSubmitNewService}
                                disabled={isSubmitDisabled}
                                style={{
                                    flex: 1, padding: '10px', borderRadius: '8px',
                                    border: 'none', background: '#3b82f6', color: '#fff',
                                    cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
                                    fontSize: '14px', fontWeight: '600',
                                    opacity: isSubmitDisabled ? 0.5 : 1,
                                }}
                            >
                                {addingService ? 'Menyimpan...' : 'Simpan layanan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// ── Typed shared styles ──────────────────────────────────────────────────────
const labelStyle: CSSProperties = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '5px',
};

const inputStyle: CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#111827',
    backgroundColor: '#f9fafb',
};

const selectStyle: CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    color: '#111827',
    backgroundColor: '#f9fafb',
};

export default TransactionPage;