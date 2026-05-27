import axios from "../libs/axios";
import type { CreateOrderPayload, Order } from "../types/Order";

export const orderService = {
  // 📌 create order
  create: async (payload: CreateOrderPayload) => {
    const res = await axios.post("/orders", payload);
    return res.data;
  },

  // 📌 get all orders
  getAll: async (): Promise<Order[]> => {
    const res = await axios.get("/orders");
    return res.data.data;
  },

  // 📌 get detail order
  getById: async (id: number): Promise<Order> => {
    const res = await axios.get(`/orders/${id}`);
    return res.data.data;
  },

  // 📌 update status laundry
  updateStatus: async (id: number, status: string) => {
    const res = await axios.patch(`/orders/${id}/status`, {
      status_laundry: status,
    });
    return res.data;
  },

  // 📌 update status payment
  updateStatusPembayaran: async (id: number, status: "paid" | "pending") => {
    const res = await axios.patch(`/orders/${id}/payment`, {
      status_pembayaran: status,
    });
    return res.data;
  },

  // 📌 delete order
  delete: async (id: number) => {
    const res = await axios.delete(`/orders/${id}`);
    return res.data;
  },
};