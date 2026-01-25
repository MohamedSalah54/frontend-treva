import { getTaskById } from "@/src/services/task/task.user";
import { useQuery } from "@tanstack/react-query";

export const useTaskDetails = (taskId: string) => {
  return useQuery({
    queryKey: ["task-details", taskId],
    queryFn: () => getTaskById(taskId),
    enabled: !!taskId,
    staleTime: 0,
  });
};
