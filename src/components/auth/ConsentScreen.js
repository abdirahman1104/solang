'use client';
import { useState } from 'react';

export default function ConsentScreen({ onAccept, onDecline, email }) {
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    setLoading(true);
    try {
      // Store consent in localStorage
      localStorage.setItem('consent_accepted', 'true');
      localStorage.setItem('consent_date', new Date().toISOString());
      await onAccept();
    } catch (error) {
      console.error('Error handling consent:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to Solang
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Signed in as {email}
          </p>
        </div>

        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
          <p>Before continuing, please review and accept our terms:</p>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg space-y-3">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>We'll store your API keys securely</p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Your data will be processed according to our privacy policy</p>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>You can revoke access at any time</p>
            </div>
          </div>

          <div className="text-xs">
            By clicking "Accept", you agree to our{' '}
            <a href="#" className="text-blue-500 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleAccept}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Accept & Continue'}
          </button>
          <button
            onClick={onDecline}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
} 