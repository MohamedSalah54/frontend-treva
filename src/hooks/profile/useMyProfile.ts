import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/src/services/profile";
import { useAuthStore } from "@/src/store/auth.store";
import toast from "react-hot-toast";
import { User } from "@/src/types/user";

export const useMyProfile = (options?: { enabled?: boolean }) => {
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery<User, Error>({
    queryKey: ["myProfile"],
    enabled: options?.enabled,
    queryFn: async () => {
      const data = await getMyProfile();
      setUser(data);
      return data;
    },
  });
};

