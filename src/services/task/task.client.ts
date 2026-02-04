import { api } from "@/src/lib/axios";
import { Task } from "@/src/types/task";

interface CreateTaskPayload {
  title: string;
  description: string;
  deadline: string;
  requestImages?: {
    secure_url: string;
    public_id?: string;
    folderId?: string;
  }[];
}
export type ClientReview = "yes" | "no";

export const getClientTimeline = async (): Promise<Task[]> => {
  const res = await api.get("/task/client/timeline/client");
  const tasks = res.data.data;
  return Array.isArray(tasks) ? tasks : [];
};

export const getClientTaskById = async (id: string) => {
  try {
    const res = await api.get(`/task/client/client/${id}`);
    return res.data.data;
  } catch (err: any) {
    throw err;
  }
};

export const updateTaskStatus = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}) => {
  const res = await api.patch(`/task/client/state/${id}`, { status });
  return res.data.data;
};

export const addTaskComment = async ({
  taskId,
  comment,
  images,
}: {
  taskId: string;
  comment?: string;
  images?: { secure_url: string; public_id?: string; folderId?: string }[];
}) => {
  const res = await api.post(`/task/client/${taskId}/comments`, {
    comment: comment || "",
    images: images || [],
  });
  return res.data.data;
};

export const createTask = async (payload: CreateTaskPayload) => {
  const res = await api.post("/task/client", payload);
  return res.data.data;
};

export const postSetClientReview = async (params: {
  id: string;
  clientReview: ClientReview;
}) => {
  const { data } = await api.post(`/task/client/${params.id}/review`, {
    clientReview: params.clientReview,
  });
  return data;
};

export const postCanDownload = async (id: string) => {
  const { data } = await api.post(`/task/client/${id}/can-download`);
  return data as { ok: true; images: any[] };
};
