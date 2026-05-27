import { useEffect, useState } from "react";
import type { Customer, CreateCustomerPayload } from "../types/Customer";
import {
  getCustomers,
  createCustomer,
  deleteCustomer,
} from "../service/Customer";

export const useCustomer = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /*
  |--------------------------------------------------------------------------
  | FETCH ALL
  |--------------------------------------------------------------------------
  */
  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err: any) {
      setError("Gagal mengambil data customer");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | CREATE
  |--------------------------------------------------------------------------
  */
  const addCustomer = async (payload: CreateCustomerPayload) => {
    try {
      const newCustomer = await createCustomer(payload);
      setCustomers((prev) => [newCustomer, ...prev]);
    } catch (err) {
      setError("Gagal menambah customer");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */
  const removeCustomer = async (id: number) => {
    try {
      await deleteCustomer(id);
      setCustomers((prev) =>
        prev.filter((c) => c.id !== id)
      );
    } catch (err) {
      setError("Gagal menghapus customer");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    fetchCustomers,
    addCustomer,
    removeCustomer,
  };
};