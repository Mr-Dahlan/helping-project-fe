export interface ReportQuery {
    type: "daily" | "monthly" | "yearly"; // required sesuai API spec
    date?: string;   // ISO date-time, dipakai saat type = 'daily'
    month?: number;  // 1-12, dipakai saat type = 'monthly'
    year?: number;   // dipakai saat type = 'monthly' | 'yearly'
}

export interface ReportSummary {
    total_order: number;
    total_pelanggan: number;
    total_pendapatan: number;
    total_transaksi_selesai: number;
    total_transaksi_proses: number;
}

export interface ReportTransaction {
    id: number;
    invoice: string;
    nama_pelanggan: string;
    total_price: number;
    status_laundry: string;
    tanggal_order: string;
}

export interface ReportResponse {
    summary: ReportSummary;
    transactions: ReportTransaction[];
}