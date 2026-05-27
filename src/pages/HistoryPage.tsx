import  { useState } from 'react';

import { useOrder } from '../hooks/useOrder';

import TransactionTable, {
    type LaundryStatus,
    type PaymentStatus,
} from '../components/HistoryTxTable';

const HistoryPage = () => {
    const [searchQuery, setSearchQuery] =
        useState('');

    // ✅ tambahkan updateStatusPembayaran
    const {
        orders,
        loading,
        updateStatus,
        updateStatusPembayaran,
    } = useOrder();

    const filteredOrders = orders.filter(
        (tx) => {
            const q =
                searchQuery.toLowerCase();

            return (
                tx.invoice
                    .toLowerCase()
                    .includes(q) ||
                (
                    tx.nama_pelanggan ?? ''
                )
                    .toLowerCase()
                    .includes(q)
            );
        }
    );

    // ✅ update status laundry
    const handleStatusChange =
        async (
            id: number,
            newStatus: LaundryStatus
        ) => {
            await updateStatus(
                id,
                newStatus
            );
        };

    // ✅ update pembayaran
    const handlePaymentChange =
        async (
            id: number,
            newStatus: PaymentStatus
        ) => {
            await updateStatusPembayaran(
                id,
                newStatus
            );
        };

    return (
        <div>
            <div className="dashboard-header">
                <div className="header-title">
                    <h1>
                        Riwayat transaksi
                    </h1>

                    <p>
                        Daftar seluruh
                        transaksi yang
                        telah tercatat di
                        outlet.
                    </p>
                </div>
            </div>

            <div className="history-controls">
                <div className="search-bar-container">
                    <span
                        style={{
                            marginRight:
                                '8px',
                            color:
                                '#9ca3af',
                        }}
                    >
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Cari nama pelanggan atau invoice..."
                        value={
                            searchQuery
                        }
                        onChange={(e) =>
                            setSearchQuery(
                                e.target
                                    .value
                            )
                        }
                        className="search-input"
                    />
                </div>
            </div>

            <div className="table-card">
                <div className="table-header">
                    <span className="table-title">
                        Daftar
                        Transaksi
                    </span>

                    <span
                        style={{
                            fontSize:
                                '13px',
                            color:
                                '#6b7280',
                        }}
                    >
                        Menampilkan{' '}
                        {
                            filteredOrders.length
                        }{' '}
                        transaksi
                    </span>
                </div>

                <TransactionTable
                    orders={
                        filteredOrders
                    }
                    loading={loading}
                    searchQuery={
                        searchQuery
                    }
                    onStatusChange={
                        handleStatusChange
                    }

                    // ✅ INI YANG KURANG
                    onPaymentChange={
                        handlePaymentChange
                    }
                />
            </div>
        </div>
    );
};

export default HistoryPage;