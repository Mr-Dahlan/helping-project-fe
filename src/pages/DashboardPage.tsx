import { useNavigate, useOutletContext } from 'react-router-dom';
import { useOrder } from '../hooks/useOrder';
import MetricCard from '../components/MetricCard';
import RecentTransactionsTable from '../components/RecentTransactionsTable';

// ── Helpers ───────────────────────────────────────────────────────────────
const formatRupiah = (
    num: number | string
) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(Number(num));

// ── Icons ─────────────────────────────────────────────────────────────────
const IconOrder = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 3 3 9 4-2 4 5 7-9" />
    </svg>
);

const IconPelanggan = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const IconProses = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
    </svg>
);

const IconPendapatan = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" x2="12" y1="2" y2="22" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
);

// ── DashboardPage ─────────────────────────────────────────────────────────
const DashboardPage = () => {
    const navigate = useNavigate();
    const { setShowLogoutModal } = useOutletContext<{ setShowLogoutModal: (v: boolean) => void }>();

    // ✅ Pakai useOrder — sudah auto-fetch lewat useEffect di dalam hook
    const { orders, loading,updateStatus,updateStatusPembayaran } = useOrder();

    // ── Hitung summary dari orders ────────────────────────────────────────
    const now = new Date();

    const ordersThisMonth = orders.filter((tx) => {
        const d = new Date(tx.tanggal_order);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });

    const summary = {
        total_order: ordersThisMonth.length,
        total_pelanggan: new Set(ordersThisMonth.map((tx) => tx.pelanggan_id)).size,
        total_pendapatan: ordersThisMonth
            .filter((tx) => tx.status_pembayaran === 'paid')
            .reduce((sum, tx) => sum + Number(tx.total_price), 0),
        total_transaksi_selesai: ordersThisMonth.filter((tx) => tx.status_laundry === 'taken').length,
        total_transaksi_proses: ordersThisMonth.filter((tx) => tx.status_laundry === 'process').length,
    };

    // 5 transaksi terbaru
    const recentTransactions = [...orders]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

    const prosesLabel = `${summary.total_transaksi_proses}/${summary.total_order}`;

    return (
        <div>
            {/* ── Header ──────────────────────────────────────────────── */}
            <div className="dashboard-header">
                <div className="header-title">
                    <h1>Dashboard</h1>
                    <p>Selamat datang kembali! Berikut ringkasan bulan ini.</p>
                </div>
                <button className="logout-icon-btn" title="Logout" onClick={() => setShowLogoutModal(true)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" x2="9" y1="12" y2="12" />
                    </svg>
                </button>
            </div>

            {/* ── Metric Cards ─────────────────────────────────────────── */}
            <div className="metrics-grid">
                <MetricCard
                    label="Total Order Bulan Ini"
                    value={loading ? '...' : summary.total_order}
                    colorClass="orange"
                    icon={<IconOrder />}
                />
                <MetricCard
                    label="Pelanggan Aktif"
                    value={loading ? '...' : summary.total_pelanggan}
                    colorClass="purple"
                    icon={<IconPelanggan />}
                />
                <MetricCard
                    label="Proses / Total Order"
                    value={loading ? '...' : prosesLabel}
                    colorClass="blue"
                    icon={<IconProses />}
                />
                <MetricCard
                    label="Pendapatan Bulan Ini"
                    value={loading ? '...' : formatRupiah(summary.total_pendapatan)}
                    colorClass="green"
                    icon={<IconPendapatan />}
                />
            </div>

            {/* ── Chart + Shortcut ─────────────────────────────────────── */}
            <div className="dashboard-middle">
                <div className="chart-card">
                    <div className="chart-header">
                        <span className="chart-title">Pertumbuhan Mingguan</span>
                    </div>
                    <div className="chart-container">
                        <svg viewBox="0 0 500 160" width="100%" height="100%" style={{ overflow: 'visible' }}>
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                                </linearGradient>
                            </defs>
                            <line x1="0" y1="20" x2="500" y2="20" stroke="#f3f4f6" strokeWidth="1" />
                            <line x1="0" y1="60" x2="500" y2="60" stroke="#f3f4f6" strokeWidth="1" />
                            <line x1="0" y1="100" x2="500" y2="100" stroke="#f3f4f6" strokeWidth="1" />
                            <line x1="0" y1="140" x2="500" y2="140" stroke="#f3f4f6" strokeWidth="1" />
                            <path d="M 10 140 L 10 120 Q 50 110, 90 90 T 170 100 T 250 50 T 330 65 T 410 40 T 490 55 L 490 140 Z" fill="url(#chartGradient)" />
                            <path d="M 10 120 Q 50 110, 90 90 T 170 100 T 250 50 T 330 65 T 410 40 T 490 55" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                            {[
                                { cx: 10, cy: 120 }, { cx: 90, cy: 90 }, { cx: 170, cy: 100 },
                                { cx: 250, cy: 50 }, { cx: 330, cy: 65 }, { cx: 410, cy: 40 }, { cx: 490, cy: 55 },
                            ].map((p, i) => (
                                <circle key={i} cx={p.cx} cy={p.cy} r="4" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
                            ))}
                            {['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'].map((day, i) => (
                                <text key={day} x={10 + i * 80} y="156" fill="#9ca3af" fontSize="10" textAnchor="middle">{day}</text>
                            ))}
                        </svg>
                    </div>
                </div>

                <div className="shortcut-card">
                    <span className="shortcut-title">Shortcut</span>
                    <div className="shortcut-buttons">
                        <button className="shortcut-btn" onClick={() => navigate('/transaksi')}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" x2="12" y1="5" y2="19" />
                                <line x1="5" x2="19" y1="12" y2="12" />
                            </svg>
                            Tambah transaksi
                        </button>
                        <button className="shortcut-btn secondary">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                            Laporan akhir bulan
                        </button>
                        <button
                            className="shortcut-btn secondary"
                            onClick={() => setShowLogoutModal(true)}
                            style={{ color: '#ef4444' }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" x2="9" y1="12" y2="12" />
                            </svg>
                            Log out
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Recent Transactions ──────────────────────────────────── */}
            <RecentTransactionsTable
                transactions={recentTransactions}
                loading={loading}
                onUpdateStatus={updateStatus}
                onUpdatePembayaran={updateStatusPembayaran}
            />
        </div>
    );
};

export default DashboardPage;