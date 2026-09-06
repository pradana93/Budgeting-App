import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { profileService } from '@/services/api';
import { User } from '@/types';

export const useUserProfile = () => {
  const { user } = useAuth();

  const { data: profile, isLoading, error } = useQuery<User | null>({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      try {
        return await profileService.getProfile(user.id);
      } catch (err) {
        return null;
      }
    },
    enabled: !!user?.id,
    staleTime: 60000,
  });

  return { profile, isLoading, error };
};

export const usePartnerProfile = (partnerId: string | undefined) => {
  const { data: partner, isLoading, error } = useQuery<User | null>({
    queryKey: ['partner', partnerId],
    queryFn: async () => {
      if (!partnerId) return null;
      try {
        return await profileService.getPartner(partnerId);
      } catch (err) {
        return null;
      }
    },
    enabled: !!partnerId,
    staleTime: 60000,
  });

  return { partner, isLoading, error };
};
