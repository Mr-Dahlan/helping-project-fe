import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductManagement = () => {
    const [services, setServices] = useState([]);
    const [activeTab, setActiveTab] = useState('Semua');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [serviceStats, setServiceStats] = useState({});
    
    // Add/Edit Modals
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    
    // Form fields
    const [formCategory, setFormCategory] = useState('normal');
    const [formName, setFormName] = useState('');
    const [formPrice, setFormPrice] = useState('');
    const [formUnit, setFormUnit] = useState('kg');

    const defaultServices = [
        { id: 1, kategori: 'normal', nama: 'Cuci & Lipat', harga: 10000, satuan: 'kg' },
        { id: 2, kategori: 'normal', nama: 'Setrika Saja', harga: 8000, satuan: 'kg' },
        { id: 3, kategori: 'normal', nama: 'Cuci Kering Setrika', harga: 12000, satuan: 'kg' },
        { id: 4, kategori: 'normal', nama: 'Pembersih Pakaian', harga: 15000, satuan: 'item' },
        { id: 5, kategori: 'normal', nama: 'Cuci Selimut', harga: 20000, satuan: 'item' },
        { id: 6, kategori: 'normal', nama: 'Cuci Gorden', harga: 15000, satuan: 'kg' },
        { id: 7, kategori: 'normal', nama: 'Cuci Seprai', harga: 15000, satuan: 'item' },
        { id: 8, kategori: 'normal', nama: 'Permak Pakaian', harga: 15000, satuan: 'item' },
        { id: 9, kategori: 'normal', nama: 'Cuci Bed Cover', harga: 25000, satuan: 'item' },
        { id: 10, kategori: 'normal', nama: 'Cuci Sepatu', harga: 30000, satuan: 'pasang' }
    ];

    const fetchServicesAndStats = async () => {
        setLoading(true);
        try {
            const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
            const [servRes, ordersRes] = await Promise.all([
                axios.get(`${apiURL}/services`),
                axios.get(`${apiURL}/orders`).catch(e => ({ data: { data: [] } }))
            ]);

            if (servRes.data.status === 'success' && servRes.data.data.length > 0) {
                setServices(servRes.data.data);
            } else {
                setServices(defaultServices);
            }

            if (ordersRes.data.status === 'success') {
                const txs = ordersRes.data.data;
                const counts = {};
                txs.forEach(tx => {
                    if (tx.details) {
                        tx.details.forEach(d => {
                            const name = d.layanan ? d.layanan.nama : 'Layanan';
                            counts[name] = (counts[name] || 0) + Math.round(d.jumlah || 1);
                        });
                    }
                });
                setServiceStats(counts);
            }
        } catch (err) {
            console.error("Gagal mengambil data layanan", err);
            setServices(defaultServices);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServicesAndStats();
    }, []);

    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num).replace('Rp', 'Rp ');
    };

    const filteredServices = services.filter(s => {
        const matchesTab = activeTab === 'Semua' || 
                           (activeTab === 'Normal' && s.kategori === 'normal') ||
                           (activeTab === 'Express' && s.kategori === 'express');
        const matchesSearch = s.nama.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const handleOpenAdd = () => {
        setIsEditing(false);
        setFormCategory('normal');
        setFormName('');
        setFormPrice('');
        setFormUnit('kg');
        setShowModal(true);
    };

    const handleOpenEdit = (s) => {
        setIsEditing(true);
        setSelectedServiceId(s.id);
        setFormCategory(s.kategori);
        setFormName(s.nama);
        setFormPrice(s.harga);
        setFormUnit(s.satuan);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus layanan ini secara lokal?")) {
            setServices(services.filter(s => s.id !== id));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formName.trim() || !formPrice) return;

        const priceNum = parseInt(formPrice);

        if (isEditing) {
            setServices(services.map(s => 
                s.id === selectedServiceId 
                    ? { ...s, kategori: formCategory, nama: formName, harga: priceNum, satuan: formUnit } 
                    : s
            ));
            setShowModal(false);
        } else {
            try {
                const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
                const res = await axios.post(`${apiURL}/services`, {
                    nama: formName,
                    harga: priceNum,
                    satuan: formUnit,
                    kategori: formCategory
                });
                if (res.data.status === 'success') {
                    setServices([...services, res.data.data]);
                    setShowModal(false);
                }
            } catch (err) {
                console.error("Gagal menambahkan layanan ke database", err);
                const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
                const newServ = {
                    id: newId,
                    kategori: formCategory,
                    nama: formName,
                    harga: priceNum,
                    satuan: formUnit
                };
                setServices([...services, newServ]);
                setShowModal(false);
            }
        }
    };

    const getIconSvg = (name) => {
        const n = name.toLowerCase();
        if (n.includes('setrika') && !n.includes('cuci')) {
            return (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 8h11a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" />
                    <path d="M5 8V5a2 2 0 0 1 2-2h3" />
                </svg>
            );
        }
        if (n.includes('pembersih') || n.includes('permak') || n.includes('pakaian')) {
            return (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.38 3.46L16 7.83l-1.42-1.42 4.38-4.38a1 1 0 0 1 1.42 0l1 1a1 1 0 0 1 0 1.43zM10.5 22h7a2.5 2.5 0 0 0 2.5-2.5V14h-10v5.5a2.5 2.5 0 0 0 2.5 2.5zM4 14h6.5v8H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z" />
                </svg>
            );
        }
        return (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="4" />
                <path d="M12 20a8 8 0 0 0 8-8" />
            </svg>
        );
    };

    return (
        <div>
            {/* Header Section */}
            <div className="dashboard-header">
                <div className="header-title">
                    <h1>Manajemen Produk</h1>
                    <p>Kelola daftar layanan dan harga operasional laundry Anda.</p>
                </div>
                <button 
                    onClick={handleOpenAdd}
                    style={{
                        padding: '10px 20px',
                        background: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '24px',
                        fontWeight: '600',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" x2="12" y1="5" y2="19" />
                        <line x1="5" x2="19" y1="12" y2="12" />
                    </svg>
                    Tambah Layanan Baru
                </button>
            </div>

            {/* Split layout: Services left, Statistics right */}
            <div style={{ display: 'grid', gridTemplateColumns: '2.4fr 1.2fr', gap: '24px', alignItems: 'start' }}>
                {/* Left Side: Services Catalog */}
                <div>
                    {/* Category Selector Tabs and Search */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {['Semua', 'Normal', 'Express'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`filter-btn ${activeTab === tab ? 'active' : ''}`}
                                    style={{
                                        padding: '6px 16px',
                                        fontSize: '13px',
                                        background: activeTab === tab ? '#e0f2fe' : '#ffffff',
                                        color: activeTab === tab ? '#0284c7' : 'var(--text-muted)',
                                        borderColor: activeTab === tab ? '#0284c7' : 'var(--border-color)',
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        
                        <div className="search-bar-container" style={{ width: '260px', margin: 0 }}>
                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '13px' }}>🔍</span>
                            <input 
                                type="text" 
                                placeholder="Cari berdasarkan nama layanan..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                                style={{ padding: '8px 12px 8px 34px', fontSize: '13px', borderRadius: '18px' }}
                            />
                        </div>
                    </div>

                    {/* Services Cards Grid */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Memuat daftar produk...</div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                            {filteredServices.map((s) => (
                                <div 
                                    key={s.id} 
                                    className="service-card" 
                                    style={{ 
                                        background: '#ffffff', 
                                        borderRadius: '14px', 
                                        padding: '20px', 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        justifyContent: 'space-between', 
                                        minHeight: '150px',
                                        border: '1px solid var(--border-color)',
                                        position: 'relative'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                        <div 
                                            style={{ 
                                                width: '40px', 
                                                height: '40px', 
                                                borderRadius: '10px', 
                                                backgroundColor: s.kategori === 'express' ? '#fff0e0' : '#eff6ff',
                                                color: s.kategori === 'express' ? '#ff7a00' : '#2563eb',
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {getIconSvg(s.nama)}
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button 
                                                onClick={() => handleOpenEdit(s)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', fontSize: '14px' }}
                                                title="Edit layanan"
                                            >
                                                ✏️
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(s.id)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', fontSize: '14px' }}
                                                title="Hapus layanan"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ flexGrow: 1, marginBottom: '16px' }}>
                                        <span style={{ fontSize: '9px', fontWeight: '800', letterSpacing: '1px', color: s.kategori === 'express' ? '#ff7a00' : '#2563eb', display: 'block', textTransform: 'uppercase', marginBottom: '4px' }}>
                                            {s.kategori}
                                        </span>
                                        <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>{s.nama}</h4>
                                        {/* Layanan description card removed as requested! */}
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                                        <div>
                                            <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)', fontWeight: '600' }}>HARGA</span>
                                            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
                                                {formatRupiah(s.harga)}<span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' }}> /{s.satuan}</span>
                                            </span>
                                        </div>
                                        <span style={{ fontSize: '9px', fontWeight: '800', background: '#d1fae5', color: '#10b981', padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.5px' }}>
                                            AKTIF
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Side: Usage Statistics */}
                <div style={{ background: '#ffffff', borderRadius: '14px', padding: '24px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '0.5px' }}>POPULARITAS LAYANAN</span>
                        <span style={{ fontSize: '16px' }}>🔥</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {services.slice(0, 6).map((s, idx) => {
                            const count = serviceStats[s.nama] || 0;
                            const maxVal = Math.max(...Object.values(serviceStats), 10);
                            const pct = Math.round((count / maxVal) * 100);
                            return (
                                <div key={idx}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
                                        <span style={{ color: 'var(--text-main)' }}>{s.nama} ({s.kategori})</span>
                                        <span style={{ color: '#2563eb' }}>{count}x</span>
                                    </div>
                                    <div style={{ height: '8px', background: '#eff6ff', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${pct}%`, height: '100%', background: s.kategori === 'express' ? '#ff7a00' : '#2563eb' }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Service Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '440px', textAlign: 'left', borderRadius: '20px', padding: '24px' }}>
                        <h3 className="modal-title" style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '700' }}>
                            {isEditing ? 'Edit Layanan' : 'Tambah Layanan Baru'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group" style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>Kategori Layanan</label>
                                <select 
                                    value={formCategory} 
                                    onChange={(e) => setFormCategory(e.target.value)} 
                                    className="form-input"
                                    style={{ background: '#ffffff', border: '1px solid #d1d5db' }}
                                >
                                    <option value="normal">NORMAL</option>
                                    <option value="express">EXPRESS</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>Nama Layanan</label>
                                <input 
                                    type="text" 
                                    value={formName} 
                                    onChange={(e) => setFormName(e.target.value)} 
                                    className="form-input" 
                                    required 
                                    placeholder="Contoh: Cuci & Lipat"
                                    style={{ background: '#ffffff', border: '1px solid #d1d5db' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>Harga (Rp)</label>
                                    <input 
                                        type="number" 
                                        value={formPrice} 
                                        onChange={(e) => setFormPrice(e.target.value)} 
                                        className="form-input" 
                                        required 
                                        placeholder="10000"
                                        style={{ background: '#ffffff', border: '1px solid #d1d5db' }}
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>Satuan</label>
                                    <select 
                                        value={formUnit} 
                                        onChange={(e) => setFormUnit(e.target.value)} 
                                        className="form-input"
                                        style={{ background: '#ffffff', border: '1px solid #d1d5db' }}
                                    >
                                        <option value="kg">kg</option>
                                        <option value="item">item</option>
                                        <option value="pasang">pasang</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-buttons" style={{ justifyContent: 'flex-end', gap: '8px', display: 'flex' }}>
                                <button type="button" className="modal-btn no" onClick={() => setShowModal(false)} style={{ width: 'auto', padding: '10px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer' }}>Batal</button>
                                <button type="submit" className="modal-btn yes" style={{ width: 'auto', padding: '10px 20px', background: '#2563eb', color: '#fff', borderRadius: '20px', border: 'none', cursor: 'pointer' }}>Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
