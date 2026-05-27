import { useEffect, useState } from "react";
import { orderService } from "../service/Order";
import type { CreateOrderPayload, Order } from "../types/Order";

export const useOrder = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 📌 fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await orderService.getAll();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // 📌 create order
  const createOrder = async (payload: CreateOrderPayload) => {
    try {
      setLoading(true);

      const res = await orderService.create(payload);

      await fetchOrders(); // refresh list
      return res;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create order");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 📌 update status
  const updateStatus = async (id: number, status: string) => {
    try {
      await orderService.updateStatus(id, status);
      await fetchOrders();
    } catch (err: any) {
      setError("Failed to update status");
    }
  };

  
  // 📌 update status pembayaran
  const updateStatusPembayaran = async (
    id: number,
    status: "paid" | "pending",
  ) => {
    try {
      // ✅ update UI langsung
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id
            ? {
                ...order,
                status_pembayaran: status,
              }
            : order,
        ),
      );

      // ✅ sync ke backend
      await orderService.updateStatusPembayaran(id, status);

      // optional refetch
      await fetchOrders();
    } catch (err: any) {
      setError("Failed to update status pembayaran");
    }
  };

  // 📌 delete order
  const deleteOrder = async (id: number) => {
    try {
      await orderService.delete(id);
      await fetchOrders();
    } catch (err: any) {
      setError("Failed to delete order");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    updateStatus,
    updateStatusPembayaran,
    deleteOrder,
  };
};
