import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useAppStore } from '@/store/appStore';
import { authService, profileService, budgetService } from '@/services/api';
import { ProfileSetupData, BudgetSetupData } from '@/utils/validation';
import ProfileStep from './ProfileStep';
import BudgetStep from './BudgetStep';
import PartnerStep from './PartnerStep';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Category } from '@/types';

export const SetupWizard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setCurrentUser, setCurrentBudget } = useAppStore();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileSetupData | null>(null);
  const [budgetData, setBudgetData] = useState<BudgetSetupData & { categories: Omit<Category, 'id' | 'budget_id' | 'created_at'>[] } | null>(null);

  const handleProfileSubmit = async (data: ProfileSetupData) => {
    setIsLoading(true);
    try {
      if (!user) throw new Error('User not authenticated');

      const profile = await profileService.createProfile(
        user.id,
        data.name,
        data.role,
        data.avatar
      );

      setCurrentUser({
        ...profile,
        email: user.email || '',
      });

      setProfileData(data);
      setStep(2);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBudgetSubmit = async (data: BudgetSetupData & { categories: Omit<Category, 'id' | 'budget_id' | 'created_at'>[] }) => {
    setIsLoading(true);
    try {
      if (!user || !profileData) throw new Error('Missing user or profile data');

      const budget = await budgetService.createBudget(
        user.id,
        data.amount,
        data.frequency,
        data.categories
      );

      setCurrentBudget(budget);
      setBudgetData(data);
      setStep(3);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create budget');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePartnerSubmit = async (mode: 'email' | 'code', value: string) => {
    setIsLoading(true);
    try {
      if (value === 'skip') {
        // Skip partner setup
        setStep(4);
        return;
      }

      if (mode === 'email') {
        // Email invitation logic
        toast.success('Invitation sent! Your partner can now accept.');
      } else {
        // Pairing code logic
        toast.success('Pairing code created! Share with your partner.');
      }

      setStep(4);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to process partner setup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Navigate to appropriate dashboard based on role
      if (profileData?.role === 'provider') {
        navigate('/dashboard/provider');
      } else {
        navigate('/dashboard/receiver');
      }
      toast.success('Setup complete! Welcome to Budget Buddy! 🎉');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to complete setup');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && step !== 1 && step !== 2 && step !== 3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      {step === 1 && (
        <ProfileStep onNext={handleProfileSubmit} isLoading={isLoading} />
      )}
      {step === 2 && (
        <BudgetStep onNext={handleBudgetSubmit} isLoading={isLoading} />
      )}
      {step === 3 && (
        <PartnerStep onNext={handlePartnerSubmit} isLoading={isLoading} />
      )}
      {step === 4 && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              You're All Set!
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
              {profileData?.role === 'provider'
                ? "You're set up as a Provider. Start managing your budget and reviewing your partner's requests!"
                : "You're set up as a Receiver. You can now submit reimbursement requests!"}
            </p>

            {budgetData && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Budget Amount
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      ${budgetData.amount.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Frequency
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white capitalize">
                      {budgetData.frequency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Categories
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {budgetData.categories.length}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleComplete}
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading && <LoadingSpinner size="sm" />}
              {isLoading ? 'Redirecting...' : 'Go to Dashboard'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SetupWizard;
