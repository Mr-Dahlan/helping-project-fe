import axiosInstance from "../libs/axios";
import type { AuthResponse } from "../types/auth";

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axiosInstance.post("/login", { email, password });
  console.log("LOGIN RESPONSE:", response.data); // 👈 tambah ini
  return response.data;
};

export const register = async (name: string, email: string, phone: string, password: string, role: string) => {
  const { data } = await axiosInstance.post("/register", { name, email, phone, password, role });
  return data;
};

export const logout = async () => {
    const response = await axiosInstance.post("/logout");
    return response.data;
};

export const getMe = async () => {
    const response = await axiosInstance.get("/me");
    return response.data;
};