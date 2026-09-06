import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { SignUpSchema, SignInSchema } from '@/utils/validation';
import { useAuth } from '@/contexts/AuthContext';
import { profileService } from '@/services/api';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Alert from '@/components/common/Alert';

type FormMode = 'signin' | 'signup';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { signUp: authSignUp, signIn: authSignIn } = useAuth();
  const [mode, setMode] = useState<FormMode>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(mode === 'signin' ? SignInSchema : SignUpSchema),
  });

  const handleAuthSubmit = handleSubmit(async (data: any) => {
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'signin') {
        const { session } = await authSignIn(data.email, data.password);
        
        if (session?.user) {
          // Check if user has profile
          try {
            await profileService.getProfile(session.user.id);
            // User has profile, redirect to dashboard
            navigate('/dashboard/provider');
          } catch {
            // User doesn't have profile, redirect to setup
            navigate('/setup');
          }
        }
        
        toast.success('Signed in successfully!');
      } else {
        const { user } = await authSignUp(data.email, data.password, data.name);
        
        if (user) {
          toast.success('Account created! Redirecting...');
          setMode('signin');
          reset();
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
            <span className="text-3xl">💰</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Budget Buddy
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your couple's budget together
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8">
          {/* Mode Tabs */}
          <div className="flex gap-2 mb-8">
            <button
              onClick={() => {
                setMode('signin');
                reset();
                setError(null);
              }}
              className={`flex-1 py-3 font-medium rounded-lg transition-colors ${
                mode === 'signin'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('signup');
                reset();
                setError(null);
              }}
              className={`flex-1 py-3 font-medium rounded-lg transition-colors ${
                mode === 'signup'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert
              type="error"
              title="Authentication Error"
              message={error}
              onClose={() => setError(null)}
            />
          )}

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Full Name
                </label>
                <input
                  {...register('name')}
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {(errors.name as any)?.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {(errors.email as any)?.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {(errors.password as any)?.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6"
            >
              {isLoading && <LoadingSpinner size="sm" />}
              {isLoading
                ? 'Processing...'
                : mode === 'signin'
                ? 'Sign In'
                : 'Create Account'}
            </button>
          </form>

          {/* Info Message */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
              {mode === 'signin'
                ? "Don't have an account? "
                : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  reset();
                  setError(null);
                }}
                className="text-blue-500 hover:text-blue-600 font-medium"
              >
                {mode === 'signin' ? 'Sign up here' : 'Sign in here'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 dark:text-slate-400 mt-6">
          🔒 Your data is secure and encrypted with Supabase
        </p>
      </div>
    </div>
  );
};

export default Auth;
