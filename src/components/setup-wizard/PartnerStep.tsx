import React, { useState } from 'react';
import { Mail, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { Header } from '@/components/common/Header';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { generatePairingCode } from '@/utils/formatting';

interface PartnerStepProps {
  onNext: (mode: 'email' | 'code', value: string) => Promise<void>;
  isLoading?: boolean;
}

export const PartnerStep: React.FC<PartnerStepProps> = ({
  onNext,
  isLoading = false,
}) => {
  const [mode, setMode] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [pairingCode, setPairingCode] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const generateNewCode = () => {
    const code = generatePairingCode();
    setPairingCode(code);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(pairingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }
    try {
      await onNext('email', email);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send invite');
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pairingCode.trim()) {
      toast.error('Pairing code is required');
      return;
    }
    try {
      await onNext('code', pairingCode);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to pair accounts');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <Header title="Step 3 of 4: Invite Your Partner" />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Connect With Your Partner 💑
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            Choose how to connect with your partner's account.
          </p>

          {/* Mode Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => setMode('email')}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                mode === 'email'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'
              }`}
            >
              <Mail className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <div className="font-semibold text-slate-900 dark:text-white">
                Send Email
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Invite via email
              </div>
            </button>

            <button
              onClick={() => {
                setMode('code');
                if (!pairingCode) generateNewCode();
              }}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                mode === 'code'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-300 dark:border-slate-600 hover:border-blue-400'
              }`}
            >
              <div className="text-3xl mb-2">🔗</div>
              <div className="font-semibold text-slate-900 dark:text-white">
                Pairing Code
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Share a code
              </div>
            </button>
          </div>

          {/* Email Mode */}
          {mode === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Partner's Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="partner@example.com"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  💌 An invitation link will be sent to your partner's email.
                  They'll need to sign up and accept the invitation.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isLoading && <LoadingSpinner size="sm" />}
                {isLoading ? 'Sending Invite...' : 'Send Invitation'}
              </button>
            </form>
          )}

          {/* Code Mode */}
          {mode === 'code' && (
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div className="flex gap-3 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Pairing Code
                  </label>
                  <input
                    type="text"
                    value={pairingCode}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-blue-300 dark:border-blue-600 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-slate-900 dark:text-white font-mono text-lg font-bold text-center"
                  />
                </div>
                <div className="flex flex-col justify-end gap-2">
                  <button
                    type="button"
                    onClick={generateNewCode}
                    className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-medium text-sm transition-colors"
                  >
                    New Code
                  </button>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Or Enter Your Partner's Code
                </label>
                <input
                  type="text"
                  value={pairingCode}
                  onChange={(e) => setPairingCode(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  maxLength="6"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-mono text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-sm text-green-800 dark:text-green-300">
                  🔗 Share this code with your partner or ask them for theirs
                  to connect your accounts.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isLoading && <LoadingSpinner size="sm" />}
                {isLoading ? 'Connecting...' : 'Connect Accounts'}
              </button>
            </form>
          )}

          {/* Skip Option */}
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Want to set up your partner's account later?
            </p>
            <button
              type="button"
              onClick={() => onNext('email', 'skip')}
              className="text-blue-500 hover:text-blue-600 font-medium text-sm"
            >
              Skip for now →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerStep;
