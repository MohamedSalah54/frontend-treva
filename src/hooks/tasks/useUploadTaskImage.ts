import {
  UploadedImage,
  uploadTaskImage,
} from "@/src/services/task/task-upload";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useUploadTaskImage = () => {
  return useMutation<UploadedImage, any, File>({
    mutationFn: uploadTaskImage,
    onSuccess: () => {
      toast.success("تم رفع الصورة");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "فشل في رفع الصورة");
    },
  });
};
