import axiosInstance from "../libs/axios";
import type {
  Customer,
  CreateCustomerPayload,
  UpdateCustomerPayload,
} from "../types/Customer";

/*
|--------------------------------------------------------------------------
| GET ALL
|--------------------------------------------------------------------------
*/
export const getCustomers = async (): Promise<Customer[]> => {
  const res = await axiosInstance.get(`/customers`);
  return res.data.data;
};

/*
|--------------------------------------------------------------------------
| GET BY ID
|--------------------------------------------------------------------------
*/
export const getCustomerById = async (
  id: number
): Promise<Customer> => {
  const res = await axiosInstance.get(`/customers/${id}`);
  return res.data.data;
};

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/
export const createCustomer = async (
  payload: CreateCustomerPayload
): Promise<Customer> => {
  const res = await axiosInstance.post(
    `/customers`,
    payload
  );
  return res.data.data;
};

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/
export const updateCustomer = async (
  id: number,
  payload: UpdateCustomerPayload
): Promise<Customer> => {
  const res = await axiosInstance.put(
    `/customers/${id}`,
    payload
  );
  return res.data.data;
};

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/
export const deleteCustomer = async (
  id: number
): Promise<void> => {
  await axiosInstance.delete(`/customers/${id}`);
};