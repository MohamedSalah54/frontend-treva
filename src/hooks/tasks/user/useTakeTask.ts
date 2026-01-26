import { takeTask } from "@/src/services/task/task.user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// export const useTakeTask = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: takeTask,
//     onSuccess: (data) => {

//       queryClient.invalidateQueries({ queryKey: ["tasks"] });
//     },
//     onError: (err: any) => {},
//   });
// };

export const useTakeTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: takeTask,
    onSuccess: (_data, taskId) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      // 👇 ده المهم
      queryClient.invalidateQueries({
        queryKey: ["task-details", taskId],
      });
    },
  });
};
