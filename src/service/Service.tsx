import axiosInstance from "../libs/axios";
import type {
  Service,
  CreateServicePayload,
  UpdateServicePayload,
} from "../types/Service";

/*
|--------------------------------------------------------------------------
| GET ALL
|--------------------------------------------------------------------------
*/
export const getServices = async (): Promise<Service[]> => {
  const res = await axiosInstance.get("/services");
  return res.data.data;
};

/*
|--------------------------------------------------------------------------
| GET BY ID
|--------------------------------------------------------------------------
*/
export const getServiceById = async (
  id: number
): Promise<Service> => {
  const res = await axiosInstance.get(`/services/${id}`);
  return res.data.data;
};

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/
export const createService = async (
  payload: CreateServicePayload
): Promise<Service> => {
  const res = await axiosInstance.post("/services", payload);
  return res.data.data;
};

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/
export const updateService = async (
  id: number,
  payload: UpdateServicePayload
): Promise<Service> => {
  const res = await axiosInstance.put(
    `/services/${id}`,
    payload
  );
  return res.data.data;
};

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/
export const deleteService = async (
  id: number
): Promise<void> => {
  await axiosInstance.delete(`/services/${id}`);
};