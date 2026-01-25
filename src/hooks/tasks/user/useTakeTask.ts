import { takeTask } from "@/src/services/task/task.user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useTakeTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: takeTask,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tasks"]);
    },
    onError: (err: any) => {

    },
  });
};
