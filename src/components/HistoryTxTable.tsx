import React, { useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────
type LaundryStatus =
    | 'received'
    | 'process'
    | 'ready'
    | 'taken';

type PaymentStatus =
    | 'paid'
    | 'pending';

interface Order {
    id: number;
    invoice: string;
    nama_pelanggan?: string;
    nomor_hp?: string;

    total_price: number;

    status_laundry: LaundryStatus;
    status_pembayaran: PaymentStatus;

    created_at: string;
}

interface TransactionTableProps {
    orders: Order[];
    loading?: boolean;
    searchQuery?: string;

    onStatusChange?: (
        id: number,
        newStatus: LaundryStatus
    ) => Promise<void>;

    onPaymentChange?: (
        id: number,
        newStatus: PaymentStatus
    ) => Promise<void>;
}

// ── Constants ─────────────────────────────────────────────────────────────
const STATUS_OPTIONS: {
    value: LaundryStatus;
    label: string;
}[] = [
    { value: 'received', label: 'Diterima' },
    { value: 'process', label: 'Sedang Dicuci' },
    { value: 'ready', label: 'Siap Diambil' },
    { value: 'taken', label: 'Selesai' },
];

const PAYMENT_OPTIONS: {
    value: PaymentStatus;
    label: string;
}[] = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Lunas' },
];

// ── Helpers ───────────────────────────────────────────────────────────────
const formatRupiah = (num: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    })
        .format(num)
        .replace('Rp', 'Rp ');

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);

    if (isNaN(date.getTime()))
        return dateStr;

    return date.toLocaleDateString(
        'en-US',
        {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }
    );
};

const getBadgeClass = (
    status:
        | LaundryStatus
        | PaymentStatus
) => {
    if (
        status === 'taken' ||
        status === 'ready' ||
        status === 'paid'
    )
        return 'success';

    if (status === 'process')
        return 'process';

    return 'pending';
};

const getStatusLabel = (
    status: LaundryStatus
) => {
    return (
        STATUS_OPTIONS.find(
            (s) => s.value === status
        )?.label ?? status
    );
};

const getPaymentLabel = (
    status: PaymentStatus
) => {
    return (
        PAYMENT_OPTIONS.find(
            (s) => s.value === status
        )?.label ?? status
    );
};

// ── Status Laundry Cell ───────────────────────────────────────────────────
interface StatusCellProps {
    orderId: number;
    currentStatus: LaundryStatus;

    onStatusChange?: (
        id: number,
        newStatus: LaundryStatus
    ) => Promise<void>;
}

const StatusCell: React.FC<
    StatusCellProps
> = ({
    orderId,
    currentStatus,
    onStatusChange,
}) => {
    const [isEditing, setIsEditing] =
        useState(false);

    const [localStatus, setLocalStatus] =
        useState<LaundryStatus>(
            currentStatus
        );

    const [saving, setSaving] =
        useState(false);

    const handleSave = async (
        newStatus: LaundryStatus
    ) => {
        setSaving(true);

        setLocalStatus(newStatus);

        setIsEditing(false);

        await onStatusChange?.(
            orderId,
            newStatus
        );

        setSaving(false);
    };

    if (isEditing) {
        return (
            <td
                style={{
                    minWidth: '160px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                    }}
                >
                    <select
                        autoFocus
                        defaultValue={
                            localStatus
                        }
                        onChange={(e) =>
                            handleSave(
                                e.target
                                    .value as LaundryStatus
                            )
                        }
                        onBlur={() =>
                            setIsEditing(false)
                        }
                        style={{
                            fontSize: '12px',
                            padding:
                                '4px 8px',
                            borderRadius:
                                '6px',
                            border:
                                '1.5px solid #3b82f6',
                            outline: 'none',
                            background:
                                '#fff',
                            cursor: 'pointer',
                            color:
                                '#111827',
                        }}
                    >
                        {STATUS_OPTIONS.map(
                            (opt) => (
                                <option
                                    key={
                                        opt.value
                                    }
                                    value={
                                        opt.value
                                    }
                                >
                                    {
                                        opt.label
                                    }
                                </option>
                            )
                        )}
                    </select>
                </div>
            </td>
        );
    }

    return (
        <td>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                }}
            >
                <span
                    className={`badge ${getBadgeClass(
                        localStatus
                    )}`}
                >
                    {saving
                        ? '...'
                        : getStatusLabel(
                              localStatus
                          )}
                </span>

                {onStatusChange && (
                    <button
                        onClick={() =>
                            setIsEditing(
                                true
                            )
                        }
                        title="Ubah status"
                        style={{
                            background:
                                'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '2px',
                            color:
                                '#9ca3af',
                            display: 'flex',
                            alignItems:
                                'center',
                            borderRadius:
                                '4px',
                            transition:
                                'color 0.15s',
                        }}
                        onMouseEnter={(
                            e
                        ) =>
                            (e.currentTarget.style.color =
                                '#3b82f6')
                        }
                        onMouseLeave={(
                            e
                        ) =>
                            (e.currentTarget.style.color =
                                '#9ca3af')
                        }
                    >
                        <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    </button>
                )}
            </div>
        </td>
    );
};

