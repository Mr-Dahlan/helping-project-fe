import React, { useState } from 'react';

const ProductManagement = () => {
    // Service state
    const [services, setServices] = useState([
        { id: 1, category: 'CUCI KERING', name: 'Cuci Kering (Kemeja)', desc: 'Perawatan serat khusus untuk kemeja formal maupun kasual agar tidak mengkerut.', price: 95000, unit: 'pcs', status: 'AKTIF', icon: 'shirt' },
        { id: 2, category: 'LAYANAN PAKET', name: 'Cuci Kering (Celana)', desc: 'Pembersihan mendalam untuk celana jeans, kain, maupun bahan sintetis.', price: 50000, unit: 'pcs', status: 'AKTIF', icon: 'package' },
        { id: 3, category: 'SETRIKA SAJA', name: 'Setrika (Jas Set)', desc: 'Finishing premium dengan uap bertekanan tinggi untuk hasil setrika yang kaku dan rapi.', price: 45000, unit: 'set', status: 'AKTIF', icon: 'iron' },
        { id: 4, category: 'PRIORITY EXPRESS', name: 'Cuci Kering (Dress)', desc: 'Layanan super cepat 6 jam untuk gaun dan dress pesta dengan penanganan sensitif.', price: 60000, unit: 'pcs', status: 'AKTIF', icon: 'flash' }
    ]);

    const [activeTab, setActiveTab] = useState('Semua');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Add/Edit Modals
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);
    
    // Form fields
    const [formCategory, setFormCategory] = useState('CUCI KERING');
    const [formName, setFormName] = useState('');
    const [formDesc, setFormDesc] = useState('');
    const [formPrice, setFormPrice] = useState('');
    const [formUnit, setFormUnit] = useState('pcs');

    // Mock recent transactions for product management bottom table
    const recentTransactions = [
        { id: '1024', customer: 'Siti Nuraini', time: '24 Okt 2023, 14:30', service: 'CUCI KERING', price: 95000, status: 'AKTIF' },
        { id: '1025', customer: 'Bambang S.', time: '24 Okt 2023, 15:15', service: 'SETRIKA SAJA', price: 50000, status: 'AKTIF' }
    ];

    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num).replace('Rp', 'Rp ');
    };

    // Filter services list
    const filteredServices = services.filter(s => {
        const matchesTab = activeTab === 'Semua' || 
                           (activeTab === 'Cuci Kering' && s.category === 'CUCI KERING') ||
                           (activeTab === 'Cuci Basah' && s.category === 'CUCI BASAH') ||
                           (activeTab === 'Setrika' && s.category === 'SETRIKA SAJA') ||
                           (activeTab === 'Express' && s.category === 'PRIORITY EXPRESS');
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              s.desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const handleOpenAdd = () => {
        setIsEditing(false);
        setFormCategory('CUCI KERING');
        setFormName('');
        setFormDesc('');
        setFormPrice('');
        setFormUnit('pcs');
        setShowModal(true);
    };

    const handleOpenEdit = (s) => {
        setIsEditing(true);
        setSelectedServiceId(s.id);
        setFormCategory(s.category);
        setFormName(s.name);
        setFormDesc(s.desc);
        setFormPrice(s.price);
        setFormUnit(s.unit);
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus layanan ini?")) {
            setServices(services.filter(s => s.id !== id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formName.trim() || !formPrice) return;

        const priceNum = parseFloat(formPrice);
        const iconMap = {
            'CUCI KERING': 'shirt',
            'LAYANAN PAKET': 'package',
            'SETRIKA SAJA': 'iron',
            'PRIORITY EXPRESS': 'flash'
        };
        const icon = iconMap[formCategory] || 'shirt';

        if (isEditing) {
            setServices(services.map(s => 
                s.id === selectedServiceId 
                    ? { ...s, category: formCategory, name: formName, desc: formDesc, price: priceNum, unit: formUnit, icon } 
                    : s
            ));
        } else {
            const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
            const newServ = {
                id: newId,
                category: formCategory,
                name: formName,
                desc: formDesc,
                price: priceNum,
                unit: formUnit,
                status: 'AKTIF',
                icon
            };
            setServices([...services, newServ]);
        }
        setShowModal(false);
    };

    const getIconSvg = (iconType) => {
        switch (iconType) {
            case 'shirt':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L9 7h6l-3-5z" />
                        <path d="M6 7l-3 4 3 4V7z" />
                        <path d="M18 7l3 4-3 4V7z" />
                        <path d="M6 15v5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-5H6z" />
                    </svg>
                );
            case 'package':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="9" y1="3" x2="9" y2="21" />
                        <line x1="15" x2="15" y1="3" y2="21" />
                        <line x1="3" y1="9" x2="21" y2="9" />
                        <line x1="3" y1="15" x2="21" y2="15" />
                    </svg>
                );
            case 'iron':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7.5 13.5L16.5 4.5" />
                        <path d="M11 20H4a2 2 0 0 1-2-2V8c0-1.66 1.34-3 3-3h12a3 3 0 0 1 3 3v1" />
                        <path d="M19 12a4 4 0 0 1-4 4h-2" />
                    </svg>
                );
            case 'flash':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                );
            default:
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                );
        }
    };

    return (
        <div>
            {/* Header Section */}
            <div className="dashboard-header">
                <div className="header-title">
                    <h1>Product Management</h1>
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
            <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '24px', alignItems: 'start' }}>
                {/* Left Side: Services Catalog */}
                <div>
                    {/* Category Selector Tabs and Search */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {['Semua', 'Cuci Kering', 'Cuci Basah', 'Setrika', 'Express'].map((tab) => (
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
                                    minHeight: '190px',
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
                                            backgroundColor: s.category === 'CUCI KERING' ? '#ffe0e0' : s.category === 'SETRIKA SAJA' ? '#ede9fe' : '#e0f2fe',
                                            color: s.category === 'CUCI KERING' ? '#ef4444' : s.category === 'SETRIKA SAJA' ? '#8b5cf6' : '#2563eb',
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {getIconSvg(s.icon)}
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button 
                                            onClick={() => handleOpenEdit(s)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-muted)' }}
                                        >
                                            ✏️
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(s.id)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#ef4444' }}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>

                                <div style={{ flexGrow: 1, marginBottom: '16px' }}>
                                    <span style={{ fontSize: '9px', fontWeight: '800', letterSpacing: '1px', color: '#ff7a00', display: 'block', marginBottom: '4px' }}>
                                        {s.category}
                                    </span>
                                    <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>{s.name}</h4>
                                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{s.desc}</p>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                                    <div>
                                        <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)', fontWeight: '600' }}>HARGA</span>
                                        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
                                            {formatRupiah(s.price)}<span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' }}> /{s.unit}</span>
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '9px', fontWeight: '800', background: '#d1fae5', color: '#10b981', padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.5px' }}>
                                        {s.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Statistics Dashboard */}
                <div style={{ background: '#ffffff', borderRadius: '14px', padding: '24px', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>Statistik Layanan</span>
                        <span>📊</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
                                <span style={{ color: 'var(--text-main)' }}>Cuci Kering</span>
                                <span style={{ color: '#2563eb' }}>48%</span>
                            </div>
                            <div style={{ height: '8px', background: '#eff6ff', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: '48%', height: '100%', background: '#2563eb' }}></div>
                            </div>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>12 Layanan Aktif</span>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
                                <span style={{ color: 'var(--text-main)' }}>Setrika Saja</span>
                                <span style={{ color: '#ff7a00' }}>32%</span>
                            </div>
                            <div style={{ height: '8px', background: '#fff0e0', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: '32%', height: '100%', background: '#ff7a00' }}></div>
                            </div>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>8 Layanan Aktif</span>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
                                <span style={{ color: 'var(--text-main)' }}>Express</span>
                                <span style={{ color: '#8b5cf6' }}>20%</span>
                            </div>
                            <div style={{ height: '8px', background: '#ede9fe', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: '20%', height: '100%', background: '#8b5cf6' }}></div>
                            </div>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>5 Layanan Aktif</span>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)' }}>PERFORMA BULAN INI</span>
                            <span style={{ fontSize: '11px', color: '#10b981', background: '#d1fae5', padding: '2px 6px', borderRadius: '10px', fontWeight: '600' }}>↗ +12%</span>
                        </div>
                        {/* Micro performance chart */}
                        <div style={{ display: 'flex', gap: '4px', height: '36px', alignItems: 'flex-end' }}>
                            <div style={{ flex: 1, height: '40%', background: '#dbeafe', borderRadius: '2px' }}></div>
                            <div style={{ flex: 1, height: '60%', background: '#dbeafe', borderRadius: '2px' }}></div>
                            <div style={{ flex: 1, height: '50%', background: '#dbeafe', borderRadius: '2px' }}></div>
                            <div style={{ flex: 1, height: '70%', background: '#dbeafe', borderRadius: '2px' }}></div>
                            <div style={{ flex: 1, height: '90%', background: '#2563eb', borderRadius: '2px' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Transaksi Terbaru Table */}
            <div className="table-card" style={{ marginTop: '24px' }}>
                <div className="table-header">
                    <span className="table-title">Transaksi Terbaru</span>
                    <button style={{ background: '#f8fafc', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}>
                        📥
                    </button>
                </div>

                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>TRANSAKSI</th>
                                <th>PELANGGAN</th>
                                <th>TANGGAL & WAKTU</th>
                                <th>LAYANAN</th>
                                <th>HARGA</th>
                                <th>STATUS</th>
                                <th style={{ textAlign: 'center' }}>AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions.map((tx) => (
                                <tr key={tx.id}>
                                    <td style={{ fontWeight: '600' }}>{tx.id}</td>
                                    <td>{tx.customer}</td>
                                    <td>{tx.time}</td>
                                    <td style={{ fontSize: '12px', fontWeight: '600', color: '#ff7a00' }}>{tx.service}</td>
                                    <td className="price-text" style={{ fontWeight: '600' }}>{formatRupiah(tx.price)}</td>
                                    <td>
                                        <span style={{ fontSize: '11px', background: '#d1fae5', color: '#10b981', padding: '4px 10px', borderRadius: '12px', fontWeight: '700' }}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                            •••
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Micro pagination */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>Menampilkan 2 dari 10 layanan</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        <button style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', background: '#ffffff', cursor: 'pointer' }}>&lt;</button>
                        <button style={{ padding: '4px 8px', border: 'none', borderRadius: '4px', background: '#2563eb', color: '#ffffff', fontWeight: '600' }}>1</button>
                        <button style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', background: '#ffffff', cursor: 'pointer' }}>2</button>
                        <button style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', background: '#ffffff', cursor: 'pointer' }}>&gt;</button>
                    </div>
                </div>
            </div>

            {/* Service Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxWidth: '440px', textAlign: 'left' }}>
                        <h3 className="modal-title" style={{ marginBottom: '16px', fontSize: '18px' }}>
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
                                    <option value="CUCI KERING">CUCI KERING</option>
                                    <option value="LAYANAN PAKET">LAYANAN PAKET</option>
                                    <option value="SETRIKA SAJA">SETRIKA SAJA</option>
                                    <option value="PRIORITY EXPRESS">PRIORITY EXPRESS</option>
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
                                    placeholder="Contoh: Cuci Kering (Kemeja)"
                                    style={{ background: '#ffffff', border: '1px solid #d1d5db' }}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600' }}>Deskripsi</label>
                                <textarea 
                                    value={formDesc} 
                                    onChange={(e) => setFormDesc(e.target.value)} 
                                    className="form-input" 
                                    placeholder="Jelaskan detail layanan laundry..."
                                    rows="3"
                                    style={{ background: '#ffffff', border: '1px solid #d1d5db', fontFamily: 'inherit', resize: 'none' }}
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
                                        placeholder="95000"
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
                                        <option value="pcs">pcs</option>
                                        <option value="kg">kg</option>
                                        <option value="set">set</option>
                                        <option value="pasang">pasang</option>
                                        <option value="item">item</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-buttons" style={{ justifyContent: 'flex-end', gap: '8px' }}>
                                <button type="button" className="modal-btn no" onClick={() => setShowModal(false)} style={{ width: 'auto', padding: '10px 20px' }}>Cancel</button>
                                <button type="submit" className="modal-btn yes" style={{ width: 'auto', padding: '10px 20px', background: '#2563eb' }}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;
