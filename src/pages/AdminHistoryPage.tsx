import { useState } from "react";
import { useOrder } from "../hooks/useOrder";
import type { Order } from "../types/Order";

const AdminHistoryPage = () => {
  const { orders, loading } = useOrder();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTx, setSelectedTx] = useState<Order | null>(null);

  /*
  |--------------------------------------------------------------------------
  | HELPERS
  |--------------------------------------------------------------------------
  */
  const formatRupiah = (num: number) => {
    if (num === undefined || num === null) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(num)
      .replace("Rp", "Rp ");
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return { date: "-", time: "" };
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return { date: dateStr, time: "" };
    return {
      date: date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      time:
        date
          .toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
          .replace(":", ".") + " WIB",
    };
  };

  const getLayananText = (tx: Order) => {
    if (tx.details && tx.details.length > 0) {
      return tx.details
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

  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */
  const filteredTransactions = orders.filter((tx) => {
    const query = searchQuery.toLowerCase();
    const invoice = String(tx.invoice || tx.id || "").toLowerCase();
    const name = String(tx.nama_pelanggan || "").toLowerCase();
    const status = String(tx.status_pembayaran || "").toLowerCase();
    const statusLaundry = String(tx.status_laundry || "").toLowerCase();

    let servicesStr = "";
    if ((tx as any).details?.length > 0) {
      servicesStr = (tx as any).details
        .map((d: any) => d.layanan?.nama ?? "")
        .join(" ")
        .toLowerCase();
    }

    const dateObj = formatDate(tx.created_at);
    const dateStr = String(dateObj.date || "").toLowerCase();

    return (
      invoice.includes(query) ||
      name.includes(query) ||
      status.includes(query) ||
      statusLaundry.includes(query) ||
      servicesStr.includes(query) ||
      dateStr.includes(query)
    );
  });

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */
  return (
    <div>
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-title">
          <h1>Riwayat Transaksi (Admin)</h1>
          <p>Audit dan monitor seluruh laporan transaksi masuk secara real-time.</p>
        </div>
      </div>

      {/* Search */}
      <div className="history-controls">
        <div className="search-bar-container">
          <svg
            className="search-icon-svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Cari ID transaksi, nama, status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-header">
          <span className="table-title">Audit Ledger Transaksi</span>
          <span style={{ fontSize: "13px", color: "#6b7280", fontWeight: "500" }}>
            Menampilkan {filteredTransactions.length} records
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#6b7280" }}>
            Mengambil data audit ledger...
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af" }}>
            {searchQuery
              ? "Tidak ada data yang cocok dengan pencarian."
              : "Belum ada transaksi terekam."}
          </div>
        ) : (
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID Transaksi</th>
                  <th>Pelanggan</th>
                  <th>Layanan Utama</th>
                  <th>Total Bayar</th>
                  <th>Status Bayar</th>
                  <th>Status Laundry</th>
                  <th>Tanggal & Waktu</th>
                </tr>
              </thead>
              <tbody>
                {[...filteredTransactions]
                  .sort((a, b) => b.id - a.id)
                  .map((tx) => (
                    <tr
                      key={tx.id}
                      onClick={() => setSelectedTx(tx)}
                      style={{ cursor: "pointer" }}
                      className="clickable-row"
                    >
                      <td style={{ fontWeight: "700", color: "#2563eb" }}>
                        {tx.invoice || tx.id}
                      </td>
                      <td>{tx.nama_pelanggan || "-"}</td>
                      <td
                        style={{
                          maxWidth: "200px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={getLayananText(tx)}
                      >
                        {getLayananText(tx)}
                      </td>
                      <td className="price-text" style={{ fontWeight: "600" }}>
                        {formatRupiah(tx.total_price)}
                      </td>
                      <td>
                        <span
                          className={`badge ${tx.status_pembayaran}`}
                          style={{ fontSize: "11px", padding: "4px 10px", fontWeight: "700" }}
                        >
                          {tx.status_pembayaran}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${tx.status_laundry}`}
                          style={{ fontSize: "11px", padding: "4px 10px", fontWeight: "700" }}
                        >
                          {tx.status_laundry}
                        </span>
                      </td>
                      <td>
                        <div className="date-time-cell">
                          <span className="date-text">
                            {formatDate(tx.created_at).date}
                          </span>
                          {formatDate(tx.created_at).time && (
                            <span
                              className="time-text"
                              style={{ fontSize: "11px", color: "#6b7280" }}
                            >
                              {formatDate(tx.created_at).time}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedTx && (
        <div className="modal-overlay" onClick={() => setSelectedTx(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "520px",
              width: "90%",
              textAlign: "left",
              padding: "28px",
              borderRadius: "20px",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              position: "relative",
            }}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedTx(null)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: "#f3f4f6",
                color: "#1f2937",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                fontSize: "13px",
              }}
            >
              ✕
            </button>

            <h2
              style={{
                fontSize: "20px",
                fontWeight: "700",
                marginBottom: "16px",
                color: "#111827",
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "12px",
                marginTop: 0,
              }}
            >
              Detail Transaksi
            </h2>

            {/* Invoice & Status */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <div>
                <span
                  style={{
                    fontSize: "11px",
                    color: "#6b7280",
                    display: "block",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                  }}
                >
                  ID TRANSAKSI
                </span>
                <span style={{ fontSize: "16px", fontWeight: "700", color: "#2563eb" }}>
                  {selectedTx.invoice || selectedTx.id}
                </span>
              </div>
              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    fontSize: "11px",
                    color: "#6b7280",
                    display: "block",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                  }}
                >
                  STATUS PEMBAYARAN
                </span>
                <span
                  className={`badge ${selectedTx.status_pembayaran}`}
                  style={{ fontSize: "12px", padding: "4px 12px", fontWeight: "700", borderRadius: "20px" }}
                >
                  {selectedTx.status_pembayaran}
                </span>
              </div>
            </div>

            {/* Info Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "20px",
                background: "#f9fafb",
                padding: "16px",
                borderRadius: "14px",
                border: "1px solid #e5e7eb",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "10px",
                    color: "#6b7280",
                    display: "block",
                    textTransform: "uppercase",
                    fontWeight: "600",
                  }}
                >
                  Pelanggan
                </span>
                <span style={{ fontWeight: "700", fontSize: "14px", color: "#111827" }}>
                  {selectedTx.nama_pelanggan || "-"}
                </span>
              </div>
              <div>
                <span
                  style={{
                    fontSize: "10px",
                    color: "#6b7280",
                    display: "block",
                    textTransform: "uppercase",
                    fontWeight: "600",
                  }}
                >
                  No Handphone
                </span>
                <span style={{ fontWeight: "600", fontSize: "14px", color: "#111827" }}>
                  {selectedTx.nomor_hp || "-"}
                </span>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <span
                  style={{
                    fontSize: "10px",
                    color: "#6b7280",
                    display: "block",
                    textTransform: "uppercase",
                    fontWeight: "600",
                  }}
                >
                  Alamat
                </span>
                <span style={{ fontSize: "13px", color: "#374151", fontWeight: "500" }}>
                  {selectedTx.alamat || "-"}
                </span>
              </div>
              <div>
                <span
                  style={{
                    fontSize: "10px",
                    color: "#6b7280",
                    display: "block",
                    textTransform: "uppercase",
                    fontWeight: "600",
                  }}
                >
                  Status Laundry
                </span>
                <span
                  className={`badge ${selectedTx.status_laundry}`}
                  style={{ fontSize: "11px", padding: "3px 10px", fontWeight: "700", borderRadius: "20px" }}
                >
                  {selectedTx.status_laundry}
                </span>
              </div>
              <div>
                <span
                  style={{
                    fontSize: "10px",
                    color: "#6b7280",
                    display: "block",
                    textTransform: "uppercase",
                    fontWeight: "600",
                  }}
                >
                  Tanggal Masuk
                </span>
                <span style={{ fontSize: "13px", color: "#374151", fontWeight: "500" }}>
                  {formatDate(selectedTx.created_at).date},{" "}
                  {formatDate(selectedTx.created_at).time}
                </span>
              </div>
              <div>
                <span
                  style={{
                    fontSize: "10px",
                    color: "#6b7280",
                    display: "block",
                    textTransform: "uppercase",
                    fontWeight: "600",
                  }}
                >
                  Tanggal Terima
                </span>
                <span style={{ fontSize: "13px", color: "#374151", fontWeight: "500" }}>
                  {selectedTx.tanggal_terima || "-"}
                </span>
              </div>
            </div>

            {/* Detail Layanan */}
            <h3
              style={{
                fontSize: "13px",
                fontWeight: "700",
                marginBottom: "10px",
                color: "#374151",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Detail Layanan
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginBottom: "20px",
                maxHeight: "150px",
                overflowY: "auto",
              }}
            >
              {(selectedTx as any).details?.length > 0 ? (
                (selectedTx as any).details.map((d: any, index: number) => {
                  const name = d.layanan?.nama ?? "Layanan";
                  const qty = Math.round(d.jumlah || 1);
                  const unit = d.layanan?.satuan ?? "kg";
                  const subtotal = d.subtotal || d.jumlah * (d.layanan?.harga || 0);
                  return (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "13px",
                        paddingBottom: "6px",
                        borderBottom: "1px dashed #e5e7eb",
                      }}
                    >
                      <span style={{ color: "#4b5563" }}>
                        {name}{" "}
                        <strong style={{ color: "#111827" }}>
                          x{qty} {unit}
                        </strong>
                      </span>
                      <span style={{ fontWeight: "600", color: "#111827" }}>
                        {formatRupiah(subtotal)}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p style={{ color: "#9ca3af", fontSize: "13px" }}>
                  Tidak ada detail layanan.
                </p>
              )}
            </div>

            {/* Total */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "700",
                fontSize: "15px",
                borderTop: "2px solid #e5e7eb",
                paddingTop: "12px",
                color: "#111827",
              }}
            >
              <span>TOTAL BAYAR</span>
              <span style={{ color: "#10b981", fontSize: "16px" }}>
                {formatRupiah(selectedTx.total_price)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHistoryPage;