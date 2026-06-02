import React, { useState } from 'react';

const FinancialReports = () => {
    const [period, setPeriod] = useState('Monthly');
    const [searchQuery, setSearchQuery] = useState('');
    const [ledger, setLedger] = useState([
        { txId: 'TX-88293', customer: 'Andi Pratama', serviceType: 'Dry Clean (Shirt)', paymentMethod: 'Visa •••• 4242', dateTime: 'Jun 24, 2026 - 14:20', price: 95000, status: 'SELESAI', initials: 'AP' },
        { txId: 'TX-88294', customer: 'Rizky Saputra', serviceType: 'Suit Cleaning', paymentMethod: 'Mastercard •••• 8829', dateTime: 'Jun 24, 2026 - 11:05', price: 150000, status: 'SELESAI', initials: 'RS' },
        { txId: 'TX-88295', customer: 'Fajar Nugroho', serviceType: 'Dry Clean (Pants)', paymentMethod: 'Cash', dateTime: 'Jun 23, 2026 - 17:45', price: 45000, status: 'PENDING', initials: 'FN' },
        { txId: 'TX-88296', customer: 'Dwi Lestari', serviceType: 'Wash & Fold (2kg)', paymentMethod: 'ShopeePay (E-Wallet)', dateTime: 'Jun 23, 2026 - 15:30', price: 60000, status: 'SELESAI', initials: 'DL' }
    ]);

    const formatRupiah = (num) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(num).replace('Rp', 'Rp ');
    };

    const filteredLedger = ledger.filter(l => 
        l.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.txId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.serviceType.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDownload = () => {
        let content = `FINANCIAL REPORT - LAUNDRYINAJA\n`;
        content += `Periode: ${period}\n`;
        content += `Generated at: ${new Date().toLocaleString()}\n`;
        content += `==============================================\n`;
        content += `Total Revenue      : Rp 14.250.000\n`;
        content += `Average Order Value: Rp 85.400\n`;
        content += `Projected Net Profit: Rp 10.260.000\n\n`;
        content += `TRANSACTION LEDGER:\n`;
        filteredLedger.forEach(l => {
            content += `${l.txId} | ${l.customer} | ${l.serviceType} | ${l.paymentMethod} | ${l.dateTime} | ${formatRupiah(l.price)} | ${l.status}\n`;
        });
        
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `laporan_keuangan_${period.toLowerCase()}_${new Date().toISOString().split('T')[0]}.txt`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert("Laporan keuangan berhasil diunduh!");
    };

    return (
        <div>
            {/* Header Section */}
            <div className="dashboard-header">
                <div className="header-title">
                    <h1>Financial Reports</h1>
                    <p>Detail keuangan dan analisis bisnis</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Monthly Toggle Button */}
                    <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: '24px', padding: '2px' }}>
                        {['Monthly', 'Quarterly', 'Yearly'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setPeriod(t)}
                                style={{
                                    border: 'none',
                                    outline: 'none',
                                    padding: '6px 14px',
                                    borderRadius: '20px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    backgroundColor: period === t ? '#ffffff' : 'transparent',
                                    color: period === t ? '#0f172a' : 'var(--text-muted)',
                                    boxShadow: period === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <button 
                        onClick={handleDownload}
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
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" x2="12" y1="15" y2="3" />
                        </svg>
                        Download
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid matching Finance Design */}
            <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div className="metric-card">
                    <div className="metric-info">
                        <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            TOTAL REVENUE
                            <span style={{ fontSize: '10px', color: '#10b981', background: '#d1fae5', padding: '2px 6px', borderRadius: '10px', fontWeight: '700' }}>↗ +12.5% vs last month</span>
                        </span>
                        <span className="metric-value">{formatRupiah(14250000)}</span>
                    </div>
                    <div className="metric-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect width="20" height="14" x="2" y="5" rx="2" />
                            <line x1="2" x2="22" y1="10" y2="10" />
                        </svg>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-info">
                        <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            AVERAGE ORDER VALUE
                            <span style={{ fontSize: '10px', color: '#ff7a00', background: '#fff0e0', padding: '2px 6px', borderRadius: '10px', fontWeight: '700' }}>168 Orders active</span>
                        </span>
                        <span className="metric-value">{formatRupiah(85400)}</span>
                    </div>
                    <div className="metric-icon" style={{ background: '#fff0e0', color: '#ff7a00' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                        </svg>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-info">
                        <span className="metric-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            PROJECTED NET PROFIT
                            <span style={{ fontSize: '10px', color: '#8b5cf6', background: '#ede9fe', padding: '2px 6px', borderRadius: '10px', fontWeight: '700' }}>72% Margin optimized</span>
                        </span>
                        <span className="metric-value">{formatRupiah(10260000)}</span>
                    </div>
                    <div className="metric-icon" style={{ background: '#ede9fe', color: '#8b5cf6' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" x2="18" y1="20" y2="10" />
                            <line x1="12" x2="12" y1="20" y2="4" />
                            <line x1="6" x2="6" y1="20" y2="14" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Split layout: Chart left, Market Share right */}
            <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '20px', marginBottom: '24px', alignItems: 'stretch' }}>
                {/* Revenue Growth chart card */}
                <div className="chart-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <div>
                            <span className="chart-title" style={{ fontSize: '16px', fontWeight: '600' }}>Revenue Growth & Projections</span>
                            <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>Daily tracking of gross revenue vs overhead targets</span>
                        </div>
                        <div style={{ display: 'flex', gap: '14px', fontSize: '12px', fontWeight: '600' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563eb' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb' }}></span> Revenue
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#93c5fd' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#93c5fd' }}></span> Projection
                            </span>
                        </div>
                    </div>

                    <div className="chart-container" style={{ height: '220px' }}>
                        <svg viewBox="0 0 500 180" width="100%" height="100%" style={{ overflow: 'visible' }}>
                            {/* SVG Column Chart to match the Revenue Projections bar chart */}
                            <g transform="translate(10, 0)">
                                {/* Monday */}
                                <rect x="25" y="100" width="16" height="50" rx="3" fill="#93c5fd" />
                                <rect x="25" y="120" width="16" height="30" rx="3" fill="#2563eb" />
                                <text x="33" y="165" fontSize="9" fill="var(--text-muted)" textAnchor="middle" fontWeight="600">MONDAY</text>

                                {/* Tuesday */}
                                <rect x="90" y="80" width="16" height="70" rx="3" fill="#93c5fd" />
                                <rect x="90" y="115" width="16" height="35" rx="3" fill="#2563eb" />
                                <text x="98" y="165" fontSize="9" fill="var(--text-muted)" textAnchor="middle" fontWeight="600">TUESDAY</text>

                                {/* Wednesday */}
                                <rect x="155" y="90" width="16" height="60" rx="3" fill="#93c5fd" />
                                <rect x="155" y="125" width="16" height="25" rx="3" fill="#2563eb" />
                                <text x="163" y="165" fontSize="9" fill="var(--text-muted)" textAnchor="middle" fontWeight="600">WEDNESDAY</text>

                                {/* Thursday */}
                                <rect x="220" y="60" width="16" height="90" rx="3" fill="#93c5fd" />
                                <rect x="220" y="95" width="16" height="55" rx="3" fill="#2563eb" />
                                <text x="228" y="165" fontSize="9" fill="var(--text-muted)" textAnchor="middle" fontWeight="600">THURSDAY</text>

                                {/* Friday */}
                                <rect x="285" y="70" width="16" height="80" rx="3" fill="#93c5fd" />
                                <rect x="285" y="110" width="16" height="40" rx="3" fill="#2563eb" />
                                <text x="293" y="165" fontSize="9" fill="var(--text-muted)" textAnchor="middle" fontWeight="600">FRIDAY</text>

                                {/* Saturday */}
                                <rect x="350" y="50" width="16" height="100" rx="3" fill="#93c5fd" />
                                <rect x="350" y="90" width="16" height="60" rx="3" fill="#2563eb" />
                                <text x="358" y="165" fontSize="9" fill="var(--text-muted)" textAnchor="middle" fontWeight="600">SATURDAY</text>

                                {/* Sunday */}
                                <rect x="415" y="60" width="16" height="90" rx="3" fill="#93c5fd" />
                                <rect x="415" y="105" width="16" height="45" rx="3" fill="#2563eb" />
                                <text x="423" y="165" fontSize="9" fill="var(--text-muted)" textAnchor="middle" fontWeight="600">SUNDAY</text>
                            </g>
                        </svg>
                    </div>
                </div>

                {/* Market Share card on the right */}
                <div style={{ background: '#ffffff', borderRadius: '14px', padding: '24px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>Market Share</span>
                            <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>•••</span>
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '16px' }}>Service category performance</span>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>
                                    <span style={{ color: 'var(--text-main)' }}>Cuci Kering (Kemeja)</span>
                                    <span style={{ color: 'var(--text-muted)' }}>Rp 6.4M (45%)</span>
                                </div>
                                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: '45%', height: '100%', background: '#2563eb' }}></div>
                                </div>
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>
                                    <span style={{ color: 'var(--text-main)' }}>Setelan Jas</span>
                                    <span style={{ color: 'var(--text-muted)' }}>Rp 3.9M (28%)</span>
                                </div>
                                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: '28%', height: '100%', background: '#ff7a00' }}></div>
                                </div>
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>
                                    <span style={{ color: 'var(--text-main)' }}>Cuci Kering (Celana)</span>
                                    <span style={{ color: 'var(--text-muted)' }}>Rp 2.4M (17%)</span>
                                </div>
                                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: '17%', height: '100%', background: '#8b5cf6' }}></div>
                                </div>
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '600', marginBottom: '4px' }}>
                                    <span style={{ color: 'var(--text-main)' }}>Lain-lain</span>
                                    <span style={{ color: 'var(--text-muted)' }}>Rp 1.4M (10%)</span>
                                </div>
                                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: '10%', height: '100%', background: '#64748b' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Transaction Ledger */}
            <div className="table-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <span className="table-title" style={{ display: 'block', fontSize: '16px', fontWeight: '600' }}>Transaction Ledger</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                            Real-time financial logs for all verified service payments.
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="search-bar-container" style={{ width: '220px', margin: 0 }}>
                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '13px' }}>🔍</span>
                            <input 
                                type="text" 
                                placeholder="Search Ledger..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                                style={{ padding: '8px 12px 8px 34px', fontSize: '13px', borderRadius: '18px' }}
                            />
                        </div>

                        <button 
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 16px',
                                background: '#f8fafc',
                                border: '1px solid var(--border-color)',
                                borderRadius: '18px',
                                fontSize: '13px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            🎛️ Advanced Filters
                        </button>
                    </div>
                </div>

                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>TRANSAKSI</th>
                                <th>PELANGGAN</th>
                                <th>SERVICE TYPE</th>
                                <th>PAYMENT METHOD</th>
                                <th>DATE & TIME</th>
                                <th>HARGA</th>
                                <th>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLedger.map((l) => (
                                <tr key={l.txId}>
                                    <td style={{ fontWeight: '700', color: '#2563eb' }}>{l.txId}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div 
                                                style={{ 
                                                    width: '28px', 
                                                    height: '28px', 
                                                    borderRadius: '50%', 
                                                    backgroundColor: '#eff6ff', 
                                                    color: '#2563eb', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center',
                                                    fontWeight: '600',
                                                    fontSize: '11px'
                                                }}
                                            >
                                                {l.initials}
                                            </div>
                                            <span style={{ fontWeight: '600', fontSize: '13px' }}>{l.customer}</span>
                                        </div>
                                    </td>
                                    <td>{l.serviceType}</td>
                                    <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                        {l.paymentMethod.includes('Visa') ? '💳 ' : l.paymentMethod.includes('Mastercard') ? '💳 ' : '💵 '}
                                        {l.paymentMethod}
                                    </td>
                                    <td>{l.dateTime}</td>
                                    <td className="price-text" style={{ fontWeight: '600' }}>{formatRupiah(l.price)}</td>
                                    <td>
                                        <span 
                                            className={`badge ${l.status === 'SELESAI' ? 'success' : 'pending'}`}
                                            style={{ fontSize: '11px', padding: '4px 10px', fontWeight: '700' }}
                                        >
                                            {l.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>Showing 1 - {filteredLedger.length} of 10 transactions</span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        <button style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', background: '#ffffff', cursor: 'pointer' }}>&lt;</button>
                        <button style={{ padding: '4px 8px', border: 'none', borderRadius: '4px', background: '#2563eb', color: '#ffffff', fontWeight: '600' }}>1</button>
                        <button style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', background: '#ffffff', cursor: 'pointer' }}>2</button>
                        <button style={{ padding: '4px 8px', border: '1px solid #d1d5db', borderRadius: '4px', background: '#ffffff', cursor: 'pointer' }}>&gt;</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialReports;
