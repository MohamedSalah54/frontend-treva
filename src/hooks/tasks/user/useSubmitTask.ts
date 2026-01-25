import { submitTaskApi, SubmitTaskDto } from "@/src/services/task/task.user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UseSubmitTaskParams {
  taskId: string;
}

export const useSubmitTask = ({ taskId }: UseSubmitTaskParams) => {
  const queryClient = useQueryClient();

return useMutation({
  mutationFn: async (data: SubmitTaskDto) => {
    return submitTaskApi(taskId, data);
  },

  onSuccess: (res) => {

    queryClient.invalidateQueries({
      queryKey: ["task", taskId],
    });
  },

  onError: (error) => {
    console.error("🔴 submitTask onError:", error);
  },
});
};
