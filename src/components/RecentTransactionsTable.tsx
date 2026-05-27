import React, { useState } from "react";
import { Link } from "react-router-dom";

// ── Types ─────────────────────────────────────────────────────────────────
type LaundryStatus =
    | "received"
    | "process"
    | "ready"
    | "taken";

type PaymentStatus =
    | "paid"
    | "pending";

interface Transaction {
    id: number;
    nama_pelanggan?: string;
    total_price: number;

    status_laundry: LaundryStatus;
    status_pembayaran: PaymentStatus;

    tanggal_order: string;
}

interface RecentTransactionsTableProps {
    transactions: Transaction[];
    loading?: boolean;

    onUpdateStatus: (
        id: number,
        status: LaundryStatus
    ) => Promise<void>;

    onUpdatePembayaran: (
        id: number,
        status: PaymentStatus
    ) => Promise<void>;
}

// ── Constants ─────────────────────────────────────────────────────────────
const LAUNDRY_OPTIONS: {
    value: LaundryStatus;
    label: string;
}[] = [
    { value: "received", label: "Diterima" },
    { value: "process", label: "Dicuci" },
    { value: "ready", label: "Siap Diambil" },
    { value: "taken", label: "Selesai" },
];

const PAYMENT_OPTIONS: {
    value: PaymentStatus;
    label: string;
}[] = [
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Lunas" },
];

// ── Helpers ───────────────────────────────────────────────────────────────
const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    })
        .format(num)
        .replace("Rp", "Rp ");

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) return dateStr;

    return date.toLocaleDateString("id-ID", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const getLaundryBadge = (
    status: LaundryStatus
) => {
    if (
        status === "taken" ||
        status === "ready"
    )
        return "success";

    if (status === "process")
        return "process";

    return "pending";
};

const getPaymentBadge = (
    status: PaymentStatus
) => {
    return status === "paid"
        ? "success"
        : "pending";
};

// ── Payment Cell ──────────────────────────────────────────────────────────
interface PaymentCellProps {
    transactionId: number;
    currentStatus: PaymentStatus;

    onUpdatePembayaran: (
        id: number,
        status: PaymentStatus
    ) => Promise<void>;
}

const PaymentCell: React.FC<
    PaymentCellProps
> = ({
    transactionId,
    currentStatus,
    onUpdatePembayaran,
}) => {
    const [localStatus, setLocalStatus] =
        useState<PaymentStatus>(
            currentStatus
        );

    const [saving, setSaving] =
        useState(false);

    const handleChange = async (
        newStatus: PaymentStatus
    ) => {
        setSaving(true);

        setLocalStatus(newStatus);

        await onUpdatePembayaran(
            transactionId,
            newStatus
        );

        setSaving(false);
    };

    return (
        <td>
            <select
                value={localStatus}
                disabled={saving}
                onChange={(e) =>
                    handleChange(
                        e.target
                            .value as PaymentStatus
                    )
                }
                className={`badge ${getPaymentBadge(
                    localStatus
                )}`}
            >
                {PAYMENT_OPTIONS.map((opt) => (
                    <option
                        key={opt.value}
                        value={opt.value}
                    >
                        {saving
                            ? "..."
                            : opt.label}
                    </option>
                ))}
            </select>
        </td>
    );
};

// ── Laundry Cell ──────────────────────────────────────────────────────────
interface LaundryCellProps {
    transactionId: number;
    currentStatus: LaundryStatus;

    onUpdateStatus: (
        id: number,
        status: LaundryStatus
    ) => Promise<void>;
}

const LaundryCell: React.FC<
    LaundryCellProps
> = ({
    transactionId,
    currentStatus,
    onUpdateStatus,
}) => {
    const [localStatus, setLocalStatus] =
        useState<LaundryStatus>(
            currentStatus
        );

    const [saving, setSaving] =
        useState(false);

    const handleChange = async (
        newStatus: LaundryStatus
    ) => {
        setSaving(true);

        setLocalStatus(newStatus);

        await onUpdateStatus(
            transactionId,
            newStatus
        );

        setSaving(false);
    };

    return (
        <td>
            <select
                value={localStatus}
                disabled={saving}
                onChange={(e) =>
                    handleChange(
                        e.target
                            .value as LaundryStatus
                    )
                }
                className={`badge ${getLaundryBadge(
                    localStatus
                )}`}
            >
                {LAUNDRY_OPTIONS.map((opt) => (
                    <option
                        key={opt.value}
                        value={opt.value}
                    >
                        {saving
                            ? "..."
                            : opt.label}
                    </option>
                ))}
            </select>
        </td>
    );
};

// ── Main Component ────────────────────────────────────────────────────────
const RecentTransactionsTable: React.FC<
    RecentTransactionsTableProps
> = ({
    transactions,
    loading = false,
    onUpdateStatus,
    onUpdatePembayaran,
}) => {
    return (
        <div className="table-card">
            <div className="table-header">
                <span className="table-title">
                    Transaksi terbaru
                </span>

                <Link
                    to="/riwayat"
                    className="view-all-btn"
                >
                    View semua
                </Link>
            </div>

            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Pelanggan</th>
                            <th>Harga</th>
                            <th>Pembayaran</th>
                            <th>Status Laundry</th>
                            <th>Tanggal</th>
                        </tr>
                    </thead>

                    <tbody>
                        {transactions.map((tx) => (
                            <tr key={tx.id}>
                                <td>
                                    {tx.nama_pelanggan ??
                                        "-"}
                                </td>

                                <td>
                                    {formatRupiah(
                                        tx.total_price
                                    )}
                                </td>

                                <PaymentCell
                                    transactionId={
                                        tx.id
                                    }
                                    currentStatus={
                                        tx.status_pembayaran
                                    }
                                    onUpdatePembayaran={
                                        onUpdatePembayaran
                                    }
                                />

                                <LaundryCell
                                    transactionId={
                                        tx.id
                                    }
                                    currentStatus={
                                        tx.status_laundry
                                    }
                                    onUpdateStatus={
                                        onUpdateStatus
                                    }
                                />

                                <td>
                                    {formatDate(
                                        tx.tanggal_order
                                    )}
                                </td>
                            </tr>
                        ))}

                        {transactions.length ===
                            0 &&
                            !loading && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        style={{
                                            textAlign:
                                                "center",
                                            color:
                                                "#9ca3af",
                                            padding:
                                                "1.5rem",
                                        }}
                                    >
                                        Belum ada
                                        transaksi bulan
                                        ini.
                                    </td>
                                </tr>
                            )}

                        {loading && (
                            <tr>
                                <td
                                    colSpan={5}
                                    style={{
                                        textAlign:
                                            "center",
                                        color:
                                            "#9ca3af",
                                        padding:
                                            "1.5rem",
                                    }}
                                >
                                    Mengambil
                                    data...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentTransactionsTable;