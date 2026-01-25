import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "@/src/services/auth";
import { useAuthStore } from "@/src/store/auth.store";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
export const useLogin = () => {
  const router = useRouter()

  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: loginRequest,

    onSuccess: (data) => {
      setUser(data.data); 
      toast.success("تم تسجيل الدخول بنجاح")
      router.push("/")
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || error?.message || "فشل في تسجيل الدخول ❌"
      );
    },
  });
};

