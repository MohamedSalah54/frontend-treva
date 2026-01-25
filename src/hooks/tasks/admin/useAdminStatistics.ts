import { getAdminStatistics } from "@/src/services/task/task.admin";
import { useQuery } from "@tanstack/react-query";

export const useAdminStatistics = () => {
  return useQuery({
    queryKey: ["admin-statistics"],
    queryFn: getAdminStatistics,
  });
};
