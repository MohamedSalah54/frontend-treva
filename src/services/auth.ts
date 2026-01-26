import { api } from "@/src/lib/axios";
import { Role } from "../types/task";

export interface LoginPayload {
  phoneNumber: string;
  password: string;
}


export const loginRequest = async (data: LoginPayload) => {
  const res = await api.post("/auth/login", data, { withCredentials: true });

  const user = res.data.data;

  return res.data;
};

export const logoutRequest = async () => {
  const res = await api.post("/auth/logout", {}, { withCredentials: true });

  return res.data;
};

export const getMeRequest = async () => {
  const res = await api.get("/auth/me");
  return res.data.data;
};

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  phoneNumber:string;
  password: string;
  role: Role;
}

export const registerRequest = async (data: RegisterPayload) => {
  try {
    const res = await api.post("/auth/create-user", data);
    return res.data;
  } catch (err: any) {
    const message = err.response?.data?.message || "فشل في انشاء حساب جديد";
    throw new Error(message);
  }
};
