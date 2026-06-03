// src/service/userService.ts

import axiosInstance from "../libs/axios"; // sesuaikan path
import type { User, CreateUserPayload, UpdateUserPayload } from "../types/User";

/*
|--------------------------------------------------------------------------
| GET ALL
|--------------------------------------------------------------------------
*/
export const getUsers = async (): Promise<User[]> => {
  const res = await axiosInstance.get("/admin/users");
  return res.data?.data ?? res.data;
};

/*
|--------------------------------------------------------------------------
| GET ONE
|--------------------------------------------------------------------------
*/
export const getUserById = async (id: number): Promise<User> => {
  const res = await axiosInstance.get(`/admin/users/${id}`);
  return res.data?.data ?? res.data;
};

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/
export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  const res = await axiosInstance.post("/admin/users", payload);
  return res.data?.data ?? res.data;
};

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/
export const updateUser = async (
  id: number,
  payload: UpdateUserPayload
): Promise<User> => {
  const res = await axiosInstance.put(`/admin/users/${id}`, payload);
  return res.data?.data ?? res.data;
};

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/
export const deleteUser = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/admin/users/${id}`);
};