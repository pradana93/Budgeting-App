import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useProfile';
import { useBudget } from '@/hooks/useBudget';
import { usePendingRequests, useApproveRequest, useRejectRequest } from '@/hooks/useRequests';
import { Header } from '@/components/common/Header';
import BudgetOverview from '@/components/dashboard/BudgetOverview';
import RequestList from '@/components/requests/RequestList';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export const ProviderDashboard: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { budget, isLoading: budgetLoading } = useBudget(user?.id);
  const { pendingRequests, isLoading: requestsLoading } = usePendingRequests(budget?.id);
  const approveRequestMutation = useApproveRequest();
  const rejectRequestMutation = useRejectRequest();
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'analytics'>(
    'overview'
  );

  const handleApprove = async (requestId: string, budgetId: string, amount: number) => {
    try {
      await approveRequestMutation.mutateAsync({ requestId, budgetId, amount });
      toast.success('Request approved!');
    } catch (error) {
      toast.error('Failed to approve request');
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await rejectRequestMutation.mutateAsync(requestId);
      toast.success('Request rejected');
    } catch (error) {
      toast.error('Failed to reject request');
    }
  };

  if (budgetLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Header title="Provider Dashboard" />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Header title="Provider Dashboard" />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="card text-center">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              No Active Budget
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Please set up your budget in the setup wizard to get started.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Header title={`Provider Dashboard - ${profile?.name || 'User'}`} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-300 dark:border-slate-700">
          {(['overview', 'requests', 'analytics'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab === 'overview'
                ? '💰 Overview'
                : tab === 'requests'
                ? '📋 Requests'
                : '📊 Analytics'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <BudgetOverview budget={budget} />

            {/* Pending Requests Summary */}
            <div className="card">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Pending Requests
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Total Pending
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                    {pendingRequests.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Total Amount
                  </p>
                  <p className="text-3xl font-bold text-yellow-500 mt-2">
                    ${pendingRequests.reduce((sum, r) => sum + r.amount, 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Requires Action
                  </p>
                  <p className="text-3xl font-bold text-red-500 mt-2">
                    {pendingRequests.filter((r) => r.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <RequestList
            requests={pendingRequests}
            categories={[]}
            isLoading={requestsLoading}
            isProvider={true}
            onApprove={handleApprove}
            onReject={handleReject}
            filter="pending"
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            requests={pendingRequests}
            categories={[]}
          />
        )}
      </div>
    </div>
  );
};

export default ProviderDashboard;
