import React from 'react';
import { Header } from '@/components/common/Header';
import { Budget } from '@/types';
import { formatCurrency, formatDate, getDaysRemaining, calculatePercentage, getBudgetStatus } from '@/utils/formatting';
import { TrendingUp, Calendar, AlertCircle } from 'lucide-react';

interface BudgetOverviewProps {
  budget: Budget;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({ budget }) => {
  const daysRemaining = getDaysRemaining(budget.period_end);
  const percentageSpent = calculatePercentage(budget.spent, budget.amount);
  const status = getBudgetStatus(budget.spent, budget.amount);

  const statusConfig = {
    safe: {
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      barColor: 'bg-green-500',
    },
    warning: {
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      barColor: 'bg-yellow-500',
    },
    danger: {
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      barColor: 'bg-red-500',
    },
  };

  const config = statusConfig[status];

  return (
    <div className="space-y-6">
      {/* Main Card */}
      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Budget Overview
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              {formatDate(budget.period_start)} - {formatDate(budget.period_end)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Budget expired'}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {formatCurrency(budget.remaining)}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Remaining
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                {percentageSpent}%
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                of {formatCurrency(budget.amount)}
              </p>
            </div>
          </div>

          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
            <div
              className={`h-4 rounded-full transition-all ${config.barColor}`}
              style={{ width: `${percentageSpent}%` }}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Total Budget
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {formatCurrency(budget.amount)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Spent
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {formatCurrency(budget.spent)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Frequency
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-1 capitalize">
              {budget.frequency}
            </p>
          </div>
        </div>
      </div>

      {/* Status Alert */}
      {status !== 'safe' && (
        <div className={`${config.bg} border-2 ${config.border} rounded-lg p-4 flex items-start gap-3`}>
          <AlertCircle className={`w-5 h-5 ${config.color} flex-shrink-0 mt-0.5`} />
          <div>
            <p className={`font-semibold ${config.color}`}>
              {status === 'warning'
                ? 'Budget Running Low'
                : 'Budget Exceeded'}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {status === 'warning'
                ? `You've spent ${percentageSpent}% of your budget. Be careful with your spending.`
                : `You've exceeded your budget limit. No new requests will be approved.`}
            </p>
          </div>
        </div>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Average Daily Spend
            </p>
          </div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">
            {formatCurrency(budget.spent / Math.max(1, getDaysRemaining(budget.period_end) || 1))}
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <p className="text-sm font-medium text-purple-800 dark:text-purple-300">
              Days Left
            </p>
          </div>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">
            {daysRemaining > 0 ? daysRemaining : 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview;
