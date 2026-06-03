import { useState, useMemo } from "react";
import { useCustomer } from "../hooks/useCustomer";
import { useOrder } from "../hooks/useOrder";
// import type { Customer } from "../types/Customer";
import type { Order } from "../types/Order";

/*
|--------------------------------------------------------------------------
| ENRICHED CUSTOMER TYPE (gabungan Customer + data order)
|--------------------------------------------------------------------------
*/
interface EnrichedCustomer {
  id: number;
  displayId: string;
  name: string;
  phone: string;
  address: string;
  email?: string;
  joinDate: string;
  initials: string;
  stats: {
    totalOrders: number;
    totalRevenue: number;
  };
  history: {
    id: string;
    date: string;
    service: string;
    price: number;
    status: string;
    statusLaundry: string;
  }[];
}

const CustomerDatabase = () => {
  const { customers, loading: loadingCustomers } = useCustomer();
  const { orders, loading: loadingOrders } = useOrder();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Download Modal States
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState("txt");

  const loading = loadingCustomers || loadingOrders;

  /*
  |--------------------------------------------------------------------------
  | HELPERS
  |--------------------------------------------------------------------------
  */
  const formatRupiah = (num: number) => {
    if (!num) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(num)
      .replace("Rp", "Rp ");
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) || "CS";

  const getLayananText = (order: Order) => {
    const details = (order as any).details;
    if (details?.length > 0) {
      return details
        .map((d: any) => {
          const name = d.layanan?.nama ?? "Layanan";
          const qty = Math.round(d.jumlah || 1);
          const unit = d.layanan?.satuan ?? "kg";
          return `${name} (${qty} ${unit})`;
        })
        .join(", ");
    }
    return "Cuci Kering Setrika";
  };

  const formatOrderDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return (
      date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) +
      " - " +
      date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) +
      " WIB"
    );
  };

  /*
  |--------------------------------------------------------------------------
  | ENRICH: gabungkan customers + orders
  |--------------------------------------------------------------------------
  */
  const enrichedCustomers = useMemo<EnrichedCustomer[]>(() => {
    // Map orders per pelanggan_id
    const ordersByCustomerId: Record<number, Order[]> = {};
    // Map orders per nama (untuk guest order tanpa pelanggan_id)
    const ordersByName: Record<string, Order[]> = {};

    orders.forEach((o) => {
      if (o.pelanggan_id) {
        if (!ordersByCustomerId[o.pelanggan_id]) ordersByCustomerId[o.pelanggan_id] = [];
        ordersByCustomerId[o.pelanggan_id].push(o);
      } else if (o.nama_pelanggan) {
        const key = o.nama_pelanggan.trim().toLowerCase();
        if (!ordersByName[key]) ordersByName[key] = [];
        ordersByName[key].push(o);
      }
    });

    const result: EnrichedCustomer[] = customers.map((c, index) => {
      const custOrders = ordersByCustomerId[c.id] ?? [];
      const totalRevenue = custOrders.reduce((sum, o) => sum + (o.total_price || 0), 0);

      return {
        id: c.id,
        displayId: `CUST-${String(index + 1).padStart(3, "0")}`,
        name: c.nama,
        phone: c.phone ?? "-",
        address: c.alamat ?? "-",
        email: c.email,
        joinDate: c.created_at
          ? new Date(c.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
          : "-",
        initials: getInitials(c.nama),
        stats: {
          totalOrders: custOrders.length,
          totalRevenue,
        },
        history: custOrders.map((o) => ({
          id: o.invoice || String(o.id),
          date: formatOrderDate(o.created_at),
          service: getLayananText(o),
          price: o.total_price,
          status: o.status_pembayaran,
          statusLaundry: o.status_laundry,
        })),
      };
    });

    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [customers, orders]);

  /*
  |--------------------------------------------------------------------------
  | FILTER & ACTIVE
  |--------------------------------------------------------------------------
  */
  const filteredCustomers = enrichedCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.displayId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCustomer =
    enrichedCustomers.find((c) => c.id === selectedId) ?? enrichedCustomers[0];

  /*
  |--------------------------------------------------------------------------
  | DOWNLOAD
  |--------------------------------------------------------------------------
  */
  const triggerDownload = () => {
    setIsDownloading(true);
    setDownloadProgress(10);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            let fileContent = `DATABASE PELANGGAN - LAUNDRYINAJA\n`;
            fileContent += `Tanggal Cetak: ${new Date().toLocaleString("id-ID")}\n`;
            fileContent += `==========================================================\n\n`;

            enrichedCustomers.forEach((c) => {
              fileContent += `Nama Pelanggan  : ${c.name}\n`;
              fileContent += `No Handphone    : ${c.phone}\n`;
              fileContent += `Alamat Rumah    : ${c.address}\n`;
              fileContent += `Total Pesanan   : ${c.stats.totalOrders} Pesanan\n`;
              fileContent += `Total Pendapatan: ${formatRupiah(c.stats.totalRevenue)}\n`;
              fileContent += `----------------------------------------------------------\n`;
            });

            const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute(
              "download",
              `database_pelanggan_${new Date().toISOString().split("T")[0]}.${downloadFormat}`
            );
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setIsDownloading(false);
            setShowDownloadModal(false);
            setDownloadProgress(0);
          }, 800);
          return 100;
        }
        return prev + 30;
      });
    }, 250);
  };

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */
  return (
    <div style={{ paddingBottom: "30px" }}>
      {/* Header */}
      <div
        className="dashboard-header"
        style={{
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="header-title">
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "var(--text-main)" }}>
            Database Pelanggan
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
            Kelola data profil pelanggan, alamat rumah, dan akumulasi riwayat transaksi.
          </p>
        </div>
        <button
          onClick={() => {
            setDownloadProgress(0);
            setIsDownloading(false);
            setShowDownloadModal(true);
          }}
          style={{
            padding: "10px 20px",
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            color: "#ffffff",
            border: "none",
            borderRadius: "24px",
            fontWeight: "600",
            fontSize: "13.5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 10px rgba(37, 99, 235, 0.25)",
            transition: "transform 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
          Unduh Database
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: "var(--text-muted)",
            fontSize: "15px",
          }}
        >
          ⏳ Memuat database pelanggan...
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "350px 1fr",
            gap: "24px",
            alignItems: "stretch",
          }}
        >
          {/* Left Panel: Customer List */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              border: "1px solid var(--border-color)",
              display: "flex",
              flexDirection: "column",
              height: "calc(100vh - 190px)",
              overflow: "hidden",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.03)",
            }}
          >
            {/* Search */}
            <div
              style={{
                padding: "16px",
                borderBottom: "1px solid var(--border-color)",
                background: "#f8fafc",
              }}
            >
              <div
                className="search-bar-container"
                style={{ width: "100%", margin: 0, position: "relative" }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af",
                    fontSize: "14px",
                  }}
                >
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Cari nama atau no HP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  style={{
                    padding: "10px 12px 10px 36px",
                    fontSize: "13px",
                    borderRadius: "20px",
                    width: "100%",
                    boxSizing: "border-box",
                    border: "1px solid #e2e8f0",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* List */}
            <div style={{ overflowY: "auto", flex: 1, padding: "12px" }}>
              {filteredCustomers.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "30px 10px",
                    color: "var(--text-muted)",
                    fontSize: "13px",
                  }}
                >
                  Pelanggan tidak ditemukan
                </div>
              ) : (
                filteredCustomers.map((c) => {
                  const isSelected = c.id === selectedId;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedId(c.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 14px",
                        borderRadius: "12px",
                        cursor: "pointer",
                        backgroundColor: isSelected ? "#eff6ff" : "transparent",
                        border: isSelected ? "1px solid #bfdbfe" : "1px solid transparent",
                        transition: "all 0.2s",
                        marginBottom: "6px",
                      }}
                      onMouseOver={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = "#f8fafc";
                      }}
                      onMouseOut={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          backgroundColor: isSelected ? "#2563eb" : "#f1f5f9",
                          color: isSelected ? "#ffffff" : "#475569",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "700",
                          fontSize: "14px",
                          flexShrink: 0,
                        }}
                      >
                        {c.initials}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          flex: 1,
                          overflow: "hidden",
                        }}
                      >
                        <span
                          style={{
                            fontWeight: "600",
                            fontSize: "14px",
                            color: isSelected ? "#1e3a8a" : "var(--text-main)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {c.name}
                        </span>
                        <span
                          style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}
                        >
                          {c.phone}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Panel: Customer Details */}
          {activeCustomer ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Profile Card */}
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  border: "1px solid var(--border-color)",
                  padding: "24px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.03)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "50%",
                      backgroundColor: "#eff6ff",
                      color: "#2563eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "800",
                      fontSize: "26px",
                      border: "2px solid #bfdbfe",
                    }}
                  >
                    {activeCustomer.initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "22px",
                        fontWeight: "800",
                        color: "var(--text-main)",
                      }}
                    >
                      {activeCustomer.name}
                    </h2>
                    <p style={{ margin: "6px 0 0 0", fontSize: "13px", color: "#64748b" }}>
                      Pelanggan terdaftar sejak {activeCustomer.joinDate}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "24px",
                    marginTop: "24px",
                    paddingTop: "20px",
                    borderTop: "1px solid var(--border-color)",
                  }}
                >
                  <div>
                    <span
                      style={{
                        display: "block",
                        fontSize: "11px",
                        color: "var(--text-muted)",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                      }}
                    >
                      Nomor Handphone
                    </span>
                    <span
                      style={{
                        display: "block",
                        fontSize: "14.5px",
                        fontWeight: "600",
                        color: "var(--text-main)",
                        marginTop: "6px",
                      }}
                    >
                      {activeCustomer.phone}
                    </span>
                  </div>
                  <div>
                    <span
                      style={{
                        display: "block",
                        fontSize: "11px",
                        color: "var(--text-muted)",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                      }}
                    >
                      Alamat Rumah
                    </span>
                    <span
                      style={{
                        display: "block",
                        fontSize: "14.5px",
                        fontWeight: "600",
                        color: "var(--text-main)",
                        marginTop: "6px",
                        lineHeight: "1.4",
                      }}
                    >
                      {activeCustomer.address}
                    </span>
                  </div>
                  {activeCustomer.email && (
                    <div>
                      <span
                        style={{
                          display: "block",
                          fontSize: "11px",
                          color: "var(--text-muted)",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          letterSpacing: "0.8px",
                        }}
                      >
                        Email
                      </span>
                      <span
                        style={{
                          display: "block",
                          fontSize: "14.5px",
                          fontWeight: "600",
                          color: "var(--text-main)",
                          marginTop: "6px",
                        }}
                      >
                        {activeCustomer.email}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
                <div
                  style={{
                    background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                    border: "1px solid #bfdbfe",
                    borderRadius: "16px",
                    padding: "20px 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "transform 0.2s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <div>
                    <span
                      style={{
                        display: "block",
                        color: "#1e40af",
                        fontSize: "11px",
                        fontWeight: "800",
                        letterSpacing: "0.8px",
                        textTransform: "uppercase",
                        marginBottom: "6px",
                      }}
                    >
                      TOTAL PESANAN
                    </span>
                    <span style={{ display: "block", fontSize: "26px", fontWeight: "800", color: "#1e3b8a" }}>
                      {activeCustomer.stats.totalOrders} Pesanan
                    </span>
                  </div>
                  <div
                    style={{
                      width: "46px",
                      height: "46px",
                      borderRadius: "12px",
                      background: "#3b82f6",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M8 12h8" />
                      <path d="M12 8v8" />
                    </svg>
                  </div>
                </div>

                <div
                  style={{
                    background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
                    border: "1px solid #a7f3d0",
                    borderRadius: "16px",
                    padding: "20px 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "transform 0.2s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <div>
                    <span
                      style={{
                        display: "block",
                        color: "#065f46",
                        fontSize: "11px",
                        fontWeight: "800",
                        letterSpacing: "0.8px",
                        textTransform: "uppercase",
                        marginBottom: "6px",
                      }}
                    >
                      TOTAL PENDAPATAN
                    </span>
                    <span style={{ display: "block", fontSize: "26px", fontWeight: "800", color: "#064e3b" }}>
                      {formatRupiah(activeCustomer.stats.totalRevenue)}
                    </span>
                  </div>
                  <div
                    style={{
                      width: "46px",
                      height: "46px",
                      borderRadius: "12px",
                      background: "#10b981",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <line x1="2" x2="22" y1="10" y2="10" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* History Table */}
              <div className="table-card" style={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.03)" }}>
                <span
                  className="table-title"
                  style={{
                    fontSize: "16px",
                    fontWeight: "700",
                    marginBottom: "16px",
                    display: "block",
                    color: "var(--text-main)",
                  }}
                >
                  Riwayat Transaksi Pelanggan
                </span>
                <div className="data-table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>ID Transaksi</th>
                        <th>Layanan Utama</th>
                        <th>Total Bayar</th>
                        <th>Status Bayar</th>
                        <th>Status Laundry</th>
                        <th>Tanggal Masuk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeCustomer.history.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}
                          >
                            Belum ada riwayat transaksi
                          </td>
                        </tr>
                      ) : (
                        activeCustomer.history.map((tx, idx) => (
                          <tr key={idx}>
                            <td style={{ fontWeight: "700", color: "#2563eb" }}>{tx.id}</td>
                            <td
                              style={{
                                maxWidth: "280px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                              title={tx.service}
                            >
                              {tx.service}
                            </td>
                            <td className="price-text" style={{ fontWeight: "600" }}>
                              {formatRupiah(tx.price)}
                            </td>
                            <td>
                              <span
                                className={`badge ${tx.status}`}
                                style={{ fontSize: "11px", padding: "4px 12px", fontWeight: "700" }}
                              >
                                {tx.status}
                              </span>
                            </td>
                            <td>
                              <span
                                className={`badge ${tx.statusLaundry}`}
                                style={{ fontSize: "11px", padding: "4px 12px", fontWeight: "700" }}
                              >
                                {tx.statusLaundry}
                              </span>
                            </td>
                            <td style={{ fontSize: "13px", fontWeight: "500", color: "#4b5563" }}>
                              {tx.date}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "300px",
                border: "1px dashed var(--border-color)",
                borderRadius: "16px",
                color: "var(--text-muted)",
              }}
            >
              Pilih salah satu pelanggan untuk melihat detail lengkap
            </div>
          )}
        </div>
      )}

      {/* Download Modal */}
      {showDownloadModal && (
        <div
          className="modal-overlay"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
          }}
        >
          <div
            className="modal-content"
            style={{
              maxWidth: "420px",
              width: "90%",
              textAlign: "center",
              borderRadius: "24px",
              padding: "30px",
              background: "#ffffff",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
              position: "relative",
            }}
          >
            {!isDownloading ? (
              <>
                <button
                  onClick={() => setShowDownloadModal(false)}
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "#f1f5f9",
                    color: "#475569",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "800",
                    fontSize: "13px",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e2e8f0")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
                >
                  ✕
                </button>

                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "#eff6ff",
                    color: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px auto",
                    fontSize: "24px",
                  }}
                >
                  📥
                </div>

                <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>
                  Ekspor Database Pelanggan
                </h3>
                <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px", lineHeight: "1.4" }}>
                  Pilih format dokumen untuk mengunduh seluruh data pelanggan laundry Anda.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
                  {(["txt", "csv"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setDownloadFormat(fmt)}
                      style={{
                        padding: "12px",
                        borderRadius: "12px",
                        border: downloadFormat === fmt ? "2px solid #2563eb" : "1.5px solid #e2e8f0",
                        background: downloadFormat === fmt ? "#eff6ff" : "#ffffff",
                        color: downloadFormat === fmt ? "#1e40af" : "#475569",
                        fontWeight: "700",
                        fontSize: "13px",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span style={{ fontSize: "18px" }}>{fmt === "txt" ? "📄" : "📊"}</span>
                      {fmt === "txt" ? "Dokumen Teks (.txt)" : "Spreadsheet (.csv)"}
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  <button
                    onClick={() => setShowDownloadModal(false)}
                    style={{
                      padding: "10px 22px",
                      borderRadius: "24px",
                      border: "1.5px solid #cbd5e1",
                      cursor: "pointer",
                      background: "#ffffff",
                      color: "#475569",
                      fontWeight: "600",
                      fontSize: "13.5px",
                    }}
                  >
                    Batal
                  </button>
                  <button
                    onClick={triggerDownload}
                    style={{
                      padding: "10px 24px",
                      background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                      color: "#ffffff",
                      borderRadius: "24px",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "700",
                      fontSize: "13.5px",
                    }}
                  >
                    Mulai Unduh
                  </button>
                </div>
              </>
            ) : (
              <div style={{ padding: "10px 0" }}>
                <div
                  style={{ position: "relative", width: "80px", height: "80px", margin: "0 auto 20px auto" }}
                >
                  <div
                    style={{
                      boxSizing: "border-box",
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      border: "5px solid #eff6ff",
                      borderTopColor: "#2563eb",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#2563eb",
                    }}
                  >
                    {downloadProgress}%
                  </span>
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", marginBottom: "8px" }}>
                  Menyiapkan Dokumen
                </h3>
                <p style={{ fontSize: "13px", color: "#64748b" }}>
                  Mengumpulkan data pelanggan dan memproses file ekspor...
                </p>
                <div
                  style={{
                    width: "100%",
                    height: "6px",
                    backgroundColor: "#f1f5f9",
                    borderRadius: "3px",
                    marginTop: "20px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${downloadProgress}%`,
                      height: "100%",
                      backgroundColor: "#2563eb",
                      borderRadius: "3px",
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDatabase;