import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTaskComment } from "@/src/services/task/task.client";

export const useAddTaskComment = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: addTaskComment,
    onSuccess: (updatedTask) => {
      qc.setQueryData(["task", updatedTask.id], updatedTask);
    },
  });
};
