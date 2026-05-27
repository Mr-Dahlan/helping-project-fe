export interface Service {
  id: number;
  nama_layanan: string;
  harga: number;
  satuan: string; // kg / pcs / item
  kategori?: string; // reguler / express
  deskripsi?: string;
  created_at?: string;
  updated_at?: string;
}

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/
export interface CreateServicePayload {
  nama_layanan: string;
  harga: number;
  satuan: string;
  kategori?: string;
  deskripsi?: string;
}

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/
export interface UpdateServicePayload {
  nama_layanan?: string;
  harga?: number;
  satuan?: string;
  kategori?: string;
  deskripsi?: string;
}