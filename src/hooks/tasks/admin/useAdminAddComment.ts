import {
  AddCommentDto,
  addCommentRequest,
} from "@/src/services/task/task.admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAddComment = (taskId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddCommentDto) => addCommentRequest(taskId, data),
    onSuccess: (newComment) => {
      queryClient.setQueryData(["taskComments", taskId], (oldData: any) => {
        if (!oldData) return [newComment];
        return [...oldData, newComment];
      });
    },
    onError: (error: any) => {
      console.error("Error adding comment:", error.response || error);
    },
  });
};
