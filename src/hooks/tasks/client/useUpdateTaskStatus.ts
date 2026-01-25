import { updateTaskStatus } from "@/src/services/task/task.client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateTaskStatus = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateTaskStatus,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["client-timeline"] });
      qc.invalidateQueries({ queryKey: ["task"] });
    },
  });
};
