export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "cashier" | "owner";
  created_at?: string;
  updated_at?: string;
}
 
export interface CreateUserPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: "admin" | "cashier" | "owner";
}
 
export interface UpdateUserPayload {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  role?: "admin" | "cashier" | "owner";
}
