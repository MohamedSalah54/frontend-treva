import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyProfile } from "@/src/services/profile";
import toast from "react-hot-toast";
import { User } from "@/src/types/user";
import { useAuthStore } from "@/src/store/auth.store";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<User, any, Partial<User>>({
    mutationFn: updateMyProfile,
    onSuccess: (data: User) => {
      if (data) {
        queryClient.setQueryData(["myProfile"], data);
        // useAuthStore.getState().setUser(data);
        useAuthStore.getState().patchUser(data);
      }
      toast.success("تم تحديث الملف الشخصي بنجاح");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "فشل في التحديث");
    },
  });
};
