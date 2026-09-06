import React from 'react';
import { ReimbursementRequest, Category, Budget } from '@/types';
import { formatCurrency, formatDate, getRelativeTime } from '@/utils/formatting';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface RequestCardProps {
  request: ReimbursementRequest;
  category?: Category;
  onApprove?: () => void;
  onReject?: () => void;
  isProvider?: boolean;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  category,
  onApprove,
  onReject,
  isProvider = false,
}) => {
  const statusConfig = {
    pending: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-800 dark:text-yellow-200',
      icon: Clock,
      label: 'Pending',
    },
    approved: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-200',
      icon: CheckCircle,
      label: 'Approved',
    },
    rejected: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-200',
      icon: XCircle,
      label: 'Rejected',
    },
  };

  const config = statusConfig[request.status];
  const StatusIcon = config.icon;

  return (
    <div className={`${config.bg} border-2 ${config.border} rounded-lg p-6`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <StatusIcon className={`w-5 h-5 ${config.text}`} />
            <span className={`text-sm font-semibold ${config.text}`}>
              {config.label}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {category?.name || 'Uncategorized'}
          </h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatCurrency(request.amount)}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {formatDate(request.created_at)}
          </p>
        </div>
      </div>

      {request.description && (
        <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {request.description}
          </p>
        </div>
      )}

      {request.photo_url && (
        <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
          <img
            src={request.photo_url}
            alt="Receipt"
            className="w-full h-auto max-h-64 rounded-lg object-cover"
          />
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-4">
        <span>{getRelativeTime(request.created_at)}</span>
        {request.notes && (
          <span className="text-slate-700 dark:text-slate-300 font-medium">
            Note: {request.notes}
          </span>
        )}
      </div>

      {isProvider && request.status === 'pending' && (
        <div className="flex gap-3">
          <button
            onClick={onApprove}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Approve
          </button>
          <button
            onClick={onReject}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
};

export default RequestCard;
