import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUpdateTask, UpdateTaskPayload } from "@/src/services/task/task.admin";

export const useAdminUpdateTask = (taskId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTaskPayload) => adminUpdateTask(taskId, payload),
    onSuccess: (updatedTask) => {
      // ✅ حدث الـ cache فورًا
      queryClient.setQueryData(["task", taskId], updatedTask);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
