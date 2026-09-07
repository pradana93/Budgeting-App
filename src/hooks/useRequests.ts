import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestService } from '@/services/api';
import { useAppStore } from '@/store/appStore';

export const useBudgetRequests = (budgetId: string | undefined) => {
  const { requests, setRequests } = useAppStore();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['requests', budgetId],
    queryFn: async () => {
      if (!budgetId) return [];
      return requestService.getRequests(budgetId);
    },
    enabled: !!budgetId,
    staleTime: 10000,
  });

  React.useEffect(() => {
    if (data) {
      setRequests(data);
    }
  }, [data, setRequests]);

  return {
    requests: requests.length > 0 ? requests : data || [],
    isLoading,
    isError,
    error,
  };
};

export const usePendingRequests = (budgetId: string | undefined) => {
  const { isLoading, data, error } = useQuery({
    queryKey: ['pendingRequests', budgetId],
    queryFn: async () => {
      if (!budgetId) return [];
      return requestService.getPendingRequests(budgetId);
    },
    enabled: !!budgetId,
    staleTime: 5000,
  });

  return {
    pendingRequests: data || [],
    isLoading,
    error,
  };
};

export const useReceiverRequests = (receiverId: string | undefined) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['receiverRequests', receiverId],
    queryFn: async () => {
      if (!receiverId) return [];
      return requestService.getReceiverRequests(receiverId);
    },
    enabled: !!receiverId,
    staleTime: 10000,
  });

  return {
    requests: data || [],
    isLoading,
    error,
  };
};

export const useCreateRequest = () => {
  const queryClient = useQueryClient();
  const { addRequest } = useAppStore();

  return useMutation({
    mutationFn: ({ receiverId, budgetId, categoryId, amount, description, photoUrl }: { receiverId: string; budgetId: string; categoryId: string; amount: number; description: string; photoUrl?: string }) =>
      requestService.createRequest(receiverId, budgetId, categoryId, amount, description, photoUrl),
    onSuccess: (request) => {
      addRequest(request);
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['receiverRequests'] });
    },
  });
};

export const useApproveRequest = () => {
  const queryClient = useQueryClient();
  const { updateRequest } = useAppStore();

  return useMutation({
    mutationFn: requestService.approveRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
      queryClient.invalidateQueries({ queryKey: ['budget'] });
    },
  });
};

export const useRejectRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestService.rejectRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
    },
  });
};
