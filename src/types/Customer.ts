export interface Customer {
  id: number;
  nama: string;
  email?: string;
  phone?: string;
  alamat?: string;
  created_at?: string;
  updated_at?: string;
}

/*
|--------------------------------------------------------------------------
| Payload untuk CREATE
|--------------------------------------------------------------------------
*/
export interface CreateCustomerPayload {
  nama: string;
  email?: string;
  phone?: string;
  alamat?: string;
}

/*
|--------------------------------------------------------------------------
| Payload untuk UPDATE
|--------------------------------------------------------------------------
*/
export interface UpdateCustomerPayload {
  nama?: string;
  email?: string;
  phone?: string;
  alamat?: string;
}