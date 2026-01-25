import { api } from "@/src/lib/axios";
import { UserProfile } from "../types/user";

export const getMyProfile = async () => {
  const res = await api.get("/profile/me", { withCredentials: true });
  return res.data.data;
};

export const getPublicProfile = async (id: string) => {
  if (!id) {
    throw new Error("Public profile id is required");
  }

  const res = await api.get(`/profile/${id}`);
  return res.data.data;
};

export const updateMyProfile = async (data: any) => {
  const res = await api.patch("/profile/me", data, { withCredentials: true });

  return res.data.data;
};

export const uploadProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await api.post("/upload/profile", formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data; // { public_id, secure_url }
  } catch (err: any) {
    throw err;
  }
};

export const fetchUserProfile = async (
  userId: string,
): Promise<UserProfile> => {
  const response = await api.get(`/profile/${userId}/full-profile`);
  return response.data.data;
};
