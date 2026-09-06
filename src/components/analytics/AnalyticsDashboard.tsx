import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ReimbursementRequest, Category } from '@/types';
import { formatCurrency } from '@/utils/formatting';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

interface AnalyticsDashboardProps {
  requests: ReimbursementRequest[];
  categories: Category[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  requests,
  categories,
}) => {
  // Calculate spending by category
  const categorySpending = categories.map((cat) => {
    const spent = requests
      .filter(
        (req) => req.category_id === cat.id && req.status === 'approved'
      )
      .reduce((sum, req) => sum + req.amount, 0);

    return {
      name: cat.name,
      spent,
      limit: cat.limit || 0,
    };
  });

  // Calculate spending by month (last 6 months)
  const monthlySpending = Array.from({ length: 6 })
    .map((_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      const month = date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });

      const monthRequests = requests.filter((req) => {
        const reqDate = new Date(req.created_at);
        return (
          reqDate.getMonth() === date.getMonth() &&
          reqDate.getFullYear() === date.getFullYear() &&
          req.status === 'approved'
        );
      });

      const total = monthRequests.reduce((sum, req) => sum + req.amount, 0);
      return { month, total };
    });

  const totalSpent = requests
    .filter((r) => r.status === 'approved')
    .reduce((sum, r) => sum + r.amount, 0);

  const pieData = categorySpending.filter((c) => c.spent > 0);

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Total Spent
          </h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
            {formatCurrency(totalSpent)}
          </p>
        </div>

        <div className="card">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Approved Requests
          </h3>
          <p className="text-3xl font-bold text-green-500 mt-2">
            {requests.filter((r) => r.status === 'approved').length}
          </p>
        </div>

        <div className="card">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Pending Requests
          </h3>
          <p className="text-3xl font-bold text-yellow-500 mt-2">
            {requests.filter((r) => r.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Spending by Category */}
      {pieData.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            Spending Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, spent }) => `${name}: ${formatCurrency(spent)}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="spent"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(value as number)}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Spending Over Time */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
          Spending Trend (6 Months)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlySpending}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
            <Bar dataKey="total" fill="#3B82F6" name="Spent" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Limits */}
      {categorySpending.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
            Category Spending vs Limits
          </h2>
          <div className="space-y-4">
            {categorySpending.map((category, idx) => (
              <div key={category.name}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-slate-900 dark:text-white">
                    {category.name}
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {formatCurrency(category.spent)}{' '}
                    {category.limit > 0 && `/ ${formatCurrency(category.limit)}`}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      category.limit > 0 && category.spent > category.limit
                        ? 'bg-red-500'
                        : 'bg-green-500'
                    }`}
                    style={{
                      width: category.limit > 0
                        ? Math.min((category.spent / category.limit) * 100, 100) + '%'
                        : '0%',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
