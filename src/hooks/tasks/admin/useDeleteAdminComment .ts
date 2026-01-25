import { deleteAdminCommentRequest } from "@/src/services/task/task.admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteAdminComment = (taskId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => {
      if (!taskId) return Promise.reject("taskId is undefined");
      return deleteAdminCommentRequest(taskId, commentId);
    },
    onSuccess: () => {
      if (taskId) queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });
};

