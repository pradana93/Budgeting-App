import React from 'react';
import { ReimbursementRequest, Category, Budget } from '@/types';
import RequestCard from '@/components/requests/RequestCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface RequestListProps {
  requests: ReimbursementRequest[];
  categories: Category[];
  isLoading?: boolean;
  onApprove?: (requestId: string, budgetId: string, amount: number) => Promise<void>;
  onReject?: (requestId: string) => Promise<void>;
  isProvider?: boolean;
  filter?: 'all' | 'pending' | 'approved' | 'rejected';
}

export const RequestList: React.FC<RequestListProps> = ({
  requests,
  categories,
  isLoading = false,
  onApprove,
  onReject,
  isProvider = false,
  filter = 'all',
}) => {
  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || 'Unknown';
  };

  const filteredRequests = requests.filter((req) => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  if (isLoading) {
    return (
      <div className="card flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (filteredRequests.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-4xl mb-4">📭</div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          {filter === 'pending'
            ? 'No pending requests'
            : filter === 'approved'
            ? 'No approved requests'
            : filter === 'rejected'
            ? 'No rejected requests'
            : 'No requests yet'}
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          {isProvider
            ? 'Requests from your partner will appear here'
            : 'Submit your first reimbursement request'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredRequests.map((request) => (
        <RequestCard
          key={request.id}
          request={request}
          category={categories.find((c) => c.id === request.category_id)}
          isProvider={isProvider}
          onApprove={
            isProvider && onApprove
              ? () => onApprove(request.id, request.budget_id, request.amount)
              : undefined
          }
          onReject={isProvider && onReject ? () => onReject(request.id) : undefined}
        />
      ))}
    </div>
  );
};

export default RequestList;
