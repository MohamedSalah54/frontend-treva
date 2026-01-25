import { getClientTimeline } from "@/src/services/task/task.client";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/src/store/auth.store";

// export const useClientTimeline = () => {
//   const user = useAuthStore((state) => state.user);
//   return useQuery({
//     queryKey: ["client-timeline", user?._id],
//     queryFn: async () => {
//       const tasks = await getClientTimeline();
//       return tasks;
//     },
//     enabled: !!user,
//     staleTime: 0,
//     refetchOnMount: true,
//     onError: (err) => {
//     },
//     onSuccess: (data) => {
//     },
//   });
// };

export const useClientTimeline = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ["client-timeline", user?.sub],
    queryFn: getClientTimeline,
    enabled: !!user && user.role === "client",
    staleTime: 0,
    refetchOnMount: true,
  });
};
