import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useProfile';
import { useBudget } from '@/hooks/useBudget';
import { useReceiverRequests, useCreateRequest } from '@/hooks/useRequests';
import { Header } from '@/components/common/Header';
import BudgetOverview from '@/components/dashboard/BudgetOverview';
import RequestForm from '@/components/requests/RequestForm';
import RequestList from '@/components/requests/RequestList';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { ReimbursementRequestData } from '@/utils/validation';

export const ReceiverDashboard: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { budget, isLoading: budgetLoading } = useBudget(user?.id);
  const { requests, isLoading: requestsLoading } = useReceiverRequests(user?.id);
  const createRequestMutation = useCreateRequest();
  const [activeTab, setActiveTab] = useState<'budget' | 'request' | 'history'>(
    'budget'
  );

  const handleSubmitRequest = async (data: ReimbursementRequestData & { photoUrl?: string }) => {
    try {
      if (!user || !budget) throw new Error('Missing user or budget');

      await createRequestMutation.mutateAsync({
        receiverId: user.id,
        budgetId: budget.id,
        categoryId: data.categoryId,
        amount: data.amount,
        description: data.description,
        photoUrl: data.photoUrl,
      } as any);
      
      toast.success('Request submitted successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit request');
    }
  };

  if (budgetLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Header title="Receiver Dashboard" />
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Header title="Receiver Dashboard" />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="card text-center">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              No Active Budget
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Please wait for your partner to set up the budget.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Header title={`Receiver Dashboard - ${profile?.name || 'User'}`} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-300 dark:border-slate-700">
          {(['budget', 'request', 'history'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab === 'budget'
                ? '💰 Budget Status'
                : tab === 'request'
                ? '📝 New Request'
                : '📋 Request History'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'budget' && (
          <BudgetOverview budget={budget} />
        )}

        {activeTab === 'request' && (
          <RequestForm
            budget={budget}
            categories={[]}
            onSubmit={handleSubmitRequest}
            isLoading={createRequestMutation.isPending}
          />
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Request History
              </h2>

              {/* Filter Tabs */}
              <div className="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
                  <button
                    key={filter}
                    className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    {filter === 'all'
                      ? 'All'
                      : filter === 'pending'
                      ? 'Pending'
                      : filter === 'approved'
                      ? 'Approved'
                      : 'Rejected'}
                  </button>
                ))}
              </div>

              <RequestList
                requests={requests}
                categories={[]}
                isLoading={requestsLoading}
                isProvider={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiverDashboard;
