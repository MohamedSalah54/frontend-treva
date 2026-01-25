import { filterMyTasksApi } from "@/src/services/task/task.filter";
import { useQuery } from "@tanstack/react-query";

export const useFilterMyTasks = (role: "admin" | "client", status: string) => {
  const statuses =
    status === "all"
      ? undefined
      : status === "receive"
      ? ["available"]
      : [status];

  return useQuery({
    queryKey: [role, "my-tasks", status],
    queryFn: () => filterMyTasksApi(role, statuses),
  });
};
