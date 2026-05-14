import React, { useState } from 'react';
import { postTransaction } from '../../services/transactionService';

const TransactionPage = () => {
    const [customer, setCustomer] = useState({ nama: '', nomor: '', alamat: '' });
    const [cart, setCart] = useState([]); // Berisi layanan yang dipilih

    const handleBayar = async () => {
        try {
            const data = { ...customer, total: 93500 }; // Contoh total dari desain hal 5
            const res = await postTransaction(data);
            if(res.status === 'success') {
                // Navigasi ke hal 5 (Pembayaran Sukses)
                window.location.href = '/success'; 
            }
        } catch (err) {
            console.error("Gagal bayar", err);
        }
    };

    return (
        <div className="flex">
            {/* Bagian Kiri: Pilih Layanan (Hal 3) */}
            <div className="w-2/3 p-4">
                <h2 className="text-xl font-bold">Pilih Layanan</h2>
                {/* Mapping ServiceCard di sini */}
            </div>

            {/* Bagian Kanan: Info Pelanggan & Keranjang */}
            <div className="w-1/3 p-4 bg-gray-100">
                <input type="text" placeholder="Nama" onChange={(e) => setCustomer({...customer, nama: e.target.value})} />
                {/* Input lainnya... */}
                <button onClick={handleBayar} className="bg-green-500 text-white w-full p-2 rounded">
                    Selesaikan Pembayaran
                </button>
            </div>
        </div>
    );
};