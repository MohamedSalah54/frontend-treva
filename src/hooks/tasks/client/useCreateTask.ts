import { createTask } from "@/src/services/task/task.client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateTask = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["client-timeline"] });
      toast.success("created successfully")
    },
  });
};
