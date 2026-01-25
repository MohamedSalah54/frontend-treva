import { api } from "@/src/lib/axios";

export interface UploadedImage {
  public_id: string;
  secure_url: string;
  folderId?: string;
}

export const uploadTaskImage = async (file: File): Promise<UploadedImage> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await api.post("/upload/tasks", formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (err: any) {
    throw err;
  }
};
