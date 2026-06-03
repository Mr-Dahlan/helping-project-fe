import { useMemo, useState } from "react";

import { useOrder } from "../hooks/useOrder";
import { useService } from "../hooks/useService";
import { useUsers } from "../hooks/useUser";

const FinancialReports = () => {
  /*
    |--------------------------------------------------------------------------
    | HOOKS
    |--------------------------------------------------------------------------
    */
  const { orders, loading: orderLoading } = useOrder();
  const { services, loading: serviceLoading } = useService();
  const { users, loading: userLoading } = useUsers();

  /*
    |--------------------------------------------------------------------------
    | STATE
    |--------------------------------------------------------------------------
    */
  const [period, setPeriod] = useState("Bulanan");
  const [searchQuery, setSearchQuery] = useState("");

  /*
    |--------------------------------------------------------------------------
    | DOWNLOAD MODAL
    |--------------------------------------------------------------------------
    */
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const [downloadProgress, setDownloadProgress] = useState(0);

  const [isDownloading, setIsDownloading] = useState(false);

  const [downloadFormat, setDownloadFormat] = useState("txt");

  /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */
  const loading = orderLoading || serviceLoading || userLoading;

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
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  /*
    |--------------------------------------------------------------------------
    | GET SERVICE NAME
    |--------------------------------------------------------------------------
    */
  const getServiceName = (layananId: number) => {
    const service = services.find((s) => s.id === layananId);

    return service?.nama_layanan || "Layanan";
  };

  /*
    |--------------------------------------------------------------------------
    | GET SERVICE UNIT
    |--------------------------------------------------------------------------
    */
  const getServiceUnit = (layananId: number) => {
    const service = services.find((s) => s.id === layananId);

    return service?.satuan || "kg";
  };

  /*
    |--------------------------------------------------------------------------
    | FORMAT LAYANAN
    |--------------------------------------------------------------------------
    */
  const getLayananText = (tx: any) => {
    if (!tx.details || tx.details.length === 0) {
      return "-";
    }

    return tx.details
      .map((d: any) => {
        return `${getServiceName(d.layanan_id)} (${d.jumlah} ${getServiceUnit(
          d.layanan_id,
        )})`;
      })
      .join(", ");
  };

  /*
    |--------------------------------------------------------------------------
    | OVERHEAD COST
    |--------------------------------------------------------------------------
    */
  const getOverheadCost = (serviceName: string) => {
    const name = serviceName.toLowerCase();

    if (name.includes("cuci") && name.includes("lipat")) return 5000;

    if (name.includes("setrika")) return 3500;

    if (name.includes("kering") && name.includes("setrika")) return 6000;

    if (name.includes("sepatu")) return 18000;

    if (name.includes("bed cover")) return 15000;

    return 4000;
  };

  /*
    |--------------------------------------------------------------------------
    | FILTER PERIOD
    |--------------------------------------------------------------------------
    */
  const filteredOrders = useMemo(() => {
    const now = new Date();

    return orders.filter((o: any) => {
      const txDate = new Date(o.created_at);

      const diffMs = now.getTime() - txDate.getTime();

      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (period === "Bulanan") {
        return diffDays <= 30;
      }

      if (period === "Triwulan") {
        return diffDays <= 90;
      }

      if (period === "Tahunan") {
        return diffDays <= 365;
      }

      return true;
    });
  }, [orders, period]);

  /*
    |--------------------------------------------------------------------------
    | TOTAL REVENUE
    |--------------------------------------------------------------------------
    */
  const totalRevenue = useMemo(() => {
    return filteredOrders.reduce(
      (sum: number, tx: any) => sum + Number(tx.total_price || 0),
      0,
    );
  }, [filteredOrders]);

  /*
    |--------------------------------------------------------------------------
    | PROJECTED PROFIT
    |--------------------------------------------------------------------------
    */
  const projectedProfit = useMemo(() => {
    let totalOverhead = 0;

    filteredOrders.forEach((tx: any) => {
      tx.details?.forEach((d: any) => {
        const serviceName = getServiceName(d.layanan_id);

        totalOverhead +=
          Number(getOverheadCost(serviceName)) * Number(d.jumlah || 1);
      });
    });

    return Math.max(totalRevenue - totalOverhead, 0);
  }, [filteredOrders, totalRevenue]);

  /*
    |--------------------------------------------------------------------------
    | LEDGER
    |--------------------------------------------------------------------------
    */
  const ledger = useMemo(() => {
    return filteredOrders.map((tx: any) => ({
      txId: tx.invoice || String(tx.id),

      customer: tx.nama_pelanggan || "Customer",

      serviceType: getLayananText(tx),

      paymentMethod: tx.metode_pembayaran || "cash",

      dateTime:
        new Date(tx.created_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }) +
        " - " +
        new Date(tx.created_at).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }) +
        " WIB",

      price: tx.total_price || 0,

      status: tx.status_laundry || "pending",

      initials: getInitials(tx.nama_pelanggan),

      kasir: users.find((u: any) => u.id === tx.user_id)?.name || "Admin",
    }));
  }, [filteredOrders, users]);

  /*
    |--------------------------------------------------------------------------
    | SEARCH FILTER
    |--------------------------------------------------------------------------
    */
  const filteredLedger = ledger.filter((l: any) => {
    const query = searchQuery.toLowerCase();

    return (
      l.customer.toLowerCase().includes(query) ||
      l.txId.toLowerCase().includes(query) ||
      l.serviceType.toLowerCase().includes(query) ||
      l.dateTime.toLowerCase().includes(query) ||
      l.kasir.toLowerCase().includes(query)
    );
  });

  /*
    |--------------------------------------------------------------------------
    | DOWNLOAD REPORT
    |--------------------------------------------------------------------------
    */
  const handleDownload = () => {
    setIsDownloading(true);
    setDownloadProgress(10);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);

          setTimeout(() => {
            let content = `LAPORAN KEUANGAN - LAUNDRYINAJA\n`;

            content += `Periode: ${period}\n`;

            content += `Dibuat pada: ${new Date().toLocaleString("id-ID")}\n`;

            content += `=====================================\n`;

            content += `TOTAL REVENUE: ${formatRupiah(totalRevenue)}\n`;

            content += `PROJECTED PROFIT: ${formatRupiah(projectedProfit)}\n\n`;

            filteredLedger.forEach((l: any) => {
              content += `${l.txId} | ${l.customer} | ${l.serviceType} | ${l.kasir} | ${l.paymentMethod} | ${l.dateTime} | ${formatRupiah(
                l.price,
              )}\n`;
            });

            const blob = new Blob([content], {
              type: "text/plain;charset=utf-8;",
            });

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;

            link.download = `laporan_keuangan_${period.toLowerCase()}.${
              downloadFormat
            }`;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            setIsDownloading(false);

            setShowDownloadModal(false);

            setDownloadProgress(0);
          }, 800);

          return 100;
        }

        return prev + 25;
      });
    }, 250);
  };

  /*
    |--------------------------------------------------------------------------
    | LOADING
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
        }}
      >
        Memuat laporan keuangan...
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="dashboard-header">
        <div className="header-title">
          <h1>Laporan Keuangan</h1>

          <p>Detail keuangan dan analisis bisnis secara real-time</p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              background: "#e2e8f0",
              borderRadius: "24px",
              padding: "2px",
            }}
          >
            {["Bulanan", "Triwulan", "Tahunan"].map((t) => (
              <button key={t} onClick={() => setPeriod(t)}>
                {t}
              </button>
            ))}
          </div>

          <button onClick={() => setShowDownloadModal(true)}>
            Unduh Laporan
          </button>
        </div>
      </div>

      {/* METRICS */}
      <div
        className="metrics-grid"
        style={{
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div className="metric-card green">
          <div className="metric-info">
            <span className="metric-label">TOTAL REVENUE</span>

            <span className="metric-value">{formatRupiah(totalRevenue)}</span>
          </div>
        </div>

        <div className="metric-card purple">
          <div className="metric-info">
            <span className="metric-label">PROJECTED PROFIT</span>

            <span className="metric-value">
              {formatRupiah(projectedProfit)}
            </span>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Cari transaksi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* TABLE */}
      <div className="table-card">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Pelanggan</th>
                <th>Layanan</th>
                <th>Kasir</th>
                <th>Metode</th>
                <th>Tanggal</th>
                <th>Harga</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredLedger.map((l: any, index: number) => (
                <tr key={index}>
                  <td>{l.txId}</td>

                  <td>{l.customer}</td>

                  <td>{l.serviceType}</td>

                  <td>{l.kasir}</td>

                  <td>{l.paymentMethod}</td>

                  <td>{l.dateTime}</td>

                  <td>{formatRupiah(l.price)}</td>

                  <td>
                    <span
                      className={`badge ${
                        l.status === "taken" || l.status === "ready"
                          ? "success"
                          : "pending"
                      }`}
                    >
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DOWNLOAD MODAL */}
      {showDownloadModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            {!isDownloading ? (
              <>
                <h3>Unduh Laporan</h3>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginTop: "20px",
                  }}
                >
                  <button onClick={() => setDownloadFormat("txt")}>TXT</button>

                  <button onClick={() => setDownloadFormat("csv")}>CSV</button>
                </div>

                <div
                  style={{
                    marginTop: "20px",
                  }}
                >
                  <button onClick={handleDownload}>Download</button>

                  <button onClick={() => setShowDownloadModal(false)}>
                    Tutup
                  </button>
                </div>
              </>
            ) : (
              <div>
                <h3>Menyiapkan Laporan...</h3>

                <div
                  style={{
                    marginTop: "20px",
                  }}
                >
                  {downloadProgress}%
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialReports;
