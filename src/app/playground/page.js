'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Alert } from '@/components/notifications';
import { supabase } from '@/utils/supabase';
import BackToDashboard from '@/components/BackToDashboard';

export default function Playground() {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
      }
    };
    checkAuth();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert({ show: false, type: '', message: '' });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });

      const data = await response.json();
      console.log('Validation response:', data);

      if (response.ok) {
        router.push('/protected');
      } else {
        setAlert({
          show: true,
          type: 'error',
          message: data.error
        });
        setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
      }
    } catch (error) {
      console.error('Validation error:', error);
      setAlert({
        show: true,
        type: 'error',
        message: `Error: ${error.message}`
      });
      setTimeout(() => setAlert({ show: false, type: '', message: '' }), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <BackToDashboard />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          API Playground
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="apiKey"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Enter your API Key
              </label>
              <input
                id="apiKey"
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="solang_..."
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !apiKey.trim()}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Validating...' : 'Validate API Key'}
            </button>
          </form>
        </div>

        {alert.show && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert({ show: false, type: '', message: '' })}
          />
        )}
      </div>
    </div>
  );
} 