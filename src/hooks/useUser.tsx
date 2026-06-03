// src/hooks/useUsers.ts
import { useEffect, useState } from "react";
import type { User, CreateUserPayload, UpdateUserPayload } from "../types/User";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../service/userService";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /*
  |--------------------------------------------------------------------------
  | FETCH ALL
  |--------------------------------------------------------------------------
  */
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err: any) {
      setError("Gagal mengambil data user");
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | CREATE
  |--------------------------------------------------------------------------
  */
  const addUser = async (payload: CreateUserPayload) => {
    try {
      const newUser = await createUser(payload);
      setUsers((prev) => [newUser, ...prev]);
    } catch (err: any) {
      setError("Gagal menambah user");
      throw err; // re-throw agar bisa di-catch di komponen
    }
  };

  /*
  |--------------------------------------------------------------------------
  | UPDATE
  |--------------------------------------------------------------------------
  */
  const editUser = async (id: number, payload: UpdateUserPayload) => {
    try {
      const updated = await updateUser(id, payload);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    } catch (err: any) {
      setError("Gagal mengupdate user");
      throw err;
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */
  const removeUser = async (id: number) => {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      setError("Gagal menghapus user");
      throw err;
    }
  };

  /*
  |--------------------------------------------------------------------------
  | HELPERS
  |--------------------------------------------------------------------------
  */
  const getUsersByRole = (role: User["role"]) =>
    users.filter((u) => u.role === role);

  const totalByRole = {
    admin: users.filter((u) => u.role === "admin").length,
    cashier: users.filter((u) => u.role === "cashier").length,
    owner: users.filter((u) => u.role === "owner").length,
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    addUser,
    editUser,
    removeUser,
    getUsersByRole,
    totalByRole,
  };
};