  import { useQuery } from "@tanstack/react-query";
  import { getPublicProfile } from "@/src/services/profile";
  import { User } from "@/src/types/user";

  export const usePublicProfile = (
    id: string | undefined,
    options?: { enabled?: boolean }
  ) => {
    return useQuery<User, Error>({
      queryKey: ["publicProfile", id],
      enabled: Boolean(id) && options?.enabled,
      queryFn: () => getPublicProfile(id!),
    });
  };
