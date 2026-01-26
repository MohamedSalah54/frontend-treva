import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/src/store/auth.store";
import { getAdminTimeline } from "@/src/services/task/task.admin";

export const useAdminTimeline = () => {
  const user = useAuthStore((state) => state.user);
  return useQuery({
    queryKey: ["admin-timeline", user?.id],
    queryFn: async () => {
      const tasks = await getAdminTimeline();
      return tasks;
    },
    enabled: !!user,
    staleTime: 0,
    refetchOnMount: true,
  });
};
