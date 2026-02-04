import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postSetClientReview } from "@/src/services/task/task.client";

export const useSetClientReview = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: postSetClientReview,
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["task", variables.id] });
      qc.invalidateQueries({ queryKey: ["client-timeline"] });
    },
  });
};
