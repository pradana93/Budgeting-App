import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { ProfileSetupSchema, ProfileSetupData } from '@/utils/validation';
import { Header } from '@/components/common/Header';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const AVATARS = ['😊', '🤓', '😎', '🥰', '🤩', '😇'];

interface ProfileStepProps {
  onNext: (data: ProfileSetupData) => Promise<void>;
  isLoading?: boolean;
}

export const ProfileStep: React.FC<ProfileStepProps> = ({
  onNext,
  isLoading = false,
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string>(AVATARS[0]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileSetupData>({
    resolver: zodResolver(ProfileSetupSchema),
  });

  const handleFormSubmit = handleSubmit(async (data) => {
    try {
      await onNext({ ...data, avatar: selectedAvatar });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to create profile'
      );
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <Header title="Step 1 of 4: Your Profile" />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome! Let's Get Started 👋
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            Tell us about yourself and choose your role in the couple's budget.
          </p>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Your Name
              </label>
              <input
                {...register('name')}
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
                What's Your Role?
              </label>
              <div className="grid grid-cols-2 gap-4">
                {(['provider', 'receiver'] as const).map((role) => (
                  <label
                    key={role}
                    className="relative cursor-pointer"
                  >
                    <input
                      {...register('role')}
                      type="radio"
                      value={role}
                      className="sr-only peer"
                    />
                    <div className="peer-checked:ring-2 peer-checked:ring-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 border-2 peer-checked:border-blue-500 border-slate-300 dark:border-slate-600 rounded-lg p-4 text-center transition-all cursor-pointer hover:border-blue-400">
                      <div className="text-2xl mb-2">
                        {role === 'provider' ? '💳' : '🛒'}
                      </div>
                      <div className="font-semibold text-slate-900 dark:text-white capitalize mb-1">
                        {role}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {role === 'provider'
                          ? 'Allocate funds'
                          : 'Submit requests'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
              )}
            </div>

            {/* Avatar */}
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-3">
                Choose Your Avatar
              </label>
              <div className="flex gap-3 flex-wrap">
                {AVATARS.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`text-4xl p-3 rounded-lg transition-all ${
                      selectedAvatar === avatar
                        ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isLoading && <LoadingSpinner size="sm" />}
              {isLoading ? 'Creating Profile...' : 'Next: Budget Setup →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileStep;
