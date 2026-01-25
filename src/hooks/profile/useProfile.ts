import { fetchUserProfile } from '@/src/services/profile';
import { UserProfile } from '@/src/types/user';
import { useQuery } from '@tanstack/react-query';


export const useProfile = (userId: string) => {
  return useQuery<UserProfile, Error>({
  queryKey: ['profile', userId],
  queryFn: () => fetchUserProfile(userId),
  enabled: !!userId,
  staleTime: 1000 * 60,
});

};