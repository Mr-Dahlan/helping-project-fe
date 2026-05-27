import { useEffect, useState } from "react";
import type {
  Service,
  CreateServicePayload,
} from "../types/Service";

import {
  getServices,
  createService,
  deleteService,
} from "../service/Service";

export const useService = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /*
  |--------------------------------------------------------------------------
  | FETCH ALL
  |--------------------------------------------------------------------------
  */
  const fetchServices = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getServices();
      setServices(data);
    } catch (err) {
      setError("Gagal mengambil data layanan");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | CREATE
  |--------------------------------------------------------------------------
  */
  const addService = async (payload: CreateServicePayload) => {
    try {
      const newService = await createService(payload);
      setServices((prev) => [newService, ...prev]);
    } catch (err) {
      setError("Gagal menambah layanan");
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */
  const removeService = async (id: number) => {
    try {
      await deleteService(id);
      setServices((prev) =>
        prev.filter((s) => s.id !== id)
      );
    } catch (err) {
      setError("Gagal menghapus layanan");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    error,
    fetchServices,
    addService,
    removeService,
  };
};