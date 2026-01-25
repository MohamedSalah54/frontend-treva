import { getClientTaskById } from "@/src/services/task/task.client";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Task } from "@/src/types/task";
export const useClientTaskDetails = (id: string) => {
  return useQuery<Task>({
    queryKey: ["task", id],
    queryFn: () => getClientTaskById(id),
    enabled: !!id, 
  });
};

