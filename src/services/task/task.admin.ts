import { api } from "@/src/lib/axios";
import { AdminDecision, Task, TaskStatus } from "@/src/types/task";

export const getAdminTimeline = async (): Promise<Task[]> => {
  const res = await api.get("/task/admin/admin/timeLine");
  const tasks = res.data.data;
  return Array.isArray(tasks) ? tasks : [];
};

export const getTaskByIdForAdmin = async (taskId: string): Promise<Task> => {
  const res = await api.get(`/task/admin/${taskId}`);
  return res.data.data;
};

export interface AdminReviewDto {
  decision: AdminDecision;
  comment?: string;
  images?: string[];
}

export const adminReviewTaskApi = async (
  taskId: string,
  data: AdminReviewDto,
) => {
  const res = await api.patch(`/task/admin/${taskId}/review`, data);

  return res.data;
};

export interface UpdateTaskPayload {
  status?: TaskStatus;
  isPaid?: boolean;
}

export const adminUpdateTask = async (
  taskId: string,
  payload: UpdateTaskPayload,
) => {
  const { data } = await api.patch(`/task/admin/${taskId}`, payload);
  return data.data;
};

export const getAdminStatistics = async () => {
  const { data } = await api.get("/task/admin/statistics");
  return data.data;
};

// export interface AddCommentDto {
//   comment: string;
//   images?: string[];
// }

export interface AddCommentDto {
  comment: string;
  images?: {
    secure_url: string;
    public_id?: string;
    folderId?: string;
  }[];
}

export const addCommentRequest = async (
  taskId: string,
  data: AddCommentDto
) => {
  const payload = { comment: data.comment, images: data.images || [] };
  const response = await api.post(`/task/admin/${taskId}/comments`, payload);
  return response.data.data; 
};
export const deleteAdminCommentRequest = async (
  taskId: string,
  commentId: string,
) => {
  const response = await api.delete(
    `/task/admin/${taskId}/comments/${commentId}`,
  );
  return response.data;
};
