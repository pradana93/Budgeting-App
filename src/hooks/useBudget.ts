import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetService } from '@/services/api';
import { useAppStore } from '@/store/appStore';

export const useBudget = (providerId: string | undefined) => {
  const { currentBudget, setCurrentBudget } = useAppStore();
  const queryClient = useQueryClient();

  const {
    data: budget,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['budget', providerId],
    queryFn: async () => {
      if (!providerId) return null;
      return budgetService.getCurrentBudget(providerId);
    },
    enabled: !!providerId,
    staleTime: 30000, // 30 seconds
  });

  React.useEffect(() => {
    if (budget) {
      setCurrentBudget(budget);
    }
  }, [budget, setCurrentBudget]);

  const refreshBudget = () => {
    queryClient.invalidateQueries({ queryKey: ['budget', providerId] });
  };

  return {
    budget: currentBudget || budget,
    isLoading,
    isError,
    error,
    refreshBudget,
  };
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ providerId, amount, frequency, categories }: { providerId: string; amount: number; frequency: 'weekly' | 'biweekly' | 'monthly'; categories: any[] }) =>
      budgetService.createBudget(providerId, amount, frequency, categories),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget'] });
    },
  });
};
