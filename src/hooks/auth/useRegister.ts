import { useMutation } from "@tanstack/react-query";
import { registerRequest, RegisterPayload } from "@/src/services/auth";
import { useAuthStore } from "@/src/store/auth.store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useRegister = () => {
  // const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: RegisterPayload) => registerRequest(data),

    onSuccess: (res: any) => {
      toast.success(res.message || "تم إنشاء حساب جديد 🎉");
      setTimeout(() => router.push("/"), 500);
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "فشل في إنشاء حساب جديد  ❌",
      );
    },
  });

  return mutation;
};
