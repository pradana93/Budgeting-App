import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { BudgetSetupSchema, BudgetSetupData } from '@/utils/validation';
import { Category } from '@/types';
import { Header } from '@/components/common/Header';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const DEFAULT_CATEGORIES = [
  { name: 'Groceries', limit: 300 },
  { name: 'Utilities', limit: 150 },
  { name: 'Entertainment', limit: 100 },
  { name: 'Shopping', limit: 200 },
  { name: 'Dining', limit: 150 },
  { name: 'Transportation', limit: 100 },
];

interface BudgetStepProps {
  onNext: (data: BudgetSetupData & { categories: Omit<Category, 'id' | 'budget_id' | 'created_at'>[] }) => Promise<void>;
  isLoading?: boolean;
}

export const BudgetStep: React.FC<BudgetStepProps> = ({
  onNext,
  isLoading = false,
}) => {
  const [categories, setCategories] = useState<Omit<Category, 'id' | 'budget_id' | 'created_at'>[]>(
    DEFAULT_CATEGORIES.map(cat => ({ name: cat.name, limit: cat.limit } as any))
  );
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryLimit, setNewCategoryLimit] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<BudgetSetupData>({
    resolver: zodResolver(BudgetSetupSchema),
    defaultValues: {
      frequency: 'monthly',
    },
  });

  const amount = watch('amount');

  const addCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    const newCategory = {
      name: newCategoryName,
      limit: newCategoryLimit ? parseFloat(newCategoryLimit) : undefined,
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName('');
    setNewCategoryLimit('');
    toast.success('Category added!');
  };

  const removeCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    if (categories.length === 0) {
      toast.error('Add at least one category');
      return;
    }

    try {
      await onNext({ ...data, categories });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to set up budget'
      );
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <Header title="Step 2 of 4: Budget Configuration" />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Set Up Your Budget 💰
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            Define your budget amount, frequency, and spending categories.
          </p>

          <form onSubmit={handleFormSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Budget Amount */}
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Budget Amount ($)
                </label>
                <input
                  {...register('amount', { valueAsNumber: true })}
                  type="number"
                  placeholder="2000"
                  step="0.01"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Budget Frequency
                </label>
                <select
                  {...register('frequency')}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            {/* Categories Section */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Spending Categories
              </h3>

              {/* Existing Categories */}
              <div className="space-y-2 mb-6">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {category.name}
                      </div>
                      {category.limit && (
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Limit: ${category.limit}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCategory(index)}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Category */}
              <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg space-y-3">
                <h4 className="font-medium text-slate-900 dark:text-white">
                  Add Custom Category
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category name"
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    value={newCategoryLimit}
                    onChange={(e) => setNewCategoryLimit(e.target.value)}
                    placeholder="Limit (optional)"
                    step="0.01"
                    className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={addCategory}
                  className="w-full bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-900 dark:text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </button>
              </div>
            </div>

            {/* Summary */}
            {amount && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  ✓ Budget: ${amount.toFixed(2)} {watch('frequency')}
                  {categories.length > 0 &&
                    ` • Categories: ${categories.length}`}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading && <LoadingSpinner size="sm" />}
              {isLoading ? 'Saving Budget...' : 'Next: Invite Partner →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BudgetStep;