// ── Payment Cell ──────────────────────────────────────────────────────────
interface PaymentCellProps {
    orderId: number;
    currentStatus: PaymentStatus;

    onPaymentChange?: (
        id: number,
        newStatus: PaymentStatus
    ) => Promise<void>;
}

const PaymentCell: React.FC<
    PaymentCellProps
> = ({
    orderId,
    currentStatus,
    onPaymentChange,
}) => {
    const [isEditing, setIsEditing] =
        useState(false);

    const [localStatus, setLocalStatus] =
        useState<PaymentStatus>(
            currentStatus
        );

    const [saving, setSaving] =
        useState(false);

    const handleSave = async (
        newStatus: PaymentStatus
    ) => {
        setSaving(true);

        setLocalStatus(newStatus);

        setIsEditing(false);

        await onPaymentChange?.(
            orderId,
            newStatus
        );

        setSaving(false);
    };

    if (isEditing) {
        return (
            <td
                style={{
                    minWidth: '140px',
                }}
            >
                <select
                    autoFocus
                    defaultValue={
                        localStatus
                    }
                    onChange={(e) =>
                        handleSave(
                            e.target
                                .value as PaymentStatus
                        )
                    }
                    onBlur={() =>
                        setIsEditing(false)
                    }
                    style={{
                        fontSize: '12px',
                        padding:
                            '4px 8px',
                        borderRadius:
                            '6px',
                        border:
                            '1.5px solid #10b981',
                        outline: 'none',
                        background: '#fff',
                        cursor: 'pointer',
                        color: '#111827',
                    }}
                >
                    {PAYMENT_OPTIONS.map(
                        (opt) => (
                            <option
                                key={
                                    opt.value
                                }
                                value={
                                    opt.value
                                }
                            >
                                {opt.label}
                            </option>
                        )
                    )}
                </select>
            </td>
        );
    }

    return (
        <td>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                }}
            >
                <span
                    className={`badge ${getBadgeClass(
                        localStatus
                    )}`}
                >
                    {saving
                        ? '...'
                        : getPaymentLabel(
                              localStatus
                          )}
                </span>

                {onPaymentChange && (
                    <button
                        onClick={() =>
                            setIsEditing(
                                true
                            )
                        }
                        title="Ubah pembayaran"
                        style={{
                            background:
                                'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '2px',
                            color:
                                '#9ca3af',
                            display: 'flex',
                            alignItems:
                                'center',
                            borderRadius:
                                '4px',
                            transition:
                                'color 0.15s',
                        }}
                        onMouseEnter={(
                            e
                        ) =>
                            (e.currentTarget.style.color =
                                '#10b981')
                        }
                        onMouseLeave={(
                            e
                        ) =>
                            (e.currentTarget.style.color =
                                '#9ca3af')
                        }
                    >
                        <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                    </button>
                )}
            </div>
        </td>
    );
};

// ── TransactionTable ──────────────────────────────────────────────────────
const TransactionTable: React.FC<
    TransactionTableProps
> = ({
    orders,
    loading = false,
    searchQuery = '',
    onStatusChange,
    onPaymentChange,
}) => {
    if (loading) {
        return (
            <div
                style={{
                    textAlign: 'center',
                    padding:
                        '40px 0',
                    color:
                        '#6b7280',
                }}
            >
                Mengambil data
                transaksi...
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div
                style={{
                    textAlign: 'center',
                    padding:
                        '40px 0',
                    color:
                        '#9ca3af',
                }}
            >
                {searchQuery
                    ? 'Tidak ada transaksi yang cocok dengan pencarian.'
                    : 'Belum ada riwayat transaksi.'}
            </div>
        );
    }

    return (
        <div className="data-table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>
                            No Invoice
                        </th>
                        <th>
                            Pelanggan
                        </th>
                        <th>
                            No Handphone
                        </th>
                        <th>
                            Total Bayar
                        </th>
                        <th>
                            Pembayaran
                        </th>
                        <th>Status</th>
                        <th>
                            Tanggal &
                            Waktu
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map(
                        (tx) => (
                            <tr
                                key={tx.id}
                            >
                                <td
                                    style={{
                                        fontWeight:
                                            '600',
                                    }}
                                >
                                    {
                                        tx.invoice
                                    }
                                </td>

                                <td>
                                    {tx.nama_pelanggan ??
                                        '-'}
                                </td>

                                <td>
                                    {tx.nomor_hp ??
                                        '-'}
                                </td>

                                <td>
                                    {formatRupiah(
                                        tx.total_price
                                    )}
                                </td>

                                <PaymentCell
                                    orderId={
                                        tx.id
                                    }
                                    currentStatus={
                                        tx.status_pembayaran
                                    }
                                    onPaymentChange={
                                        onPaymentChange
                                    }
                                />

                                <StatusCell
                                    orderId={
                                        tx.id
                                    }
                                    currentStatus={
                                        tx.status_laundry
                                    }
                                    onStatusChange={
                                        onStatusChange
                                    }
                                />

                                <td>
                                    {formatDate(
                                        tx.created_at
                                    )}
                                </td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTable;

export type {
    Order,
    LaundryStatus,
    PaymentStatus,
    TransactionTableProps,
};