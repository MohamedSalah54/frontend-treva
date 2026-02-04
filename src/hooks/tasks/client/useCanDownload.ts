import { useMutation } from "@tanstack/react-query";
import { postCanDownload } from "@/src/services/task/task.client";

export const useCanDownload = () => {
  return useMutation({
    mutationFn: postCanDownload,
  });
};
