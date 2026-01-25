import { getTaskByIdForAdmin } from "@/src/services/task/task.admin";
import { useQuery } from "@tanstack/react-query";

export const useTaskDetailsForAdmin = (taskId: string) => {
  return useQuery({
    queryKey: ["task-details", taskId],
    queryFn: () => getTaskByIdForAdmin(taskId),
    enabled: !!taskId,
    staleTime: 0,
  });
};
