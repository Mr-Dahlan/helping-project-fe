export interface OrderItem {
  layanan_id: number;
  jumlah: number; // kg atau qty
  harga: number;
  subtotal: number;
}

export interface CreateOrderPayload {
  pelanggan_id?: number | null;

  nama_pelanggan?: string;
  nomor_hp?: string;
  alamat?: string;

  tanggal_order: string;   // YYYY-MM-DD
  tanggal_terima: string;  // YYYY-MM-DD

  details: OrderItem[];
}

export interface Order {
  id: number;
  invoice: string;

  user_id: number;
  pelanggan_id?: number | null;

  total_price: number;
  total_item: number;

  nama_pelanggan?: string;
  nomor_hp?: string;
  alamat?: string;

  status_pembayaran: "pending" | "paid";
  status_laundry: "received" | "process" | "ready" | "taken";

  tanggal_order: string;
  tanggal_terima: string;

  created_at: string;
  updated_at: string;
}

// src/types/Order.ts
export interface Order {
  // ... field yang ada sekarang ...
  details?: OrderItem[];  // tambahkan ini
}