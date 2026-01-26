import { api } from "@/src/lib/axios";
import { Task } from "@/src/types/task";

export const getUserTimeline = async (): Promise<Task[]> => {
  const res = await api.get("/task/user/timeline/user");
  const tasks = res.data.data;
  return Array.isArray(tasks) ? tasks : [];
};

export const getTaskById = async (taskId: string): Promise<Task> => {
  const res = await api.get(`/task/user/${taskId}`);
  return res.data.data;
};

export const takeTask = async (taskId: string) => {
  const response = await api.patch(`/task/user/${taskId}/take`);
  return response.data;
};

export interface SubmitTaskDto {
  images: {
    secure_url: string;
    public_id: string;
    folderId?: string;
  }[];
}


export const submitTaskApi = async (taskId: string, data: SubmitTaskDto) => {
  const res = await api.patch(`/task/user/${taskId}/submit`, data);

  return res.data;
};
