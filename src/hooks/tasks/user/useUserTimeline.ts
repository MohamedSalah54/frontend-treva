import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/src/store/auth.store";
import { getUserTimeline } from "@/src/services/task/task.user";

// export const useUserTimeline = () => {
//   const user = useAuthStore((state) => state.user);
//   return useQuery({
//     queryKey: ["user-timeline", user?._id],
//     queryFn: async () => {
//       const tasks = await getUserTimeline();
//       return tasks;
//     },
//     enabled: !!user,
//     staleTime: 0,
//     refetchOnMount: true,
//   });
// };

export const useUserTimeline = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ["user-timeline", user?._id],
    queryFn: getUserTimeline,
    enabled: !!user && user.role === "user", 
    staleTime: 0,
    refetchOnMount: true,
  });
};
