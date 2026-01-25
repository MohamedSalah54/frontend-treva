import { api } from "@/src/lib/axios";

export const filterMyTasksApi = async (role: "admin" | "client", statuses?: string[]) => {
  const params: any = {};
  if (statuses && statuses.length > 0) {
    params.status = statuses.join(",");
  }

  const url = role === "admin" ? "/task/admin/my-tasks" : "/task/client/my-tasks";

  const { data } = await api.get(url, { params });
  return data;
};
