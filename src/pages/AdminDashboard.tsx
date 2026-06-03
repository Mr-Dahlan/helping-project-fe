import { useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

import { useCustomer } from "../hooks/useCustomer";
import { useService } from "../hooks/useService";
import { useOrder } from "../hooks/useOrder";
import { useUsers } from "../hooks/useUser";

const AdminDashboard = () => {
    const { setShowLogoutModal } = useOutletContext<any>();

    /*
    |--------------------------------------------------------------------------
    | HOOKS
    |--------------------------------------------------------------------------
    */
    const {  loading: customerLoading } = useCustomer();
    const { services, loading: serviceLoading } = useService();
    const { orders, loading: orderLoading } = useOrder();
    const { users, loading: userLoading } = useUsers();

    /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */
    const [selectedTx, setSelectedTx] = useState<any>(null);

    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */
    const loading =
        customerLoading ||
        serviceLoading ||
        orderLoading ||
        userLoading;

    /*
    |--------------------------------------------------------------------------
    | FORMAT RUPIAH
    |--------------------------------------------------------------------------
    */
    const formatRupiah = (num: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(num);
    };

    /*
    |--------------------------------------------------------------------------
    | INITIAL NAME
    |--------------------------------------------------------------------------
    */
    const getInitials = (name?: string) => {
        if (!name) return "CS";

        return name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2);
    };

    /*
    |--------------------------------------------------------------------------
    | FORMAT DATE
    |--------------------------------------------------------------------------
    */
    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "-";

        const date = new Date(dateStr);

        return date.toLocaleString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    /*
    |--------------------------------------------------------------------------
    | BADGE CLASS
    |--------------------------------------------------------------------------
    */
    const getBadgeClass = (status?: string) => {
        switch (status) {
            case "pending":
            case "received":
                return "pending";

            case "process":
                return "process";

            case "ready":
            case "taken":
            case "paid":
                return "success";

            default:
                return "pending";
        }
    };

    /*
    |--------------------------------------------------------------------------
    | GET LAYANAN TEXT
    |--------------------------------------------------------------------------
    */
    const getLayananText = (tx: any) => {
        if (!tx.details || tx.details.length === 0) {
            return "-";
        }

        return tx.details
            .map((d: any) => {
                const service = services.find(
                    (s) => s.id === d.layanan_id
                );

                return `${service?.nama_layanan || "Layanan"} (${d.jumlah} ${
                    service?.satuan || "kg"
                })`;
            })
            .join(", ");
    };

    /*
    |--------------------------------------------------------------------------
    | DASHBOARD STATS
    |--------------------------------------------------------------------------
    */
    const stats = useMemo(() => {
        const today = new Date().toDateString();

        const totalRevenue = orders
    .filter(
        (o: any) =>
            new Date(o.created_at).toDateString() === today
    )
    .reduce(
        (sum: number, o: any) =>
            sum + Number(o.total_price || 0),
        0
    );

        const activeOrders = orders.filter((o: any) =>
            ["received", "process", "ready"].includes(
                o.status_laundry
            )
        ).length;

        return {
            totalRevenue,
            activeOrders,
            recentTransactions: [...orders]
                .sort((a: any, b: any) => b.id - a.id)
                .slice(0, 5),
        };
    }, [orders]);

    /*
    |--------------------------------------------------------------------------
    | WEEKLY REVENUE
    |--------------------------------------------------------------------------
    */
    const getWeeklyRevenue = () => {
        const days = [
            "minggu",
            "senin",
            "selasa",
            "rabu",
            "kamis",
            "jumat",
            "sabtu",
        ];

        const revenueByDay: any = {
            senin: 0,
            selasa: 0,
            rabu: 0,
            kamis: 0,
            jumat: 0,
            sabtu: 0,
            minggu: 0,
        };

        orders.forEach((tx: any) => {
            const txDate = new Date(tx.created_at);

            if (!isNaN(txDate.getTime())) {
                const dayName = days[txDate.getDay()];

                if (revenueByDay[dayName] !== undefined) {
                    revenueByDay[dayName] +=
    Number(tx.total_price || 0);
                }
            }
        });

        return revenueByDay;
    };

    const weeklyData = getWeeklyRevenue();

    const dayOrder = [
        "senin",
        "selasa",
        "rabu",
        "kamis",
        "jumat",
        "sabtu",
        "minggu",
    ];

    const xCoords = [35, 95, 155, 215, 275, 335, 395];

    const maxRevenue = Math.max(
        ...dayOrder.map((d) => weeklyData[d]),
        50000
    );

    const chartBars = dayOrder.map((day, index) => {
        const x = xCoords[index];
        const val = weeklyData[day];

        const height =
            maxRevenue > 0
                ? (val / maxRevenue) * 90
                : 0;

        const y = 120 - height;

        return {
            x,
            y,
            height,
            val,
            day: day.toUpperCase(),
        };
    });

    /*
    |--------------------------------------------------------------------------
    | LOADING SCREEN
    |--------------------------------------------------------------------------
    */
    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "60vh",
                    fontSize: "14px",
                }}
            >
                Memuat dashboard...
            </div>
        );
    }

    return (
        <div>
            {/* HEADER */}
            <div className="dashboard-header">
                <div className="header-title">
                    <h1>Dashboard Admin</h1>

                    <p>
                        Selamat datang kembali!
                        Berikut ringkasan operasional
                        laundry secara real-time.
                    </p>
                </div>

                <button
                    className="logout-icon-btn"
                    title="Logout"
                    onClick={() =>
                        setShowLogoutModal(true)
                    }
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#ef4444",
                        padding: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#fef2f2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line
                            x1="21"
                            x2="9"
                            y1="12"
                            y2="12"
                        />
                    </svg>
                </button>
            </div>

            {/* METRICS */}
            <div
                className="metrics-grid"
                style={{
                    gridTemplateColumns:
                        "repeat(2, 1fr)",
                    gap: "16px",
                }}
            >
                <div className="metric-card green">
                    <div className="metric-info">
                        <span className="metric-label">
                            TOTAL REVENUE
                        </span>

                        <span className="metric-value">
                            {formatRupiah(
                                stats.totalRevenue
                            )}
                        </span>
                    </div>
                </div>

                <div className="metric-card orange">
                    <div className="metric-info">
                        <span className="metric-label">
                            ACTIVE ORDERS
                        </span>

                        <span className="metric-value">
                            {stats.activeOrders} Pesanan
                        </span>
                    </div>
                </div>
            </div>

            {/* MIDDLE */}
            <div
                className="dashboard-middle"
                style={{ marginTop: "24px" }}
            >
                {/* CHART */}
                <div className="chart-card">
                    <div
                        style={{
                            display: "flex",
                            justifyContent:
                                "space-between",
                            alignItems: "center",
                            marginBottom: "20px",
                        }}
                    >
                        <div>
                            <span
                                className="chart-title"
                                style={{
                                    display: "block",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                }}
                            >
                                Penjualan Mingguan
                            </span>
                        </div>
                    </div>

                    <div className="chart-container">
                        <svg
                            viewBox="0 0 500 160"
                            width="100%"
                            height="100%"
                        >
                            <g transform="translate(10, 0)">
                                {chartBars.map(
                                    (bar, idx) => (
                                        <g key={idx}>
                                            <rect
                                                x={bar.x}
                                                y="30"
                                                width="28"
                                                height="90"
                                                rx="6"
                                                fill="#eff6ff"
                                            />

                                            <rect
                                                x={bar.x}
                                                y={bar.y}
                                                width="28"
                                                height={
                                                    bar.height
                                                }
                                                rx="4"
                                                fill="#2563eb"
                                            >
                                                <title>
                                                    {formatRupiah(
                                                        bar.val
                                                    )}
                                                </title>
                                            </rect>

                                            <text
                                                x={
                                                    bar.x + 14
                                                }
                                                y="135"
                                                fontSize="10"
                                                fill="gray"
                                                textAnchor="middle"
                                            >
                                                {bar.day}
                                            </text>
                                        </g>
                                    )
                                )}
                            </g>
                        </svg>
                    </div>
                </div>

                {/* USER */}
                <div
                    className="shortcut-card"
                    style={{ padding: "24px" }}
                >
                    <span
                        className="shortcut-title"
                        style={{
                            fontSize: "16px",
                            fontWeight: "600",
                            marginBottom: "20px",
                            display: "block",
                        }}
                    >
                        USER AKTIF
                    </span>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                        }}
                    >
                        {users.slice(0, 5).map(
                            (u: any, idx: number) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "space-between",
                                        padding:
                                            "12px 16px",
                                        borderRadius:
                                            "12px",
                                        border:
                                            "1px solid var(--border-color)",
                                    }}
                                >
                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            gap: "12px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width:
                                                    "36px",
                                                height:
                                                    "36px",
                                                borderRadius:
                                                    "50%",
                                                backgroundColor:
                                                    "#eff6ff",
                                                color:
                                                    "#2563eb",
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "center",
                                                fontWeight:
                                                    "600",
                                            }}
                                        >
                                            {getInitials(
                                                u.name
                                            )}
                                        </div>

                                        <span
                                            style={{
                                                fontWeight:
                                                    "600",
                                            }}
                                        >
                                            {u.name}
                                        </span>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div
                className="table-card"
                style={{ marginTop: "24px" }}
            >
                <div className="table-header">
                    <span
                        className="table-title"
                        style={{
                            display: "block",
                            fontSize: "16px",
                            fontWeight: "600",
                        }}
                    >
                        Riwayat Transaksi
                    </span>

                    <Link
                        to="/admin/riwayat"
                        className="view-all-btn"
                    >
                        Lebih Detail
                    </Link>
                </div>

                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Invoice</th>
                                <th>Pelanggan</th>
                                <th>Layanan</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Tanggal</th>
                            </tr>
                        </thead>

                        <tbody>
                            {stats.recentTransactions.map(
                                (tx: any) => {
                                    const customerName =
                                        tx.nama_pelanggan ||
                                        "Customer";

                                    const phoneNum =
                                        tx.nomor_hp ||
                                        "-";

                                    return (
                                        <tr
                                            key={tx.id}
                                            onClick={() =>
                                                setSelectedTx(
                                                    tx
                                                )
                                            }
                                            style={{
                                                cursor:
                                                    "pointer",
                                            }}
                                        >
                                            <td
                                                style={{
                                                    fontWeight:
                                                        "700",
                                                    color:
                                                        "#2563eb",
                                                }}
                                            >
                                                {
                                                    tx.invoice
                                                }
                                            </td>

                                            <td>
                                                <div
                                                    style={{
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        gap: "10px",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width:
                                                                "32px",
                                                            height:
                                                                "32px",
                                                            borderRadius:
                                                                "50%",
                                                            backgroundColor:
                                                                "#f3f4f6",
                                                            display:
                                                                "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                            fontWeight:
                                                                "600",
                                                        }}
                                                    >
                                                        {getInitials(
                                                            customerName
                                                        )}
                                                    </div>

                                                    <div>
                                                        <div
                                                            style={{
                                                                fontWeight:
                                                                    "700",
                                                            }}
                                                        >
                                                            {
                                                                customerName
                                                            }
                                                        </div>

                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    "11px",
                                                            }}
                                                        >
                                                            {
                                                                phoneNum
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                {getLayananText(
                                                    tx
                                                )}
                                            </td>

                                            <td>
                                                {formatRupiah(
                                                    tx.total_price
                                                )}
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${getBadgeClass(
                                                        tx.status_laundry
                                                    )}`}
                                                >
                                                    {
                                                        tx.status_laundry
                                                    }
                                                </span>
                                            </td>

                                            <td>
                                                {formatDate(
                                                    tx.created_at
                                                )}
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL */}
            {selectedTx && (
                <div
                    className="modal-overlay"
                    onClick={() =>
                        setSelectedTx(null)
                    }
                >
                    <div
                        className="modal-content"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                        style={{
                            maxWidth: "520px",
                            width: "90%",
                            padding: "28px",
                            borderRadius: "20px",
                        }}
                    >
                        <button
                            onClick={() =>
                                setSelectedTx(null)
                            }
                        >
                            X
                        </button>

                        <h2>Detail Transaksi</h2>

                        <div style={{ marginTop: "20px" }}>
                            <p>
                                <strong>Invoice:</strong>{" "}
                                {selectedTx.invoice}
                            </p>

                            <p>
                                <strong>
                                    Pelanggan:
                                </strong>{" "}
                                {
                                    selectedTx.nama_pelanggan
                                }
                            </p>

                            <p>
                                <strong>
                                    Nomor HP:
                                </strong>{" "}
                                {selectedTx.nomor_hp}
                            </p>

                            <p>
                                <strong>Alamat:</strong>{" "}
                                {selectedTx.alamat}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {
                                    selectedTx.status_laundry
                                }
                            </p>

                            <p>
                                <strong>Total:</strong>{" "}
                                {formatRupiah(
                                    selectedTx.total_price
                                )}
                            </p>
                        </div>

                        <div style={{ marginTop: "24px" }}>
                            <h3>Detail Layanan</h3>

                            {selectedTx.details?.map(
                                (
                                    d: any,
                                    index: number
                                ) => {
                                    const service =
                                        services.find(
                                            (s) =>
                                                s.id ===
                                                d.layanan_id
                                        );

                                    return (
                                        <div
                                            key={
                                                index
                                            }
                                            style={{
                                                display:
                                                    "flex",
                                                justifyContent:
                                                    "space-between",
                                                padding:
                                                    "10px 0",
                                                borderBottom:
                                                    "1px dashed #e5e7eb",
                                            }}
                                        >
                                            <span>
                                                {service?.nama_layanan ||
                                                    "Layanan"}

                                                <strong>
                                                    {" "}
                                                    x
                                                    {
                                                        d.jumlah
                                                    }{" "}
                                                    {service?.satuan ||
                                                        "kg"}
                                                </strong>
                                            </span>

                                            <span>
                                                {formatRupiah(
                                                    d.subtotal
                                                )}
                                            </span>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* FOOTER */}
            <div
                style={{
                    textAlign: "center",
                    marginTop: "40px",
                    paddingBottom: "10px",
                    fontSize: "12px",
                }}
            >
                © 2026 LAUNDRYINAJA • V1.0.1
            </div>
        </div>
    );
};

export default AdminDashboard;
