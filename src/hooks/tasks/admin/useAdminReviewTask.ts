import {
  AdminReviewDto,
  adminReviewTaskApi,
} from "@/src/services/task/task.admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseAdminReviewTaskParams {
  taskId: string;
}

export const useAdminReviewTask = ({ taskId }: UseAdminReviewTaskParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdminReviewDto) => adminReviewTaskApi(taskId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["task", taskId],
      });

      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
};
